/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import ConfirmDialog from '~/components/Dialogs/ConfirmDialog';
import { FormSpace } from '~/components/FormInputs';
import moment from 'moment';
import { DateTimePicker } from 'material-ui-pickers';

const diaplayFormat = 'YYYY/MM/DD HH:mm';
const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ';

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

    const baseProps = {
      variant: 'outlined',
      fullWidth: true,
      format: diaplayFormat,
      animateYearScrolling: false,
      cancelLabel: '取消',
      clearLabel: '清除',
      okLabel: '確定',
      // clearable
      // disableFuture
      // maxDateMessage="Date must be less than today"
    };

    console.log('this.state.editingText :', this.state.editingText);

    return (
      <ConfirmDialog
        {...rest}
        onClose={this.handleClose}
        dialogProps={{ onExited }}
      >
        <DialogContent>
          {/* <FormSpace variant="content2" /> */}
          <DateTimePicker
            {...baseProps}
            format={diaplayFormat}
            minutesStep={20}
            value={this.state.editingText}
            onChange={v => this.setState({ editingText: moment(v).format(timeFormat)/* .toISOString(true) */ })}
          />
          <FormSpace variant="content2" />
          <DateTimePicker
            {...baseProps}
            format={diaplayFormat}
            minutesStep={20}
            value={this.state.editingText}
            onChange={v => this.setState({ editingText: moment(v).format(timeFormat)/* .toISOString(true) */ })}
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
