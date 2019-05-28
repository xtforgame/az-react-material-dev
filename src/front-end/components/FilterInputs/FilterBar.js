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
  constructor(props) {
    super(props);
    if (props.value !== undefined) {
      this.controlled = true;
    }
    this.state = {
      dialogOpend: false,
    };
  }

  handleOpen = () => {
    this.setState({ dialogOpend: true });
  }

  handleClose = (value) => {
    const newState = { dialogOpend: false };
    if (value) {
      newState.value = value;
    }

    this.setState(newState);

    if (value) {
      const {
        onFiltersChange = () => undefined,
      } = this.props;
      onFiltersChange(value);
    }
  }

  handleDeleteChip = (name, v, values) => {
    const value = { ...this.state.value };
    delete value[name];
    this.setState({ value });
    const {
      onFiltersChange = () => undefined,
    } = this.props;
    onFiltersChange(value);
  }

  render() {
    const {
      classes,
      // onSearch = () => {},
      position = 'fixed',
      fields,
      onFiltersChange,
      value: valueFromPorps,
      ...props
    } = this.props;
    const { dialogOpend, value: valueFromState } = this.state;
    let value = this.controlled ? valueFromPorps : valueFromState;

    value = value || {};

    return (
      <div className={classes.root}>
        <AppBar color="default" position={position} className={classes.appBarPaper}>
          <Toolbar>
            <DialogWithChips
              title="搜尋"
              open={dialogOpend}
              onDeleteChip={this.handleDeleteChip}
              onClose={this.handleClose}
              dialogProps={{
                buttonTexts: {
                  confirm: '搜尋',
                  cancel: '取消',
                },
              }}
              renderChip={({ key, value }) => !!value && ({ label: `搜尋:${value}` })}
              value={value}
              fields={fields || []}
              {...props}
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
