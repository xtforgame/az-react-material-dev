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
    presets: ['text', translateLabel('username')],
  },
  {
    name: 'usernameX',
    presets: ['text', translateLabel('rememberMe')],
    mwRender: [
      ({ value, link: { hostProps }, options: { translate, renderSession: rs } }) => {
        const usernameX = rs.calculated && rs.calculated.usernameX;
        return {
          value: usernameX || value,
        };
      },
    ],
  },
  {
    name: 'password',
    presets: ['password', translateLabel('password')],
    extraOptions: { space: <div /> },
  },
  {
    name: 'rememberMe',
    presets: ['checkbox', translateLabel('rememberMe')],
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
            Object.values(rs.linker.getFields())
            .filter(f => f.dirty)
            .forEach((f) => {
              // console.log('f :', f);
            });
            const username = rs.linker.getValue('username');
            rs.calculated = {
              ...rs.calculated,
              usernameX: username && `${rs.linker.getValue('username')}pp`,
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
