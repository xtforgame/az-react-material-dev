/* eslint-disable no-param-reassign */
import React from 'react';
import FormDialogInput from '~/components/FormInputs/FormDialogInput';
import FdiDialog from './FdiDialog';

export const DateRangePreset = {
  component: FormDialogInput,
  converter: { fromView: ([v]) => v },
  extraProps: {
    displayValue: range => '選擇範圍',
    renderDialog: ({
      label,
      title,
      open,
      handleClose,
      value,
      dialogProps,
    }) => (
      <FdiDialog
        title={title != null ? title : label}
        open={open}
        onClose={handleClose}
        value={value}
        {...dialogProps}
      />
    ),
  },
  mwRender: ({ value, handleChange, link: { host, hostProps, linker } }) => ({
    value,
    onChange: handleChange,
  }),
};

export const x = 1;
