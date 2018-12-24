import React from 'react';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
} from '~/components/FormInputs';
import FormBaseType001 from './FormBaseType001';

import createFormPaperStyle from '~/styles/FormPaper';

const styles = theme => ({
  ...createFormPaperStyle(theme),
});

class LoginForm extends React.PureComponent {
  render() {
    const {
      intl,
      classes,
      fields,
      i18nMessages,
    } = this.props;
    const translated = translateMessages(intl, i18nMessages, [
      'login',
    ]);

    return (
      <FormBaseType001
        {...this.props}
        fields={[
          ...fields,
          () => ({
            InputComponent: Button,
            ignoredFromOutputs: true,
            getProps: (props, { link: { owner } }) => ({
              variant: 'contained',
              fullWidth: true,
              color: 'primary',
              className: classes.loginBtn,
              onClick: owner.handleSubmit,
              children: translated.login,
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
)(LoginForm);
