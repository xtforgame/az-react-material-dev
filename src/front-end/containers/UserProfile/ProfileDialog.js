import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import SimpleFullScreenDialog from '~/components/Dialogs/SimpleFullScreenDialog';
import Profile from './Profile';

const styles = theme => ({
  paperRoot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowX: 'hidden',
    flex: 1,
  },
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    background: theme.palette.background.default,
    padding: 8,
    [theme.breakpoints.up('sm')]: {
      padding: 48,
    },
  },
});

class UserProfile extends React.PureComponent {
  render() {
    const {
      t,
      classes,
      open,
      onClose,
    } = this.props;
    return (
      <SimpleFullScreenDialog
        title={t('profile')}
        open={open}
        onClose={onClose}
      >
        <div className={classes.root}>
          <div className={classes.paperRoot}>
            <Profile />
          </div>
        </div>
      </SimpleFullScreenDialog>
    );
  }
}

export default compose(
  withStyles(styles),
  withTranslation(['app-common']),
)(UserProfile);
