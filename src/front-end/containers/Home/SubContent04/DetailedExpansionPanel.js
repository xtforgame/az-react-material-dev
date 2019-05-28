import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  root: {
    width: '100%',
  },
  list: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    // alignItems: 'center',
    flexDirection: 'column',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  healthy: {
    color: theme.status.success.main,
  },
  warning: {
    color: theme.status.warning.main,
  },
  danger: {
    color: theme.status.danger.main,
  },
  unknown: {
    color: theme.palette.action.disabled,
  },
  inactive: {
    color: theme.palette.action.disabled,
  },
});

class DetailedExpansionPanel extends React.PureComponent {
  state = {
    enabled: true,
  };

  handleChecked = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleToggle = () => {
    this.setState({
      enabled: !this.state.enabled,
    });
  };

  render() {
    const {
      title,
      listItems = [],
      classes,
      expanded,
      onChange,
      onDone,
    } = this.props;
    const { enabled } = this.state;
    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded} onChange={onChange}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.column}>
              <Typography className={classes.heading}>
                {title}
              </Typography>
            </div>
            <div className={classes.column}>
              <Typography
                variant="subtitle1"
                className={classes.secondaryHeading}
                color="textSecondary"
                classes={{
                  subtitle1: enabled ? classes.healthy : classes.inactive,
                }}
              >
                {enabled ? 'Enabled' : 'Disabled'}
              </Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <List
              dense
              className={classes.list}
            >
              <ListItem
                button
                onClick={this.handleToggle}
              >
                {/* <ListItemIcon>
                  <CloseIcon />
                </ListItemIcon> */}
                <ListItemText primary="Enabled" secondary={enabled ? 'on' : 'off'} />
                <ListItemSecondaryAction>
                  <Switch
                    onChange={this.handleToggle}
                    checked={enabled}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {listItems}
            </List>
            {/* <div className={classes.column} />
            <div className={classes.column}>
              <Chip label="Barbados" className={classes.chip} onDelete={() => {}} />
            </div>
            <div className={classNames(classes.column, classes.helper)}>
              <Typography variant="caption">
                Select your destination of choice<br />
                <a href="#sub-labels-and-columns" className={classes.link}>
                  Learn more
                </a>
              </Typography>
            </div> */}
          </ExpansionPanelDetails>
          {/* <Divider /> */}
          <ExpansionPanelActions>
            <Button size="small" onClick={onDone}>
              Cancel
            </Button>
            <Button size="small" color="primary" onClick={onDone}>
              Save
            </Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(DetailedExpansionPanel);
