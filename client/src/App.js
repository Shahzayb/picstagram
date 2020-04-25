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
import CreatePost from './page/CreatePost';
import Post from './page/Post';
import Comments from './page/Comments';

import withStartupLogin from './hoc/withStartupLogin';
import UnauthenticatedAccessibleRoute from './hoc/UnauthenticatedAccessibleRoute';
import AuthenticatedAccessibleRoute from './hoc/AuthenticatedAccessibleRoute';

import { ensureLogin } from './redux/action/auth';

function App() {
  let location = useLocation();

  // location of background screen
  let background = location.state && location.state.background;

  // check if background screen path and foreground screen (modal) path are different
  let differentPaths = background && background.pathname !== location.pathname;

  background = differentPaths && background;

  return (
    <>
      <Navbar />
      <Layout>
        <Switch location={background || location}>
          <AuthenticatedAccessibleRoute exact path="/">
            <Home />
          </AuthenticatedAccessibleRoute>
          <UnauthenticatedAccessibleRoute exact path="/login">
            <Login />
          </UnauthenticatedAccessibleRoute>

          <UnauthenticatedAccessibleRoute exact path="/register">
            <Register />
          </UnauthenticatedAccessibleRoute>
          <Route exact path="/photo/:photoId">
            <div>photo</div>
          </Route>
          <AuthenticatedAccessibleRoute exact path="/post">
            <CreatePost />
          </AuthenticatedAccessibleRoute>
          <Route exact path="/search/:term">
            <div>search result</div>
          </Route>
          <AuthenticatedAccessibleRoute exact path="/account/edit">
            <div>edit account</div>
          </AuthenticatedAccessibleRoute>
          <AuthenticatedAccessibleRoute exact path="/account/change-password">
            <div>change password</div>
          </AuthenticatedAccessibleRoute>
          <Route path="/@:username" component={Profile} />

          <Route exact path="/p/:photoId/" component={Post} />
          <Route exact path="/p/:photoId/comments">
            <Comments />
          </Route>
        </Switch>
        {!!background ? (
          <>
            <AuthenticatedAccessibleRoute exact path="/post">
              <Modal title="Make a post">
                <CreatePost insideModal />
              </Modal>
            </AuthenticatedAccessibleRoute>
            <Route exact path="/p/:photoId/comments">
              <Modal title="Comments">
                <Comments insideModal />
              </Modal>
            </Route>
          </>
        ) : null}
      </Layout>
    </>
  );
}

const AppWithStartupLogin = withStartupLogin(App);

const mapState = (state) => ({ loading: state.auth.loading });

const mapDispatch = { ensureLogin };

export default connect(mapState, mapDispatch)(AppWithStartupLogin);
