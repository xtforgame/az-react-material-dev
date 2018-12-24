/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormTextField from '../FormTextField';

const WrappedInput = (props) => {
  const {
    label, InputProps = {}, classes, multiline, onKeyDown, ...other
  } = props;
  // console.log('InputProps :', InputProps);
  const { onKeyDown: downshiftOnKeyDown, ...otherInputProps } = InputProps;
  const handleMultilinesKeyDown = (event) => {
    // console.log('keycode(event) :', keycode(event));
    if (
      !multiline
      || ((keycode(event) !== 'enter')
        && (keycode(event) !== 'up')
        && (keycode(event) !== 'down'))
    ) {
      downshiftOnKeyDown(event);
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  return (
    <FormTextField
      id={InputProps.id}
      label={label}
      className={classes.inputRoot}
      multiline={multiline}
      onKeyDown={handleMultilinesKeyDown}
      {...otherInputProps}
      {...other}
    />
  );
};

function SuggestionItem({
  suggestion, index, itemProps, highlightedIndex, selectedItem,
}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}
SuggestionItem.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(suggestions, inputValue) {
  // let count = 0;

  return suggestions.filter((suggestion) => {
    const keep = (!inputValue || suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1);

    if (keep) {
      // count += 1;
    }

    return keep;
  });
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    maxHeight: 320,
    overflowY: 'scroll',
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
});

class FormAutocomplete extends React.PureComponent {
  state = {
    inputValue: '',
  };

  render() {
    const {
      classes,
      id,
      label,
      suggestions,
      value,
      onChange,
      ...rest
    } = this.props;

    return (
      <Downshift
        onStateChange={({ inputValue }) => {
          if (inputValue != null) {
            if (onChange) {
              onChange(inputValue);
            }
            if (inputValue) {
              this.setState({ inputValue });
            }
          }
        }}
        selectedItem={value == null ? this.state.inputValue : value}
      >
        {({
          getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex,
        }) => (
          <div className={classes.container}>
            {<WrappedInput
              label={label}
              classes={classes}
              InputProps={getInputProps({
                // placeholder: 'Search a country (start with a)',
                id,
                // onKeyDown: event => {
                //   if (event.key === 'Enter') {
                //     // Prevent Downshift's default 'Enter' behavior.
                //     event.preventDownshiftDefault = true

                //     // your handler code
                //   }
                // },
              })}
              {...rest}
            />}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {getSuggestions(suggestions, inputValue).map((suggestion, index) => (
                  <SuggestionItem
                    key={suggestion.label}
                    suggestion={suggestion}
                    index={index}
                    itemProps={getItemProps({ item: suggestion.label })}
                    highlightedIndex={highlightedIndex}
                    selectedItem={selectedItem}
                  />
                ))}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

FormAutocomplete.propTypes = {
  id: PropTypes.string.isRequired,
  suggestions: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FormAutocomplete);
