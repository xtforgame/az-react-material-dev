/* eslint-disable react/no-multi-comp */

import React from 'react';
import useDialogState from '~/hooks/useDialogState';
import FdiDialog from './FdiDialog';
import FdiButton from './FdiButton';

export const Cancel = Symbol('Cancel');

/*
  props:
    onChange(value)
    label
    title (default = label)
    value
    displayValue(value) => text
    renderButton
    buttonProps
    renderDialog
    dialogProps
*/
export default (props) => {
  const {
    Button = FdiButton,
    Dialog = FdiDialog,
    label,
    title,
    value,
    displayValue = v => v,
    renderButton,
    buttonProps,
    renderDialog,
    dialogProps: dp1,
    onChange = () => {},
  } = props;

  const [{
    open,
    exited,
    dialogProps: dp2,
  }, {
    handleOpen,
    handleClose,
    handleExited,
  }] = useDialogState({
    open: () => {
    },
    close: (v) => {
      if (v !== undefined && v !== Cancel) {
        onChange(v);
      }
    },
  });

  const dialogProps = { ...dp1, ...dp2 };

  const valueForDisplay = displayValue(value);
  const propsForButton = {
    label,
    title,
    handleOpen,
    value,
    valueForDisplay,
    buttonProps,
  };

  const propsForDialog = {
    label,
    title,
    open,
    handleClose,
    handleExited,
    value,
    dialogProps,
  };

  return (
    <React.Fragment>
      {renderButton ? renderButton(propsForButton) : (
        <Button
          label={label}
          value={valueForDisplay}
          onClick={handleOpen}
          onKeyDown={handleOpen}
          {...buttonProps}
        />
      )}
      {(!exited) && (
        renderDialog ? renderDialog(propsForDialog) : (
          <Dialog
            title={title != null ? title : label}
            value={value}
            {...dialogProps}
          />
        )
      )}
    </React.Fragment>
  );
};
