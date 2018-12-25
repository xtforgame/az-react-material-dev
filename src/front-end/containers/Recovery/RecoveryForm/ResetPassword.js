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
  FormPasswordInput,
} from '~/components/FormInputs';
import FormBaseType001 from '~/containers/LoginForms/FormBaseType001';
import createResetPasswordInputConfigs from '~/containers/LoginForms/createResetPasswordInputConfigs';

import {
  FormTextFieldPreset,
  displayErrorFromPropsForTextField,
  FormPasswordVisibilityPreset,
  assert,
  translateLabel,
  addOnPressEnterEvent,
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
});

class ResetPassword extends React.PureComponent {
  static propTypes = {
    recoveringUsername: PropTypes.string,
    recoveringCode: PropTypes.string,
    onResetPassword: PropTypes.func.isRequired,
  };

  resetPassword = ({ newPassword }) => {
    const {
      recoveringUsername,
      recoveringCode,
    } = this.props;

    this.props.onResetPassword({
      username: recoveringUsername,
      code: recoveringCode,
      newPassword,
    });
  }

  render() {
    const {
      intl,
      classes,
      ...porps
      // recoveryCodeError,
    } = this.props;

    const translated = translateMessages(intl, messages, [
      'setNewPassword',
    ]);

    return (
      <FormBaseType001
        {...porps}
        namespace="reset-password"
        i18nMessages={messages}
        setNewPasswordText={translated.setNewPassword}
        onSubmit={this.resetPassword}
        fields={createResetPasswordInputConfigs(classes)}
      />
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
