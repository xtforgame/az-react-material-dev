import React from 'react';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
} from '~/components/FormInputs';

import InputLinker from '~/utils/InputLinker';
import {
  propagateOnChangeEvent,
} from '~/utils/InputLinker/helpers';

class FormBaseType001 extends React.PureComponent {
  constructor(props) {
    super(props);
    const { fields, namespace = '' } = props;

    this.il = new InputLinker(this, { namespace });

    this.fieldLinks = this.il.add(...(fields.map(field => ({
      presets: [field, propagateOnChangeEvent()],
    }))));

    this.state = this.il.mergeInitState({});
  }

  handleSubmit = () => {
    const { onSubmit = () => {} } = this.props;
    if (this.il.validate()) {
      const outputs = this.il.getOutputs();
      onSubmit(outputs);
    }
  }

  render() {
    const {
      intl,
      i18nMessages,
      i18nTranslate,
      extraContents,
      renderOptions,
      children,
    } = this.props;
    const translate = i18nTranslate
      || (i18nMessages ? translateMessages.bind(null, intl, i18nMessages) : undefined);

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          {
            this.fieldLinks.map((filedLink) => {
              const space = 'space' in filedLink.options ? filedLink.options.space : <FormSpace variant="content1" />;
              return (
                <React.Fragment key={filedLink.name}>
                  {this.il.renderComponent(filedLink.name, { translate, ...renderOptions })}
                  {space}
                </React.Fragment>
              );
            })
          }
          {extraContents}
        </FormContent>
        {children}
      </div>
    );
  }
}

export default compose(
  injectIntl,
)(FormBaseType001);
