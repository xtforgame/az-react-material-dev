import React from 'react';
import {
  FormSpace,
} from '~/components/FormInputs';
import {
  FormCheckboxPreset,
  FragmentPreset,
  SuccessBottonPreset,
  addOnPressEnterEvent,
} from '~/utils/InputLinker/helpers';

import {
  createPhoneOrEmailAccountInput,
  createValidPasswordInput,
} from './inputConfigs';

export default (defaultRememberMe = false) => [
  createPhoneOrEmailAccountInput(),
  {
    ...createValidPasswordInput(),
    options: {
      space: <FormSpace variant="content2" />,
    },
  },
  {
    name: 'agreed',
    presets: [FormCheckboxPreset, addOnPressEnterEvent('handleSubmit')],
    props: { dense: 'true', color: 'primary' },
    defaultValue: false,
    getVisibility: ({ link: { ownerProps } }) => ownerProps.comfirmUserAgreement,
    extraGetProps: (props, { link: { ownerProps } }, { translate }) => ({
      ...props,
      label: ownerProps.comfirmUserAgreement && ownerProps.userAgreementLabel,
    }),
  },
  {
    presets: [FragmentPreset],
    getProps: (props, { link: { ownerProps, linker } }) => ({
      children: !ownerProps.comfirmUserAgreement && (ownerProps.userAgreementLabel),
    }),
    options: { space: null },
  },
  {
    presets: [SuccessBottonPreset],
    extraGetProps: (props, { link: { owner, ownerProps, linker } }, { translate }) => ({
      variant: 'contained',
      fullWidth: true,
      color: 'primary',
      className: ownerProps.classes.login,
      onClick: owner.handleSubmit,
      children: translate('createAccount'),
      disabled: ownerProps.comfirmUserAgreement && !linker.getValue('agreed'),
    }),
    options: { space: <FormSpace variant="content1" /> },
  },
];
