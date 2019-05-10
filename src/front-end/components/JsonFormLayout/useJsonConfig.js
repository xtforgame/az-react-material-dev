/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
import {
  toArray,
} from '~/utils/InputLinker';

export const normalizeJsonConfig = (json) => {
  if (Array.isArray(json.preRender)) {
    json.preRender = new Function(...json.preRender); // eslint-disable-line no-new-func
  }
  if (Array.isArray(json.globalValidator)) {
    json.globalValidator = new Function(...json.globalValidator); // eslint-disable-line no-new-func
  }
  json.fileds.forEach((filed) => {
    if (filed.type) {
      filed.presets = toArray(filed.type)
      .concat([{ extraOptions: { jflType: filed.type } }])
      .concat(toArray(filed.preset))
      .concat(toArray(filed.presets));
      delete filed.type;
      delete filed.preset;
    }
  });
  return json;
};

export default (props) => {
  const {
    jsonConfig: jc,
  } = props;

  const jsonConfig = normalizeJsonConfig(jc);

  const propsEx = {
    namespace: jsonConfig.namespace,
    fields: jsonConfig.fileds,
    rsBeforeRender: (rs) => {
      // console.log('RenderSession.beforeRender()');
      let $inputChanged = false;
      const $dirtyMap = {};
      Object.values(rs.linker.getFields())
      .filter(f => f.dirty && !f.name.startsWith('~'))
      .forEach((f) => {
        $dirtyMap[f.name] = true;
        $inputChanged = true;
      });

      jsonConfig.preRender(rs, {
        $dirtyMap,
        $inputChanged,
      });

      rs.linker.resetDirtyFlags();
    },
    rsAfterRender: (rs) => {
      // console.log('rs :', rs);
      // console.log('RenderSession.afterRender()');
    },
  };

  return {
    jsonConfig,
    propsEx,
  };
};
