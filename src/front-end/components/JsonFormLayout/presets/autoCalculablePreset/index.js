/* eslint-disable no-param-reassign */
import AutoCalculable, { defaultIsEqual } from '~/components/AutoCalculable';
import resetableInputPreset from '../resetableInputPreset';

const autoCalculableBasePreset = {
  extraConverter: {
    normalize: ((v, { link }) => {
      if (link.data.autoCalc) {
        return link.data.calculatedValue;
      }
      return v;
    }),
  },
};

const autoCalculableDefaultPrerenderPreset = {
  mwPreRender: ({ nonProps }) => [{
    Component: nonProps.component,
  }, {
    component: AutoCalculable,
    shouldRender: true,
  }],
};

export default {
  presets: [
    resetableInputPreset,
    autoCalculableBasePreset,
    autoCalculableDefaultPrerenderPreset,
  ],
  evaluate: cfg => ({
    ...cfg,
    extraOptions: {
      isEqual: (calculated, input) => !input || (calculated === input),
      // unmountWhileReset: true
    },
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
      ({ props, link }) => {
        const isEqual = link.options.isEqual || defaultIsEqual;
        link.data.calculatedValue = props.calculatedValue;
        link.data.autoCalc = isEqual(props.calculatedValue, props.value);
        return ({});
      },
    ],
  }),
};
