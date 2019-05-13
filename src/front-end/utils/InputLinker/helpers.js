/* eslint-disable no-underscore-dangle */
import React from 'react';
import moment from 'moment';
import { DateTimePicker, DatePicker } from 'material-ui-pickers';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import BreakAllContentText from '~/components/Text/BreakAllContentText';
import {
  FormTextField,
  FormTextInput,
  FormSelect,
  FormCodeInput,
  FormNumberInput,
  FormCheckbox,
  FormPhoneOrEmailInput,
  FormSwitch,
  ListInput,
} from '~/components/FormInputs';
import { isAllDigital } from 'common/utils/validators';

export const assert = (condition, message, i18n) => {
  if (!condition) {
    const error = new Error(message || 'Validation failed');
    error.i18n = i18n;
    throw error;
  }
};

export const FormTextFieldLikePreset = {
  component: FormTextField,
  cfgMiddlewares: {
    last: {
      mwRender: ({
        props,
        value,
        link,
        handleChange,
        validateError,
        options: { translate },
      }) => {
        const validateErrorMessage = validateError && (
          (validateError.i18n && translate(validateError.i18n.key, validateError.i18n.values))
          || validateError.message
        );

        return {
          id: link.key,
          value,
          onChange: handleChange,
          error: !!validateErrorMessage,
          helperText: validateErrorMessage || props.helperText, // helperMessage,
        };
      },
    },
  },
};

export const FormTextFieldPreset = FormTextFieldLikePreset;

export const createFormNumberInputPreset = (currency = false) => cfg => ({
  ...cfg,
  component: FormNumberInput,
  extraProps: {
    currency,
  },
});

export const createListInputPreset = createRow => cfg => ({
  ...cfg,
  component: ListInput,
  converter: {
    fromView: (([{ type, id, value: valueArray }], linkInfo) => {
      switch (type) {
        case 'add': {
          return [
            ...valueArray,
            createRow({ type, id, valueArray }, linkInfo),
          ];
        }
        default: {
          return [...valueArray];
        }
      }
    }),
  },
  mwRender: ({
    value,
    link,
    handleChange,
  }) => ({
    id: link.key,
    value,
    onChange: handleChange,
  }),
});

export const mwpDisplayErrorFromPropsForTextField = (propKey, getMessageFunc = e => e) => (
  { props, link: { hostProps }, validateError }
) => {
  const newProps = {};
  const errorFromProps = hostProps[propKey];
  if (!validateError && errorFromProps) {
    newProps.error = true;
    newProps.helperText = getMessageFunc(errorFromProps) || props.helperText;
  }
  return newProps;
};

const InputTypePreset = {
  cfgMiddlewares: {
    last: cfg => ({
      ...cfg,
      mwRender: [
        ({
          props,
          value,
          link,
          handleChange,
          validateError,
          options: { translate },
        }) => {
          const validateErrorMessage = validateError && (
            (validateError.i18n && translate(validateError.i18n.key, validateError.i18n.values))
            || validateError.message
          );

          return {
            id: link.key,
            value,
            onChange: handleChange,
            formProps: {
              ...props.formProps,
              error: validateErrorMessage,
            },
            helperText: validateErrorMessage || props.helperText, // helperMessage,
          };
        },
        ({ props }) => {
          const formProps = props.formProps || {};
          const style = { ...formProps.style };
          if (props.fullWidth && !('width' in style)) {
            style.width = '100%';
          }

          return {
            formProps: {
              ...formProps,
              style,
            },
          };
        },
      ],
    }),
  },
};

export const FormTextInputPreset = {
  presets: [InputTypePreset],
  component: FormTextInput,
};

export const FormSelectPreset = {
  presets: [InputTypePreset],
  component: FormSelect,
  mwRender: ({ link }) => ({
    name: link.name,
  }),
};

export const FormSwitchPreset = {
  component: FormSwitch,
  converter: {
    fromView: (([e]) => e.target.checked),
  },
  mwRender: ({ link, handleChange, value }) => ({
    checked: value,
    onChange: handleChange,
    value: link.name,
  }),
};

export const DateTimePickerBasePreset = {
  converter: {
    fromView: ([v]) => moment(v, 'YYYY/MM/DD a h:mm').format(),
  },
  extraProps: {
    variant: 'outlined',
    fullWidth: true,
    format: 'YYYY/MM/DD a h:mm',
    animateYearScrolling: false,
    cancelLabel: '取消',
    clearLabel: '清除',
    okLabel: '確定',
    // clearable
    // disableFuture
    // maxDateMessage="Date must be less than today"
  },
  mwRender: ({ handleChange, value }) => ({
    value: value || null,
    onChange: handleChange,
  }),
};

export const DateTimePickerPreset = {
  presets: [DateTimePickerBasePreset],
  component: DateTimePicker,
};

export const DatePickerPreset = {
  presets: [DateTimePickerBasePreset],
  component: DatePicker,
  converter: {
    fromView: ([v]) => moment(v, 'YYYY/MM/DD').format(),
  },
  extraProps: {
    format: 'YYYY/MM/DD',
  },
};

