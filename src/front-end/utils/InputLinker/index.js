/* eslint-disable no-underscore-dangle */
export class Converter {
  constructor(convertFuncMap = {}) {
    this.fromView = convertFuncMap.fromView || (([event]) => event.target.value);
    this.toView = convertFuncMap.toView || (value => value || '');
    this.toOutput = convertFuncMap.toOutput || (value => value);
  }
}

export class FieldLink {
  constructor(linker, link) {
    this.linker = linker;
    this._owner = this.linker.component;
    this.namespace = this.linker.namespace;
    this.name = link.name;
    this.uniqueName = this.namespace ? `${this.namespace}-${this.name}` : this.name;
    this.key = this.uniqueName;
    this.defaultValue = link.defaultValue;

    this.handledByProps = link.handledByProps;
    if (this.handledByProps) {
      if (!this.handledByProps.value || !this.handledByProps.onChange) {
        throw new Error('Wrong options: handledByProps');
      }
      if (typeof this.handledByProps.value === 'string') {
        const valueProp = this.handledByProps.value;
        this.handledByProps.value = ({ link: { ownerProps } }, options = {}) => ownerProps[valueProp];
      }

      if (typeof this.handledByProps.onChange === 'string') {
        const onChangeProp = this.handledByProps.onChange;
        this.handledByProps.onChange = ({ value }, { link: { ownerProps } }, options = {}) => {
          this.owner.setState(this.linker._getUpdatedStateForResetError(this.name));
          if (ownerProps[onChangeProp]) {
            ownerProps[onChangeProp](value);
          }
        };
      }
    }

    this.converter = new Converter(link.converter);

    this._validate = link.validate;
    this._getPropsMiddlewares = (Array.isArray(link.getProps) ? link.getProps : [link.getProps]) || [(() => ({}))];
    this.props = link.props;
    this.data = link.data;

    this.onChange = link.onChange || (() => {});
    this.onValidateError = link.onValidateError || (() => {});

    // functions

    this.getValue = targetState => this.linker.getValueFromState(this.name, targetState);
    this.setValue = value => this.owner.setState(this.linker._getUpdatedState(this.name, value));
    this.getOutput = targetState => this.converter.toOutput(this.getValue(targetState));
    this.getViewValue = targetState => this.converter.toView(this.getValue(targetState));
    this.validate = targetState => this._validate(this.getValue(targetState));

    if (this.handledByProps) {
      this.getValue = () => this.handledByProps.value({ link: this }, {});
      this.setValue = (value, rawArgs) => this.handledByProps.onChange({ value, rawArgs }, { link: this }, {});
    }
  }

  getProps = (initProps, linkInfo, options) => this._getPropsMiddlewares.reduce(
    (props, m) => m(props, linkInfo, options),
    initProps
  )

  get owner() { return this._owner; }

  get ownerProps() { return this.owner.props; }

  get ownerState() { return this.owner.state; }
}

export default class InputLinker {
  constructor(component, {
    namespace = '',
    fieldStateName = 'fields',
    fieldErrorStateName = 'errors',
  }) {
    this.component = component;
    this.namespace = namespace;
    this.fieldStateName = fieldStateName;
    this.fieldErrorStateName = fieldErrorStateName;
    this.fieldLinks = {};
  }

  add(...fields) {
    fields.forEach((field) => {
      this.fieldLinks[field.name] = new FieldLink(this, field);
    });
  }

  getOutput(fieldName) {
    return this.fieldLinks[fieldName].getOutput();
  }

  getOutputs() {
    const values = {};
    Object.keys(this.fieldLinks).forEach((fieldName) => {
      const output = this.getOutput(fieldName);
      if (output !== undefined) {
        values[fieldName] = output;
      }
    });
    return values;
  }

  remove(...fieldNames) {
    fieldNames.forEach((fieldName) => {
      delete this.fieldLinks[fieldName];
    });
  }

  // ==========================

  getFieldsFromState(targetState) {
    return (targetState || this.component.state)[this.fieldStateName];
  }

  getValueFromState(fieldName, targetState) {
    return this.getFieldsFromState(targetState)[fieldName];
  }

  getErrorsFromState(targetState) {
    return (targetState || this.component.state)[this.fieldErrorStateName];
  }

  getErrorFromState(fieldName, targetState) {
    return this.getErrorsFromState(targetState)[fieldName];
  }

  mergeInitState(state = {}) {
    const newState = {
      ...state,
      [this.fieldStateName]: { ...state[this.fieldStateName] },
      [this.fieldErrorStateName]: { ...state[this.fieldErrorStateName] },
    };
    Object.keys(this.fieldLinks).forEach((fieldName) => {
      const field = this.fieldLinks[fieldName];
      if (!field.handledByProps) {
        newState[this.fieldStateName][fieldName] = this.fieldLinks[fieldName].defaultValue;
      }
      newState[this.fieldErrorStateName][fieldName] = undefined;
    });
    return newState;
  }

  _getUpdatedStateForResetError(fieldName, targetState) {
    return {
      [this.fieldErrorStateName]: {
        ...this.getErrorsFromState(targetState),
        [fieldName]: undefined,
      },
    };
  }

  _getUpdatedState(fieldName, value, targetState) {
    return {
      [this.fieldStateName]: {
        ...this.getFieldsFromState(targetState),
        [fieldName]: value,
      },
      [this.fieldErrorStateName]: {
        ...this.getErrorsFromState(targetState),
        [fieldName]: undefined,
      },
    };
  }

  validate() {
    let passed = true;
    const newErrorState = {};
    Object.keys(this.fieldLinks).forEach((fieldName) => {
      const field = this.fieldLinks[fieldName];
      if (field._validate) {
        let error;
        try {
          const result = field.validate();
          if (result instanceof Error) {
            error = result;
          }
        } catch (e) { error = e; }
        if (error) {
          newErrorState[fieldName] = error;
          field.onValidateError(newErrorState[fieldName], { link: field });
          passed = false;
        }
      }
    });

    if (!passed) {
      this.component.setState({
        [this.fieldErrorStateName]: {
          ...this.getErrorsFromState(),
          ...newErrorState,
        },
      });
    }
    return passed;
  }

  getErrorStatus = fieldName => ({ validateError: this.getErrorFromState(fieldName) });

  // handlers
  handleChange = field => (...rawArgs) => {
    const storedValue = field.getValue();
    const linkInfo = { storedValue, link: field };
    const value = field.converter.fromView(rawArgs, linkInfo);
    field.onChange(value, rawArgs, linkInfo);
    field.setValue(value, rawArgs);
  };

  // render helper
  renderProps = (fieldName, options = {}) => {
    const props = options.props || {};
    const field = this.fieldLinks[fieldName];
    const { validateError } = this.getErrorStatus(fieldName);

    return field.getProps(props, {
      value: field.getViewValue(),
      link: field,
      handleChange: this.handleChange(field),
      validateError,
    }, options);
  };
}
