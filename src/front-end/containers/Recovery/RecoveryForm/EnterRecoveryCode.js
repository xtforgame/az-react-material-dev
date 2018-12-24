/* eslint-disable react/prop-types, react/forbid-prop-types, jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
} from '~/components/FormInputs';

import InputLinker from '~/utils/InputLinker';
import createRecoveryCodeInputConfigs from '~/containers/LoginForms/createRecoveryCodeInputConfigs';

const styles = theme => ({
  flexContainer: {
    display: 'flex',
  },
  flex1: {
    flex: 1,
  },
  actionBtn: {
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

  constructor(props) {
    super(props);
    this.il = new InputLinker(this, {
      namespace: 'forgot-password',
    });
    this.il.add(
      createRecoveryCodeInputConfigs()
    );

    this.state = this.il.mergeInitState({});
  }

  challengeRecoveryToken = () => {
    const { recoveringUsername } = this.props;

    const { recoveryCode } = this.il.getOutputs();

    if (this.il.validate()) {
      this.props.onChallenge({
        username: recoveringUsername,
        code: recoveryCode,
      });
    }
  }

  render() {
    const {
      intl,
      classes,
      onResend,
    } = this.props;

    const { recoveryCode } = this.il.getOutputs();

    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
      'username',
      'sendCode',
      'resendCode',
      'enterCode',
    ]);

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
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
          <FormSpace variant="content8" />
          {this.il.renderComponent('recoveryCode', { translate })}
          <FormSpace variant="content2" />
          <div className={classes.flexContainer}>
            {onResend && (
              <Button
                color="default"
                className={classes.actionBtn}
                onClick={onResend}
              >
                {translated.resendCode}
              </Button>
            )}
            <div className={classes.flex1} />
            <Button
              variant="contained"
              color="primary"
              disabled={!recoveryCode || recoveryCode.length !== 6}
              className={classes.actionBtn}
              onClick={this.challengeRecoveryToken}
            >
              {translated.enterCode}
            </Button>
          </div>
          <FormSpace variant="content1" />
        </FormContent>
      </div>
    );
  }
}


export default compose(
  injectIntl,
  withStyles(styles),
)(EnterRecoveryCode);