export const DatePickerWithoutYearPreset = {
  presets: [DatePickerPreset],
  converter: {
    fromView: ([v]) => moment(v, 'MM/DD').format(),
  },
  extraProps: {
    format: 'MM/DD',
  },
};

export const createMenuItemConfig = (name, children) => ({
  ignoredFromOutputs: true,
  component: MenuItem,
  // name,
  extraProps: {
    value: name,
  },
  mwRender: () => ({
    children,
  }),
});

export const FormPasswordVisibilityPreset = cfg => ({
  ...cfg,
  mwRender: ({ value, handleChange }) => ({
    type: value ? 'text' : 'password',
    onShowPassswordClick: handleChange,
  }),
  ignoredFromOutputs: true,
  converter: {
    fromView: ((_, { storedValue }) => !storedValue),
    toOutput: () => undefined,
  },
});

export const FormCheckboxPreset = cfg => ({
  ...cfg,
  component: FormCheckbox,
  mwRender: ({
    value,
    link,
    handleChange,
  }) => ({
    id: link.key,
    onChange: handleChange,
    checked: value,
  }),
  converter: {
    fromView: (([e, v]) => v),
  },
});

export const FormPhoneOrEmailInputPreset = {
  presets: [FormTextFieldPreset],
  component: FormPhoneOrEmailInput,
  props: { enablePhone: true },
  converter: {
    toView: (value => (value && value.rawInput) || ''),
    fromView: (([value]) => value),
    toOutput: (value => value && value.value),
  },
};

export const FormCodeInputPreset = {
  presets: [FormTextFieldPreset],
  component: FormCodeInput,
  converter: {
    fromView: (([e], { storedValue }) => (
      (
        !e.target.value
        || (isAllDigital(e.target.value) && e.target.value.length <= 6)
      ) ? e.target.value : storedValue)
    ),
  },
  validate: value => assert(value, null),
};

export const createIgnoredPreset = component => cfg => ({
  ...cfg,
  component,
  ignoredFromOutputs: true,
});

export const mwpListItemDisplayer = (ctx) => {
  const { props, link: { name, hostProps } } = ctx;
  ctx.props = {
    key: props.key,
    children: (
      <ListItemText
        key={name}
        disableTypography
        primary={(
          <Typography variant="subtitle1">
            {props.label || name}
          </Typography>
        )}
        secondary={(
          <Typography component={BreakAllContentText} color="textSecondary">
            {hostProps.defaultValues[name]}
          </Typography>
        )}
      />
    ),
  };
};

export const translateProp = (propName, i18nKey, i8nValues = {}) => {
  let iV = i8nValues;
  if (typeof iV === 'string') {
    iV = JSON.parse(iV);
  }
  return {
    mwRender: ({ options: { translate } }) => ({
      [propName]: i18nKey && translate(i18nKey, iV),
    }),
  };
};

export const translateLabel = (i18nKey, i8nValues) => translateProp('label', i18nKey, i8nValues);

export const addOnPressEnterEvent = (onPressEnter = undefined) => ({
  mwRender: ({ link: { host } }) => {
    const onPressEnterFunction = typeof onPressEnter === 'string' ? host[onPressEnter] : onPressEnter;
    return {
      onPressEnter: onPressEnterFunction && ((e) => {
        e.preventDefault();
        onPressEnterFunction(e);
      }),
    };
  },
});

export const propagateOnChangeEvent = (parentOnChangePropName = 'onChange') => (cfg) => {
  const originalOnChange = cfg.onChange || (() => {});
  return {
    ...cfg,
    onChange: (value, rawArgs, linkInfo) => {
      originalOnChange(value, rawArgs, linkInfo);
      const { link: { name, linker, hostProps } } = linkInfo;
      const onChange = hostProps[parentOnChangePropName] || (() => {});
      onChange(name, value, rawArgs, linker);
    },
  };
};

export const raiseDirtyFlagOnChangeEvent = (cfg) => {
  const originalOnChange = cfg.onChange || (() => {});
  return {
    ...cfg,
    onChange: (value, rawArgs, linkInfo) => {
      originalOnChange(value, rawArgs, linkInfo);
      const { link } = linkInfo;
      console.log('link :', link);
      link.dirty = true;
    },
  };
};

export const createDefaultContainer = getSpace => extraChildElements => ({
  ignoredFromOutputs: true,
  mergeChildren: (_, childrenElements, linkInfo) => childrenElements.reduce(
    (a, c, index) => {
      const array = a.concat([c]);
      const newLinkInfo = { ...linkInfo, index, key: `ctn-space-${index}` };
      let childElement;
      if (linkInfo.isMergingChildElements) {
        childElement = linkInfo.link.childElements[index];
        newLinkInfo.childElement = childElement;
      }
      if (index < childrenElements.length - 1) {
        if (childElement && 'space' in childElement.options) {
          array.push(childElement.options.space);
        } else {
          array.push(getSpace(newLinkInfo));
        }
      }
      return array;
    },
    [],
  ),
  extraChildElements,
  cfgMiddlewares: {
    last: cfg => ({
      ...cfg,
      ...(cfg.component ? {} : { component: React.Fragment }),
    }),
  },
});
