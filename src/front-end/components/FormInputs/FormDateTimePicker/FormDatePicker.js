/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import moment from 'moment';
import { DatePicker } from 'material-ui-pickers';
import { useTranslation } from 'react-i18next';
import {
  timeFormat,
  dateDisplayFormat,
  getDateDisplayFuncFromProps,
} from './utils';

export default (props) => {
  const {
    value = null,
    format, // disable this prop from original DatePicker
    onChange = () => undefined,
    ...rest
  } = props;

  const { t } = useTranslation(['builtin-components']);

  const baseProps = {
    variant: 'outlined',
    fullWidth: true,
    format: dateDisplayFormat,
    animateYearScrolling: false,
    cancelLabel: t('confirmCancel'),
    clearLabel: t('formClear'),
    okLabel: t('confirmOK'),
    invalidLabel: props.label ? '' : t('notSelected'),
    clearable: true,
    // disableFuture
    // maxDateMessage="Date must be less than today"
  };

  return (
    <DatePicker
      {...baseProps}
      {...rest}
      value={value}
      labelFunc={getDateDisplayFuncFromProps(props)}
      onChange={v => (v === null ? onChange(v) : onChange(moment(v).format(timeFormat)/* .toISOString(true) */))}
    />
  );
};
