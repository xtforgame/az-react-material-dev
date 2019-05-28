import React from 'react';
import keycode from 'keycode';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
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
});

/**
 * Material design search bar
 * @see [Search patterns](https://material.io/guidelines/patterns/search.html)
 */
class SearchInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      active: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ ...this.state, value: nextProps.value });
    }
  }

  handleInput = (e) => {
    this.setState({ value: e.target.value });
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  }

  handleCancel = () => {
    this.setState({ active: false, value: '' });
    if (this.props.onChange) {
      this.props.onChange('');
    }
  }

  handleKeyDown = (event) => {
    if (keycode(event) === 'enter') {
      this.props.onRequestSearch(this.state.value);
    }
  }

  render() {
    const { value } = this.state;
    const {
      disabled,
      onRequestSearch,
      classes,
      ...inputProps
    } = this.props;

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
            onChange={this.handleInput}
            onKeyDown={this.handleKeyDown}
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
            onClick={this.handleCancel}
            className={classes.iconButton}
            style={styles.iconButtonClose}
            disabled={disabled}
          >
            <ClearIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SearchInput);
