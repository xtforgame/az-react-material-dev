/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
  FormPasswordInput,
  InternalLink as Link,
} from '~/components/FormInputs';

import InputLinker from '~/utils/InputLinker';
import {
  FormTextFieldPreset,
  displayErrorFromPropsForTextField,
  FormPasswordVisibilityPreset,
  FormCheckboxPreset,
  assert,
  translateLabelAndAddOnKeyPressEvent,
} from '~/utils/InputLinker/helpers';

import SuccessButton from '~/components/Buttons/SuccessButton';

import createFormPaperStyle from '~/styles/FormPaper';
import {
  isValidPassword,
} from 'common/utils/validators';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.il = new InputLinker(this, {
      namespace: 'register',
    });
    this.il.add(
      {
        name: 'username',
        presets: [FormTextFieldPreset, translateLabelAndAddOnKeyPressEvent('username', this.handleEnterForTextField)],
        handledByProps: {
          value: 'username',
          onChange: 'onUsernameChange',
        },
        extraGetProps: [
          displayErrorFromPropsForTextField('passwordError', () => undefined),
          (props, linkInfo, { translate }) => ({
            ...props,
            placeholder: translate('usernameEmptyError', {
              emailAddress: { key: 'emailAddress' },
              phoneNumber: { key: 'phoneNumber' },
            }),
          }),
        ],
        validate: value => assert(!!value, null, {
          key: 'usernameEmptyError',
          values: {
            emailAddress: { key: 'emailAddress' },
            phoneNumber: { key: 'phoneNumber' },
          },
        }),
      },
      {
        name: 'password',
        presets: [FormTextFieldPreset, translateLabelAndAddOnKeyPressEvent('password', this.handleEnterForTextField)],
        InputComponent: FormPasswordInput,
        extraGetProps: displayErrorFromPropsForTextField('passwordError'),
        validate: value => assert(isValidPassword(value), null, { key: 'wrongPasswordFormatError' }),
      },
      {
        name: 'passwordVisibility',
        presets: [FormPasswordVisibilityPreset],
        defaultValue: false,
      },
      {
        name: 'agreed',
        presets: [FormCheckboxPreset, translateLabelAndAddOnKeyPressEvent(undefined, this.handleEnterForTextField)],
        props: { dense: 'true', color: 'primary' },
        defaultValue: false,
      }
    );

    this.state = this.il.mergeInitState({});
  }

  handleSubmit = () => {
    const {
      comfirmUserAgreement = false,
      onSubmit = () => {},
    } = this.props;

    const {
      username,
      password,
    } = this.il.getOutputs();

    const agreed = this.il.getValue('agreed');
    if ((!comfirmUserAgreement || agreed) && this.il.validate()) {
      onSubmit(username, password);
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
      comfirmUserAgreement = false,
      classes,
    } = this.props;
    const agreed = this.il.getValue('agreed');
    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
      'createAccount',
      'createAccountV',
      'terms',
      'privacyPolicy',
    ]);

    const userAgreementLabel = (
      <FormattedMessage
        {...messages.userAgreement}
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
          {this.il.renderComponent('username', { translate })}
          <FormSpace variant="content1" />
          {this.il.renderComponent('password', {
            translate,
            extraProps: this.il.renderProps('passwordVisibility', { translate }),
          })}
          <FormSpace variant="content2" />
          {
            !!comfirmUserAgreement && (
              this.il.renderComponent('agreed', {
                translate,
                extraProps: { label: userAgreementLabel },
              })
            )
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
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withStyles(createFormPaperStyle),
)(RegistrationForm);
