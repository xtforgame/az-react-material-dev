import React from 'react';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
  FormTextField,
  FormPasswordInput,
  FormCheckbox,
} from '~/components/SignInSignUp';

import InputLinker from '~/utils/InputLinker';
import {
  FormTextFieldGetProps,
  displayErrorFromPropsForTextField,
  FormPasswordVisibilityGetProps,
  FormCheckboxInputGetProps,
  assert,
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
    this.il.add({
      name: 'username',
      handledByProps: {
        value: 'username',
        onChange: 'onUsernameChange',
      },
      // onChange: (value, [e], { ownerProps }) => {
      //   ownerProps.onUsernameChange(e.target.value);
      // },
      getProps: [
        FormTextFieldGetProps,
        displayErrorFromPropsForTextField('passwordError', () => undefined),
        (props, { link: { owner } }, { translate }) => ({
          ...props,
          onKeyPress: owner.handleEnterForTextField,
          label: translate('username'),
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
    }, {
      name: 'password',
      getProps: [
        FormTextFieldGetProps,
        displayErrorFromPropsForTextField('passwordError'),
        (props, { link: { owner } }, { translate }) => ({
          ...props,
          onKeyPress: owner.handleEnterForTextField,
          label: translate('password'),
        }),
      ],
      validate: value => assert(value != null && value !== '', null, { key: 'passwordEmptyError' }),
    }, {
      name: 'passwordVisibility',
      defaultValue: false,
      getProps: FormPasswordVisibilityGetProps,
      converter: {
        fromView: ((_, { storedValue }) => !storedValue),
        toOutput: () => undefined,
      },
    }, {
      name: 'rememberMe',
      defaultValue: (this.props.defaultRememberMe !== undefined ? this.props.defaultRememberMe : false),
      getProps: [
        FormCheckboxInputGetProps,
        (props, { link: { owner } }, { translate }) => ({
          ...props,
          onKeyPress: owner.handleEnterForTextField,
          label: translate('rememberMe'),
          dense: 'true',
          color: 'primary',
        }),
      ],
      converter: {
        fromView: (([e, v]) => v),
      },
    });

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
      handleCreateAccount = () => {},
      classes,
    } = this.props;
    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
      'login',
      'createAccount',
    ]);

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          <FormTextField
            {...this.il.renderProps('username', { translate })}
          />
          <FormSpace variant="content1" />
          <FormPasswordInput
            {...this.il.renderProps('password', { translate })}
            {...this.il.renderProps('passwordVisibility', { translate })}
          />
          <FormCheckbox
            {...this.il.renderProps('rememberMe', { translate })}
          />
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
        <Divider />
        <FormContent>
          <Button fullWidth className={classes.loginBtn} onClick={handleCreateAccount}>
            {translated.createAccount}
          </Button>
        </FormContent>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withStyles(styles),
)(LoginForm);
