/* eslint-disable no-param-reassign */
import React, { useEffect, useRef /* , useState */ } from 'react';
// import FormDialogInput from '~/components/FormInputs/FormDialogInput';
import { FormSpace, FormContent /* , FormColorPicker */ } from '~/components/FormInputs';
import useLayoutFeatures2 from '~/hooks/useLayoutFeatures2';
import Linker from '~/utils/InputLinker/core/Linker';
// import { TwitterPicker } from 'react-color';
import presets from './presets';
import useJsonConfig from './useJsonConfig';

export class JsonFormLinker extends Linker {
  constructor(...args) {
    super(...args);
    console.log('JsonFormLinker');
    this.basicValidate = super.validate.bind(this);
  }

  validate() {
    if (this.options.globalValidator) {
      return this.options.globalValidator({
        linker: this,
        validate: this.basicValidate,
      });
    }
    return super.validate();
  }
}
class RenderSession {
  constructor(parent, name, linker, host, options = {}) {
    this.parent = parent;
    this.name = name;
    this.linker = linker;
    this.host = host;
    this.state = 'rendering';
    this.prevRenderSession = options.prevRenderSession;
  }

  beforeRender() {
    // console.log('RenderSession.beforeRender()');
    if (this.host.props.rsBeforeRender) {
      this.host.props.rsBeforeRender(this);
    }
  }

  afterRender() {
    // console.log('RenderSession.afterRender()');
    if (this.host.props.rsAfterRender) {
      this.host.props.rsAfterRender(this);
    }
  }
}

const JsonFormLayout = (p) => {
  const {
    jsonConfig,
    propsEx,
  } = useJsonConfig(p);

  const props = { ...p, ...propsEx };

  const {
    Linker = JsonFormLinker,
    linkerOptions = {},
    renderSessionParent: rsp,
    renderSessionName: rsName,
    children,
    i18nNs = [],
    onSubmit = () => {},
  } = props;

  const {
    il, resetIl, /* classesByNs, */ tData: { t/* , i18n, ready */ }, host,
  } = useLayoutFeatures2({
    ...props,
    ...propsEx,
    Linker,
    i18nNs: [...i18nNs, 'builtin-components'],
    linkerOptions: {
      ...linkerOptions,
      presets: {
        ...presets,
        ...linkerOptions.presets,
      },
      globalValidator: jsonConfig.globalValidator,
      // cursor jumps to end of controlled input in the async mode
      // this is a work-around for that issue
      applyChangesSync: true,
    },
    // onDidMount: (il) => { console.warn('il :', il); },
    onSubmit: (outputs, linker) => {
      onSubmit(outputs, {
        linker,
        resetIl,
      });
    },
  });

  // if (!ready) {
  //   t = () => '';
  // }

  const ref = useRef();

  const renderSession = new RenderSession(rsp, rsName, il, host, {
    prevRenderSession: ref.current && ref.current.prevRenderSession,
  });

  il.updateHost({
    ...host,
    renderSession,
  });

  renderSession.beforeRender();
  useEffect(() => {
    ref.current = { prevRenderSession: renderSession };
    renderSession.afterRender();
    renderSession.prevRenderSession = null;
  });

  // const [bg, setBg] = useState('#7BDCB5');
  // const [dialogText, setDialogText] = useState('Dialog Text');

  const renderSpace = (filedLink) => {
    if (!('space' in filedLink.options)) {
      return <FormSpace variant="content2" />;
    }
    if (filedLink.options.space === 'none') {
      return <div />;
    }
    return <div />;
  };

  return (
    <div>
      <FormSpace variant="top" />
      <FormContent>
        {
          il.fieldLinks.map((filedLink) => {
            const space = renderSpace(filedLink);
            return (
              <React.Fragment key={filedLink.name}>
                {il.renderComponent(filedLink.name, { translate: t, renderSession })}
                {space}
              </React.Fragment>
            );
          })
        }
        {/* <FormColorPicker
          label="Color"
          value={bg}
          onChange={c => setBg(c)}
          fullWidth
          colors={[
            '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF',
          ]}
        /> */}
        {/* <FormSpace variant="content2" />
        <FormDialogInput
          label="Dialog"
          title="XXX Dialog"
          value={dialogText}
          displayValue={t => t}
          onChange={t => setDialogText(t)}
        /> */}
        {/* <TwitterPicker
          width="100%"
          triangle="hide"
          styles={{
            'hide-triangle': {
              card: {
                boxShadow: 'unset',
              },
            },
          }}
          color={bg}
          onChangeComplete={c => console.log('c :', c) || setBg(c.hex || c || '')}
        /> */}
      </FormContent>
      {children}
    </div>
  );
};
JsonFormLayout.displayName = 'JsonFormLayout';

export default JsonFormLayout;
