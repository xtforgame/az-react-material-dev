import React from 'react';
import { createStructuredSelector } from 'reselect';
// import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import { useTranslation } from 'react-i18next';
import {
  useConnect,
} from '~/hooks/redux-react-hook-ex';
import SimpleFullScreenDialog from '~/components/Dialogs/SimpleFullScreenDialog';
import {
  changeTheme,
} from '~/containers/App/actions';
import {
  makeUiThemeSelector,
} from '~/containers/App/selectors';

// const useStyles = makeStyles({});

const mapStateToProps = createStructuredSelector({
  uiTheme: makeUiThemeSelector(),
});

const mapDispatchToProps = {
  changeTheme,
};

export default (props) => {
  const {
    open,
    onClose,
  } = props;

  const { t } = useTranslation(['app-common']);


  const {
    uiTheme,
    changeTheme,
  } = useConnect(mapStateToProps, mapDispatchToProps);

  // const classes = useStyles();

  const handleToggle = () => {
    changeTheme({
      ...uiTheme,
      paletteType: uiTheme.paletteType === 'dark' ? 'light' : 'dark',
    });
  };


  return (
    <SimpleFullScreenDialog
      title={t('settings')}
      open={open}
      onClose={onClose}
    >
      <List>
        <ListItem
          button
          onClick={handleToggle}
        >
          {/* <ListItemIcon>
            <CloseIcon />
          </ListItemIcon> */}
          <ListItemText primary="Dark mode" secondary={uiTheme.paletteType === 'dark' ? 'on' : 'off'} />
          <ListItemSecondaryAction>
            <Switch
              onChange={handleToggle}
              checked={uiTheme.paletteType === 'dark'}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </SimpleFullScreenDialog>
  );
};
