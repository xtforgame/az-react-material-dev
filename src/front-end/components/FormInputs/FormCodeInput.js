/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormTextField from './FormTextField';

const styles = theme => ({
});

const FormCodeInput = (props) => {
  const {
    id,
    type = 'text',
    onShowPassswordClick,
    ...rest
  } = props;
  const startAdornment = (
    <InputAdornment position="start">
      VXL-
    </InputAdornment>
  );
  return (
    <FormTextField
      id={id}
      type={type}
      startAdornment={startAdornment}
      {...rest}
    />
  );
};

FormCodeInput.propTypes = {
  id: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
)(FormCodeInput);
