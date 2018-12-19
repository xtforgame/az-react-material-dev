/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import createFormPaperStyle from '~/styles/FormPaper';

const InternalLink = ({ text, classes }) => (
  <a
    role="button"
    tabIndex={-1}
    className={classes.link}
    onClick={(event) => {
      event.stopPropagation();
      event.preventDefault();
    }}
  >
    {text}
  </a>
);

export default compose(
  withStyles(createFormPaperStyle),
)(InternalLink);
