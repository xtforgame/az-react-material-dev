/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import ConfirmDialog from '~/components/Dialogs/ConfirmDialog';
import { FormDateTimePicker, FormSpace } from '~/components/FormInputs';

export default class RangeDialog extends React.PureComponent {
  constructor(...args) {
    super(...args);
    const {
      normalize = v => v,
    } = this.props;
    const [lowerBound, upperBound] = normalize([
      (this.props.value && this.props.value[0]) || null,
      (this.props.value && this.props.value[1]) || null,
    ]);
    this.state = { lowerBound, upperBound };
  }

  handleEnterForTextField = (event) => {
    if (event.key === 'Enter') {
      this.handleClose(true);
      event.preventDefault();
    }
  };

  normalize = (lb, ub) => {
    const {
      normalize = v => v,
    } = this.props;

    const [lowerBound, upperBound] = normalize([lb, ub]);

    return this.setState({ lowerBound, upperBound });
  }

  setLowerBound = (lowerBound) => {
    this.normalize(lowerBound, this.state.upperBound);
  }

  setUpperBound = (upperBound) => {
    this.normalize(this.state.lowerBound, upperBound);
  }

  handleClose = (_result) => {
    let result = _result;
    if (result === true) {
      const { lowerBound, upperBound } = this.state;
      result = [lowerBound, upperBound];
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
        buttonTexts={{
          yes: '確定',
          no: '取消',
        }}
      >
        <DialogContent>
          <FormSpace variant="content1" />
          <FormDateTimePicker
            label="開始時間"
            minutesStep={60}
            value={this.state.lowerBound}
            onChange={v => this.setLowerBound(v)}
          />
          <FormSpace variant="content2" />
          <FormDateTimePicker
            label="結束時間"
            minutesStep={60}
            value={this.state.upperBound}
            onChange={v => this.setUpperBound(v)}
          />
        </DialogContent>
      </ConfirmDialog>
    );
  }
}

RangeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
