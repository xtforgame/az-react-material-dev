/* eslint-disable no-underscore-dangle, react/no-this-in-sfc, no-param-reassign */
import React, { useState } from 'react';
import {
  toArray,
  mwDynamicNonPropsFilter,
} from './utils';
import FieldLink from './FieldLink';
import {
  proxyTypeArray,
} from './proxy';

export default class InputLinker {
  constructor(host, options = {}) {
    this.host = host;
    this.options = options;
    this.stateMode = options.stateMode || 'state';
    this.namespace = options.namespace || '';
    this.proxyAndSliceNames = [];
    this.sliceNameInState = { ...options.sliceNameInState };
    proxyTypeArray.forEach((p) => {
      if (p.defaultSliceName && !this.sliceNameInState[p.name]) {
        this.sliceNameInState[p.name] = p.defaultSliceName;
      }
      if (this.sliceNameInState[p.name]) {
        this.proxyAndSliceNames.push({ proxyName: p.name, sliceName: this.sliceNameInState[p.name] });
      }
    });
    this.presets = options.presets || {};
    this.ignoredUndefinedFromOutputs = options.ignoredUndefinedFromOutputs;
    this.FieldLink = options.FieldLink || FieldLink;
    this.fieldLinks = [];
    this.fieldMap = {};
    this._idCounter = 0;
    this._pendingChanges = { changes: [] };
    this.customData = {};
  }

  get hostProps() { return this.host.props; }

  resetDirtyFlags = (flag = false) => {
    Object.values(this.fieldMap).forEach(f => (f.dirty = flag));
  }

  onFieldValueChange = (field, value, rawArgs, linkInfo) => {
    field.dirty = true;
  }

  addPendingChange = (cb, change) => {
    if (!this._pendingChanges.nextTick) {
      this._pendingChanges.nextTick = setTimeout(this.resolvePendingChanges, 0);
    }
    if (!this._pendingChanges.cb) {
      this._pendingChanges.cb = cb;
    }
    this._pendingChanges.changes.push(change);
  }

  resolvePendingChanges = () => {
    this._pendingChanges.cb(
      this._pendingChanges.changes,
      this,
      this._pendingChanges.changes.reduce((v, change) => ({
        ...v,
        [change.link.name]: change.value,
      }), this.getValues()),
    );
    this._pendingChanges = { changes: [] };
  }

  getUniqueName = () => (this.namespace ? `${this.namespace}-unnamed-${++this._idCounter}` : `unnamed-${++this._idCounter}`);

  getPreset = (preset) => {
    if (typeof preset === 'string') {
      const result = this.presets[preset];
      if (!result) {
        throw new Error(`preset: '${preset}' not found in Linker`);
      }
      return result;
    } else if (Array.isArray(preset) && preset.length > 0) {
      const [funcName, ...args] = preset;
      const func = this.getPreset(funcName);
      if (!func) {
        throw new Error(`preset: '${funcName}' not found in Linker`);
      }
      return func(...args);
    }
    return preset;
  };

