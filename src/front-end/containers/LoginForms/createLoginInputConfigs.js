// import Divider from '@material-ui/core/Divider';
import {
  FormCheckboxPreset,
  translateLabelAndAddOnKeyPressEvent,
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
    presets: [FormCheckboxPreset, translateLabelAndAddOnKeyPressEvent('rememberMe', 'handleEnterForTextField')],
    props: { dense: 'true', color: 'primary' },
    defaultValue: defaultRememberMe || false,
  },
  // { name: 'd1', InputComponent: Divider },
  // { name: 'd2', InputComponent: Divider },
  // { name: 'd3', InputComponent: Divider },
  // { name: 'd4', InputComponent: Divider },
];
