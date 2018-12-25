/* eslint-disable react/prop-types, react/forbid-prop-types, jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';
import FormBaseType001 from '~/containers/LoginForms/FormBaseType001';
import createEnterRecoveryCodeInputConfigs from '~/containers/LoginForms/createEnterRecoveryCodeInputConfigs';

const styles = theme => ({
  flexContainer: {
    display: 'flex',
  },
  flex1: {
    flex: 1,
  },
  link: {
    cursor: 'text',
    color: theme.palette.secondary.main,
    textDecoration: 'none',
  },
  textContainer: {
    cursor: 'text',
    wordWrap: 'break-word',
  },
});

class EnterRecoveryCode extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onChallenge: PropTypes.func.isRequired,
    onResend: PropTypes.func,
    recoveringUsername: PropTypes.string,
    recoveryCodeError: PropTypes.any,
  };

  challengeRecoveryToken = ({ recoveryCode }) => {
    const { recoveringUsername } = this.props;
    this.props.onChallenge({
      username: recoveringUsername,
      code: recoveryCode,
    });
  }

  render() {
    const { intl, classes, onResend } = this.props;

    const translated = translateMessages(intl, messages, [
      'username',
      'sendCode',
      'resendCode',
      'enterCode',
    ]);

    const label = (
      <FormattedMessage
        {...messages.enterRecoveryCodeFor}
        values={{
          accountName: (
            <a key="accountName" className={classes.link}>
              {this.props.recoveringUsername}
            </a>
          ),
        }}
      >
        {(...parts) => (
          <Typography
            variant="body1"
            className={classes.textContainer}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            {parts}
          </Typography>
        )}
      </FormattedMessage>
    );

    return (
      <FormBaseType001
        namespace="enter-recovery-code"
        displayLabel={label}
        resendText={translated.resendCode}
        enterCodeText={translated.enterCode}
        onResend={onResend}
        i18nMessages={messages}
        onSubmit={this.challengeRecoveryToken}
        fields={createEnterRecoveryCodeInputConfigs(classes)}
      />
    );
  }
}


export default compose(
  injectIntl,
  withStyles(styles),
)(EnterRecoveryCode);
