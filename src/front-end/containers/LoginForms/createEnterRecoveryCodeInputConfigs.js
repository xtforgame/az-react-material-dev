import React from 'react';
import Button from '@material-ui/core/Button';
import {
  FormSpace,
} from '~/components/FormInputs';
import { FragmentPreset } from '~/utils/InputLinker/helpers';
import {
  createRecoveryCodeInput,
} from './inputConfigs';

export default classes => [
  {
    presets: [FragmentPreset],
    getProps: (props, { link: { ownerProps } }) => ({
      children: ownerProps.displayLabel,
    }),
    options: { space: <FormSpace variant="content8" /> },
  },
  createRecoveryCodeInput(),
  {
    InputComponent: FormSpace,
    ignoredFromOutputs: true,
    props: { variant: 'content1' },
  },
  {
    InputComponent: 'div',
    ignoredFromOutputs: true,
    getProps: (props, { link: { owner, ownerProps, linker } }) => {
      const recoveryCode = linker.getOutput('recoveryCode');
      return {
        className: classes.flexContainer,
        children: (
          <React.Fragment>
            {ownerProps.onResend && (
              <Button
                color="default"
                onClick={ownerProps.onResend}
              >
                {ownerProps.resendText}
              </Button>
            )}
            <div className={classes.flex1} />
            <Button
              variant="contained"
              color="primary"
              disabled={!recoveryCode || recoveryCode.length !== 6}
              onClick={owner.handleSubmit}
            >
              {ownerProps.enterCodeText}
            </Button>
          </React.Fragment>
        ),
      };
    },
    options: { space: <FormSpace variant="content1" /> },
  },
];
