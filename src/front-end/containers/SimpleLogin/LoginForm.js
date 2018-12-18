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

import FormInputLinker, {
  FormTextFieldGetProps,
  FormPasswordVisibilityGetProps,
  assert,
} from '~/utils/FormInputLinker2';

import createCommonStyles from '~/styles/common';
import createFormPaperStyle from '~/styles/FormPaper';

const styles = theme => ({
  ...createFormPaperStyle(theme),
  ...createCommonStyles(theme, 'flex'),
});

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.fil = new FormInputLinker(this, {
      namespace: 'login',
    });
    this.fil.add({
      name: 'username',
      getProps: (__, _) => ({
        ...FormTextFieldGetProps(__, _),
        placeholder: _.translate('usernameEmptyError', {
          emailAddress: { key: 'emailAddress' },
          phoneNumber: { key: 'phoneNumber' },
        }),
        onChange: (e) => {
          __.ownerProps.onUsernameChange(e.target.value);
          __.handleChange(e);
        },
      }),
      validate: value => assert(!!value, null, {
        key: 'usernameEmptyError',
        values: {
          emailAddress: { key: 'emailAddress' },
          phoneNumber: { key: 'phoneNumber' },
        },
      }),
    }, {
      name: 'password',
      getProps: FormTextFieldGetProps,
      validate: value => assert(value != null && value !== '', null, { key: 'passwordEmptyError' }),
    }, {
      name: 'password-visibility',
      defaultValue: false,
      getProps: FormPasswordVisibilityGetProps,
      converter: {
        fromView: (({ valueInState }) => !valueInState),
      },
    });

    this.state = this.fil.mergeInitState({
      rememberMe: this.props.defaultRememberMe !== undefined ? this.props.defaultRememberMe : false,
    });
  }

  static getDerivedStateFromProps(props, state) {
    // if (state.fil) {
    //   return state.fil.derivedFromProps(props, state);
    // }

    // // No state update necessary
    return null;
  }

  handleSubmit = () => {
    const {
      onSubmit = () => {},
    } = this.props;

    const {
      username,
      password,
    } = this.fil.getOutputs();

    if (this.fil.validate()) {
      onSubmit(username, password, this.state.rememberMe);
    }
  }

  handleEnterForTextField = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
      event.preventDefault();
    }
  };

  handleRememberMeChange = (event, checked) => {
    const {
      onRememberMeChange = () => {},
    } = this.props;
    onRememberMeChange(checked);
    this.setState({ rememberMe: checked });
  };

  render() {
    const {
      intl,
      handleCreateAccount = () => {},
      classes,
    } = this.props;
    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
      'username',
      'password',
      'login',
      'rememberMe',
      'createAccount',
    ]);

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          <FormTextField
            label={translated.username}
            onKeyPress={this.handleEnterForTextField}
            {...this.fil
              .getPropsForInputField('username', { translate })}
          />
          <FormSpace variant="content1" />
          <FormPasswordInput
            label={translated.password}
            onKeyPress={this.handleEnterForTextField}
            {...this.fil
              .getPropsForInputField('password', { translate })}
            {...this.fil
              .getPropsForInputField('password-visibility', { translate })}
          />
          <FormCheckbox
            dense="true"
            color="primary"
            checked={this.state.rememberMe}
            onChange={this.handleRememberMeChange}
            label={translated.rememberMe}
            onKeyPress={this.handleEnterForTextField}
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
