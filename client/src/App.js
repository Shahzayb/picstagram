import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './component/Layout';
import Navbar from './component/Navbar';
import Modal from './component/Modal';

import Home from './page/Home';
import Login from './page/Login';
import Register from './page/Register';
import Profile from './page/Profile';
import Post from './page/Post';

import withStartupLogin from './hoc/withStartupLogin';
import UnauthenticatedAccessibleRoute from './hoc/UnauthenticatedAccessibleRoute';
import AuthenticatedAccessibleRoute from './hoc/AuthenticatedAccessibleRoute';

import { isSmallScreen } from './util/screen';

import { ensureLogin } from './redux/action/auth';

function App() {
  let location = useLocation();

  // location of background screen
  let background = location.state && location.state.background;

  // check if background screen path and foreground screen (modal) path are different
  let differentPaths = background && background.pathname !== location.pathname;

  // only show screen inside modal if window width is not small
  let insideModal = differentPaths && background && !isSmallScreen();

  console.log('background', background);
  console.log('location', location);
  console.log('insideModal', insideModal);
  console.log('differentPaths', differentPaths);

  return (
    <>
      <Navbar />
      <Layout>
        <Switch location={(insideModal && background) || location}>
          <AuthenticatedAccessibleRoute exact path="/">
            <Home />
          </AuthenticatedAccessibleRoute>
          <UnauthenticatedAccessibleRoute path="/login">
            <Login />
          </UnauthenticatedAccessibleRoute>

          <UnauthenticatedAccessibleRoute path="/register">
            <Register />
          </UnauthenticatedAccessibleRoute>
          <Route path="/photo/:photoId">
            <div>photo</div>
          </Route>
          <AuthenticatedAccessibleRoute path="/post">
            <Post />
          </AuthenticatedAccessibleRoute>
          <Route path="/search/:term">
            <div>search result</div>
          </Route>
          <AuthenticatedAccessibleRoute path="/account/edit">
            <div>edit account</div>
          </AuthenticatedAccessibleRoute>
          <AuthenticatedAccessibleRoute path="/account/change-password">
            <div>change password</div>
          </AuthenticatedAccessibleRoute>
          <Route exact path="/:username" component={Profile} />
        </Switch>
        {insideModal ? (
          <AuthenticatedAccessibleRoute path="/post">
            <Modal title="Make a post">
              <Post insideModal />
            </Modal>
          </AuthenticatedAccessibleRoute>
        ) : null}
      </Layout>
    </>
  );
}

const AppWithStartupLogin = withStartupLogin(App);

const mapState = (state) => ({ loading: state.auth.loading });

const mapDispatch = { ensureLogin };

export default connect(mapState, mapDispatch)(AppWithStartupLogin);
