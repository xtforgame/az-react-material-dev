/* eslint-disable react/prop-types, react/forbid-prop-types */
import React, { useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import ConfirmDialog from '~/components/Dialogs/ConfirmDialog';
import { FormSpace } from '~/components/FormInputs';
import { useTranslation } from 'react-i18next';

export default (props) => {
  const {
    normalize = v => v,
    label,
    value,
    i18nNs = [],
    onClose = () => undefined,
    onExited,
    RangeInput,
    rangeInpuProps,
    ...rest
  } = props;

  const [initLb, initUb] = normalize([
    (props.value && props.value[0]) || null,
    (props.value && props.value[1]) || null,
  ]);

  const [lowerBound, setLowerBound] = useState(initLb);
  const [upperBound, setUpperBound] = useState(initUb);

  const { t } = useTranslation(['builtin-components']);

  const setRange = (lb, ub) => {
    const [nln, nub] = normalize([lb, ub]);
    setLowerBound(nln);
    setUpperBound(nub);
  };

  const handleClose = (_result) => {
    let result = _result;
    if (result === true) {
      result = [lowerBound, upperBound];
    } else {
      result = undefined;
    }
    onClose(result);
  };

  return (
    <ConfirmDialog
      {...rest}
      onClose={handleClose}
      dialogProps={{ onExited }}
      buttonTexts={{
        yes: t('confirmOK'),
        no: t('confirmCancel'),
      }}
    >
      <DialogContent>
        <FormSpace variant="content1" />
        <RangeInput
          i18nNs={i18nNs}
          lowerBound={lowerBound}
          upperBound={upperBound}
          onLowerBoundChange={lb => setRange(lb, upperBound)}
          onUpperBoundChange={ub => setRange(lowerBound, ub)}
          {...rangeInpuProps}
        />
      </DialogContent>
    </ConfirmDialog>
  );
};
