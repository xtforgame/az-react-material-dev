/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import translateMessages from '~/utils/translateMessages';
import {
  InternalLink as Link,
} from '~/components/FormInputs';
import FormBaseType001 from '~/containers/LoginForms/FormBaseType001';
import createFormPaperStyle from '~/styles/FormPaper';

const styles = theme => ({
  ...createFormPaperStyle(theme),
});

class RegistrationForm extends React.PureComponent {
  render() {
    const {
      intl,
      classes,
      i18nMessages,
      fields,
      comfirmUserAgreement,
    } = this.props;
    const translated = translateMessages(intl, i18nMessages, [
      'terms',
      'createAccountV',
      'privacyPolicy',
    ]);

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
      <FormBaseType001
        {...this.props}
        comfirmUserAgreement={comfirmUserAgreement}
        userAgreementLabel={userAgreementLabel}
        fields={fields}
      />
    );
  }
}

export default compose(
  injectIntl,
  withStyles(styles),
)(RegistrationForm);
