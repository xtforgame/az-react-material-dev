// import InputLinker from '~/utils/InputLinker';
import {
  FormCheckboxPreset,
  translateLabelAndAddOnKeyPressEvent,
} from '~/utils/InputLinker/helpers';

import {
  createSimpleAccountInput,
  createNonemptyPasswordInput,
} from './inputConfigs';

export default (defaultRememberMe = false) => [
  createSimpleAccountInput(),
  createNonemptyPasswordInput(),
  {
    name: 'rememberMe',
    presets: [FormCheckboxPreset, translateLabelAndAddOnKeyPressEvent('rememberMe', 'handleEnterForTextField')],
    props: { dense: 'true', color: 'primary' },
    defaultValue: defaultRememberMe || false,
  },
];
