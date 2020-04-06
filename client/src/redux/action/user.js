import * as actionTypes from '../action/type';
import { pageSize } from '../../config/env';
import {
  getProfile,
  getUserPhoto,
  getUserFollower,
  getUserFollowing,
  followUser as followUserApi,
  unfollowUser as unfollowUserApi,
} from '../../api/user';

export const fetchUser = (username) => async (dispatch) => {
  try {
    const user = await getProfile(username);
    dispatch({
      type: actionTypes.FETCH_USER,
      payload: {
        username,
        user,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const fetchUserPhoto = (username, page) => async (dispatch) => {
  try {
    const photo = await getUserPhoto(username, page);
    dispatch({
      type: actionTypes.FETCH_USER_PHOTO,
      payload: {
        username,
        photo,
        pagination: {
          curPage: page,
          hasMore: photo.length === pageSize,
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const fetchUserFollowing = (username, page) => async (dispatch) => {
  try {
    const following = await getUserFollowing(username, page);
    dispatch({
      type: actionTypes.FETCH_USER_FOLLOWING,
      payload: {
        username,
        following,
        pagination: {
          curPage: page,
          hasMore: following.length === pageSize,
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const fetchUserFollower = (username, page) => async (dispatch) => {
  try {
    const follower = await getUserFollower(username, page);
    dispatch({
      type: actionTypes.FETCH_USER_FOLLOWER,
      payload: {
        username,
        follower,
        pagination: {
          curPage: page,
          hasMore: follower.length === pageSize,
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const followUser = (username, done) => async (dispatch, getState) => {
  try {
    const follower = getState().auth.user.username;
    await followUserApi(username);
    dispatch({
      type: actionTypes.FOLLOW_USER,
      payload: {
        follower,
        followee: username,
      },
    });
  } catch (e) {
    console.log(e);
  } finally {
    done();
  }
};

export const unfollowUser = (username, done) => async (dispatch, getState) => {
  try {
    const follower = getState().auth.user.username;
    await unfollowUserApi(username);

    dispatch({
      type: actionTypes.UNFOLLOW_USER,
      payload: {
        follower,
        followee: username,
      },
    });
  } catch (e) {
    console.log(e);
  } finally {
    done();
  }
};

export const resetMyProfile = () => (dispatch, getState) => {
  const username = getState().auth.user.username;
  dispatch({
    type: actionTypes.RESET_USER,
    payload: {
      username,
    },
  });
};
