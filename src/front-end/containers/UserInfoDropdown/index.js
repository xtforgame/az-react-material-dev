import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Settings from '@material-ui/icons/Settings';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import modelMap from '~/containers/App/modelMap';
import ProfileDialog from '~/containers/UserProfile/ProfileDialog';
import UserSettingsDialog from '~/containers/UserSettingsDialog';
import { push } from 'react-router-redux';

const {
  clearSessionCache,
} = modelMap.actions;

const styles = theme => ({
  menuItem: {
    // '&:focus': {
    //   backgroundColor: theme.palette.primary.main,
    //   '& $primary, & $icon': {
    //     color: theme.palette.common.white,
    //   },
    // },
  },
  primary: {},
  icon: {},
});

class UserInfoDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      menuOpen: false,
      profileOpen: false,
      settingsOpen: false,
    };
  }

  getMenuItmes() {
    const { classes, t, clearSessionCache/* , push */ } = this.props;
    return [
      <MenuItem
        key="user-profile"
        className={classes.menuItem}
        onClick={(event) => {
          this.setState({
            profileOpen: true,
            menuOpen: false,
          });
          // push('/user-profile');
        }}
      >
        {/* <ListItemIcon className={classes.icon}>
          <AccountBox />
        </ListItemIcon> */}
        <ListItemText
          inset
          classes={{ primary: classes.primary }}
          primary={t('profile')}
        />
      </MenuItem>,
      // <MenuItem
      //   key="user-account"
      //   className={classes.menuItem}
      //   onClick={(event) => {
      //     this.setState({
      //       menuOpen: false,
      //     });
      //   }}
      // >
      //   {/* <ListItemIcon
      //     className={classes.icon}
      //   >
      //     <AccountBox />
      //   </ListItemIcon> */}
      //   <ListItemText
      //     classes={{ primary: classes.primary }}
      //     primary={<FormattedMessage {...messages.myAccount} />}
      //   />
      // </MenuItem>,
      <MenuItem
        key="user-setting"
        className={classes.menuItem}
        onClick={(event) => {
          this.setState({
            settingsOpen: true,
            menuOpen: false,
          });
        }}
      >
        <ListItemIcon className={classes.icon}>
          <Settings />
        </ListItemIcon>
        <ListItemText
          classes={{ primary: classes.primary }}
          primary={t('settings')}
        />
      </MenuItem>,
      <Divider key="divider-1" />,
      <MenuItem
        key="logout"
        className={classes.menuItem}
        onClick={(event) => {
          this.setState({
            menuOpen: false,
          });
          clearSessionCache('me');
        }}
      >
        <ListItemIcon className={classes.icon}>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText
          classes={{ primary: classes.primary }}
          primary={t('logout')}
        />
      </MenuItem>,
    ];
  }

  handleClick = (event) => {
    this.setState({
      menuOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestCloseMenu = () => {
    this.setState({ menuOpen: false });
  };

  handleRequestCloseDialog = () => {
    this.setState({
      profileOpen: false,
      settingsOpen: false,
    });
  };

  render() {
    const {
      classes, i18n, t, tReady, clearSessionCache, push, ...props
    } = this.props;
    return (
      <div>
        <IconButton
          color="inherit"
          aria-owns={this.state.open ? 'options-menu' : null}
          aria-haspopup="true"
          {...props}
          onClick={this.handleClick}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.menuOpen}
          onClose={this.handleRequestCloseMenu}
        >
          {this.getMenuItmes()}
        </Menu>
        {this.state.profileOpen && (
          <ProfileDialog
            open={this.state.profileOpen}
            onClose={this.handleRequestCloseDialog}
          />
        )}
        {this.state.settingsOpen && (
          <UserSettingsDialog
            open={this.state.settingsOpen}
            onClose={this.handleRequestCloseDialog}
          />
        )}
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({}),
    {
      clearSessionCache,
      push,
    }
  ),
  withTranslation(['app-common']),
  withStyles(styles),
)(UserInfoDropdown);
