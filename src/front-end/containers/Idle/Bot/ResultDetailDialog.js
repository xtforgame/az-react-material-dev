import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import BreakAllCodeBlock from '~/components/Text/BreakAllCodeBlock';
import createCommonStyles from '~/styles/common';
import SimpleFullScreenDialog from '~/components/Dialogs/SimpleFullScreenDialog';

const styles = theme => ({
  ...createCommonStyles(theme, ['flex']),
  paperRoot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowX: 'hidden',
    flex: 1,
  },
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    background: theme.palette.background.default,
    padding: 8,
  },
});

class ResultDetailDialog extends React.PureComponent {
  render() {
    const {
      classes,
      open,
      onClose,
      result,
    } = this.props;

    return (
      <SimpleFullScreenDialog
        title="Detail"
        open={open}
        onClose={onClose}
      >
        <div className={classes.root}>
          <Paper className={classes.paperRoot} elevation={1}>
            <Typography component={BreakAllCodeBlock} variant="body1" className={classes.flex1}>
              {JSON.stringify(result, null, 2)}
            </Typography>
          </Paper>
        </div>
      </SimpleFullScreenDialog>
    );
  }
}


export default withStyles(styles)(ResultDetailDialog);
