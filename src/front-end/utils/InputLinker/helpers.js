/* eslint-disable no-underscore-dangle */
import {
  FormTextField,
  FormTextInput,
  FormCheckbox,
  FormPhoneOrEmailInput,
} from '~/components/FormInputs';

export const assert = (condition, message, i18n) => {
  if (!condition) {
    const error = new Error(message || 'Validation failed');
    error.i18n = i18n;
    throw error;
  }
};

export const FormTextFieldGetProps = (props, {
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
    ...props,
    id: link.key,
    value,
    onChange: handleChange,
    error: !!validateErrorMessage,
    helperText: validateErrorMessage, // helperMessage,
  };
};

export const FormTextFieldPreset = cfg => ({
  ...cfg,
  InputComponent: FormTextField,
  getProps: cfg.getProps.concat([FormTextFieldGetProps]),
});

export const displayErrorFromPropsForTextField = (propKey, getMessageFunc = e => e) => (
  props,
  { link: { ownerProps }, validateError },
  options
) => {
  const newProps = { ...props };
  const errorFromProps = ownerProps[propKey];
  if (!validateError && errorFromProps) {
    newProps.error = true;
    newProps.helperText = getMessageFunc(errorFromProps);
  }
  return newProps;
};

export const FormTextInputGetProps = (props, {
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
    ...props,
    id: link.key,
    value,
    onChange: handleChange,
    formProps: {
      error: validateErrorMessage,
    },
    helperText: validateErrorMessage, // helperMessage,
  };
};

export const FormTextInputPreset = cfg => ({
  ...cfg,
  InputComponent: FormTextInput,
  getProps: cfg.getProps.concat([FormTextInputGetProps]),
});

export const FormPasswordVisibilityGetProps = (props, {
  value, link, handleChange, validateError,
}, options = {}) => ({
  ...props,
  type: value ? 'text' : 'password',
  onShowPassswordClick: handleChange,
});


export const FormPasswordVisibilityPreset = cfg => ({
  ...cfg,
  getProps: cfg.getProps.concat([FormPasswordVisibilityGetProps]),
  converter: {
    fromView: ((_, { storedValue }) => !storedValue),
    toOutput: () => undefined,
  },
});

export const FormCheckboxGetProps = (props, {
  value,
  link,
  handleChange,
  validateError,
},
{ translate } = {}) => ({
  ...props,
  id: link.key,
  onChange: handleChange,
  checked: value,
});

export const FormCheckboxPreset = cfg => ({
  ...cfg,
  InputComponent: FormCheckbox,
  getProps: cfg.getProps.concat([FormCheckboxGetProps]),
  converter: {
    fromView: (([e, v]) => v),
  },
});


// // the short version
// export const FormPhoneOrEmailInputPreset = {
//   presets: [FormTextFieldPreset],
//   InputComponent: FormPhoneOrEmailInput,
//   props: { enablePhone: true },
//   converter: {
//     toView: (value => (value && value.rawInput) || ''),
//     fromView: (([value]) => value),
//     toOutput: (value => value && value.value),
//   },
// };

export const FormPhoneOrEmailInputPreset = {
  presets: [FormTextFieldPreset],
  evaluate: cfg => ({
    ...cfg,
    InputComponent: FormPhoneOrEmailInput,
    props: { enablePhone: false },
    converter: {
      toView: (value => (value && value.rawInput) || ''),
      fromView: (([value]) => value),
      toOutput: (value => value && value.value),
    },
  }),
};

export const translateLabel = i18nKey => ({
  extraGetProps: (props, { link: { owner } }, { translate }) => ({
    ...props,
    label: i18nKey && translate(i18nKey),
  }),
});

export const addOnKeyPressEvent = (onKeyPress = undefined) => ({
  extraGetProps: (props, { link: { owner } }, { translate }) => ({
    ...props,
    onKeyPress,
  }),
});

export const translateLabelAndAddOnKeyPressEvent = (i18nKey, onKeyPress = undefined) => ({
  extraGetProps: (props, { link: { owner } }, { translate }) => ({
    ...props,
    onKeyPress: typeof onKeyPress === 'string' ? owner[onKeyPress] : onKeyPress,
    label: i18nKey && translate(i18nKey),
  }),
});

export const propagateOnChangeEvent = (parentOnChangePropName = 'onChange') => ({
  onChange: (value, rawArgs, { link: { name, linker, ownerProps } }) => {
    const onChange = ownerProps[parentOnChangePropName] || (() => {});
    onChange(name, value, rawArgs, linker);
  },
});
