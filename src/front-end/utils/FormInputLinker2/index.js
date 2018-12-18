/* eslint-disable no-underscore-dangle */
export const FormTextFieldGetProps = ({
  value,
  link,
  handleChange,
  validateError,
},
{ translate } = {}) => {
  const validateErrorMessage = validateError && (
    (validateError.i18n && translate(validateError.i18n.key, validateError.i18n.values))
    || validateError.message
  );

  return {
    id: link.key,
    value,
    onChange: handleChange,
    error: !!validateErrorMessage,
    helperText: validateErrorMessage, // helperMessage,
    ...link.props,
  };
};

export const FormTextInputGetProps = ({
  value,
  link,
  handleChange,
  validateError,
},
{ translate } = {}) => {
  const validateErrorMessage = validateError && (
    (validateError.i18n && translate(validateError.i18n.key, validateError.i18n.values))
    || validateError.message
  );

  return {
    id: link.key,
    value,
    onChange: handleChange,
    formProps: {
      error: validateErrorMessage,
    },
    helperText: validateErrorMessage, // helperMessage,
    ...link.props,
  };
};

export const FormPasswordVisibilityGetProps = ({
  value, link, handleChange, validateError,
}, options = {}) => ({
  type: value ? 'text' : 'password',
  onShowPassswordClick: handleChange,
});

export const assert = (condition, message, i18n) => {
  if (!condition) {
    const error = new Error(message || 'Validation failed');
    error.i18n = i18n;
    throw error;
  }
};

export class Converter {
  constructor(convertFuncMap = {}) {
    this.fromView = convertFuncMap.fromView || (([event]) => event.target.value);
    this.toView = convertFuncMap.toView || (value => value || '');
    this.toOutput = convertFuncMap.toOutput || (value => value);
  }
}

export class StateLink {
  constructor(linker, link) {
    this.linker = linker;
    this.component = this.linker.component;
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
        this.handledByProps.value = ({ ownerProps }, options = {}) => ownerProps[valueProp];
      }

      if (typeof this.handledByProps.onChange === 'string') {
        const onChangeProp = this.handledByProps.onChange;
        this.handledByProps.onChange = ({ value }, { ownerProps }, options = {}) => {
          this.component.setState(this.linker._getUpdatedStateForResetError(this.name));
          if (ownerProps[onChangeProp]) {
            ownerProps[onChangeProp](value);
          }
        };
      }
    }

    this.converter = new Converter(link.converter);

    this._validate = link.validate;
    this.getProps = link.getProps || (() => ({}));
    this.props = link.props;
    this.data = link.data;

    this.onChange = link.onChange || (() => {});
    this.onValidateError = link.onValidateError || (() => {});

    // functions

    this.getValue = targetState => this.linker.getValueFromState(this.name, targetState);
    this.setValue = value => this.component.setState(this.linker._getUpdatedState(this.name, value));
    this.getOutput = targetState => this.converter.toOutput(this.getValue(targetState));
    this.getViewValue = targetState => this.converter.toView(this.getValue(targetState));
    this.validate = targetState => this._validate(this.getValue(targetState));

    if (this.handledByProps) {
      this.getValue = () => {
        const { props: ownerProps, state: ownerState } = this.component;
        return this.handledByProps.value({ ownerProps, ownerState, link: this }, {});
      };

      this.setValue = (value, rawArgs) => {
        const { props: ownerProps, state: ownerState } = this.component;
        return this.handledByProps.onChange({ value, rawArgs }, { ownerProps, ownerState, link: this }, {});
      };
    }
  }
}

export default class FormInputLinker {
  constructor(component, {
    namespace = '',
    fieldStateName = 'fields',
    fieldErrorStateName = 'errors',
  }) {
    this.component = component;
    this.namespace = namespace;
    this.fieldStateName = fieldStateName;
    this.fieldErrorStateName = fieldErrorStateName;
    this.fields = {};
  }

  add(...fields) {
    fields.forEach((field) => {
      this.fields[field.name] = new StateLink(this, field);
    });
  }

  getOutput(fieldName) {
    return this.fields[fieldName].getOutput();
  }

  getOutputs() {
    const values = {};
    Object.keys(this.fields).forEach((fieldName) => {
      const output = this.getOutput(fieldName);
      if (output !== undefined) {
        values[fieldName] = output;
      }
    });
    return values;
  }

  remove(...fieldNames) {
    fieldNames.forEach((fieldName) => {
      delete this.fields[fieldName];
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
    Object.keys(this.fields).forEach((fieldName) => {
      const field = this.fields[fieldName];
      if (!field.handledByProps) {
        newState[this.fieldStateName][fieldName] = this.fields[fieldName].defaultValue;
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
    Object.keys(this.fields).forEach((fieldName) => {
      const field = this.fields[fieldName];
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
          field.onValidateError(newErrorState[fieldName], {
            ownerProps: this.component.props,
            ownerState: this.component.state,
            link: field,
          });
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

  getErrorStatus(fieldName) {
    const validateError = this.getErrorFromState(fieldName);
    return {
      validateError,
    };
  }

  // handlers
  handleChange = field => (...rawArgs) => {
    const storedValue = field.getValue();
    const { props: ownerProps, state: ownerState } = this.component;
    const options = {
      ownerProps,
      ownerState,
      storedValue,
      link: field,
    };
    const value = field.converter.fromView(rawArgs, options);
    field.onChange(value, rawArgs, options);
    field.setValue(value, rawArgs);
  };

  // render helper
  renderProps = (fieldName, options = {}) => {
    const field = this.fields[fieldName];
    const {
      validateError,
    } = this.getErrorStatus(fieldName);

    return field.getProps({
      ownerProps: this.component.props,
      ownerState: this.component.state,
      value: field.getViewValue(),
      link: field,
      handleChange: this.handleChange(field),
      validateError,
    }, options);
  };
}
