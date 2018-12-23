import React from 'react';
import {
  FormSpace,
} from '~/components/FormInputs';
import {
  FormCheckboxPreset,
  translateLabelAndAddOnKeyPressEvent,
} from '~/utils/InputLinker/helpers';

import {
  createSimpleAccountInput,
  createValidPasswordInput,
} from './inputConfigs';

export default (defaultRememberMe = false) => [
  createSimpleAccountInput(),
  {
    ...createValidPasswordInput(),
    options: {
      space: <FormSpace variant="content2" />,
    },
  },
  {
    name: 'agreed',
    presets: [FormCheckboxPreset, translateLabelAndAddOnKeyPressEvent(undefined, 'handleEnterForTextField')],
    props: { dense: 'true', color: 'primary' },
    defaultValue: false,
    extraGetProps: (props, { link: { ownerProps } }, { translate, userAgreementLabel }) => ({
      ...props,
      label: ownerProps.comfirmUserAgreement && userAgreementLabel,
    }),
  },
];
