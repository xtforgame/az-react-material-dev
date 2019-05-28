import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import createCommonStyles from '~/styles/common';

const styles = theme => ({
  ...createCommonStyles(theme, 'flex'),
  maskedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',

    // verticalFlexContainer
    flexDirection: 'column',
    display: 'flex',
    // height: '100%',
  },
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',

    // verticalFlexContainer
    flexDirection: 'column',
    display: 'flex',
    // height: '100%',
  },
  progress: {
    // margin: `0 ${theme.spacing(2}px`,
  },
});

class ProgressWithMask extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      delayTimeout: null,
      show: false,
    };
  }

  componentWillMount() {
    const { delay } = this.props;

    if (delay) {
      const delayTimeout = setTimeout(() => {
        this.setState({
          delayTimeout: null,
          show: true,
        });
      }, delay);
      this.setState({
        delayTimeout,
        show: false,
      });
    } else {
      this.setState({
        delayTimeout: null,
        show: true,
      });
    }
  }

  componentWillUnmount() {
    if (this.state.delayTimeout) {
      clearTimeout(this.state.delayTimeout);
    }
  }

  render() {
    const {
      classes,
      color,
      style,
      zIndex,
      backgroundColor,
      delay,
      ...rest
    } = this.props;
    const { show } = this.state;

    const extraStyle = {};

    if (show) {
      if (zIndex != null) {
        extraStyle.zIndex = zIndex;
      }
      if (backgroundColor != null) {
        extraStyle.backgroundColor = backgroundColor;
      }
    }

    return (
      <div
        className={show ? classes.maskedContainer : classes.container}
        style={{
          ...style,
          ...extraStyle,
        }}
        {...rest}
      >
        <div className={classes.flex1} />
        <div className={classes.flexContainer}>
          <div className={classes.flex1} />
          {show && <CircularProgress className={classes.progress} size={50} color={color || 'primary'} thickness={7} />}
          <div className={classes.flex1} />
        </div>
        <div className={classes.flex1} />
      </div>
    );
  }
}

export default withStyles(styles)(ProgressWithMask);
