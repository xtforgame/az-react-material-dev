/* eslint-disable react/prop-types, react/forbid-prop-types */
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
  FormPhoneOrEmailInput,
} from '~/components/FormInputs';

import FormInputLinker, {
  FormTextFieldGetProps,
  assert,
} from '~/utils/FormInputLinker';

import modelMap from '~/containers/App/modelMap';

const {
  postRecoveryTokens,
} = modelMap.waitableActions;

const styles = theme => ({
});

class SendRecovryCode extends React.Component {
  static propTypes = {
    onCodeSent: PropTypes.func.isRequired,
    onBackToEnterTheCode: PropTypes.func.isRequired,
    lastSentUsername: PropTypes.string,
    onUsernameChange: PropTypes.func,
    username: PropTypes.object,
    usernameError: PropTypes.any,
    lastUpdatedTime: PropTypes.number.isRequired,
    remainingTime: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.fil = new FormInputLinker(this, {
      namespace: 'forgot-password',
    });
    this.fil.add({
      name: 'username',
      exposed: {
        onChange: 'onUsernameChange',
        value: 'username',
        error: 'usernameError',
      },
      converter: {
        toView: (valueInState => (valueInState && valueInState.rawInput) || ''),
        fromView: ((_, value) => value),
        toOutput: (value => value && value.value),
      },
      getProps: (__, _) => ({
        ...FormTextFieldGetProps(__, _),
        placeholder: _.translate('usernameEmptyError', {
          emailAddress: { key: 'emailAddress' },
          phoneNumber: { key: 'phoneNumber' },
        }),
      }),
      validate: value => assert(value && value.type, null, {
        key: 'usernameEmptyError',
        values: {
          emailAddress: { key: 'emailAddress' },
          phoneNumber: { key: 'phoneNumber' },
        },
      }),
    });

    this.state = this.fil.mergeInitState({
      fil: this.fil,
      countDown: this.countDown,
      remainingTime: this.props.remainingTime,
    });
  }

  componentDidMount() {
    this.countDown();
  }

  componentWillUnmount() {
    this.stopCountDown();
  }

  static getDerivedStateFromProps(props, state) {
    const { fil, countDown } = state;
    let newState = null;
    if (fil) {
      newState = {
        ...fil.derivedFromProps(props, state),
      };
    }

    if (props.lastUpdatedTime > (state.lastUpdatedTime || 0)) {
      let { remainingTime } = props;
      if (!state.lastUpdatedTime) {
        remainingTime -= (new Date().getTime() - props.lastUpdatedTime);
      }
      newState = {
        ...newState,
        lastUpdatedTime: props.lastUpdatedTime,
        remainingTime,
      };
      countDown();
    }

    // No state update necessary
    return newState;
  }

  stopCountDown = () => clearTimeout(this.countDownTimer);

  countDown = () => {
    this.stopCountDown();
    this.countDownTimer = setTimeout(() => {
      if (this.state.remainingTime >= 1000) {
        this.setState({
          remainingTime: this.state.remainingTime - 1000,
        });
        this.countDown();
      } else {
        this.setState({
          remainingTime: 0,
        });
      }
    }, 1000);
  }

  recover = () => {
    const {
      postRecoveryTokens,
      onCodeSent,
    } = this.props;
    const userNameState = this.fil.getOutputFromState('username');

    if (this.fil.validate()) {
      postRecoveryTokens({
        type: userNameState.type,
        username: userNameState.value,
      })
      .then(({ data }) => {
        const {
          username,
        } = this.fil.getOutputs();
        onCodeSent({
          recoveringUsername: username,
          remainingTime: data.remainingTime,
        });
      })
      .catch((e) => {
        const {
          username,
        } = this.fil.getOutputs();
        const resData = jsonPtr.get(e, '/data/error/response/data');
        if (resData) {
          onCodeSent({
            recoveringUsername: username,
            remainingTime: resData.remainingTime,
          });
        } else {
          throw e;
        }
      });
    }
  }

  backToEnterTheCode = () => {
    const {
      onBackToEnterTheCode,
    } = this.props;

    if (this.fil.validate()) {
      const {
        username,
      } = this.fil.getOutputs();
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

    const {
      username,
    } = this.fil.getOutputs();

    const {
      remainingTime = 0,
    } = this.state;

    const remainingSec = Math.round(remainingTime / 1000);

    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
      'username',
      'sendCode',
      'enterCode',
    ]);

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          <FormPhoneOrEmailInput
            enablePhone={false}
            label={translated.username}
            onKeyPress={this.handleEnterForTextField}
            {...this.fil
              .getPropsForInputField('username', { translate })}
          />
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
)(SendRecovryCode);
