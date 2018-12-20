import React from 'react';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
  FormPasswordInput,
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

import createCommonStyles from '~/styles/common';
import createFormPaperStyle from '~/styles/FormPaper';

const styles = theme => ({
  ...createFormPaperStyle(theme),
  ...createCommonStyles(theme, 'flex'),
});

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.il = new InputLinker(this, {
      namespace: 'login',
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
        validate: value => assert(value != null && value !== '', null, { key: 'passwordEmptyError' }),
      },
      {
        name: 'passwordVisibility',
        presets: [FormPasswordVisibilityPreset],
        defaultValue: false,
      },
      {
        name: 'rememberMe',
        presets: [FormCheckboxPreset, translateLabelAndAddOnKeyPressEvent('rememberMe', this.handleEnterForTextField)],
        props: { dense: 'true', color: 'primary' },
        defaultValue: (this.props.defaultRememberMe !== undefined ? this.props.defaultRememberMe : false),
      }
    );

    this.state = this.il.mergeInitState({});
  }

  handleSubmit = () => {
    const { onSubmit = () => {} } = this.props;

    const {
      username,
      password,
      rememberMe,
    } = this.il.getOutputs();

    if (this.il.validate()) {
      onSubmit(username, password, rememberMe);
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
    } = this.props;
    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
      'login',
    ]);

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
          {this.il.renderComponent('rememberMe', { translate })}
          <FormSpace variant="content1" />
          <Button
            variant="contained"
            fullWidth
            color="primary"
            className={classes.loginBtn}
            onClick={this.handleSubmit}
          >
            {translated.login}
          </Button>
          <FormSpace variant="content1" />
        </FormContent>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withStyles(styles),
)(LoginForm);
