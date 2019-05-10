/* eslint-disable no-param-reassign */
import Button from '@material-ui/core/Button';
import {
  // FormSpace,
  // FormContent,
  FormPasswordInput,
  FormDatePicker,
  FormTimePicker,
  FormDateTimePicker,
} from '~/components/FormInputs';
// import FormDialogInput from '~/components/FormInputs/FormDialogInput';
import AutoCalculable, { defaultIsEqual } from '~/components/AutoCalculable';
import resetableInputPreset from './resetableInputPreset';
import {
  DateRangePreset,
  TimeRangePreset,
  DateTimeRangePreset,
} from './range/presets';

// import InputLinker from '~/utils/InputLinker';
import {
  FormTextFieldPreset,
  FormPasswordVisibilityPreset,
  FormCheckboxPreset,
  DatePickerPreset,
  assert,
  translateProp,
  createIgnoredPreset,
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
    extraProps: { dense: 'true', color: 'primary' },
  },
  button: {
    presets: [createIgnoredPreset(Button)],
    component: Button,
  },
  dateOld: {
    presets: [DatePickerPreset],
    extraProps: {
      variant: 'outlined',
      // InputProps: { style: { width: 140 } },
      fullWidth: true,
    },
  },
  date: {
    component: FormDatePicker,
    converter: {
      fromView: ([v]) => v,
      toView: v => v,
    },
    extraProps: {
      // InputProps: { style: { width: 140 } },
      fullWidth: true,
    },
    mwRender: ({ handleChange, value }) => ({
      value,
      onChange: handleChange,
    }),
  },
  dateRange: {
    presets: [DateRangePreset],
  },
  time: {
    component: FormTimePicker,
    converter: {
      fromView: ([v]) => v,
      toView: v => v,
    },
    extraProps: {
      // InputProps: { style: { width: 140 } },
      fullWidth: true,
    },
    mwRender: ({ handleChange, value }) => ({
      value,
      onChange: handleChange,
    }),
  },
  timeRange: {
    presets: [TimeRangePreset],
  },
  dateTime: {
    component: FormDateTimePicker,
    converter: {
      fromView: ([v]) => v,
      toView: v => v,
    },
    extraProps: {
      // InputProps: { style: { width: 140 } },
      fullWidth: true,
    },
    mwRender: ({ handleChange, value }) => ({
      value,
      onChange: handleChange,
    }),
  },
  dateTimeRange: {
    presets: [DateTimeRangePreset],
  },
  submit: {
    presets: ['button'],
    extraProps: {
      variant: 'contained',
      color: 'primary',
      fullWidth: true,
    },
    mwRender: ({ link: { host, hostProps, linker } }) => ({
      className: hostProps.classesByNs.loginBtn,
      onClick: host.handleSubmit,
      // children: hostProps.countDownText,
    }),
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
