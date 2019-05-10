/* eslint-disable no-param-reassign */
import React from 'react';
import FormDialogInput from '~/components/FormInputs/FormDialogInput';
import {
  getDateDisplayFuncFromProps,
  getTimeDisplayFuncFromProps,
  getDateTimeDisplayFuncFromProps,
} from '~/components/FormInputs/FormDateTimePicker/utils';
import moment from 'moment';
import DateRange from './components/DateRange';
import TimeRange from './components/TimeRange';
import DateTimeRange from './components/DateTimeRange';
import RangeDialog from '../RangeDialog';

const normalizeDateTime = ([startTime, endTime]) => {
  if (
    startTime
    && endTime
    && moment(startTime).valueOf() > moment(endTime).valueOf()
  ) {
    return [endTime || null, startTime || null];
  }
  return [startTime || null, endTime || null];
};

const getDateRangeDisplayFunc = displayFunc => (range) => {
  const [
    startTime = null,
    endTime = null,
  ] = range || [];
  const startText = displayFunc(startTime, '');
  const finishText = displayFunc(endTime, '');
  if (startText && finishText) {
    return `${startText}\n~\n${finishText}`;
  } else if (startText) {
    return `${startText} ~`;
  } else if (finishText) {
    return `~ ${finishText}`;
  }
  return '';
};

const DateTimeRangePresetBase = {
  converter: { fromView: ([v]) => v },
};

export const DateRangePreset = {
  presets: [DateTimeRangePresetBase],
  component: FormDialogInput,
  extraProps: {
    renderDialog: ({
      label,
      title,
      open,
      handleClose,
      value,
      dialogProps,
    }) => (
      <RangeDialog
        title={title != null ? title : label}
        normalize={normalizeDateTime}
        open={open}
        onClose={handleClose}
        value={value}
        RangeInput={DateRange}
        {...dialogProps}
      />
    ),
  },
  cfgMiddlewares: {
    last: cfg => ({
      ...cfg,
      mwRender: ({
        props, value, handleChange, link: { host, hostProps, linker },
      }) => ({
        displayValue: getDateRangeDisplayFunc(getDateDisplayFuncFromProps(props)),
        value,
        onChange: handleChange,
      }),
    }),
  },
};

export const TimeRangePreset = {
  presets: [DateTimeRangePresetBase],
  component: FormDialogInput,
  extraProps: {
    renderDialog: ({
      label,
      title,
      open,
      handleClose,
      value,
      dialogProps,
    }) => (
      <RangeDialog
        title={title != null ? title : label}
        normalize={normalizeDateTime}
        open={open}
        onClose={handleClose}
        value={value}
        RangeInput={TimeRange}
        {...dialogProps}
      />
    ),
  },
  cfgMiddlewares: {
    last: cfg => ({
      ...cfg,
      mwRender: ({
        props, value, handleChange, link: { host, hostProps, linker },
      }) => ({
        displayValue: getDateRangeDisplayFunc(getTimeDisplayFuncFromProps(props)),
        value,
        onChange: handleChange,
      }),
    }),
  },
};

export const DateTimeRangePreset = {
  presets: [DateTimeRangePresetBase],
  component: FormDialogInput,
  extraProps: {
    renderDialog: ({
      label,
      title,
      open,
      handleClose,
      value,
      dialogProps,
    }) => (
      <RangeDialog
        title={title != null ? title : label}
        normalize={normalizeDateTime}
        open={open}
        onClose={handleClose}
        value={value}
        RangeInput={DateTimeRange}
        {...dialogProps}
      />
    ),
  },
  cfgMiddlewares: {
    last: cfg => ({
      ...cfg,
      mwRender: ({
        props, value, handleChange, link: { host, hostProps, linker },
      }) => ({
        displayValue: getDateRangeDisplayFunc(getDateTimeDisplayFuncFromProps(props)),
        value,
        onChange: handleChange,
      }),
    }),
  },
};

export const x = 1;