  evaluateConfig = ({ config: currentCfg, lastQueue = [] }, c) => {
    let config;
    if (typeof c === 'function') {
      config = c(currentCfg);
    } else {
      config = currentCfg;
      const {
        preset, presets, evaluate = _config => ({ ..._config, ...c }), cfgMiddlewares: { before, after, last } = {},
      } = c;

      const addLast = (c) => {
        lastQueue.splice(0, 0, ...toArray(last));
        return c;
      };

      ({ config } = toArray(before)
        .concat(toArray(preset)).concat(toArray(presets)).concat(toArray(evaluate))
        .concat([addLast])
        .concat(toArray(after))
          .map(this.getPreset)
          .reduce(this.evaluateConfig, { config, lastQueue }));

      delete config.preset;
      delete config.presets;
      delete config.evaluate;
      delete config.middlewares;
    }
    if (!config) {
      console.error('Wrong config', c);
      throw new Error('Wrong config');
    }
    if (config.mwPreRender) {
      config.mwPreRender = toArray(config.mwPreRender);
      config.mwPreRenderArray.push(...config.mwPreRender);
      delete config.mwPreRender;
    }
    if (config.mwRender) {
      config.mwRender = toArray(config.mwRender);
      config.mwRenderArray.push(...config.mwRender);
      delete config.mwRender;
    }
    if (config.extraConverter) {
      config.converter = { ...config.converter, ...config.extraConverter };
      delete config.extraConverter;
    }
    if (config.extraProps) {
      config.props = { ...config.props, ...config.extraProps };
      delete config.extraProps;
    }
    if (config.extraOptions) {
      config.options = { ...config.options, ...config.extraOptions };
      delete config.extraOptions;
    }
    if (config.extraChildLinks) {
      config.extraChildLinks = toArray(config.extraChildLinks);
      config.childLinks.push(...config.extraChildLinks);
      delete config.extraChildLinks;
    }
    if (config.extraChildElements) {
      config.extraChildElements = toArray(config.extraChildElements);
      config.childElements.push(...config.extraChildElements);
      delete config.extraChildElements;
    }
    return { config, lastQueue };
  };

  _add(configs) {
    return configs.map((_c) => {
      const configChain = toArray(_c);
      let config = {
        converter: {},
        mwPreRenderArray: [],
        mwRenderArray: [],
        childLinks: [],
        childElements: [],
        options: {},
      };
      let lastQueue = [];
      ({ config, lastQueue } = configChain.reduce(this.evaluateConfig, { config, lastQueue }));
      while (lastQueue.length > 0) {
        ({ config, lastQueue } = lastQueue.reduce(this.evaluateConfig, { config, lastQueue: [] }));
      }
      config.name = config.name || this.getUniqueName();
      // set static props as the first middleware
      config.mwRenderArray = [config.props, ...config.mwRenderArray];
      this.fieldMap[config.name] = new this.FieldLink(this, config);
      const fieldLink = this.fieldMap[config.name];
      if (config.childLinks) {
        fieldLink.addChildLink(...this._add(config.childLinks));
      }
      if (config.childElements) {
        fieldLink.addChildElement(...this._add(config.childElements));
      }
      return fieldLink;
    });
  }

  add(...configs) {
    const result = this._add(configs);
    this.fieldLinks.push(...result);
    return result;
  }

  setDefaultValues(defaultValues) {
    Object.keys(defaultValues).forEach((key) => {
      const field = this.getField(key);
      if (field) {
        field.defaultValue = defaultValues[key];
      }
    });
  }

  getField = fieldName => this.fieldMap[fieldName];

  getFields = () => this.fieldMap;

  getValue = fieldName => this.fieldMap[fieldName].getValue();

  getNormalizedValue = fieldName => this.fieldMap[fieldName].getNormalizedValue();

  getValues = () => Object.values(this.fieldMap).reduce((values, field) => {
    values[field.name] = field.getValue();
    return values;
  }, {});

  getNormalizedValues = () => Object.values(this.fieldMap).reduce((values, field) => {
    values[field.name] = field.getNormalizedValue();
    return values;
  }, {});

  getOutput = fieldName => this.fieldMap[fieldName].getOutput()

  getOutputs = () => Object.values(this.fieldMap).filter(field => !field.ignoredFromOutputs).reduce((values, field) => {
    const value = field.getOutput();
    if (!this.ignoredUndefinedFromOutputs || value !== undefined) {
      values[field.name] = value;
    }
    return values;
  }, {})

  getDataFromSlice = (sliceName, state) => (state || this.host.state)[this.sliceNameInState[sliceName]];

  getDataFromSliceByName = (sliceName, fieldName, state) => this.getDataFromSlice(sliceName, state)[fieldName];

  changeValue = (fieldName, value) => {
    const field = this.getField(fieldName);
    if (field) {
      field.changeValue(value);
    }
  };

