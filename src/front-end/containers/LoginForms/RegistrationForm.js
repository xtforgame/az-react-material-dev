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
  InternalLink as Link,
} from '~/components/FormInputs';
import FormBaseType001 from './FormBaseType001';

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
      renderOptions,
      fields,
      comfirmUserAgreement,
    } = this.props;
    const translated = translateMessages(intl, i18nMessages, [
      'terms',
      'createAccount',
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
        renderOptions={{
          ...renderOptions,
          userAgreementLabel,
        }}
        fields={[
          ...fields,
          () => ({
            InputComponent: React.Fragment,
            ignoredFromOutputs: true,
            getProps: (props, { link: { owner, linker } }) => ({
              children: !comfirmUserAgreement && (userAgreementLabel),
            }),
            options: { space: null },
          }),
          () => ({
            InputComponent: SuccessButton,
            ignoredFromOutputs: true,
            getProps: (props, { link: { owner, linker } }) => ({
              variant: 'contained',
              fullWidth: true,
              color: 'primary',
              className: classes.login,
              onClick: owner.handleSubmit,
              children: translated.createAccount,
              disabled: comfirmUserAgreement && !linker.getValue('agreed'),
            }),
            options: { space: <FormSpace variant="content1" /> },
          }),
        ]}
      />
    );
  }
}

export default compose(
  injectIntl,
  withStyles(styles),
)(RegistrationForm);
