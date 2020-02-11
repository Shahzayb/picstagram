import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import history from '../lib/history';

const AuthenticatedAccessibleRoute = ({ authenticated, ...props }) => {
  useEffect(() => {
    if (!authenticated) {
      history.push('/login');
    }
  }, [authenticated]);
  return authenticated ? <Route {...props} /> : null;
};

const mapState = state => ({ authenticated: state.auth.isLoggedIn });

export default connect(mapState)(AuthenticatedAccessibleRoute);
