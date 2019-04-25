import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import createCommonStyles from '~/styles/common';
import JsonFormLayout from '~/components/JsonFormLayout';
import Linker from '~/utils/InputLinker/core/Linker';

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

class JsonFormLinker extends Linker {
  constructor(...args) {
    super(...args);
    console.log('JsonFormLinker');
    this.presets = {
      password: {
        presets: [FormTextFieldPreset, translateLabel('password')],
        component: FormPasswordInput,
        validate: value => assert(value != null && value !== '', null, { key: 'passwordEmptyError' }),
        childLinks: [
          {
            name: 'passwordVisibility',
            presets: [FormPasswordVisibilityPreset],
            defaultValue: false,
          },
        ],
        extraOptions: { space: <div /> },
      },
    };
  }
}

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
    mwRender: [
      ({ link: { hostProps }, options: { translate, renderSession } }) => console.log('renderSession :', renderSession) || ({
        placeholder: translate('usernameEmptyError', {
          emailAddress: '$t(emailAddress)',
          phoneNumber: '$t(phoneNumber)',
        }),
      }),
    ],
    validate: value => assert(!!value, null, {
      key: 'usernameEmptyError',
      values: {
        emailAddress: '$t(emailAddress)',
        phoneNumber: '$t(phoneNumber)',
      },
    }),
  },
  {
    name: 'password',
    presets: ['password'],
  },
  {
    name: 'rememberMe',
    presets: [FormCheckboxPreset, translateLabel('rememberMe')],
    props: { dense: 'true', color: 'primary' },
    defaultValue: false,
  },
];

class SubContent08 extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      value: {},
    };
  }

  handleChange = (value, rawArgs, link, values) => {
    /* another work-around for the cursor issue */
    // this.setState({
    //   value: { ...values },
    // });
  }

  handleChanges = (changes, linker, values) => {
    /* another work-around for the cursor issue */
    // if (changes.length < 2) {
    //   // already handled by this.handleChange
    //   return;
    // }
    this.setState({
      value: { ...values },
    });
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <Paper className={classes.root}>
        <JsonFormLayout
          Linker={JsonFormLinker}
          linkerOptions={{
            // cursor jumps to end of controlled input in the async mode
            // this is a work-around for that issue
            applyChangesSync: true,
          }}
          value={value}
          onChange={this.handleChange}
          onChanges={this.handleChanges}
          onDidMount={(linker) => {
            // console.log('this.editingParams :', this.editingParams);
            if (!('password' in value)) {
              linker.changeValues({
                password: 'password',
                passwordVisibility: true,
              });
            }
          }}
          rsBeforeRender={(rs) => {
            // console.log('RenderSession.beforeRender()');
            Object.values(rs.linker.getFields())
            .filter(f => f.dirty)
            .forEach((f) => {
              // console.log('f :', f);
            });
            rs.calculated = {
              ...rs.calculated,
              username: `${rs.linker.getValue('username')}pp`,
            };
            rs.linker.resetDirtyFlags();
          }}
          rsAfterRender={(rs) => {
            // console.log('RenderSession.afterRender()');
          }}
          namespace="form1"
          fields={fileds}
          styleNs={['login']}
          i18nNs={['app-common']}
          // onChange={(...agrs) => { console.log('agrs :', agrs); }}
          // onSubmit={(value) => { console.log('value :', value); }}
          submitButtonText="登入"
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(SubContent08);
