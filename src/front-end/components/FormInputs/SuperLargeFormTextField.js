/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import withOnPressEnterEvent from './withOnPressEnterEvent';

const paddingSize = 20;

const styles = theme => ({
  inputStyle: {
    paddingTop: paddingSize,
    paddingBottom: paddingSize,
    fontSize: 50,
  },
  /* Styles applied to the root element if `margin="dense"`. */
  marginDenseLabelStyle: {
    // Compensation for the `Input.inputDense` style.
    transform: 'translate(0, 21px) scale(1)',
  },
  /* Styles applied to the `input` element if `shrink={true}`. */
  shrinkLabelStyle: {
    transform: 'translate(0, 1.5px) scale(0.75)',
    transformOrigin: 'top left',
  },
  outlinedLabelStyle: {
    fontSize: 50,
    transform: `translate(14px, ${24 + paddingSize + 17}px) scale(1)`,
    '&$marginDenseLabelStyle': {
      transform: `translate(14px, ${17 + paddingSize + 17}px) scale(1)`,
    },
    '&$shrinkLabelStyle': {
      transform: `translate(14px, ${-6 + 6}px) scale(0.75)`,
    },
  },
});

const LargeFormTextField = ({
  classes: {
    inputStyle,
    outlinedLabelStyle,
    marginDenseLabelStyle,
    shrinkLabelStyle,
    ...classes
  },
  InputProps,
  InputLabelProps,
  ...props
}) => (
  <TextField
    variant="outlined"
    className={inputStyle}
    InputProps={{
      ...InputProps,
      classes: {
        root: inputStyle,
      },
    }}
    InputLabelProps={{
      ...InputLabelProps,
      classes: {
        marginDense: marginDenseLabelStyle,
        shrink: shrinkLabelStyle,
        outlined: outlinedLabelStyle,
      },
    }}
    classes={classes}
    {...props}
  />
);

export default withOnPressEnterEvent(withStyles(styles)(LargeFormTextField));
