/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SuccessButton from '~/components/Buttons/SuccessButton';

import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
  InternalLink as Link,
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

class RegistrationForm extends React.PureComponent {
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
      comfirmUserAgreement,
      children,
    } = this.props;
    const translate = i18nTranslate
      || (i18nMessages ? translateMessages.bind(null, intl, i18nMessages) : undefined);
    const translated = translateMessages(intl, i18nMessages, [
      'terms',
      'createAccount',
      'createAccountV',
      'privacyPolicy',
    ]);

    const agreedField = this.il.getField('agreed');
    agreedField.visible = comfirmUserAgreement;
    const agreed = agreedField.getValue();

    const userAgreementLabel = (
      <FormattedMessage
        {...i18nMessages.userAgreement}
        values={{
          createAccountV: translated.createAccountV,
          terms: (<Link key="terms" text={translated.terms} />),
          privacyPolicy: (<Link key="privacyPolicy" text={translated.privacyPolicy} />),
        }}
      >
        {(...parts) => (
          <Typography
            variant="body1"
            className={classes.textContainer}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            {parts}
          </Typography>
        )}
      </FormattedMessage>
    );

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          {
            this.fieldLinks.map((filedLink) => {
              const space = 'space' in filedLink.options ? filedLink.options.space : <FormSpace variant="content1" />;
              return (
                <React.Fragment key={filedLink.name}>
                  {this.il.renderComponent(filedLink.name, { translate, userAgreementLabel })}
                  {space}
                </React.Fragment>
              );
            })
          }
          <FormSpace variant="content2" />
          {
            !comfirmUserAgreement && (userAgreementLabel)
          }
          <SuccessButton
            variant="contained"
            fullWidth
            color="primary"
            disabled={comfirmUserAgreement && !agreed}
            className={classes.loginBtn}
            onClick={this.handleSubmit}
          >
            {translated.createAccount}
          </SuccessButton>
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
)(RegistrationForm);
