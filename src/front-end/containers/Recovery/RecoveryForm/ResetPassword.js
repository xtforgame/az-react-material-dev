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
} from '~/components/FormInputs';

import InputLinker from '~/utils/InputLinker';
import {
  FormTextFieldPreset,
  displayErrorFromPropsForTextField,
  FormPasswordVisibilityPreset,
  assert,
  translateLabelAndAddOnKeyPressEvent,
} from '~/utils/InputLinker/helpers';
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
    this.il = new InputLinker(this, {
      namespace: 'reset-password',
    });
    this.il.add(
      {
        name: 'password',
        presets: [FormTextFieldPreset, translateLabelAndAddOnKeyPressEvent('enterNewPassword', this.handleEnterForTextField)],
        InputComponent: FormPasswordInput,
        extraGetProps: displayErrorFromPropsForTextField('passwordError'),
        validate: value => assert(isValidPassword(value), null, { key: 'wrongPasswordFormatError' }),
      },
      {
        name: 'confrimPassword',
        presets: [FormTextFieldPreset, translateLabelAndAddOnKeyPressEvent('reenterNewPassword', this.handleEnterForTextField)],
        InputComponent: FormPasswordInput,
        extraGetProps: displayErrorFromPropsForTextField('passwordError'),
        validate: (value) => {
          const {
            password,
            confrimPassword,
          } = this.il.getOutputs();
          assert(password === confrimPassword, null, { key: 'confirmPasswordError' });
        },
      },
      {
        name: 'passwordVisibility',
        presets: [FormPasswordVisibilityPreset],
        defaultValue: false,
      },
    );

    this.state = this.il.mergeInitState({
      fil: this.il,
    });
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
    } = this.il.getOutputs();

    if (this.il.validate()) {
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
    } = this.il.getOutputs();

    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
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
          {this.il.renderComponent('password', {
            translate,
            extraProps: this.il.renderProps('passwordVisibility', { translate }),
          })}
          <FormSpace variant="content4" />
          {this.il.renderComponent('confrimPassword', {
            translate,
            extraProps: this.il.renderProps('passwordVisibility', { translate }),
          })}
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
