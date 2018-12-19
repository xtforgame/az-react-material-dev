/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import { compose } from 'recompose';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
});

const FormCheckbox = (props) => {
  const {
    classes,
    label,
    checked = false,
    ...rest
  } = props;

  return (
    <FormControlLabel
      control={(
        <Checkbox
          checked={checked}
          {...{ disableRipple: false }}
          {...rest}
        />
      )}
      label={label}
    />
  );
};

FormCheckbox.propTypes = {
};

export default compose(
  withStyles(styles),
)(FormCheckbox);
