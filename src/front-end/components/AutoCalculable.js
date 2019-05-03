/* eslint-disable react/no-multi-comp */

import React, { useState, useEffect } from 'react';

export const defaultIsEqual = (r, v, p) => r === v;

export default (props) => {
  const {
    Component,
    value: v,
    calculatedValue,
    acOptions: {
      isEqual = defaultIsEqual,
      getExtraProps = () => undefined,
      onAutoCalcChanged = () => undefined,
      normalize = (v => v || ''),
    } = {},
    ...rest
  } = props;

  // const [value, setValue] = useState(v);
  const [lastAutoCalc, setLastAutoCalc] = useState(v == null || isEqual(calculatedValue, v, props));
  const [lastMatchedValue, setLastMatchedValue] = useState(null);
  const [extraProps, setExtraProps] = useState(getExtraProps(lastAutoCalc));

  const autoCalc = v == null
    || isEqual(calculatedValue, v, props)
    || (lastAutoCalc && lastMatchedValue === v);

  const currentValue = autoCalc ? calculatedValue : v;

  useEffect(() => {
    // setValue(currentValue);
    setLastAutoCalc(autoCalc);
    setLastMatchedValue(autoCalc ? v : null);
    setExtraProps(getExtraProps(autoCalc));
    setTimeout(() => onAutoCalcChanged(autoCalc), 0);
  }, [v, calculatedValue]);

  return (
    <Component
      value={normalize(currentValue)}
      {...rest}
      {...extraProps}
    />
  );
};
