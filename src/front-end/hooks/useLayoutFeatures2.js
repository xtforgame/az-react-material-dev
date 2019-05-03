import useLayoutFeatures from './useLayoutFeatures';

export const defaultIlOnInit = props => (il) => {
  const { fields, defaultValues } = props;

  il.add(...(fields.map(field => ({
    presets: [field],
  }))));

  il.setDefaultValues(defaultValues || {});
  il.resetDirtyFlags(true);
};

export default (props, ilOnInit) => useLayoutFeatures(props, ilOnInit || defaultIlOnInit(props));
