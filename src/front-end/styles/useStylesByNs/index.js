/* eslint-disable no-param-reassign */
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import global from '../common/global';
import login from '../FormPaper/login';
import flex from '../common/flex';
import appBar from '../common/appBar';
import mobile from '../common/mobile';
import genderColors from '../common/genderColors';

const stylesNsMap = {
  global,
  login,
  flex,
  appBar,
  mobile,
  genderColors,
};

export const defaultScope = 'default';

const nsScopeMap = {
  [defaultScope]: Object.keys(stylesNsMap)
    .reduce((r, name) => ({ ...r, [name]: makeStyles(stylesNsMap[name]) }), {}),
};

export default (ns, scope = defaultScope) => {
  const [namespaces] = useState(() => {
    let namespaces = ns;
    if (!Array.isArray(namespaces)) {
      namespaces = [namespaces].filter(ns => ns);
    }
    return namespaces;
  });

  nsScopeMap[scope] = nsScopeMap[scope] || {};

  return namespaces
    .reduce((r, nsName) => {
      nsScopeMap[scope][nsName] = nsScopeMap[scope][nsName]
        || makeStyles(stylesNsMap[nsName] || (() => ({})));
      r[nsName] = nsScopeMap[scope][nsName]();
      return r;
    }, {});
};
