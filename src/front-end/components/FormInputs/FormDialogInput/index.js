/* eslint-disable react/no-multi-comp */

import React from 'react';
import FdiDialog from './FdiDialog';
import FdiButton from './FdiButton';

class FormDialogInput extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = (value) => {
    const {
      onChange = () => {},
    } = this.props;

    this.setState({ open: false });
    onChange(value);
  };

  render() {
    const {
      label,
      value,
      renderButton,
      buttonProps,
      dialogProps,
    } = this.props;

    const selectedData = (value && value.data);
    const selectedName = selectedData && selectedData.name;

    return (
      <React.Fragment>
        {renderButton ? renderButton({
          selectedName,
          handleClick: this.handleClickOpen,
        }) : (
          <FdiButton
            label={label}
            value={'SSSS'}
            onClick={this.handleClickOpen}
            {...buttonProps}
          />
        )}
        {this.state.open && (
          <FdiDialog
            id="param-input"
            title={label}
            open={this.state.open}
            onClose={this.handleClose}
            editingText={'SSSS'}
            {...dialogProps}
          />
        )}
      </React.Fragment>
    );
  }
}

export default FormDialogInput;
