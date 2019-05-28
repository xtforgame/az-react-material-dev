// @flow weak

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LocaleDropdown from '~/containers/LocaleDropdown';
import UserInfoDropdown from '~/containers/UserInfoDropdown';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import createCommonStyles from '~/styles/common';

const styles = theme => ({
  root: {
    // marginTop: theme.spacing(3),
    width: '100%',
  },
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class MainAppBar extends React.PureComponent {
  render() {
    const {
      t,
      classes,
      isUserLoggedIn = true,
      onToggleMenu = () => {},
    } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            {isUserLoggedIn && (
              <IconButton color="inherit" className={classes.menuButton} onClick={onToggleMenu} aria-label="Menu">
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" color="inherit" className={classes.flex1}>
              {t('appTitle')}
            </Typography>
            <LocaleDropdown />
            {/* <Button color="inherit" onClick={() => clearSessionCache('me')}>
              <FormattedMessage {...messages.logout} />
            </Button> */}
            {isUserLoggedIn && (
              <UserInfoDropdown />
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}


export default compose(
  connect(
    state => ({}),
    {}
  ),
  withTranslation(['app-common']),
  withStyles(styles),
)(MainAppBar);
