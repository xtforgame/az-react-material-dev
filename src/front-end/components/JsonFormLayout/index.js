import React, { useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import { FormSpace, FormContent } from '~/components/FormInputs';
import useLayoutFeatures2 from '~/hooks/useLayoutFeatures2';
import Linker from '~/utils/InputLinker/core/Linker';
import { TwitterPicker } from 'react-color';
import presets from './presets';

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

const JsonFormLayout = (props) => {
  const {
    Linker = JsonFormLinker,
    linkerOptions = {},
    submitButtonText,
    renderSessionParent: rsp,
    renderSessionName: rsName,
    children,
  } = props;

  const {
    il, resetIl, classesByNs, tData: { t/* , i18n, ready */ }, host,
  } = useLayoutFeatures2({
    ...props,
    Linker,
    linkerOptions: {
      ...linkerOptions,
      presets: {
        ...presets,
        ...linkerOptions.presets,
      },
      // cursor jumps to end of controlled input in the async mode
      // this is a work-around for that issue
      applyChangesSync: true,
    },
    // onDidMount: (il) => { console.warn('il :', il); },
    onSubmit: (outputs) => { resetIl(); console.warn('outputs :', outputs); },
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

  const [bg, setBg] = useState('#fff');

  return (
    <div>
      <FormSpace variant="top" />
      <FormContent>
        {
          il.fieldLinks.map((filedLink) => {
            const space = 'space' in filedLink.options ? filedLink.options.space : <FormSpace variant="content1" />;
            return (
              <React.Fragment key={filedLink.name}>
                {il.renderComponent(filedLink.name, { translate: t, renderSession })}
                {space}
              </React.Fragment>
            );
          })
        }
        <Button
          variant="contained"
          fullWidth
          color="primary"
          className={classesByNs.login.loginBtn}
          onClick={host.handleSubmit}
        >
          {submitButtonText}
        </Button>
        <FormSpace variant="content1" />
      </FormContent>
      {children}
      <TwitterPicker
        width="100%"
        triangle="hide"
        color={bg}
        onChangeComplete={c => setBg(c)}
      />
    </div>
  );
};
JsonFormLayout.displayName = 'JsonFormLayout';

export default JsonFormLayout;
