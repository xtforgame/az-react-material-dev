import {
  FormPasswordInput,
} from '~/components/FormInputs';

import {
  FormPhoneOrEmailInputPreset,
  FormTextFieldPreset,
  FormPasswordVisibilityPreset,
  assert,
  translateLabelAndAddOnKeyPressEvent,
  displayErrorFromPropsForTextField,
} from '~/utils/InputLinker/helpers';

import {
  isValidPassword,
} from 'common/utils/validators';

export const createSimpleAccountInput = () => ({
  name: 'username',
  presets: [FormTextFieldPreset, translateLabelAndAddOnKeyPressEvent('username', 'handleEnterForTextField')],
  handledByProps: {
    value: 'username',
    onChange: 'onUsernameChange',
  },
  extraGetProps: [
    displayErrorFromPropsForTextField('passwordError', () => undefined),
    (props, linkInfo, { translate }) => ({
      ...props,
      placeholder: translate('usernameEmptyError', {
        emailAddress: { key: 'emailAddress' },
        phoneNumber: { key: 'phoneNumber' },
      }),
    }),
  ],
  validate: value => assert(!!value, null, {
    key: 'usernameEmptyError',
    values: {
      emailAddress: { key: 'emailAddress' },
      phoneNumber: { key: 'phoneNumber' },
    },
  }),
});

export const createPhoneOrEmailAccountInput = () => ({
  name: 'username',
  presets: [FormPhoneOrEmailInputPreset, translateLabelAndAddOnKeyPressEvent('username', 'handleEnterForTextField')],
  handledByProps: {
    value: 'username',
    onChange: 'onUsernameChange',
  },
  extraGetProps: [
    displayErrorFromPropsForTextField('passwordError', () => undefined),
    (props, linkInfo, { translate }) => ({
      ...props,
      placeholder: translate('usernameEmptyError', {
        emailAddress: { key: 'emailAddress' },
        phoneNumber: { key: 'phoneNumber' },
      }),
    }),
  ],
  validate: value => assert(value && value.type, null, {
    key: 'usernameEmptyError',
    values: {
      emailAddress: { key: 'emailAddress' },
      phoneNumber: { key: 'phoneNumber' },
    },
  }),
});

export const createNonemptyPasswordInput = () => ({
  name: 'password',
  presets: [FormTextFieldPreset, translateLabelAndAddOnKeyPressEvent('password', 'handleEnterForTextField')],
  InputComponent: FormPasswordInput,
  extraGetProps: displayErrorFromPropsForTextField('passwordError'),
  validate: value => assert(value != null && value !== '', null, { key: 'passwordEmptyError' }),
  childLinks: [
    {
      name: 'passwordVisibility',
      presets: [FormPasswordVisibilityPreset],
      defaultValue: false,
    },
  ],
});

export const createValidPasswordInput = () => ({
  name: 'password',
  presets: [FormTextFieldPreset, translateLabelAndAddOnKeyPressEvent('password', 'handleEnterForTextField')],
  InputComponent: FormPasswordInput,
  extraGetProps: displayErrorFromPropsForTextField('passwordError'),
  validate: value => assert(isValidPassword(value), null, { key: 'wrongPasswordFormatError' }),
  childLinks: [
    {
      name: 'passwordVisibility',
      presets: [FormPasswordVisibilityPreset],
      defaultValue: false,
    },
  ],
});
