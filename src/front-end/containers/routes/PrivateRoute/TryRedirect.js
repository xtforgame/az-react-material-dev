import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import modelMapEx from '~/containers/App/modelMapEx';

/*
  Assuming props containing:
    history
    location
    match
 */
const TryRedirect = (props) => {
  const {
    isAuthenticated,
    component: Component,
    ...rest
  } = props;

  return (
    isAuthenticated ? (
      <Component {...rest} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: rest.location },
      }}
      />
    )
  );
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: modelMapEx.cacher.selectorCreatorSet.session.selectIsAuthenticated(),
});

export default connect(
  mapStateToProps,
  {},
)(TryRedirect);
