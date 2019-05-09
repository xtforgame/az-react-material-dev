/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import ConfirmDialog from '~/components/Dialogs/ConfirmDialog';
import { FormTextField, FormSpace } from '~/components/FormInputs';

export default class FdiDialog extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      editingText: this.props.value || '',
    };
  }

  handleEnterForTextField = (event) => {
    if (event.key === 'Enter') {
      this.handleClose(true);
      event.preventDefault();
    }
  };

  handleClose = (_result) => {
    let result = _result;
    if (result === true) {
      result = this.state.editingText;
    } else {
      result = undefined;
    }
    if (this.props.onClose) {
      this.props.onClose(result);
    }
  }

  render() {
    const {
      label,
      value,
      onClose,
      onExited,
      ...rest
    } = this.props;
    return (
      <ConfirmDialog
        {...rest}
        onClose={this.handleClose}
        dialogProps={{ onExited }}
      >
        <DialogContent>
          <FormSpace variant="content1" />
          <FormTextField
            id=""
            label={label}
            onKeyPress={this.handleEnterForTextField}
            value={this.state.editingText}
            onChange={e => this.setState({ editingText: e.target.value })}
            autoFocus
            margin="dense"
            fullWidth
          />
        </DialogContent>
      </ConfirmDialog>
    );
  }
}

FdiDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
