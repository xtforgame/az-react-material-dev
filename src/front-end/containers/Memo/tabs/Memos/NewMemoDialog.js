import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
// import BreakAllCodeBlock from '~/components/Text/BreakAllCodeBlock';
import Button from '@material-ui/core/Button';
import createCommonStyles from '~/styles/common';
import SimpleFullScreenDialog from '~/components/Dialogs/SimpleFullScreenDialog';
import {
  FormTextField,
} from '~/components/FormInputs';
import modelMap from '~/containers/App/modelMap';

const {
  getMemos,
  postMemos,
} = modelMap.waitableActions;

const styles = theme => ({
  ...createCommonStyles(theme, ['flex']),
  paperRoot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    overflowX: 'hidden',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    background: theme.palette.background.default,
    padding: 8,
  },
  spacing: {
    width: 1,
    height: 16,
  },
});

class NewMemoDialog extends React.Component {
  state = {
    memoText: '',
  }

  render() {
    const {
      classes,
      open,
      onClose,
      postMemos,
      getMemos,
    } = this.props;

    return (
      <SimpleFullScreenDialog
        title="New Memo"
        open={open}
        onClose={onClose}
        headerContent={(
          <Button
            color="inherit"
            onClick={() => {
              postMemos({
                title: 'Backup Check',
                executor: {
                  id: 'backup-bot',
                  name: 'Backup Bot',
                },
                creator: {
                  id: 'backup-bot',
                  name: 'Backup Bot',
                },
                timeTrigger: new Date().getTime(),
                // nextScheduledTime: new Date().getTime(),
                createdTime: new Date().getTime(),
              })
              .then(() => {
                getMemos();
                onClose();
              })
              .catch((e) => {
                console.error('e :', e);
              });
            }}
          >
            save
          </Button>
        )}
      >
        <div className={classes.root}>
          <Paper className={classes.paperRoot} elevation={1}>
            {/* <Typography component={BreakAllCodeBlock} variant="body1" className={classes.flex1}>
              {JSON.stringify(result, null, 2)}
            </Typography> */}
            <FormTextField
              id="article"
              label="Memo..."
              multiline
              fullWidth
              rows={2}
              rowsMax={12}
              value={this.state.memoText || ''}
              onChange={(e) => {
                this.setState({
                  memoText: e.target.value,
                });
              }}
            />
            <div className={classes.spacing} />
            <div className={classes.flex1} />
            <div className={classes.flexContainerFW}>
              <Button
                onClick={() => {
                  onClose();
                }}
              >
                cancel
              </Button>
              <div className={classes.flex1} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  postMemos({
                    title: this.state.memoText || 'Backup Check',
                    executor: {
                      id: 'backup-bot',
                      name: 'Backup Bot',
                    },
                    creator: {
                      id: 'backup-bot',
                      name: 'Backup Bot',
                    },
                    timeTrigger: new Date().getTime(),
                    // nextScheduledTime: new Date().getTime(),
                    createdTime: new Date().getTime(),
                  })
                  .then(() => {
                    getMemos();
                    onClose();
                  })
                  .catch((e) => {
                    console.error('e :', e);
                  });
                }}
              >
                save
              </Button>
            </div>
          </Paper>
        </div>
      </SimpleFullScreenDialog>
    );
  }
}


export default compose(
  connect(
    null,
    {
      getMemos,
      postMemos,
    },
  ),
  withStyles(styles),
)(NewMemoDialog);
