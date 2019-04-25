import React from 'react';

import {
  // FormSpace,
  // FormContent,
  FormPasswordInput,
} from '~/components/FormInputs';

// import InputLinker from '~/utils/InputLinker';
import {
  FormTextFieldPreset,
  FormPasswordVisibilityPreset,
  FormCheckboxPreset,
  assert,
  translateLabel,
} from '~/utils/InputLinker/helpers';


export default {
  text: {
    presets: [FormTextFieldPreset],
    mwRender: [
      ({ link: { hostProps }, options: { translate, renderSession } }) => ({
        placeholder: translate('usernameEmptyError', {
          emailAddress: '$t(emailAddress)',
          phoneNumber: '$t(phoneNumber)',
        }),
      }),
    ],
    validate: value => assert(!!value, null, {
      key: 'usernameEmptyError',
      values: {
        emailAddress: '$t(emailAddress)',
        phoneNumber: '$t(phoneNumber)',
      },
    }),
  },
  password: {
    presets: [FormTextFieldPreset],
    component: FormPasswordInput,
    validate: value => assert(value != null && value !== '', null, { key: 'passwordEmptyError' }),
    childLinks: [
      {
        name: 'passwordVisibility',
        presets: [FormPasswordVisibilityPreset],
        defaultValue: false,
      },
    ],
  },
  checkbox: {
    presets: [FormCheckboxPreset],
    props: { dense: 'true', color: 'primary' },
  },
};
