/* eslint-disable react/prop-types, react/forbid-prop-types, no-empty */
import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Email from '@material-ui/icons/Email';

import /* libphonenumber, */ {
  PhoneNumberFormat as PNF,
  PhoneNumberUtil,
} from 'google-libphonenumber';
import { isValidEmail } from 'common/utils/validators';
import FormTextField from '../FormTextField';
import PhoneRegionSelect from './PhoneRegionSelect';
import { getCountryCodeFromBrowser } from './langToCountry';

const country = getCountryCodeFromBrowser();
const phoneUtil = PhoneNumberUtil.getInstance();

export const isValidPhoneNumber = (value) => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(value, country);
    return phoneUtil.isValidNumber(number);
  } catch (error) {}
  return false;
};
export { isValidEmail };


const styles = theme => ({
  adornment: {
    marginRight: 0,
  },
});

class FormPhoneOrEmailInput extends React.Component {
  static rawInputToState(rawInput, enablePhone = true, enableEmail = true) {
    let regionCode = null;
    let value = rawInput;
    let number = null;
    let type;

    if (enablePhone) {
      try {
        number = phoneUtil.parseAndKeepRawInput(rawInput, country);
        // console.log('CountryCode:', number.getCountryCode());
        // console.log('NationalNumber:', number.getNationalNumber());
        // console.log('RegionCodeForNumber:', phoneUtil.getRegionCodeForNumber(number));
        // const formattedPhoneNumber = phoneUtil.format(number, /*PNF.NATIONAL*/ PNF.INTERNATIONAL);
        // console.log(formattedPhoneNumber);
        if (phoneUtil.isValidNumber(number)) {
          type = 'phone-number';
        }
        // e.target.value = formattedPhoneNumber;
        regionCode = phoneUtil.getRegionCodeForNumber(number);
        value = phoneUtil.format(number, PNF.E164);
      } catch (error) {}
    }

    if (enableEmail && isValidEmail(rawInput)) {
      type = 'email-address';
    }

    return {
      rawInput,
      value,
      regionCode,
      type,
    };
  }

  state = {};

  onChange = (e) => {
    const state = FormPhoneOrEmailInput.rawInputToState(e.target.value || '', this.state.enablePhone, this.state.enableEmail);
    if (this.props.onChange) {
      this.props.onChange(state);
    }
    this.setState(state);
  }

  static getDerivedStateFromProps(props, prevState) {
    let newState = null;
    let enablePhone = prevState.enablePhone !== undefined ? prevState.enablePhone : true;
    let enableEmail = prevState.enableEmail !== undefined ? prevState.enableEmail : true;

    if (props.enablePhone !== undefined && (props.enablePhone !== prevState.enablePhone)) {
      newState = newState || {};
      newState.enablePhone = props.enablePhone;
      ({ enablePhone } = newState.enablePhone);
    }

    if (props.enableEmail !== undefined && (props.enableEmail !== prevState.enableEmail)) {
      newState = newState || {};
      newState.enableEmail = props.enableEmail;
      ({ enableEmail } = newState.enableEmail);
    }

    if (props.value) {
      newState = {
        ...(newState || {}),
        ...FormPhoneOrEmailInput.rawInputToState(props.value, enablePhone, enableEmail),
      };
    }

    // No state update necessary
    return newState;
  }

  render() {
    const {
      id,
      classes,
      enablePhone,
      enableEmail,
      ...rest
    } = this.props;

    const {
      regionCode,
    } = this.state;

    const startAdornment = (
      <InputAdornment
        position="start"
        className={classes.adornment}
      >
        {regionCode != null ? <PhoneRegionSelect regionCode={regionCode} />
          : (
            <IconButton
              tabIndex="-1"
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            >
              <Email />
            </IconButton>
          )
        }
      </InputAdornment>
    );
    return (
      <FormTextField
        id={id}
        InputProps={{
          startAdornment,
        }}
        {...rest}
        onChange={this.onChange}
      />
    );
  }
}

FormPhoneOrEmailInput.propTypes = {
  id: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
)(FormPhoneOrEmailInput);
