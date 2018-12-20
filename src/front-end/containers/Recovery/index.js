import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import formatMessage from '~/utils/formatMessage';
import translateMessages from '~/utils/translateMessages';
import Typography from '@material-ui/core/Typography';
import LocaleDropdown from '~/containers/LocaleDropdown';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import createCommonStyles from '~/styles/common';
import createFormPaperStyle from '~/styles/FormPaper';
import RecoveryForm from '~/containers/Recovery/RecoveryForm';

import ProgressWithMask from '~/components/Progress/ProgressWithMask';

import { createStructuredSelector } from 'reselect';
import { messages } from '../App/translation';
import modelMap from '~/containers/App/modelMap';
import {
  makeUserSessionSelector,
  makeRememberUserSelector,
} from '~/containers/App/selectors';
import EnterRecoveryCode from './RecoveryForm/EnterRecoveryCode';

const {
  postSessions,
  postRecoveryTokens,
  postChallengeRecoveryTokens,
} = modelMap.waitableActions;

const {
  cancelPostSessions,
} = modelMap.actions;

const styles = theme => ({
  ...createFormPaperStyle(theme),
  ...createCommonStyles(theme, ['flex', 'appBar']),
  FWFH: {
    height: '100%',
    width: '100%',
  },
});

class Recovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      // username: FormPhoneOrEmailInput.rawInputToState('admin@foo.bar'),
      // loginError: null,
      postUsersError: null,
      codeVerifyState: 'entering-code',
    };
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.code) {
      // console.log('match.params.code :', match.params.code);
      const recoveringUsername = match.params.username && decodeURIComponent(match.params.username);
      this.challenge({ username: recoveringUsername, code: match.params.code });
    }
  }

  challenge = ({ username, code }) => {
    const { postChallengeRecoveryTokens, intl } = this.props;
    this.setState({
      codeVerifyState: null,
      recoveryCodeError: null,
    });
    const translated = translateMessages(intl, messages, [
      'worngCodeFromUrl',
    ]);

    postChallengeRecoveryTokens({ username, token: code })
    .then(({ data }) => {
      this.setState({
        codeVerifyState: data.passed ? 'passed' : 'wrong',
        recoveryCodeError: data.passed ? null : translated.worngCodeFromUrl,
      });
    })
    .catch((e) => {
      this.setState({
        codeVerifyState: 'error',
        recoveryCodeError: translated.worngCodeFromUrl,
      });
    });
  }

  render() {
    const {
      match, intl, classes,
    } = this.props;
    const { recoveryCodeError } = this.state;
    const usernameIsTaken = formatMessage(intl, messages.usernameIsTaken, {});

    const recoveringUsername = match.params.username && decodeURIComponent(match.params.username);

    return (
      <div className={classes.flexContainerFH}>
        <React.Fragment>
          <div className={classes.flex1} />
          <Paper className={classes.paper} elevation={4}>
            <AppBar position="static">
              <Toolbar>
                {this.state.tabIndex !== 0 && (
                  <IconButton className={classes.menuButton} color="inherit" aria-label="Back" onClick={() => { this.swipeTo(0); }}>
                    <ArrowBack />
                  </IconButton>
                )}
                <Typography variant="h6" color="inherit" className={classes.flex1}>
                  <FormattedMessage {...messages.resetPassword} />
                </Typography>
                <LocaleDropdown />
              </Toolbar>
            </AppBar>
            {(this.state.codeVerifyState === 'passed' || this.state.codeVerifyState === 'entering-code')
            && (
              <RecoveryForm
                isCodeSent
                recoveringUsername={recoveringUsername}
                recoveringCode={match.params.code}
                // onUsernameChange={username => this.setState({
                //   username,
                // })}
                usernameError={this.state.tabIndex === 2 && this.state.postUsersError && usernameIsTaken}
              />
            )}
            {((!this.state.codeVerifyState) || this.state.codeVerifyState === 'wrong' || this.state.codeVerifyState === 'error')
              && (
                <EnterRecoveryCode
                  recoveringUsername={recoveringUsername}
                  onChallenge={this.challenge}
                  recoveryCodeError={recoveryCodeError}
                />
              )}
          </Paper>
          <div className={classes.flex1} />
        </React.Fragment>
        {!this.state.codeVerifyState && <ProgressWithMask delay={5000} />}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  session: makeUserSessionSelector(),
  rememberUser: makeRememberUserSelector(),
});

export default compose(
  connect(
    mapStateToProps,
    {
      postSessions,
      cancelPostSessions,
      postRecoveryTokens,
      postChallengeRecoveryTokens,
    }
  ),
  injectIntl,
  withStyles(styles),
)(Recovery);
