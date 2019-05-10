/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import { FormDatePicker, FormSpace } from '~/components/FormInputs';
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
      <FormDatePicker
        label={t('dateStart')}
        value={lowerBound}
        onChange={onLowerBoundChange}
      />
      <FormSpace variant="content2" />
      <FormDatePicker
        label={t('dateEnd')}
        value={upperBound}
        onChange={onUpperBoundChange}
      />
    </React.Fragment>
  );
};
