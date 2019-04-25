import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useInputLinker } from '~/utils/InputLinker';
import useStylesByNs from '~/styles/useStylesByNs';
import {
  propagateOnChangeEvent,
} from '~/utils/InputLinker/helpers';

export const defaultIlOnInit = props => (il) => {
  const { fields, defaultValues } = props;

  il.add(...(fields.map(field => ({
    presets: [field, propagateOnChangeEvent()],
  }))));

  il.setDefaultValues(defaultValues || {});
  il.resetDirtyFlags();
};

export default (props, ilOnInit) => {
  const {
    value,
    namespace,
    ignoredUndefinedFromOutputs = true,
    Linker,
    linkerOptions,

    i18nNs = [],
    styleNs = [],
    onInited = () => undefined,
    onDidMount = () => undefined,
    onSubmit = () => undefined,
  } = props;

  if (!Array.isArray(i18nNs)) {
    throw new Error(`Expect i18nNs as an Array, got: ${i18nNs}`);
  }

  if (!Array.isArray(styleNs)) {
    throw new Error(`Expect styleNs as an Array, got: ${styleNs}`);
  }

  const tData = useTranslation(i18nNs);
  const classesByNs = useStylesByNs(styleNs);

  const createInitFunc = (il, { reset }) => {
    (ilOnInit || defaultIlOnInit(props))(il);
    if (!reset) {
      onInited(il);
    }
  };

  const ilResults = useInputLinker(
    {/* props */},
    {
      Linker,
      ...linkerOptions,
      namespace,
      ignoredUndefinedFromOutputs,
      controlled: !!value,
    },
    createInitFunc,
  );
  const { il } = ilResults;

  const host = {
    handleSubmit: () => {
      if (il.validate()) {
        const outputs = il.getOutputs();
        onSubmit(outputs, il);
        return {
          outputs,
          linker: il,
        };
      }
      return null;
    },
    props: {
      ...props,
      classesByNs,
    },
  };

  useEffect(() => { onDidMount(il); }, []);

  return {
    ...ilResults,
    classesByNs,
    tData,
    host,
  };
};
