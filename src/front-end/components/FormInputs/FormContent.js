import React from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  content: {
    margin: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 12,
      marginRight: theme.spacing.unit * 12,
    },
  },
});

const FormContent = props => (
  <div className={props.classes.content}>
    {props.children}
  </div>
);

export default compose(
  withStyles(styles),
)(FormContent);
