/* eslint-disable react/no-multi-comp */

import React, { useState, useEffect } from 'react';

export default (props) => {
  const {
    Component,
    value: v,
    calculatedValue,
    acOptions: {
      isEqual = (r, v, p) => r === v,
      getExtraProps = () => undefined,
      onAutoCalcChanged = () => undefined,
    } = {},
    ...rest
  } = props;

  const [value, setValue] = useState(v);
  const [lastAutoCalc, setLastAutoCalc] = useState(v == null || isEqual(calculatedValue, v));
  const [lastMatchedValue, setLastMatchedValue] = useState(null);
  const [extraProps, setExtraProps] = useState(getExtraProps(lastAutoCalc));

  const autoCalc = v == null
    || isEqual(calculatedValue, v, props)
    || (lastAutoCalc && lastMatchedValue === v);

  useEffect(() => {
    setValue(autoCalc ? calculatedValue : v);
    setLastAutoCalc(autoCalc);
    setLastMatchedValue(autoCalc ? v : null);
    setExtraProps(getExtraProps(autoCalc));
    setTimeout(() => onAutoCalcChanged(autoCalc), 0);
  }, [v, calculatedValue]);

  return (
    <Component
      value={value}
      {...rest}
      {...extraProps}
    />
  );
};