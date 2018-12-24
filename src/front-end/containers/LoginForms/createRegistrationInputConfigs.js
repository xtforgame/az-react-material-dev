import React from 'react';
import {
  FormSpace,
} from '~/components/FormInputs';
import {
  FormCheckboxPreset,
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
    extraGetProps: (props, { link: { ownerProps } }, { translate, userAgreementLabel }) => ({
      ...props,
      label: ownerProps.comfirmUserAgreement && userAgreementLabel,
    }),
  },
];
