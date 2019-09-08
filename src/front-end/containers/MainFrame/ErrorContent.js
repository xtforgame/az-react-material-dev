import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import createCommonStyles from '~/styles/common';
import {
  FormSpace,
  FormContent,
} from '~/components/FormInputs';
import MainAppBar from './MainAppBar';

import modelMapEx from '~/containers/App/modelMapEx';

const {
  session,
} = modelMapEx.querchy.actionCreatorSets;

const styles = theme => ({
  ...createCommonStyles(theme, ['flex']),
});

class ErrorContent extends React.PureComponent {
  render() {
    const {
      classes,
      t,
      clearSessionCache,
    } = this.props;

    return (
      <React.Fragment>
        <MainAppBar isUserLoggedIn={false} />
        <FormSpace variant="top" />
        <FormContent>
          <FormSpace variant="content8" />
          <Typography variant="body1">
            {t('failToGetUserData')}
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
              {t('login')}
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
    {
      clearSessionCache: session.clearAllCache,
    }
  ),
  withTranslation(['app-common']),
  withStyles(styles),
)(ErrorContent);
