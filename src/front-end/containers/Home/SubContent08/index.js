/* eslint-disable no-param-reassign */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import createCommonStyles from '~/styles/common';
import JsonFormLayout, { JsonFormLinker } from '~/components/JsonFormLayout';

import jsonConfig from './jsonConfig';

const styles = theme => ({
  ...createCommonStyles(theme, ['flex', 'appBar']),
  root: {
    width: '100%',
    overflowX: 'auto',
  },
});

class SubContent08 extends React.PureComponent {
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
          jsonConfig={jsonConfig}
          Linker={JsonFormLinker}
          linkerOptions={{
            presets: {},
          }}
          value={value}
          onChange={this.handleChange}
          onChanges={this.handleChanges}
          onDidMount={(linker) => {
            // console.log('this.editingParams :', this.editingParams);
            if (!('password' in linker.host.props.value)) {
              linker.changeValues({
                password: 'password',
                passwordVisibility: true,
              });
            }
          }}
          styleNs={['login']}
          i18nNs={['app-common']}
          onSubmit={(outputs, { resetIl }) => {
            resetIl();
            console.warn('outputs :', outputs);
          }}
          submitButtonText="登入"
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(SubContent08);
