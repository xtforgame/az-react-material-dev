/* eslint-disable no-underscore-dangle, react/no-this-in-sfc, no-param-reassign */
import { useState } from 'react';
import InputLinker from './Linker';

const ilCreator = (
  host, options = {}, createOptions = {}, cb = () => undefined
) => () => {
  const {
    Linker = InputLinker,
    ...rest
  } = options;
  const il = new Linker(host, { ...rest, stateMode: 'hook' });
  cb(il, createOptions);
  return il;
};

export default (host, options, cb) => {
  const [il, setIl] = useState(ilCreator(host, options, { reset: false }, cb));

  return {
    il,
    setIl,
    resetIl: (resetOptions = {}) => {
      if (resetOptions.defaultValues) {
        il.setDefaultValues(resetOptions.defaultValues);
      }
      if (!resetOptions.ignoreResetValues) {
        const changeMap = {};
        Object.values(il.fieldMap).forEach((f) => {
          changeMap[f.name] = f.defaultValue;
          f.setError();
        });
        il.changeValues(changeMap);
      }
      const newIl = ilCreator(host, options, { ...resetOptions, reset: true }, cb)();
      setIl(newIl);
      return newIl;
    },
  };
};
