/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import moment from 'moment';
import { TimePicker } from '@material-ui/pickers';
import { useTranslation } from 'react-i18next';
import {
  timeFormat,
  timeDisplayFormat,
  getTimeDisplayFuncFromProps,
} from './utils';

export default (props) => {
  const {
    value = null,
    format, // disable this prop from original TimePicker
    onChange = () => undefined,
    ...rest
  } = props;

  const { t } = useTranslation(['builtin-components']);

  const baseProps = {
    inputVariant: 'outlined',
    fullWidth: true,
    format: timeDisplayFormat,
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
    <TimePicker
      {...baseProps}
      {...rest}
      value={value}
      labelFunc={getTimeDisplayFuncFromProps(props)}
      onChange={v => (v === null ? onChange(v) : onChange(moment(v).format(timeFormat)/* .toISOString(true) */))}
    />
  );
};
