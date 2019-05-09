/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import moment from 'moment';
import { DateTimePicker } from 'material-ui-pickers';
import { timeFormat, getDateTimeDisplayFuncFromProps } from './utils';

// const diaplayFormat = 'YYYY/MM/DD HH:mm';
const diaplayFormat = 'lll';

export default (props) => {
  const {
    value = null,
    format, // disable this prop from original DateTimePicker
    onChange = () => undefined,
    ...rest
  } = props;

  const baseProps = {
    variant: 'outlined',
    fullWidth: true,
    format: diaplayFormat,
    animateYearScrolling: false,
    cancelLabel: '取消',
    clearLabel: '清除',
    okLabel: '確定',
    invalidLabel: props.label ? '' : '<未選取>',
    clearable: true,
    // disableFuture
    // maxDateMessage="Date must be less than today"
  };

  return (
    <DateTimePicker
      {...baseProps}
      {...rest}
      value={value}
      labelFunc={getDateTimeDisplayFuncFromProps(props)}
      onChange={v => (v === null ? onChange(v) : onChange(moment(v).format(timeFormat)/* .toISOString(true) */))}
    />
  );
};
