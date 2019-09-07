/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SendRecoveryCode from './SendRecoveryCode';
import EnterRecoveryCode from './EnterRecoveryCode';
import ResetCompleted from './ResetCompleted';
import ResetPassword from './ResetPassword';

import {
  clearSensitiveData,
} from '~/containers/App/actions';

import modelMapEx from '~/containers/App/modelMapEx';

const {
  challengeRecoveryToken,
  resetPasswordRequest,
} = modelMapEx.querchy.promiseActionCreatorSets;

const styles = theme => ({
});

class RecoveryForm extends React.PureComponent {
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
    const { t } = this.props;
    challengeRecoveryToken.create({ username, token: code })
    .then(({ response: { data } }) => {
      if (data.passed) {
        this.setState({
          recoveringCode: code,
          recoveryCodeError: null,
        });
      } else {
        this.setState({
          recoveringCode: null,
          recoveryCodeError: t('worngCode'),
        });
      }
    });
  }

  handleResetPassword = ({ username, code, newPassword }) => {
    const { t } = this.props;
    resetPasswordRequest.create({
      username,
      token: code,
      newPassword,
    })
    .then(({ response: { data } }) => {
      // console.log('data :', data);
      if (data.passed) {
        this.setState({
          resetCompleted: data.passed,
        });
      } else {
        this.setState({
          recoveryCodeError: t('worngCodeFromUrl'),
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

    this.setState({
      resetCompleted: false,
      recoveringUsername: '',
    });
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
        <ResetCompleted onBackToLogin={this.backToLoginPage} />
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
    push,
    clearSensitiveData,
  }),
  withTranslation(['app-common']),
  withStyles(styles),
)(RecoveryForm);
