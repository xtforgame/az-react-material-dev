/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import withOnPressEnterEvent from './withOnPressEnterEvent';

export default withOnPressEnterEvent(props => (
  <TextField
    variant="outlined"
    {...props}
  />
));
