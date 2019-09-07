/* eslint-disable react/prop-types, react/forbid-prop-types, react/no-unused-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import jsonPtr from 'jsonpointer';
import { withStyles } from '@material-ui/core/styles';
import FormBaseType001 from '~/containers/LoginForms/FormBaseType001';
import createSendRecoveryCodeInputConfigs from '~/containers/LoginForms/createSendRecoveryCodeInputConfigs';

import modelMapEx from '~/containers/App/modelMapEx';

const {
  recoveryToken,
} = modelMapEx.querchy.promiseActionCreatorSets;

const styles = theme => ({
});
class SendRecoveryCode extends React.PureComponent {
  static propTypes = {
    onCodeSent: PropTypes.func.isRequired,
    onBackToEnterTheCode: PropTypes.func.isRequired,
    lastSentUsername: PropTypes.string,
    onUsernameChange: PropTypes.func,
    username: PropTypes.object,
    usernameError: PropTypes.any,
    nextTimeToSend: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    const now = new Date().getTime();
    this.state = {
      remainingTime: (this.props.nextTimeToSend && (this.props.nextTimeToSend > now))
        ? this.props.nextTimeToSend - now : 0,
    };
  }

  componentDidMount() {
    this.countDown();
  }

  componentWillUnmount() {
    this.stopCountDown();
  }

  stopCountDown = () => clearTimeout(this.countDownTimer);

  countDown = () => {
    this.stopCountDown();
    this.countDownTimer = setTimeout(() => {
      const now = new Date().getTime();
      if (this.props.nextTimeToSend > now) {
        this.setState({
          remainingTime: this.props.nextTimeToSend - now,
        });
        this.countDown();
      } else {
        this.setState({ remainingTime: 0 });
      }
    }, 200);
  }

  recover = ({ username }, linker) => {
    const { onCodeSent } = this.props;
    const userNameState = linker.getValue('username');

    recoveryToken.create({
      type: userNameState.type,
      username: userNameState.value,
    })
    .then(({ response: { data } }) => {
      onCodeSent({
        recoveringUsername: username,
        nextTimeToSend: new Date().getTime() + data.remainingTime,
      });
    })
    .catch((e) => {
      const resData = jsonPtr.get(e, '/data/error/response/data');
      if (resData) {
        onCodeSent({
          recoveringUsername: username,
          nextTimeToSend: new Date().getTime() + resData.remainingTime,
        });
      } else {
        throw e;
      }
    });
  }

  backToEnterTheCode = () => {
    const { onBackToEnterTheCode, lastSentUsername } = this.props;
    onBackToEnterTheCode({
      recoveringUsername: lastSentUsername,
    });
  }

  render() {
    const { t } = this.props;
    const { remainingTime = 0 } = this.state;
    const remainingSec = Math.round(remainingTime / 1000);

    return (
      <FormBaseType001
        {...this.props}
        namespace="forgot-password"
        countDownText={`${t('sendCode')}${remainingTime > 0 ? `, Remaining Time : ${remainingSec}` : ''}`}
        backToEnterTheCode={this.backToEnterTheCode}
        remainingTime={remainingTime}
        enterCodeText={t('enterCode')}
        onSubmit={this.recover}
        fields={createSendRecoveryCodeInputConfigs(this.recover)}
      />
    );
  }
}


export default compose(
  connect(null, {}),
  withTranslation(['app-common']),
  withStyles(styles),
)(SendRecoveryCode);
