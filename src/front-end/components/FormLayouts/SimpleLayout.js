import React from 'react';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
} from '~/components/FormInputs';

import InputLinker from '~/utils/InputLinker';
import {
  addOnKeyPressEvent,
  propagateOnChangeEvent,
} from '~/utils/InputLinker/helpers';

import createFormPaperStyle from '~/styles/FormPaper';

const styles = theme => ({
  ...createFormPaperStyle(theme),
});

class SimpleLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    const { fields, namespace = '' } = props;

    this.il = new InputLinker(this, { namespace });

    this.fieldLinks = this.il.add(...(fields.map(field => ({
      presets: [field, addOnKeyPressEvent(this.handleEnterForTextField), propagateOnChangeEvent()],
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

  handleEnterForTextField = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
      event.preventDefault();
    }
  };

  render() {
    const {
      intl,
      classes,
      i18nMessages,
      i18nTranslate,
      submitButtonText,
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
              const space = 'space' in filedLink.options ? filedLink.options.spaceComponent : <FormSpace variant="content1" />;
              return (
                <React.Fragment key={filedLink.name}>
                  {this.il.renderComponent(filedLink.name, { translate })}
                  {space}
                </React.Fragment>
              );
            })
          }
          <Button
            variant="contained"
            fullWidth
            color="primary"
            className={classes.loginBtn}
            onClick={this.handleSubmit}
          >
            {submitButtonText}
          </Button>
          <FormSpace variant="content1" />
        </FormContent>
        {children}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withStyles(styles),
)(SimpleLayout);
