/* eslint-disable react/prop-types, react/forbid-prop-types, jsx-a11y/anchor-is-valid */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
  FormCodeInput,
} from '~/components/FormInputs';

import FormInputLinker, {
  FormTextFieldGetProps,
  assert,
} from '~/utils/FormInputLinker';

import {
  isAllDigital,
} from 'common/utils/validators';

import modelMap from '~/containers/App/modelMap';

const {
  postRecoveryTokens,
} = modelMap.waitableActions;

const styles = theme => ({
  flexContainer: {
    display: 'flex',
  },
  flex1: {
    flex: 1,
  },
  actionBtn: {
  },
  link: {
    cursor: 'text',
    color: theme.palette.secondary.main,
    textDecoration: 'none',
  },
  textContainer: {
    cursor: 'text',
    wordWrap: 'break-word',
  },
});

class EnterRecovryCode extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onChallenge: PropTypes.func.isRequired,
    onResend: PropTypes.func,
    recoveringUsername: PropTypes.string,
    recoveryCodeError: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.fil = new FormInputLinker(this, {
      namespace: 'forgot-password',
    });
    this.fil.add({
      name: 'recoveryCode',
      exposed: {
        onChange: 'onRecoveryCodeChange',
        error: 'recoveryCodeError',
      },
      converter: {
        fromView: (({ valueInState }, e) => (
          (
            !e.target.value
            || (isAllDigital(e.target.value) && e.target.value.length <= 6)
          ) ? e.target.value : valueInState)
        ),
      },
      getProps: FormTextFieldGetProps,
      validate: value => assert(value, null),
    });

    this.state = this.fil.mergeInitState({
      fil: this.fil,
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (state.fil) {
      return state.fil.derivedFromProps(props, state);
    }

    // No state update necessary
    return null;
  }

  handleEnterForTextField = (event) => {
    if (event.key === 'Enter') {
      this.challengeRecoveryToken();
      event.preventDefault();
    }
  };

  challengeRecoveryToken = () => {
    const {
      recoveringUsername,
    } = this.props;

    const {
      recoveryCode,
    } = this.fil.getOutputs();

    if (this.fil.validate()) {
      this.props.onChallenge({
        username: recoveringUsername,
        code: recoveryCode,
      });
    }
  }

  render() {
    const {
      intl,
      classes,
      onResend,
    } = this.props;

    const {
      recoveryCode,
    } = this.fil.getOutputs();

    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
      'username',
      'sendCode',
      'resendCode',
      'recoveryCode',
      'enterCode',
    ]);

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          <FormattedMessage
            {...messages.enterRecoveryCodeFor}
            values={{
              accountName: (
                <a
                  key="accountName"
                  className={classes.link}
                >
                  {this.props.recoveringUsername}
                </a>
              ),
            }}
          >
            {(...parts) => (
              <Typography
                variant="body1"
                className={classes.textContainer}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                }}
                onMouseDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                }}
              >
                {parts}
              </Typography>
            )}
          </FormattedMessage>
          <FormSpace variant="content2" />
          <FormSpace variant="content2" />
          <FormSpace variant="content2" />
          <FormCodeInput
            label={translated.recoveryCode}
            onKeyPress={this.handleEnterForTextField}
            {...this.fil
              .getPropsForInputField('recoveryCode', { translate })}
          />
          <FormSpace variant="content2" />
          <FormSpace variant="content2" />
          <div className={classes.flexContainer}>
            {onResend && (
              <Button
                color="default"
                className={classes.actionBtn}
                onClick={onResend}
              >
                {translated.resendCode}
              </Button>
            )}
            <div className={classes.flex1} />
            <Button
              variant="contained"
              color="primary"
              disabled={!recoveryCode || recoveryCode.length !== 6}
              className={classes.actionBtn}
              onClick={this.challengeRecoveryToken}
            >
              {translated.enterCode}
            </Button>
          </div>
          <FormSpace variant="content1" />
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
)(EnterRecovryCode);
