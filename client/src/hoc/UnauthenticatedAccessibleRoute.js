import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import history from '../lib/history';

// const UnauthAccessibleRoutes = ['/register', '/login'];

const UnauthenticatedAccessibleRoute = ({ authenticated, ...props }) => {
  useEffect(() => {
    if (authenticated) {
      // there's one caveat with this approach:
      /**
       * assume history stack is: /login /register /login /register /login
       * then after user is authenticated, each location have to be poped from stack
       */
      // while (history.length && UnauthAccessibleRoutes.includes(history.location.pathname)) {

      // }
      // console.log(history);
      // if (history.length > 1) {
      //   history.goBack();
      // } else {
      //   history.replace('/');
      // }

      /**
       * lazy solution
       */
      history.replace('/');
    }
  }, [authenticated]);
  return !authenticated ? <Route {...props} /> : null;
};

const mapState = state => ({ authenticated: state.auth.isLoggedIn });

export default connect(mapState)(UnauthenticatedAccessibleRoute);
