import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';

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
import Followers from './page/Followers';
import Followings from './page/Followings';
import ForgotPassword from './page/ForgotPassword';
import MobileUserSearch from './page/MobileUserSearch';
import ResetPassword from './page/ResetPassword';
import EditProfile from './page/EditProfile';
import ChangePassword from './page/ChangePassword';

import UnauthenticatedAccessibleRoute from './hoc/UnauthenticatedAccessibleRoute';
import AuthenticatedAccessibleRoute from './hoc/AuthenticatedAccessibleRoute';

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

          <AuthenticatedAccessibleRoute exact path="/post">
            <CreatePost />
          </AuthenticatedAccessibleRoute>
          <Route exact path="/mobile-search">
            <MobileUserSearch />
          </Route>

          <AuthenticatedAccessibleRoute exact path="/account/edit">
            <EditProfile />
          </AuthenticatedAccessibleRoute>
          <AuthenticatedAccessibleRoute exact path="/account/change-password">
            <ChangePassword />
          </AuthenticatedAccessibleRoute>

          <UnauthenticatedAccessibleRoute exact path="/forgot-password">
            <ForgotPassword />
          </UnauthenticatedAccessibleRoute>
          <UnauthenticatedAccessibleRoute path="/reset-password/:userId">
            <ResetPassword />
          </UnauthenticatedAccessibleRoute>

          <Route exact path="/@:username">
            <Profile />
          </Route>

          <Route exact path="/@:username/followers">
            <Followers />
          </Route>

          <Route exact path="/@:username/following">
            <Followings />
          </Route>

          <Route exact path="/p/:photoId/">
            <Post />
          </Route>

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
            <Route exact path="/@:username/followers">
              <Modal title="Followers">
                <Followers insideModal />
              </Modal>
            </Route>

            <Route exact path="/@:username/following">
              <Modal title="Followings">
                <Followings insideModal />
              </Modal>
            </Route>
          </>
        ) : null}
      </Layout>
    </>
  );
}

export default App;
