import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import BreakAllContentText from '~/components/Text/BreakAllContentText';
import ResultDetailDialog from './ResultDetailDialog';

const styles = theme => ({
  root: {
    // width: '90%',
  },
  space: {
    width: 1,
    height: 8,
  },
  stepperRoot: {
    // [theme.breakpoints.down('sm')]: {
    padding: 8,
    // },
  },
  stepperContent: {
    // [theme.breakpoints.down('sm')]: {
    paddingLeft: 12,
    // },
  },
  listItem: {
    // [theme.breakpoints.down('sm')]: {
    paddingLeft: 8,
    paddingRight: 8,
    // },
  },
  button: {
    marginRight: theme.spacing(1),
  },
  textAlignLeft: {
    textAlign: 'left',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  success: {
    color: theme.status.success.main,
  },
  warning: {
    color: theme.status.warning.main,
  },
  danger: {
    color: theme.status.danger.main,
  },
  disabled: {
    color: theme.palette.action.disabled,
  },
});

const stateToClassName = {
  pending: 'disabled',
  running: 'warning',
  succeeded: 'success',
  failed: 'danger',
  skipped: 'disabled',
  cancelled: 'disabled',
};

class ScheduleStepper extends React.PureComponent {
  state = {
    activeStep: 0,
    skipped: new Set(),
    selectedResult: null,
  };

  getLabelProps(task) {
    const { classes } = this.props;
    const { state } = task;

    const className = stateToClassName[state];

    const buttonProps = {};
    const labelProps = {};
    if (state) {
      labelProps.error = (state === 'failed');
      buttonProps.optional = (
        <Typography
          variant="caption"
          classes={{
            caption: classes[className],
          }}
          className={classes.textAlignLeft}
        >
          {state}
        </Typography>
      );
    }
    return {
      labelProps,
      buttonProps,
    };
  }

  closeDialog = () => {
    this.setState({
      selectedResult: null,
    });
  }

  showResultDetail = result => () => {
    this.setState({
      selectedResult: result,
    });
  }

  handleNext = () => {
    const { activeStep } = this.state;
    let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped,
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  handleJump = index => () => {
    this.setState({
      activeStep: index,
    });
  };

  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }

  render() {
    const { classes, schedule } = this.props;
    const { steps } = schedule;
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper
          nonLinear
          classes={{
            root: classes.stepperRoot,
          }}
          activeStep={activeStep}
          orientation="vertical"
        >
          {steps.map((task, index) => {
            const {
              title,
              content,
              completed,
              result,
              error,
            } = task;
            const props = {};
            const {
              labelProps,
              buttonProps,
            } = this.getLabelProps(task);
            props.completed = completed;

            return (
              <Step key={title} {...props}>
                <StepButton
                  onClick={this.handleJump(index)}
                  {...buttonProps}
                >
                  <StepLabel {...labelProps}>
                    {title}
                  </StepLabel>
                </StepButton>
                <StepContent
                  className={classes.stepperContent}
                >
                  <List dense>
                    <ListItem
                      className={classes.listItem}
                    >
                      <ListItemText
                        disableTypography
                        primary={(
                          <Typography
                            variant="subtitle1"
                          >
                            Description
                          </Typography>
                        )}
                        secondary={(
                          <Typography
                            variant="body1"
                            color="textSecondary"
                            component={BreakAllContentText}
                          >
                            {content}
                          </Typography>
                        )}
                      />
                    </ListItem>
                    {result && result.message
                      && (
                        <React.Fragment>
                          <Divider />
                          <ListItem
                            className={classes.listItem}
                            button
                            onClick={this.showResultDetail(result)}
                          >
                            <ListItemText
                              disableTypography
                              primary={(
                                <Typography
                                  variant="subtitle1"
                                  classes={{
                                    subtitle1: classes.success,
                                  }}
                                >
                                  Result
                                </Typography>
                              )}
                              secondary={(
                                <Typography
                                  variant="body1"
                                  color="textSecondary"
                                  component={BreakAllContentText}
                                >
                                  {result.message}
                                </Typography>
                              )}
                            />
                          </ListItem>
                        </React.Fragment>
                      )
                    }
                    {error && error.message
                      && (
                        <React.Fragment>
                          <Divider />
                          <ListItem
                            className={classes.listItem}
                            button
                            onClick={this.showResultDetail(error)}
                          >
                            <ListItemText
                              disableTypography
                              primary={(
                                <Typography
                                  variant="subtitle1"
                                  classes={{
                                    subtitle1: classes.danger,
                                  }}
                                >
                                  Error
                                </Typography>
                              )}
                              secondary={(
                                <Typography
                                  variant="body1"
                                  color="textSecondary"
                                  component={BreakAllContentText}
                                >
                                  {error.message}
                                </Typography>
                              )}
                            />
                          </ListItem>
                        </React.Fragment>
                      )
                    }
                  </List>
                  {/* <Divider />
                  <div className={classes.space} />
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={activeStep === steps.length - 1}
                        onClick={this.handleNext}
                        className={classes.button}
                      >
                        Next
                      </Button>
                    </div>
                  </div> */}
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        <div className={classes.space} />
        <div>
          <Button
            disabled={activeStep === 0}
            onClick={this.handleBack}
            className={classes.button}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={activeStep === steps.length - 1}
            onClick={this.handleNext}
            className={classes.button}
          >
            Next
          </Button>
        </div>
        <ResultDetailDialog
          result={this.state.selectedResult}
          open={!!this.state.selectedResult}
          onClose={this.closeDialog}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ScheduleStepper);
