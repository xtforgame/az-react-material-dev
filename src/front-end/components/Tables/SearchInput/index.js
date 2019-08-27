import React, { useState } from 'react';
import keycode from 'keycode';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import useEffectIgnoreFirstRun from '~/hooks/useEffectIgnoreFirstRun';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    height: 48,
    display: 'flex',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    borderRadius: 2,
    background: fade(theme.palette.common.white, 0.15),
  },
  searchContainer: {
    margin: 'auto 16px',
    flex: 1,
  },
  input: {
    width: '100%',
    color: 'inherit',
  },
  iconButton: {
    position: 'absolute',
    transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    '&:disabled': {
      opacity: 0.38,
    },
  },
}));

/**
 * Material design search bar
 * @see [Search patterns](https://material.io/guidelines/patterns/search.html)
 */
const SearchInput = (props) => {
  const {
    disabled,
    onRequestSearch,
    onChange = () => {},
    ...inputProps
  } = props;

  const classes = useStyles();
  const [value, setValue] = useState(props.value);

  useEffectIgnoreFirstRun(() => {
    setValue(value);
  }, [props.value]);

  const handleInput = (e) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  const handleCancel = () => {
    setValue('');
    onChange('');
  };

  const handleKeyDown = (event) => {
    if (keycode(event) === 'enter') {
      onRequestSearch(value);
    }
  };

  const nonEmpty = value && value.length > 0;

  const styles = {
    iconButtonClose: {
      transform: nonEmpty ? 'scale(1, 1)' : 'scale(0, 0)',
    },
    iconButtonSearch: {
      transform: nonEmpty ? 'scale(0, 0)' : 'scale(1, 1)',
    },
  };

  return (
    <div
      className={classes.root}
    >
      <div className={classes.searchContainer}>
        <Input
          {...inputProps}
          className={classes.input}
          value={value || ''}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          fullWidth
          disableUnderline
          disabled={disabled}
        />
      </div>
      <div style={{ position: 'relative', width: 48 }}>
        <IconButton
          color="inherit"
          className={classes.iconButton}
          style={styles.iconButtonSearch}
          disabled={disabled}
        >
          <SearchIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={handleCancel}
          className={classes.iconButton}
          style={styles.iconButtonClose}
          disabled={disabled}
        >
          <ClearIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default (SearchInput);