  changeValues = (changeMap) => {
    const changes = [];
    Object.keys(changeMap).forEach((fieldName) => {
      const value = changeMap[fieldName];
      const field = this.getField(fieldName);
      if (field && this.host.props.onChanges) {
        changes.push({
          value, rawArgs: [], link: field,
        });
      }
    });
    this.host.props.onChanges(
      changes,
      this,
      changes.reduce((v, change) => ({
        ...v,
        [change.link.name]: change.value,
      }), this.getValues()),
    );
  };

  validate(keepErrors = true) {
    let passed = true;
    Object.values(this.fieldMap).forEach((field) => {
      if (field._validate) {
        let error;
        try {
          const result = field.validate();
          if (result instanceof Error) {
            error = result;
          }
        } catch (e) { error = e; }
        if (error) {
          passed = false;
          field.onValidateError(error, { link: field });
          if (keepErrors) {
            field.setError(error);
          }
        }
      }
    });
    return passed;
  }

  getErrorStatus = fieldName => ({ validateError: this.getDataFromSliceByName('error', fieldName) });

  // render helpers
  _renderPass = (fieldName, ctx, options = {}, ignoreKeyProp) => {
    const field = this.fieldMap[fieldName];
    if (!ignoreKeyProp) { ctx.props.key = field.key; }
    const { validateError } = this.getErrorStatus(fieldName);

    const newCtx = field.runRenderMiddlewares({
      value: field.getViewValue(),
      link: field,
      handleChange: field.handleChange,
      validateError,
      props: ctx.props,
      nonProps: ctx.nonProps ? ctx.nonProps : mwDynamicNonPropsFilter(field),
      options,
    });

    const { childLinks } = field;
    return childLinks.reduce(
      (_ctx, childLink) => this._renderPass(childLink.name, _ctx, options, true),
      newCtx
    );
  };

  renderProps = (fieldName, options = {}) => this._renderPass(fieldName, {}, options).props;

  renderComponent = (fieldName, options = {}) => {
    const field = this.fieldMap[fieldName];
    let newCtx = field.runPreRenderMiddlewares({
      link: field,
      props: {},
      nonProps: mwDynamicNonPropsFilter(field),
      options,
    });

    if (!newCtx.nonProps.shouldRender) {
      return undefined;
    }

    const extraChildren = field.childElements.map(child => this.renderComponent(child.name, options));
    newCtx = this._renderPass(fieldName, newCtx, options);
    const props = {
      ...newCtx.props,
      ...options.extraProps,
    };
    props.children = field.mergeChildren(props.children, extraChildren, { isMergingChildElements: true });

    if (!newCtx.nonProps.shouldRender) {
      return undefined;
    }
    const Component = newCtx.nonProps.component;
    if (Component == null) {
      throw new Error(`Wrong Component Class (${fieldName})`);
    }
    if (!props.key) {
      console.warn('component with no key :', field);
    }
    return (<Component {...props} />);
  };

  // for component only
  mergeInitState(state = {}) {
    const newState = { ...state };
    Object.values(this.sliceNameInState).filter(n => n)
      .forEach(name => (newState[name] = { ...state[name] }));
    Object.values(this.fieldMap).filter(field => !field.handledByProps)
      .forEach(field => (newState[this.sliceNameInState.value][field.name] = this.fieldMap[field.name].defaultValue));
    return newState;
  }

  // for hook only
  updateHost(host) {
    const state = { ...host.state };
    this.proxyAndSliceNames.forEach(({ sliceName }) => {
      state[sliceName] = {};
    });
    const useStateForField = (field) => {
      this.proxyAndSliceNames.forEach(({ proxyName, sliceName }) => {
        const proxy = field.proxies[proxyName];
        if (proxy.updateSetter) {
          const [value, setValue] = useState(proxyName === 'value' ? field.defaultValue : undefined);
          state[sliceName][field.name] = value;
          proxy.updateSetter(setValue);
        }
      });
      field.childLinks.forEach(useStateForField);
      field.childElements.forEach(useStateForField);
    };
    this.fieldLinks.forEach(useStateForField);
    this.host = { ...host, state };
  }
}
