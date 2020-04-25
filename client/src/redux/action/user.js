import * as actionTypes from '../action/type';
import { pageSize } from '../../config/env';
import {
  getProfile,
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
        user,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const fetchUserFollowing = (username, page, done) => async (
  dispatch
) => {
  try {
    const following = await getUserFollowing(username, page);
    dispatch({
      type: actionTypes.FETCH_USER_FOLLOWING,
      payload: {
        username,
        following,
      },
    });
    dispatch({
      type: actionTypes.UPDATE_USER_FOLLOWING_PAGE,
      payload: {
        username,
        pagination: {
          curPage: page,
          hasMore: following.length === pageSize,
        },
      },
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: actionTypes.UPDATE_USER_FOLLOWING_PAGE,
      payload: {
        username,
        pagination: {
          curPage: page,
          hasMore: false,
        },
      },
    });
  } finally {
    done();
  }
};

export const fetchUserFollower = (username, page, done) => async (dispatch) => {
  try {
    const followers = await getUserFollower(username, page);

    dispatch({
      type: actionTypes.FETCH_USER_FOLLOWER,
      payload: {
        username,
        followers,
      },
    });
    dispatch({
      type: actionTypes.UPDATE_USER_FOLLOWER_PAGE,
      payload: {
        username,
        pagination: {
          curPage: page,
          hasMore: followers.length === pageSize,
        },
      },
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: actionTypes.UPDATE_USER_FOLLOWER_PAGE,
      payload: {
        username,
        pagination: {
          curPage: page,
          hasMore: false,
        },
      },
    });
  } finally {
    done();
  }
};

export const followUser = (username, done) => async (dispatch, getState) => {
  try {
    const follower = getState().auth.user;
    await followUserApi(username);
    dispatch({
      type: actionTypes.FOLLOW_USER,
      payload: {
        follower,
        followeeUsername: username,
      },
    });
    done(null, 'Successfully followed user');
  } catch (e) {
    console.log(e);
    done('Failed to follow user');
  }
};

export const unfollowUser = (username, done) => async (dispatch, getState) => {
  try {
    const follower = getState().auth.user;
    await unfollowUserApi(username);

    dispatch({
      type: actionTypes.UNFOLLOW_USER,
      payload: {
        follower,
        followeeUsername: username,
      },
    });
    done(null, 'Successfully unfollowed user');
  } catch (e) {
    console.log(e);
    done('Failed to unfollow user');
  }
};
