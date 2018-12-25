/* eslint-disable no-underscore-dangle */
import React from 'react';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import SuccessButton from '~/components/Buttons/SuccessButton';
import {
  FormTextField,
  FormTextInput,
  FormCodeInput,
  FormCheckbox,
  FormPhoneOrEmailInput,
} from '~/components/FormInputs';
import {
  isAllDigital,
} from 'common/utils/validators';

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
  extraGetProps: FormTextInputGetProps,
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
  extraGetProps: FormPasswordVisibilityGetProps,
  ignoredFromOutputs: true,
  converter: {
    fromView: ((_, { storedValue }) => !storedValue),
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
  extraGetProps: FormCheckboxGetProps,
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

export const FormCodeInputPreset = {
  presets: [FormTextFieldPreset],
  evaluate: cfg => ({
    ...cfg,
    InputComponent: FormCodeInput,
    converter: {
      fromView: (([e], { storedValue }) => (
        (
          !e.target.value
          || (isAllDigital(e.target.value) && e.target.value.length <= 6)
        ) ? e.target.value : storedValue)
      ),
    },
    validate: value => assert(value, null),
  }),
};

export const DividerPreset = cfg => ({
  ...cfg,
  InputComponent: Divider,
  ignoredFromOutputs: true,
});

export const BottonPreset = cfg => ({
  ...cfg,
  InputComponent: Button,
  ignoredFromOutputs: true,
});

export const SuccessBottonPreset = cfg => ({
  ...cfg,
  InputComponent: SuccessButton,
  ignoredFromOutputs: true,
});

export const FragmentPreset = cfg => ({
  ...cfg,
  InputComponent: React.Fragment,
  ignoredFromOutputs: true,
});

export const translateLabel = i18nKey => ({
  extraGetProps: (props, { link: { owner } }, { translate }) => ({
    ...props,
    label: i18nKey && translate(i18nKey),
  }),
});

export const addOnPressEnterEvent = (onPressEnter = undefined) => ({
  extraGetProps: (props, { link: { owner } }) => ({
    ...props,
    onPressEnter: typeof onPressEnter === 'string' ? owner[onPressEnter] : onPressEnter,
  }),
});

export const propagateOnChangeEvent = (parentOnChangePropName = 'onChange') => (props) => {
  const originalOnChange = props.onChange || (() => {});
  return {
    ...props,
    onChange: (value, rawArgs, linkInfo) => {
      originalOnChange(value, rawArgs, linkInfo);
      const { link: { name, linker, ownerProps } } = linkInfo;
      const onChange = ownerProps[parentOnChangePropName] || (() => {});
      onChange(name, value, rawArgs, linker);
    },
  };
};
