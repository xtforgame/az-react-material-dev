import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import {
  green, lightBlue, orange, red,
} from '@material-ui/core/colors';
import ButtonBase from '@material-ui/core/ButtonBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import GaugeBar from './GaugeBar';
import droneX from './DroneX.png';

const styles = theme => ({
  flexContaner: {
    display: 'flex',
    flexDirection: 'row',
  },
  card: {
    width: 300,
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    margin: 8,
    width: 64,
    height: 64,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  status: {
    margin: 8,
    width: 200,
    // flex: 1,
  },
  buttonBase: {
    position: 'relative',
    textAlign: 'left',
  },
});

function CharCard(props) {
  const { classes, theme } = props;
  const labelColor = fade(theme.palette.background.paper, 0.7);
  const textColor = theme.palette.text.primary;

  return (
    <ButtonBase
      focusRipple
      className={classes.buttonBase}
      style={{
        // width: '30%',
        padding: 0,
      }}
      onClick={props.onClick}
    >
      <Card className={classes.card}>
        <CardMedia
          className={classes.cover}
          image={droneX}
          title="Live from space album cover"
        />
        <div className={classes.status}>

          <div className={classes.flexContaner}>
            <div style={{
              height: 10,
              width: 10,
              margin: 7,
              // boxSizing: 'border-box',
              borderWidth: 1,
              borderColor: textColor,
              borderStyle: 'solid',
              backgroundColor: green[700],
              borderRadius: '50%',
            }}
            />
            <Typography variant="body1" gutterBottom>
              BPK-01
            </Typography>
          </div>
          <GaugeBar
            textColor={textColor}
            labelColor={labelColor}
            segments={[
              { name: '1', percent: 50, color: green[700] },
              { name: '2', percent: 50, color: green[400] },
            ]}
          />
          <GaugeBar
            textColor={textColor}
            labelColor={labelColor}
            segments={[
              { name: '1', percent: 50, color: lightBlue[700] },
              { name: '2', percent: 30, color: lightBlue[400] },
            ]}
          />
          <GaugeBar
            textColor={textColor}
            labelColor={labelColor}
            segments={[
              { name: '1', percent: 40, color: orange[700] },
              { name: '2', percent: 40, color: orange[400] },
            ]}
          />
          <GaugeBar
            textColor={textColor}
            labelColor={labelColor}
            segments={[
              { name: '1', percent: 30, color: red[700] },
              { name: '2', percent: 30, color: red[400] },
            ]}
          />
        </div>
      </Card>
    </ButtonBase>
  );
}

export default withStyles(styles, { withTheme: true })(CharCard);
