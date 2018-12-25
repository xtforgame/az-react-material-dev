import React from 'react';
import {
  FormSpace,
} from '~/components/FormInputs';
import {
  FormPhoneOrEmailInputPreset,
  BottonPreset,
  displayErrorFromPropsForTextField,
  assert,
  translateLabel,
  addOnPressEnterEvent,
} from '~/utils/InputLinker/helpers';

export default recover => ([
  {
    name: 'username',
    presets: [FormPhoneOrEmailInputPreset, translateLabel('username'), addOnPressEnterEvent(recover)],
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
    options: { space: <FormSpace variant="content8" /> },
  },
  {
    presets: [BottonPreset],
    getProps: (props, { link: { owner, ownerProps, linker } }) => ({
      variant: 'contained',
      fullWidth: true,
      color: 'secondary',
      disabled: !linker.getOutput('username') || ownerProps.remainingTime > 0,
      className: ownerProps.classes.loginBtn,
      onClick: owner.handleSubmit,
      children: ownerProps.countDownText,
    }),
    options: { space: <FormSpace variant="content4" /> },
  },
  {
    presets: [BottonPreset],
    getProps: (props, { link: { ownerProps, linker } }) => ({
      fullWidth: true,
      disabled: !linker.getOutput('username'),
      className: ownerProps.classes.loginBtn,
      onClick: ownerProps.backToEnterTheCode,
      children: ownerProps.enterCodeText,
    }),
    getVisibility: ({ link: { owner, linker, ownerProps: { lastSentUsername } } }) => lastSentUsername && lastSentUsername === linker.getOutput('username'),
    options: { space: <FormSpace variant="content1" /> },
  },
]);
