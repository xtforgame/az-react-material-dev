/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import FormTextField from './FormTextField';

const styles = theme => ({
});

const FormPasswordInput = (props) => {
  const {
    id,
    type = 'password',
    onShowPassswordClick,
    ...rest
  } = props;
  const endAdornment = (
    <InputAdornment position="end">
      <IconButton
        tabIndex="-1"
        onClick={onShowPassswordClick}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
      >
        {type !== 'password' ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );
  return (
    <FormTextField
      id={id}
      type={type}
      InputProps={{
        endAdornment,
      }}
      {...rest}
    />
  );
};

FormPasswordInput.propTypes = {
  id: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
)(FormPasswordInput);
