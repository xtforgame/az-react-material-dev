/* eslint-disable no-underscore-dangle, react/no-this-in-sfc, no-param-reassign */
import {
  toArray,
  ExtraChildren,
} from './utils';
import * as proxy from './proxy';

export default class FieldLink {
  constructor(linker, config) {
    this.linker = linker;
    this.config = config;
    this.childLinks = [];
    this.childElements = [];
    this.namespace = this.linker.namespace;
    this.name = config.name;
    this.uniqueName = this.namespace ? `${this.namespace}-${this.name}` : this.name;
    this.key = this.uniqueName;
    this.defaultValue = config.defaultValue;
    this.component = config.component;
    this.shouldRender = true;
    this.ignoredFromOutputs = config.ignoredFromOutputs;
    this._mergeChildren = config.mergeChildren || ((children1, children2) => children1.concat(children2));
    this.options = config.options;
    if (this.options.unmountWhileReset) {
      this.key = `${this.key}${Math.random()}`;
    }
    this.dirty = false;

    this.converter = {
      fromView: config.converter.fromView || (([event]) => event.target.value),
      toView: config.converter.toView || (value => (value != null ? value : '')),
      toOutput: config.converter.toOutput || (value => value),
      normalize: config.converter.normalize || (v => v),
    };

    this._validate = config.validate;
    this._renderMiddlewares = config.mwRenderArray;
    this._preRenderMiddlewares = config.mwPreRenderArray;
    this.props = config.props;
    this.data = config.data || {};

    this.onChange = config.onChange || (() => {});
    this.onValidateError = config.onValidateError || (() => {});

    this.StateProxy = this.linker.stateMode === 'hook' ? proxy.HookProxy : proxy.StateProxy;

    // functions
    if (config.handledByProps || this.linker.options.controlled) {
      this.valueProxy = new proxy.PropsProxy('value', this);
    } else {
      this.valueProxy = new this.StateProxy('value', this);
    }

    this.errorProxy = new this.StateProxy('error', this);
    this.customStateProxy = new this.StateProxy('customState', this);
    this.proxies = {
      value: this.valueProxy,
      error: this.errorProxy,
      customState: this.customStateProxy,
    };

    const linkInfo = { link: this };

    this.getNormalizedValue = () => this.converter.normalize(this.getValue(), { ...linkInfo });
    this.getOutput = () => this.converter.toOutput(this.getNormalizedValue(), { ...linkInfo });
    this.getViewValue = () => this.converter.toView(this.getValue(), { ...linkInfo });
    this.validate = () => this._validate(this.getNormalizedValue(), { ...linkInfo });
  }

  getValue = () => this.valueProxy.getValue();

  setValue = (value, rawArgs, clearError = true) => {
    this.valueProxy.setValue(value, rawArgs);
    if (clearError) {
      this.setError();
    }
  };

  getCustomState = () => this.customStateProxy.getValue();

  setCustomState = (value, rawArgs) => this.customStateProxy.setValue(value, rawArgs);

  getError = () => this.errorProxy.getValue();

  setError = (value, rawArgs) => this.errorProxy.setValue(value, rawArgs);

  addChildLink(...children) {
    this.childLinks.push(...children);
  }

  addChildElement(...children) {
    this.childElements.push(...children);
  }

  mergeChildren = (children1, children2, linkInfo) => {
    let children = this._mergeChildren(
      toArray(children1), toArray(children2),
      { link: this, ...linkInfo }
    );
    if (children.length === 0) {
      children = undefined;
    } else if (children.length === 1) { ([children] = children); }
    return children;
  }

  _changeValue = (getValue, rawArgs) => {
    const storedValue = this.getValue();
    const linkInfo = { storedValue, link: this };
    const value = getValue(rawArgs, linkInfo);
    this.onChange(value, rawArgs, linkInfo);
    this.linker.onFieldValueChange(this, value, rawArgs, linkInfo);
    this.setValue(value, rawArgs);
  };

  changeValue = (value, rawArgs) => this._changeValue(() => value, rawArgs);

  // handlers
  handleChange = (...rawArgs) => this._changeValue(this.converter.fromView, rawArgs);

  handleExtraChildren = (props) => {
    if (ExtraChildren in props) {
      const newProps = {
        ...props,
        children: this.mergeChildren(props.children, props[ExtraChildren]),
      };
      delete newProps[ExtraChildren];
      return newProps;
    }
    return props;
  }

  runMiddlewares = (ctx, middlewares) => toArray(middlewares).reduce(
    (_ctx, m) => {
      const result = typeof m === 'function' ? m(_ctx) : m;
      if (result) {
        const [props, nonProps] = Array.isArray(result) ? result : [result];
        _ctx.props = { ..._ctx.props, ...props };
        _ctx.nonProps = { ..._ctx.nonProps, ...nonProps };
      }
      _ctx.props = this.handleExtraChildren(_ctx.props);
      return _ctx;
    },
    ctx
  );

  runPreRenderMiddlewares = (ctx, middlewares) => this.runMiddlewares(
    ctx, middlewares || this._preRenderMiddlewares
  );

  runRenderMiddlewares = (ctx, middlewares) => this.runMiddlewares(
    ctx, middlewares || this._renderMiddlewares
  );

  get host() { return this.linker.host; }

  get hostProps() { return this.host.props; }
}
