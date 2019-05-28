/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import RefreshIcon from '@material-ui/icons/Refresh';
import LaunchIcon from '@material-ui/icons/Launch';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  card: {
    maxWidth: 350,
    height: 'fit-content',
    margin: theme.spacing(1),
  },
  cardLayout: {
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
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'baseline', // 'center',
    // paddingLeft: theme.spacing(1),
    // paddingBottom: theme.spacing(1),
    padding: 16,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
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
  flex1: {
    flex: 1,
  },
  chip: {
    margin: 2,
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

class ContainerCard extends React.PureComponent {
  static propTypes = {
    status: PropTypes.shape({
      type: PropTypes.oneOf(['healthy', 'warning', 'danger', 'inactive', 'unknown']).isRequired,
      state: PropTypes.string.isRequired,
    }),
  };

  state = { expanded: false };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const {
      classes,
      name,
      status = {
        type: 'unknown',
        state: 'unknown',
      },
      tags = {},
      ports = [],
      image,
    } = this.props;

    const tagList = Object.keys(tags).sort().map(key => ({
      key,
      value: tags[key],
      label: `${key} : ${tags[key]}`,
    }));

    const portList = ports.sort((a, b) => (a.number - b.number)).map(({ type, number }) => `${number} : ${type}`);

    return (
      <Card className={classes.card}>
        <div className={classes.cardLayout}>
          {/* <CardMedia
            className={classes.cover}
            image="http://prospectusghanaltd.com/wp-content/uploads/2016/12/t-shirts-3.jpg"
            title="Live from space album cover"
          /> */}
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography variant="subtitle1">
                {name}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                classes={{
                  subtitle1: classes[status.type],
                }}
              >
                {status.state}
              </Typography>
            </CardContent>
            <Divider />
            {/* <CardContent className={classes.content}>
              <Typography variant="subtitle1">
                tags:
              </Typography>
              <div className={classes.chipContainer} >
                {
                  tagList.map(tag => (
                    <Chip
                      key={tag.key}
                      label={tag.label}
                      className={classes.chip}
                    />
                  ))
                }
              </div>
            </CardContent> */}
            <List>
              <ListItem>
                <ListItemText
                  primary="Image"
                  secondary={image}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  disableTypography
                  primary={(
                    <Typography
                      variant="subtitle1"
                    >
                    Tags
                    </Typography>
                  )}
                  secondary={(
                    <div className={classes.chipContainer}>
                      {
                        tagList.map(tag => (
                          <Chip
                            key={tag.key}
                            label={tag.label}
                            className={classes.chip}
                          />
                        ))
                      }
                    </div>
                  )}
                />
              </ListItem>
            </List>
          </div>
        </div>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Refresh">
            <RefreshIcon />
          </IconButton>
          <IconButton aria-label="Launch">
            <LaunchIcon />
          </IconButton>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <List>
            <ListItem>
              <ListItemText
                disableTypography
                primary={(
                  <Typography
                    variant="subtitle1"
                  >
                  Ports
                  </Typography>
                )}
                secondary={(
                  <div className={classes.chipContainer}>
                    {
                      portList.map(port => (
                        <Chip
                          key={port}
                          label={port}
                          className={classes.chip}
                        />
                      ))
                    }
                  </div>
                )}
              />
            </ListItem>
          </List>
        </Collapse>
      </Card>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ContainerCard);
