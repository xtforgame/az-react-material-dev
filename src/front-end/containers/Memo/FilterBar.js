// @flow weak

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import DialogWithChips from '~/components/FilterInputs/DialogWithChips';

import { compose } from 'recompose';
import createCommonStyles from '~/styles/common';

import {
  FormTextFieldPreset,
  addOnPressEnterEvent,
} from '~/utils/InputLinker/helpers';

const styles = theme => ({
  root: {
    // marginTop: theme.spacing(3),
    width: '100%',
  },
  appBarPaper: {
    boxShadow: theme.shadows[2].split('),').splice(1, 2).join('),'),
  },
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class FilterBar extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      dialogOpend: false,
    };
  }

  handleOpen = () => {
    this.setState({ dialogOpend: true });
  }

  handleClose = (data) => {
    const newState = { dialogOpend: false };
    if (data) {
      newState.data = data;
    }

    this.setState(newState);
  }

  handleDeleteChip = (name, value, values) => {
    const data = { ...this.state.data };
    delete data[name];
    this.setState({ data });
  }

  render() {
    const {
      classes,
      // onSearch = () => {},
      position = 'fixed',
    } = this.props;
    let { dialogOpend, data } = this.state;
    data = data || {};

    return (
      <div className={classes.root}>
        <AppBar color="default" position={position} className={classes.appBarPaper}>
          <Toolbar>
            <DialogWithChips
              title="Filter"
              open={dialogOpend}
              onDeleteChip={this.handleDeleteChip}
              onClose={this.handleClose}
              dialogProps={{
                buttonTexts: {
                  confirm: 'confirm',
                  cancel: 'cancel',
                },
              }}
              renderChip={({ key, value }) => !!value && ({ label: `include:${value}` })}
              value={data}
              fields={[
                {
                  presets: [FormTextFieldPreset, addOnPressEnterEvent('handleSubmit')],
                  name: 'searchText',
                  extraProps: {
                    label: 'Search Text',
                    margin: 'dense',
                    fullWidth: true,
                    autoFocus: true,
                  },
                  // validate: value => value || new Error('Should not be empty'),
                },
              ]}
            />
            <div className={classes.flex1} />
            <IconButton color="inherit" onClick={this.handleOpen} aria-label="Menu">
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}


export default compose(
  withStyles(styles),
)(FilterBar);
