/* eslint-disable react/prop-types, react/forbid-prop-types, react/no-unused-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import jsonPtr from 'jsonpointer';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
} from '~/components/FormInputs';

import InputLinker from '~/utils/InputLinker';
import {
  FormPhoneOrEmailInputPreset,
  displayErrorFromPropsForTextField,
  assert,
  translateLabelAndAddOnKeyPressEvent,
} from '~/utils/InputLinker/helpers';

import modelMap from '~/containers/App/modelMap';

const {
  postRecoveryTokens,
} = modelMap.waitableActions;

const styles = theme => ({
});

class SendRecoveryCode extends React.Component {
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
    this.il = new InputLinker(this, {
      namespace: 'forgot-password',
    });
    this.il.add(
      {
        name: 'username',
        presets: [FormPhoneOrEmailInputPreset, translateLabelAndAddOnKeyPressEvent('username', this.handleEnterForTextField)],
        handledByProps: {
          value: 'username',
          onChange: 'onUsernameChange',
        },
        extraGetProps: [
          displayErrorFromPropsForTextField('passwordError', () => undefined),
          (props, linkInfo, { translate }) => ({
            ...props,
            placeholder: translate('usernameEmptyError', {
              emailAddress: { key: 'emailAddress' },
              phoneNumber: { key: 'phoneNumber' },
            }),
          }),
        ],
        validate: value => assert(value && value.type, null, {
          key: 'usernameEmptyError',
          values: {
            emailAddress: { key: 'emailAddress' },
            phoneNumber: { key: 'phoneNumber' },
          },
        }),
      },
    );

    const now = new Date().getTime();
    this.state = this.il.mergeInitState({
      remainingTime: (this.props.nextTimeToSend && (this.props.nextTimeToSend > now))
        ? this.props.nextTimeToSend - now : 0,
    });
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

  recover = () => {
    const { postRecoveryTokens, onCodeSent } = this.props;
    const userNameState = this.il.getValue('username');

    if (this.il.validate()) {
      const { username } = this.il.getOutputs();
      postRecoveryTokens({
        type: userNameState.type,
        username: userNameState.value,
      })
      .then(({ data }) => {
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
  }

  backToEnterTheCode = () => {
    const { onBackToEnterTheCode } = this.props;

    if (this.il.validate()) {
      const {
        username,
      } = this.il.getOutputs();
      onBackToEnterTheCode({
        recoveringUsername: username,
      });
    }
  }

  handleEnterForTextField = (event) => {
    if (event.key === 'Enter') {
      this.recover();
      event.preventDefault();
    }
  };

  render() {
    const {
      intl,
      classes,
      lastSentUsername,
    } = this.props;

    const { username } = this.il.getOutputs();

    const { remainingTime = 0 } = this.state;

    const remainingSec = Math.round(remainingTime / 1000);

    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
      'sendCode',
      'enterCode',
    ]);

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          {this.il.renderComponent('username', { translate })}
          <FormSpace variant="content8" />
          <Button
            variant="contained"
            fullWidth
            color="secondary"
            disabled={!username || remainingTime > 0}
            className={classes.loginBtn}
            onClick={this.recover}
          >
            {`${translated.sendCode}${remainingTime > 0 ? `, Remaining Time : ${remainingSec}` : ''}`}
          </Button>
          <FormSpace variant="content4" />
          {lastSentUsername && lastSentUsername === username && (
            <Button
              fullWidth
              disabled={!username}
              className={classes.loginBtn}
              onClick={this.backToEnterTheCode}
            >
              {translated.enterCode}
            </Button>
          )}
        </FormContent>
      </div>
    );
  }
}


export default compose(
  connect(null, {
    postRecoveryTokens,
  }),
  injectIntl,
  withStyles(styles),
)(SendRecoveryCode);
