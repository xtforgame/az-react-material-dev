/* eslint-disable no-underscore-dangle */
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
    id: link.key,
    value,
    onChange: handleChange,
    error: !!validateErrorMessage,
    helperText: validateErrorMessage, // helperMessage,
    ...link.props,
  };
};

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

export const FormPasswordVisibilityGetProps = (props, {
  value, link, handleChange, validateError,
}, options = {}) => ({
  type: value ? 'text' : 'password',
  onShowPassswordClick: handleChange,
});

export const FormCheckboxInputGetProps = (props, {
  value,
  link,
  handleChange,
  validateError,
},
{ translate } = {}) => ({
  id: link.key,
  onChange: handleChange,
  checked: value,
  ...link.props,
});
