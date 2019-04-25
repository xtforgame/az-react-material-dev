import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { FormSpace, FormContent } from '~/components/FormInputs';
import useLayoutFeatures from '~/hooks/useLayoutFeatures';
import Linker from '~/utils/InputLinker/core/Linker';
import presets from './presets';

export class JsonFormLinker extends Linker {
  constructor(...args) {
    super(...args);
    console.log('JsonFormLinker');
  }
}
class RenderSession {
  constructor(parent, name, linker, host) {
    this.parent = parent;
    this.name = name;
    this.linker = linker;
    this.host = host;
    this.state = 'rendering';
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
  } = useLayoutFeatures({
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

  const renderSession = new RenderSession(rsp, rsName, il, host);

  il.updateHost(host);

  renderSession.beforeRender();
  useEffect(() => {
    renderSession.afterRender();
  });

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
    </div>
  );
};
JsonFormLayout.displayName = 'JsonFormLayout';

export default JsonFormLayout;
