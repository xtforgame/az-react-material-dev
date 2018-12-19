/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SimpleExpansionCard from '~/components/Cards/SimpleExpansionCard';
import Avatar from '@material-ui/core/Avatar';
import blue from '@material-ui/core/colors/blue';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import {
  InternalLink as Link,
} from '~/components/FormInputs';
import ScheduleStepper from './ScheduleStepper';

moment.locale('zh-TW');

const styles = theme => ({
  avatar: {
    backgroundColor: blue[500],
  },
  linkBtn: {
    verticalAlign: 'baseline',
  },
});

class ScheduleCard extends React.Component {
  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, schedule } = this.props;

    let time = '<unknown>';
    if (schedule && schedule.nextScheduledTime) {
      time = `於 ${moment(schedule.nextScheduledTime).fromNow()} 執行`;
    }
    let executor = '<unknown>';
    if (schedule && schedule.executor) {
      executor = `${schedule.executor.name}`;
    }

    return (
      <SimpleExpansionCard
        avatar={(
          <Avatar aria-label="Avatar" className={classes.avatar}>
            S
          </Avatar>
        )}
        title={schedule.title}
        subheader={(
          <Typography
            variant="body1"
            component="pre"
            color="textSecondary"
          >
            {`${time} - `}
            <ButtonBase
              className={classes.linkBtn}
            >
              <Typography
                variant="body1"
                component="pre"
                color="textSecondary"
              >
                <Link key="terms" text={`[${executor}]`} />
              </Typography>
            </ButtonBase>
          </Typography>
        )}
      >
        <ScheduleStepper schedule={schedule} />
      </SimpleExpansionCard>
    );
  }
}

export default withStyles(styles)(ScheduleCard);
