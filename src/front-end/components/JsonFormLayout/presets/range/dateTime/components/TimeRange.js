/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import { FormTimePicker, FormSpace } from '~/components/FormInputs';
import { useTranslation } from 'react-i18next';

export default (props) => {
  const {
    lowerBound,
    upperBound,
    onLowerBoundChange,
    onUpperBoundChange,
  } = props;

  const { t } = useTranslation(['builtin-components']);

  return (
    <React.Fragment>
      <FormTimePicker
        label={t('timeStart')}
        value={lowerBound}
        onChange={onLowerBoundChange}
      />
      <FormSpace variant="content2" />
      <FormTimePicker
        label={t('timeEnd')}
        value={upperBound}
        onChange={onUpperBoundChange}
      />
    </React.Fragment>
  );
};
