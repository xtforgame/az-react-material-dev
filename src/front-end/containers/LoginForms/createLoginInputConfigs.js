import {
  FormCheckboxPreset,
  // DividerPreset,
  translateLabel,
  addOnPressEnterEvent,
} from '~/utils/InputLinker/helpers';

import {
  createPhoneOrEmailAccountInput,
  createNonemptyPasswordInput,
} from './inputConfigs';

export default (defaultRememberMe = false) => [
  createPhoneOrEmailAccountInput(),
  createNonemptyPasswordInput(),
  {
    name: 'rememberMe',
    presets: [FormCheckboxPreset, translateLabel('rememberMe'), addOnPressEnterEvent('handleSubmit')],
    props: { dense: 'true', color: 'primary' },
    defaultValue: defaultRememberMe || false,
  },
  // DividerPreset,
  // DividerPreset,
  // DividerPreset,
  // DividerPreset,
];
