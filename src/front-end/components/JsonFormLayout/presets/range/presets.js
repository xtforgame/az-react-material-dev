/* eslint-disable no-param-reassign */
import React from 'react';
import FormDialogInput from '~/components/FormInputs/FormDialogInput';
import { getDateTimeDisplayFuncFromProps } from '~/components/FormInputs/FormDateTimePicker/utils';
import moment from 'moment';
import RangeDialog from './RangeDialog';

const normalizeDateTime = ([startTime, finishTime]) => {
  if (
    startTime
    && finishTime
    && moment(startTime).valueOf() > moment(finishTime).valueOf()
  ) {
    return [finishTime || null, startTime || null];
  }
  return [startTime || null, finishTime || null];
};

const getDateRangeDisplayFunc = props => (range) => {
  const displayFunc = getDateTimeDisplayFuncFromProps(props);
  const [
    startTime = null,
    finishTime = null,
  ] = range || [];
  const startText = displayFunc(startTime, '');
  const finishText = displayFunc(finishTime, '');
  if (startText && finishText) {
    return `${startText}\n~\n${finishText}`;
  } else if (startText) {
    return `${startText} ~`;
  } else if (finishText) {
    return `~ ${finishText}`;
  }
  return '';
};

export const DateRangePreset = {
  component: FormDialogInput,
  converter: { fromView: ([v]) => v },
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
        displayValue: getDateRangeDisplayFunc(props),
        value,
        onChange: handleChange,
      }),
    }),
  },
};

export const x = 1;
