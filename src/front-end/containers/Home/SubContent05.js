import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import createCommonStyles from '~/styles/common';
import SimpleLayout from '~/components/FormLayouts/SimpleLayout';
import { messages } from '~/containers/App/translation';

import {
  // FormSpace,
  // FormContent,
  FormPasswordInput,
} from '~/components/FormInputs';

// import InputLinker from '~/utils/InputLinker';
import {
  FormTextFieldPreset,
  FormPasswordVisibilityPreset,
  FormCheckboxPreset,
  assert,
  translateLabel,
} from '~/utils/InputLinker/helpers';

const styles = theme => ({
  ...createCommonStyles(theme, ['flex', 'appBar']),
  root: {
    width: '100%',
    overflowX: 'auto',
  },
});

const fileds = [
  {
    name: 'username',
    presets: [FormTextFieldPreset, translateLabel('username')],
    handledByProps: {
      value: 'username',
      onChange: 'onUsernameChange',
    },
    extraGetProps: [
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
    presets: [FormTextFieldPreset, translateLabel('password')],
    InputComponent: FormPasswordInput,
    validate: value => assert(value != null && value !== '', null, { key: 'passwordEmptyError' }),
    childLinks: [
      {
        name: 'passwordVisibility',
        presets: [FormPasswordVisibilityPreset],
        defaultValue: false,
      },
    ],
    options: { space: <div /> },
  },
  {
    name: 'rememberMe',
    presets: [FormCheckboxPreset, translateLabel('rememberMe')],
    props: { dense: 'true', color: 'primary' },
    defaultValue: false,
  },
];

class SubContent02 extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = { username: '' };

  render() {
    const { classes } = this.props;
    const { username } = this.state;
    return (
      <Paper className={classes.root}>
        <SimpleLayout
          namespace="form1"
          fields={fileds}
          username={username}
          onUsernameChange={username => this.setState({ username })}
          // onChange={(...agrs) => { console.log('agrs :', agrs); }}
          // onSubmit={(value) => { console.log('value :', value); }}
          submitButtonText="登入"
          i18nMessages={messages}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(SubContent02);
