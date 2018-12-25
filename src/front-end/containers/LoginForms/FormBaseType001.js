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
    this.il.add(...(fields.map(field => ({
      presets: [field, propagateOnChangeEvent()],
    }))));

    this.state = this.il.mergeInitState({});
  }

  handleSubmit = () => {
    const { onSubmit = () => {} } = this.props;
    if (this.il.validate()) {
      const outputs = this.il.getOutputs();
      onSubmit(outputs, this.il);
    }
  }

  render() {
    const {
      intl,
      space: defaultSpace = <FormSpace variant="content1" />,
      topSpace = <FormSpace variant="top" />,
      Content = FormContent,
      i18nMessages,
      i18nTranslate,
      extraContents,
      children,
    } = this.props;
    const translate = i18nTranslate
      || (i18nMessages ? translateMessages.bind(null, intl, i18nMessages) : undefined);

    return (
      <React.Fragment>
        {topSpace}
        <Content>
          {
            this.il.fieldLinks.map((filedLink) => {
              const space = 'space' in filedLink.options ? filedLink.options.space : defaultSpace;
              return (
                <React.Fragment key={filedLink.name}>
                  {this.il.renderComponent(filedLink.name, { translate })}
                  {space}
                </React.Fragment>
              );
            })
          }
          {extraContents}
        </Content>
        {children}
      </React.Fragment>
    );
  }
}

export default compose(
  injectIntl,
)(FormBaseType001);
