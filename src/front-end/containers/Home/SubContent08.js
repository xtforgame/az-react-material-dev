import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import createCommonStyles from '~/styles/common';
import JsonFormLayout, { JsonFormLinker } from '~/components/JsonFormLayout';

import {
// FormSpace,
// FormContent,
// FormPasswordInput,
} from '~/components/FormInputs';

// import InputLinker from '~/utils/InputLinker';
import {
// FormTextFieldPreset,
// FormPasswordVisibilityPreset,
// FormCheckboxPreset,
// assert,
// translateLabel,
} from '~/utils/InputLinker/helpers';


const styles = theme => ({
  ...createCommonStyles(theme, ['flex', 'appBar']),
  root: {
    width: '100%',
    overflowX: 'auto',
  },
});

const jsonFormData = {
  namespace: 'form1',
  preRender: (rs, {
    $dirtyMap,
    $inputChanged,
  }) => {
    const username = rs.linker.getValue('username');
    if (rs.prevRenderSession && !$inputChanged) {
      return (rs.calculated = rs.calculated || rs.prevRenderSession.calculated); // eslint-disable-line no-param-reassign
    }

    console.log('rs.calculated');

    return (rs.calculated = { // eslint-disable-line no-param-reassign
      ...rs.calculated,
      usernameX: username && `${rs.linker.getValue('username')}pp`,
    });
  },
  fileds: [
    {
      name: 'username',
      presets: [
        'text',
        ['translateProp', 'label', 'username'],
        ['translateProp', 'placeholder', 'usernameEmptyError', {
          emailAddress: '$t(emailAddress)',
          phoneNumber: '$t(phoneNumber)',
        }],
      ],
    },
    {
      name: 'usernameX',
      presets: ['autoCalculableText', ['translateProp', 'label', 'rememberMe']],
    },
    {
      name: 'password',
      presets: ['password', ['translateProp', 'label', 'password']],
      extraOptions: { space: <div /> },
    },
    {
      name: 'rememberMe',
      presets: ['checkbox', ['translateProp', 'label', 'rememberMe']],
      defaultValue: false,
    },
  ],
};

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
            presets: {},
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
            let $inputChanged = false;
            const $dirtyMap = {};
            Object.values(rs.linker.getFields())
            .filter(f => f.dirty && !f.name.startsWith('~'))
            .forEach((f) => {
              $dirtyMap[f.name] = true;
              $inputChanged = true;
            });

            jsonFormData.preRender(rs, {
              $dirtyMap,
              $inputChanged,
            });

            rs.linker.resetDirtyFlags();
          }}
          rsAfterRender={(rs) => {
            // console.log('rs :', rs);
            // console.log('RenderSession.afterRender()');
          }}
          namespace={jsonFormData.namespace}
          fields={jsonFormData.fileds}
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
