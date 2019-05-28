import React from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  content: {
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(12),
      marginRight: theme.spacing(12),
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
