/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import moment from 'moment';
import { DateTimePicker } from 'material-ui-pickers';
import { useTranslation } from 'react-i18next';
import {
  timeFormat,
  dateTimeDisplayFormat,
  getDateTimeDisplayFuncFromProps,
} from './utils';

export default (props) => {
  const {
    value = null,
    format, // disable this prop from original DateTimePicker
    onChange = () => undefined,
    ...rest
  } = props;

  const { t } = useTranslation(['builtin-components']);

  const baseProps = {
    variant: 'outlined',
    fullWidth: true,
    format: dateTimeDisplayFormat,
    animateYearScrolling: false,
    cancelLabel: t('confirmCancel'),
    clearLabel: t('formClear'),
    okLabel: t('confirmOK'),
    invalidLabel: props.label ? '' : t('notSelected'),
    clearable: true,
    // ampm: false,
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
