/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { push } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SendRecoveryCode from './SendRecoveryCode';
import EnterRecoveryCode from './EnterRecoveryCode';
import ResetCompleted from './ResetCompleted';
import ResetPassword from './ResetPassword';
import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';

import {
  clearSensitiveData,
} from '~/containers/App/actions';

import modelMap from '~/containers/App/modelMap';

const {
  postChallengeRecoveryTokens,
  postResetPasswordRequests,
} = modelMap.waitableActions;

const styles = theme => ({
});

class RecoveryForm extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
    username: PropTypes.object,
    recoveringUsername: PropTypes.string,
    recoveringCode: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      recoveringUsername: this.props.recoveringUsername,
      recoveringCode: this.props.recoveringCode,
    };
  }

  static getDerivedStateFromProps(props, prevState) {
    let retval = null;
    if (props.recoveringUsername !== undefined) {
      retval = retval || {};
      retval.recoveringUsername = props.recoveringUsername;
    }

    if (props.recoveringCode !== undefined) {
      retval = retval || {};
      retval.recoveringCode = props.recoveringCode;
    }

    // No state update necessary
    return retval;
  }

  handleCodeSent = ({
    recoveringUsername,
    nextTimeToSend,
  }) => {
    this.setState({
      recoveringUsername,
      nextTimeToSend,
      lastSentUsername: recoveringUsername,
    });
  }

  handleBackToEnterTheCode = ({
    recoveringUsername,
  }) => {
    this.setState({
      recoveringUsername,
    });
  }

  handleResend = () => {
    this.setState({
      recoveringUsername: null,
      recoveringCode: null,
    });
  }

  handleChallenge = ({ username, code }) => {
    const { postChallengeRecoveryTokens, intl } = this.props;
    postChallengeRecoveryTokens({ username, token: code })
    .then(({ data }) => {
      if (data.passed) {
        this.setState({
          recoveringCode: code,
          recoveryCodeError: null,
        });
      } else {
        const translated = translateMessages(intl, messages, [
          'worngCode',
        ]);
        this.setState({
          recoveringCode: null,
          recoveryCodeError: translated.worngCode,
        });
      }
    });
  }

  handleResetPassword = ({ username, code, newPassword }) => {
    const { postResetPasswordRequests, intl } = this.props;
    postResetPasswordRequests({
      username,
      token: code,
      newPassword,
    })
    .then(({ data }) => {
      // console.log('data :', data);
      if (data.passed) {
        this.setState({
          resetCompleted: data.passed,
        });
      } else {
        const translated = translateMessages(intl, messages, [
          'worngCodeFromUrl',
        ]);
        this.setState({
          recoveryCodeError: translated.worngCodeFromUrl,
        });
      }
    });
  }

  backToLoginPage = () => {
    const {
      clearSensitiveData,
      push,
      onBackToLogin = () => {},
    } = this.props;

    clearSensitiveData();
    push('/login');
    onBackToLogin();
  }

  render() {
    const {
      onUsernameChange,
      username,
      usernameError,
    } = this.props;
    const {
      recoveringUsername,
      recoveringCode,
      lastSentUsername,
      nextTimeToSend = 0,
      recoveryCodeError,
      resetCompleted,
    } = this.state;

    if (resetCompleted) {
      return (
        <ResetCompleted
          onBackToLogin={this.backToLoginPage}
        />
      );
    } else if (recoveringUsername && recoveringCode) {
      return (
        <ResetPassword
          recoveringUsername={recoveringUsername}
          recoveringCode={recoveringCode}
          recoveryCodeError={recoveryCodeError}
          onResetPassword={this.handleResetPassword}
        />
      );
    } else if (recoveringUsername) {
      return (
        <EnterRecoveryCode
          recoveringUsername={recoveringUsername}
          onResend={this.handleResend}
          onChallenge={this.handleChallenge}
          recoveryCodeError={recoveryCodeError}
        />
      );
    }
    return (
      <SendRecoveryCode
        onUsernameChange={onUsernameChange}
        username={username}
        usernameError={usernameError}
        lastSentUsername={lastSentUsername}
        nextTimeToSend={nextTimeToSend}
        onCodeSent={this.handleCodeSent}
        onBackToEnterTheCode={this.handleBackToEnterTheCode}
      />
    );
  }
}


export default compose(
  connect(null, {
    postChallengeRecoveryTokens,
    postResetPasswordRequests,
    push,
    clearSensitiveData,
  }),
  injectIntl,
  withStyles(styles),
)(RecoveryForm);
