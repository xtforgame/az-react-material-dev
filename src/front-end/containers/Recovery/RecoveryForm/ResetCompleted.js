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
} from '~/components/FormInputs';

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
    onBackToLogin: PropTypes.func.isRequired,
  };

  render() {
    const {
      intl,
      classes,
      onBackToLogin,
    } = this.props;

    const translated = translateMessages(intl, messages, [
      'passwordResetCompleteMessage',
      'login',
    ]);

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          <FormSpace variant="content8" />
          <Typography variant="body1">
            {translated.passwordResetCompleteMessage}
          </Typography>
          <FormSpace variant="content8" />
          <div className={classes.flexContainer}>
            <div className={classes.flex1} />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className={classes.actionBtn}
              onClick={onBackToLogin}
            >
              {translated.login}
            </Button>
          </div>
        </FormContent>
      </div>
    );
  }
}


export default compose(
  connect(null, {}),
  injectIntl,
  withStyles(styles),
)(ResetPassword);
