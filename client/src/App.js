import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './component/Layout';
import Navbar from './component/Navbar';

import Home from './page/Home';
import Login from './page/Login';
import Register from './page/Register';
import Profile from './page/Profile';
import Post from './page/Post';

import withStartupLogin from './hoc/withStartupLogin';
import UnauthenticatedAccessibleRoute from './hoc/UnauthenticatedAccessibleRoute';
import AuthenticatedAccessibleRoute from './hoc/AuthenticatedAccessibleRoute';

import { ensureLogin } from './redux/action/auth';

function App() {
  return (
    <>
      <Navbar />
      <Layout>
        <Switch>
          <AuthenticatedAccessibleRoute exact path="/" component={Home} />
          <UnauthenticatedAccessibleRoute path="/login" component={Login} />

          <UnauthenticatedAccessibleRoute
            path="/register"
            component={Register}
          />
          <Route path="/photo/:photoId" component={() => <div>photo</div>} />
          <AuthenticatedAccessibleRoute path="/post" component={Post} />
          <Route
            path="/search/:term"
            component={() => <div>search result</div>}
          />
          <AuthenticatedAccessibleRoute
            path="/account/edit"
            component={() => <div>edit account</div>}
          />
          <AuthenticatedAccessibleRoute
            path="/account/change-password"
            component={() => <div>change password</div>}
          />
          <Route exact path="/:username" component={Profile} />
        </Switch>
      </Layout>
    </>
  );
}

const AppWithStartupLogin = withStartupLogin(App);

const mapState = state => ({ loading: state.auth.loading });

const mapDispatch = { ensureLogin };

export default connect(mapState, mapDispatch)(AppWithStartupLogin);
