/* eslint-disable no-param-reassign */
import {
  // FormSpace,
  // FormContent,
  FormPasswordInput,
} from '~/components/FormInputs';
import AutoCalculable, { defaultIsEqual } from '~/components/AutoCalculable';
import resetableInputPreset from './resetableInputPreset';

// import InputLinker from '~/utils/InputLinker';
import {
  FormTextFieldPreset,
  FormPasswordVisibilityPreset,
  FormCheckboxPreset,
  assert,
  translateProp,
  // translateLabel,
} from '~/utils/InputLinker/helpers';


export default {
  text: {
    presets: [FormTextFieldPreset],
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
    cfgMiddlewares: {
      last: cfg => ({
        ...cfg,
        childLinks: [
          {
            name: `${cfg.name}Visibility`,
            presets: [FormPasswordVisibilityPreset],
            defaultValue: false,
          },
        ],
      }),
    },
  },
  checkbox: {
    presets: [FormCheckboxPreset],
    props: { dense: 'true', color: 'primary' },
  },
  // =========================
  translateProp,
  autoCalculable: {
    cfgMiddlewares: {
      last: {
        presets: [resetableInputPreset],
        // extraOptions: { unmountWhileReset: true },
        extraConverter: {
          normalize: ((v, { link }) => {
            if (link.data.autoCalc) {
              return link.data.calculatedValue;
            }
            return v;
          }),
        },
        mwPreRender: ({ nonProps }) => [{
          Component: nonProps.component,
        }, {
          component: AutoCalculable,
          shouldRender: true,
        }],
        mwRender: ({ props, link }) => {
          const isEqual = link.options.isEqual || defaultIsEqual;
          link.data.calculatedValue = props.calculatedValue;
          link.data.autoCalc = isEqual(props.calculatedValue, props.value);
          return ({});
        },
      },
    },
  },
  autoCalculableText: {
    presets: ['text', 'autoCalculable'],
    extraOptions: { isEqual: (calculated, input) => !input || (calculated === input) },
    mwRender: [
      ({ props, link, options: { renderSession: rs } }) => {
        const calculatedValue = rs.calculated && rs.calculated[link.name];
        return ({
          calculatedValue,
          acOptions: {
            isEqual: link.options.isEqual,
            getExtraProps: (autoCalc) => {
              if (!autoCalc) {
                return {
                  // error: true,
                  helperText: props.helperText || calculatedValue,
                };
              }
              return {};
            },
            onAutoCalcChanged: undefined,
          },
        });
      },
    ],
  },
};
