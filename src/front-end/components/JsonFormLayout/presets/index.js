import {
  // FormSpace,
  // FormContent,
  FormPasswordInput,
} from '~/components/FormInputs';
import AutoCalculable from '~/components/AutoCalculable';
import resetableInputPreset from './resetableInputPreset';

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
  // =========================
  autoCalculable: {
    mwPreRender: ({ nonProps }) => [{
      Component: nonProps.component,
    }, {
      component: AutoCalculable,
      shouldRender: true,
    }],
    mwRender: ({ link: { hostProps }, options: { translate, renderSession } }) => ({
      placeholder: translate('usernameEmptyError', {
        emailAddress: '$t(emailAddress)',
        phoneNumber: '$t(phoneNumber)',
      }),
    }),
  },
  autoCalculableText: {
    presets: ['text', 'autoCalculable'],
    mwRender: [
      ({ link, options: { renderSession: rs } }) => {
        const calculatedValue = rs.calculated && rs.calculated[link.name];
        return ({
          calculatedValue,
          acOptions: {
            isEqual: (r, v, p) => !v || (r === v),
            getExtraProps: (autoCalc) => {
              if (!autoCalc) {
                return {
                  // error: true,
                  helperText: calculatedValue,
                };
              }
              return {};
            },
            onAutoCalcChanged: () => undefined,
          },
        });
      },
    ],
    cfgMiddlewares: {
      last: {
        presets: [resetableInputPreset],
      },
    },
  },
};
