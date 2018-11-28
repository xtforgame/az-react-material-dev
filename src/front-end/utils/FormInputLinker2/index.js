/* eslint-disable no-underscore-dangle */
import { capitalizeFirstLetter } from 'common/utils';

export const FormTextFieldGetProps = ({
  value,
  link,
  handleChange,
  errorOccurred,
  helperMessage,
  validateError,
  errorFromProps,
},
{ translate } = {}) => {
  let errorMessage;
  if (validateError) {
    errorMessage = (
      (validateError.i18n && translate(validateError.i18n.key, validateError.i18n.values))
      || validateError.message
    );
  } else if (errorFromProps) {
    errorMessage = errorFromProps === true ? '' : errorFromProps;
  }

  return {
    id: link.key,
    value,
    onChange: handleChange,
    error: !!errorOccurred,
    helperText: errorMessage, // helperMessage,
    ...link.props,
  };
};

export const FormTextInputGetProps = ({
  value,
  link,
  handleChange,
  errorOccurred,
  helperMessage,
  validateError,
  errorFromProps,
},
{ translate } = {}) => {
  let errorMessage;
  if (validateError) {
    errorMessage = (
      (validateError.i18n && translate(validateError.i18n.key, validateError.i18n.values))
      || validateError.message
    );
  } else if (errorFromProps) {
    errorMessage = errorFromProps === true ? '' : errorFromProps;
  }

  return {
    id: link.key,
    value,
    onChange: handleChange,
    formProps: {
      error: errorOccurred,
    },
    helperText: errorMessage, // helperMessage,
    ...link.props,
  };
};

export const FormPasswordVisibilityGetProps = ({
  value, link, linker, handleChange, errorOccurred, helperMessage,
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
    this.propToState = convertFuncMap.propToState || (value => value);
    this.fromView = convertFuncMap.fromView || ((_, event) => event.target.value);
    this.toView = convertFuncMap.toView || (value => value || '');
    this.toOutput = convertFuncMap.toOutput || (value => value);
  }
}

export class StateLink {
  constructor(linker, link) {
    this.linker = linker;
    this.namespace = this.linker.namespace;
    this.name = link.name;
    this.uniqueName = this.namespace ? `${this.namespace}-${this.name}` : this.name;
    this.key = this.uniqueName;
    this.defaultValue = link.defaultValue;
    this.exposed = false;
    this.exposedProps = {};
    if (link.exposed) {
      this.exposed = true;
      const {
        onChange = `on${capitalizeFirstLetter(link.name)}Change`,
        value,
        error = `${link.name}Error`,
      } = link.exposed;
      this.exposedProps = {
        onChange,
        value,
        error,
      };
    }

    this.converter = new Converter(link.converter);

    this.validate = link.validate;
    this.getProps = link.getProps || (() => ({}));
    this.props = link.props;
    this.data = link.data;
  }
}

export default class FormInputLinker {
  constructor(component, {
    namespace = '',
    fieldStateName = 'fields',
    fieldErrorStateName = 'errors',
    prevPropsStateName = 'prevProps',
  }) {
    this.component = component;
    this.fieldStateName = fieldStateName;
    this.fieldErrorStateName = fieldErrorStateName;
    this.prevPropsStateName = prevPropsStateName;
    this.fields = {};
  }

  add(...fields) {
    fields.forEach((field) => {
      this.fields[field.name] = new StateLink(this, field);
    });
  }

  getOutput(fieldName) {
    const valueFromState = this.getValueFromState(fieldName);
    return this.fields[fieldName].converter.toOutput(valueFromState);
  }

  getOutputs() {
    const values = {};
    Object.keys(this.fields).forEach((fieldName) => {
      values[fieldName] = this.getOutput(fieldName);
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

  getPrevPropsFromState(targetState) {
    return (targetState || this.component.state)[this.prevPropsStateName];
  }

  getPrevPropFromState(fieldName, targetState) {
    return this.getPrevPropsFromState(targetState)[fieldName];
  }

  mergeInitState(state = {}) {
    const newState = {
      ...state,
      [this.fieldStateName]: {
        ...state[this.fieldStateName],
      },
      [this.fieldErrorStateName]: {
        ...state[this.fieldErrorStateName],
      },
      [this.prevPropsStateName]: {
        ...state[this.prevPropsStateName],
      },
    };
    Object.keys(this.fields).forEach((fieldName) => {
      newState[this.fieldStateName][fieldName] = this.fields[fieldName].defaultValue;
      newState[this.fieldErrorStateName][fieldName] = undefined;
    });
    return newState;
  }

  derivedFromProps(props, currState) {
    let state = null;
    Object.keys(this.fields).forEach((fieldName) => {
      const valueProp = this.fields[fieldName].exposedProps.value;
      if (valueProp && props[valueProp] !== this.getPrevPropFromState(fieldName, currState)) {
        if (!state) {
          state = { ...currState };
        }
        state = this._getUpdatedState(fieldName, this.fields[fieldName].converter.propToState(props[valueProp]), state);
      }
    });
    return state;
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
      [this.prevPropsStateName]: {
        ...this.getPrevPropsFromState(targetState),
        [fieldName]: value,
      },
    };
  }

  updateState(fieldName, value) {
    this.component.setState(this._getUpdatedState(fieldName, value));
  }

  validate() {
    let passed = true;
    const newErrorState = {};
    Object.keys(this.fields).forEach((fieldName) => {
      if (this.fields[fieldName].validate) {
        try {
          const result = this.fields[fieldName].validate(this.getValueFromState(fieldName));
          if (result instanceof Error) {
            newErrorState[fieldName] = result;
            passed = false;
          }
        } catch (error) {
          newErrorState[fieldName] = error;
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
    let occurred = false;
    let message;
    const errorFromProps = this.fields[fieldName].exposedProps.error
      && this.component.props[this.fields[fieldName].exposedProps.error];
    const validateError = this.getErrorFromState(fieldName);
    if (validateError) {
      message = validateError;
      occurred = true;
    } else if (errorFromProps) {
      message = errorFromProps === true ? '' : errorFromProps;
      occurred = true;
    }
    return {
      occurred,
      message,
      validateError,
      errorFromProps,
    };
  }

  // handlers
  handleChange = field => (...args) => {
    const fieldName = field.name;
    const value = this.fields[fieldName].converter.fromView({
      valueInState: this.getValueFromState(fieldName),
      link: field,
    }, ...args);
    const onChangeProp = this.fields[fieldName].exposedProps.onChange;
    const onChange = this.component.props[onChangeProp] || (() => {});
    this.updateState(fieldName, value);
    onChange(value);
  };

  // render helper
  getPropsForInputField = (fieldName, options = {}) => {
    const field = this.fields[fieldName];

    const {
      occurred,
      message,
      validateError,
      errorFromProps,
    } = this.getErrorStatus(fieldName);

    return field.getProps({
      value: field.converter.toView(this.getValueFromState(fieldName)),
      link: field,
      handleChange: this.handleChange(field),
      errorOccurred: occurred,
      helperMessage: message,
      validateError,
      errorFromProps,
    }, options);
  };
}
