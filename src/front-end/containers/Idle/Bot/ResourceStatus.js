import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import ButtonBase from '@material-ui/core/ButtonBase';

import {
  grey, green, lightBlue, orange, red,
} from '@material-ui/core/colors';
import { fade } from '@material-ui/core/styles/colorManipulator';

import {
  capitalizeFirstLetter,
} from 'common/utils';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import GaugeBar, { getTextStyle } from './GaugeBar';
import {
  makeUserSessionSelector,
} from '~/containers/App/selectors';

import {
  makeUserWsSessionSelector,
  botPastureStatusSelector,
} from '../selectors';

const styles = theme => ({
  infoText: {
    whiteSpace: 'pre',
    display: 'inline-block',
  },
  card: {
    width: '100%',
    display: 'flex',
  },
  status1: {
    margin: 8,
    width: 200,
    flex: 3,
  },
  status2: {
    margin: 8,
    width: 200,
    flex: 1,
    ...getTextStyle(theme.palette.text.primary),
    lineHeight: '15px',
  },
  buttonBase: {
    width: '100%',
    position: 'relative',
    textAlign: 'left',
  },
});

const resourceLists = [
  ['food', 'wood', 'rock', 'metal'],
];

const resourceInfo = {
  food: {
    color: green[700],
  },
  wood: {
    color: lightBlue[700],
  },
  rock: {
    color: orange[700],
  },
  metal: {
    color: red[700],
  },
};

class ResourceLabel extends React.Component {
  render() {
    const {
      value, max, delta, showMax,
    } = this.props;
    if (max <= 0) {
      return null;
    }
    const inc = delta >= 0
      ? (
        <span style={{ whiteSpace: 'pre', color: green[300] }}>
          {`+${delta}`}
        </span>
      )
      : (
        <span style={{ whiteSpace: 'pre', color: red[300] }}>
          {`${delta}`}
        </span>
      );
    return (
      <span style={{ whiteSpace: 'pre' }}>
        {`${value}[`}
        {inc}
        {showMax ? `] / ${max}` : ']'}
      </span>
    );
  }
}

class ResourceStatus extends React.Component { // eslint-disable-line react/no-multi-comp
  constructor(props) {
    super(props);
    this.state = {
      showMax: false,
    };
  }

  toogle = () => {
    this.setState({
      showMax: !this.state.showMax,
    });
  }

  render() {
    const {
      style, classes, botPastureStatus, theme,
    } = this.props;
    const status = botPastureStatus && botPastureStatus.status;
    const resources = (status && status.resources) || {};
    const labelColor = fade(theme.palette.background.paper, 0.7);
    const textColor = theme.palette.text.primary;

    // console.log('resources :', resources);
    return (
      <ButtonBase
        focusRipple
        className={classes.buttonBase}
        style={{
          ...style,
          // width: '30%',
          padding: 0,
        }}
        onClick={this.toogle}
      >
        <Card className={classes.card}>
          <div className={classes.status1}>
            {resourceLists[0].map((resourceName) => {
              const info = resourceInfo[resourceName];
              const value = (resources[resourceName] && resources[resourceName].value) || 0;
              const max = (resources[resourceName] && resources[resourceName].max) || 0;
              const delta = (resources[resourceName] && resources[resourceName].delta) || 0;
              const percent = max ? value / max * 100 : 0;

              return (
                <GaugeBar
                  key={resourceName}
                  title={`${capitalizeFirstLetter(resourceName)} :`}
                  mainLabel={!max ? 'N/A' : ''}
                  textColor={textColor}
                  labelColor={labelColor}
                  segments={[
                    {
                      name: '1',
                      label: <ResourceLabel
                        value={value}
                        max={max}
                        delta={delta}
                        showMax={this.state.showMax}
                      />,
                      percent,
                      color: info.color,
                    },
                    {
                      name: '2', label: '', percent: 100 - percent, color: grey[700],
                    },
                  ]}
                />
              );
            })}
          </div>
          <div className={classes.status2}>
            <span className={classes.infoText}>
              XXX
            </span>
            <br />
            <span className={classes.infoText}>
              XXX
            </span>
            <br />
            <span className={classes.infoText}>
              XXX
            </span>
            <br />
            <span className={classes.infoText}>
              XXX
            </span>
            <br />
          </div>
        </Card>
      </ButtonBase>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  session: makeUserSessionSelector(),
  wsSession: makeUserWsSessionSelector(),
  botPastureStatus: botPastureStatusSelector,
});

export default compose(
  connect(
    mapStateToProps,
    {},
  ),
  withStyles(styles, { withTheme: true }),
)(ResourceStatus);
