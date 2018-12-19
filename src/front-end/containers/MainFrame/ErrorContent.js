import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';
import createCommonStyles from '~/styles/common';
import {
  FormSpace,
  FormContent,
} from '~/components/FormInputs';
import MainAppBar from './MainAppBar';

import modelMap from '~/containers/App/modelMap';

const {
  clearSessionCache,
} = modelMap.actions;

const styles = theme => ({
  ...createCommonStyles(theme, ['flex']),
});

class ErrorContent extends React.Component {
  render() {
    const {
      classes,
      intl,
      clearSessionCache,
    } = this.props;

    const translated = translateMessages(intl, messages, [
      'failToGetUserData',
      'login',
    ]);

    return (
      <React.Fragment>
        <MainAppBar isUserLoggedIn={false} />
        <FormSpace variant="top" />
        <FormContent>
          <FormSpace variant="content8" />
          <Typography variant="body1">
            {translated.failToGetUserData}
          </Typography>
          <FormSpace variant="content8" />
          <div className={classes.flexContainer}>
            <div className={classes.flex1} />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                clearSessionCache('me');
              }}
            >
              {translated.login}
            </Button>
          </div>
        </FormContent>
      </React.Fragment>
    );
  }
}

export default compose(
  connect(
    null,
    { clearSessionCache }
  ),
  injectIntl,
  withStyles(styles),
)(ErrorContent);
