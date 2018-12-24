/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import withOnPressEnterEvent from './withOnPressEnterEvent';

const styles = theme => ({
});

const FormTextField = (props) => {
  const {
    id,
    label,
    helperText,
    formProps,
    classes,
    ...rest
  } = props;
  return (
    <FormControl {...formProps}>
      {!!label && (
        <InputLabel htmlFor={id}>
          {label}
        </InputLabel>
      )}
      <Input
        id={id}
        label={label}
        {...rest}
      />
      {!!helperText && (
        <FormHelperText id={`${id}-helper-text`}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

FormTextField.propTypes = {
  id: PropTypes.string.isRequired,
};

export default compose(
  withOnPressEnterEvent,
  withStyles(styles),
)(FormTextField);
