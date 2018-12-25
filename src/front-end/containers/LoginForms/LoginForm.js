import React from 'react';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import { BottonPreset } from '~/utils/InputLinker/helpers';

import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
} from '~/components/FormInputs';
import FormBaseType001 from '~/containers/LoginForms/FormBaseType001';

import createFormPaperStyle from '~/styles/FormPaper';

const styles = theme => ({
  ...createFormPaperStyle(theme),
});

class LoginForm extends React.PureComponent {
  render() {
    const {
      intl,
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
          {
            presets: [BottonPreset],
            getProps: (props, { link: { owner, ownerProps } }) => ({
              variant: 'contained',
              fullWidth: true,
              color: 'primary',
              className: ownerProps.classes.loginBtn,
              onClick: owner.handleSubmit,
              children: translated.login,
            }),
            options: { space: <FormSpace variant="content1" /> },
          },
        ]}
      />
    );
  }
}

export default compose(
  injectIntl,
  withStyles(styles),
)(LoginForm);
