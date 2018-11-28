/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
  FormPasswordInput,
} from '~/components/SignInSignUp';

import FormInputLinker, {
  FormTextFieldGetProps,
  FormPasswordVisibilityGetProps,
  assert,
} from '~/utils/FormInputLinker';
import {
  isValidPassword,
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
});

class ResetPassword extends React.Component {
  static propTypes = {
    recoveringUsername: PropTypes.string,
    recoveringCode: PropTypes.string,
    onResetPassword: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.fil = new FormInputLinker(this, {
      namespace: 'reset-password',
    });
    this.fil.add({
      name: 'password',
      exposed: {
        onChange: 'onPasswordChange',
      },
      getProps: FormTextFieldGetProps,
      validate: value => assert(isValidPassword(value), null, { key: 'wrongPasswordFormatError' }),
    }, {
      name: 'confrimPassword',
      getProps: FormTextFieldGetProps,
      validate: (value) => {
        const {
          password,
          confrimPassword,
        } = this.fil.getOutputs();
        assert(password === confrimPassword, null, { key: 'confirmPasswordError' });
      },
    }, {
      name: 'password-visibility',
      defaultValue: false,
      getProps: FormPasswordVisibilityGetProps,
      converter: {
        fromView: (({ valueInState }) => !valueInState),
      },
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
      this.resetPassword();
      event.preventDefault();
    }
  };

  resetPassword = () => {
    const {
      recoveringUsername,
      recoveringCode,
    } = this.props;

    const {
      password,
    } = this.fil.getOutputs();

    if (this.fil.validate()) {
      this.props.onResetPassword({
        username: recoveringUsername,
        code: recoveringCode,
        newPassword: password,
      });
    }
  }

  render() {
    const {
      intl,
      classes,
      recoveryCodeError,
    } = this.props;

    const {
      password,
    } = this.fil.getOutputs();

    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
      'enterNewPassword',
      'reenterNewPassword',
      'setNewPassword',
      'resetPassword',
    ]);

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          <FormSpace variant="content2" />
          {recoveryCodeError
            && (
              <React.Fragment>
                <Typography variant="body1" color="secondary">
                  {recoveryCodeError}
                </Typography>
                <FormSpace variant="content4" />
              </React.Fragment>
            )
          }
          <FormPasswordInput
            label={translated.enterNewPassword}
            onKeyPress={this.handleEnterForTextField}
            {...this.fil
              .getPropsForInputField('password', { translate })}
            {...this.fil
              .getPropsForInputField('password-visibility', { translate })}
          />
          <FormSpace variant="content4" />
          <FormPasswordInput
            label={translated.reenterNewPassword}
            onKeyPress={this.handleEnterForTextField}
            {...this.fil
              .getPropsForInputField('confrimPassword', { translate })}
            {...this.fil
              .getPropsForInputField('password-visibility', { translate })}
          />
          <FormSpace variant="content4" />
          <div className={classes.flexContainer}>
            <div className={classes.flex1} />
            <Button
              variant="contained"
              color="primary"
              disabled={!password}
              className={classes.actionBtn}
              onClick={this.resetPassword}
            >
              {translated.setNewPassword}
            </Button>
          </div>
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
)(ResetPassword);
