/* eslint-disable react/prop-types */
import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormBaseType001 from '~/containers/LoginForms/FormBaseType001';
import createResetPasswordInputConfigs from '~/containers/LoginForms/createResetPasswordInputConfigs';

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
      t,
      classes,
      ...porps
      // recoveryCodeError,
    } = this.props;

    return (
      <FormBaseType001
        {...porps}
        namespace="reset-password"
        setNewPasswordText={t('setNewPassword')}
        onSubmit={this.resetPassword}
        fields={createResetPasswordInputConfigs(classes)}
      />
    );
  }
}


export default compose(
  withTranslation(['app-common']),
  withStyles(styles),
)(ResetPassword);
