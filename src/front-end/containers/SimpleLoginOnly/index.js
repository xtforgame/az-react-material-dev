import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import translateMessages from '~/utils/translateMessages';
import {
  Redirect,
} from 'react-router-dom';
import {
  rememberMe,
} from '../App/actions';
import Typography from '@material-ui/core/Typography';
import LocaleDropdown from '~/containers/LocaleDropdown';

import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import createCommonStyles from '~/styles/common';
import createFormPaperStyle from '~/styles/FormPaper';

import SwipeableViews from 'react-swipeable-views';

import { createStructuredSelector } from 'reselect';
import LoginForm from '~/containers/LoginForms/LoginForm';
import createSimpleLoginInputConfigs from '~/containers/LoginForms/createSimpleLoginInputConfigs';

import modelMapEx from '~/containers/App/modelMapEx';
import {
  makeRememberUserSelector,
} from '~/containers/App/selectors';

const {
  session: sessionP,
  user: userP,
} = modelMapEx.querchy.promiseActionCreatorSets;

const {
  session,
  user,
} = modelMapEx.querchy.actionCreatorSets;

const styles = theme => ({
  ...createFormPaperStyle(theme),
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      // username: FormPhoneOrEmailInput.rawInputToState('admin@foo.bar'),
      loginError: null,
    };
  }

  componentDidMount() {
    const { location, session } = this.props;
    const fromPath = location.state && location.state.from.pathname;
    if (!session && fromPath) {
      console.warn(`Redirected page from ${fromPath} to Login`);
    }
  }

  swipeTo = (tabIndex) => {
    this.setState({ tabIndex });
  };

  login = ({ username, password, rememberMe }) => {
    const { rememberMe: remember } = this.props;
    remember(rememberMe);
    // popup('/auth-popup.html');
    // return ;
    sessionP.create({
      auth_type: 'basic',
      username,
      password,
    })
    .catch((action) => {
      this.setState({
        loginError: action.data.error,
      });
    });
  };

  render() {
    const {
      location, t, session, classes,
    } = this.props;
    let fromPath = location.state && location.state.from.pathname;
    const translated = translateMessages(t, [
      'login',
      'wrongUsernameOrPassword',
      'usernameIsTaken',
      'forgotPasswordQuestion',
    ]);

    if (session) {
      fromPath = fromPath || '/';
      return <Redirect to={{ pathname: fromPath }} />;
    }

    const titles = [translated.login, translated.createAccount, translated.forgotPasswordQuestion];
    const title = titles[this.state.tabIndex];

    return (
      <div className={classes.flexContainerFH}>
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
                {title}
              </Typography>
              <LocaleDropdown />
            </Toolbar>
          </AppBar>
          <SwipeableViews
            index={this.state.tabIndex}
            {...{}/* onChangeIndex={this.handleChangeIndex} */}
            disabled
          >
            <LoginForm
              namespace="login"
              fields={createSimpleLoginInputConfigs()}
              username={this.state.username}
              onUsernameChange={username => this.setState({ username })}
              usernameError={this.state.tabIndex === 0 && !!this.state.loginError}
              passwordError={this.state.tabIndex === 0 && this.state.loginError && translated.wrongUsernameOrPassword}
              onSubmit={this.login}
            />
          </SwipeableViews>
        </Paper>
        <div className={classes.flex1} />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  session: modelMapEx.cacher.selectorCreatorSet.session.selectMe(),
  rememberUser: makeRememberUserSelector(),
});

export default compose(
  connect(
    mapStateToProps,
    {
      cancelCreateSession: session.create.creatorRefs.cancel,
      cancelCreateUser: user.create.creatorRefs.cancel,
      rememberMe,
    }
  ),
  withTranslation(['app-common']),
  withStyles(styles),
)(Login);
