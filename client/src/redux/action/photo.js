import * as actionTypes from '../action/type';
import { pageSize } from '../../config/env';
import { getUserPhoto } from '../../api/user';

import {
  likePhoto as likePhotoApi,
  unlikePhoto as unlikePhotoApi,
  getPhotoById,
} from '../../api/photo';

export const fetchUserPhoto = (username, page, done) => async (dispatch) => {
  try {
    const photos = await getUserPhoto(username, page);
    dispatch({
      type: actionTypes.FETCH_USER_PHOTO,
      payload: {
        username,
        photos,
      },
    });
    dispatch({
      type: actionTypes.UPDATE_USER_PHOTO_PAGE,
      payload: {
        username,
        pagination: {
          curPage: page,
          hasMore: photos.length === pageSize,
        },
      },
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: actionTypes.UPDATE_USER_PHOTO_PAGE,
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

export const fetchPhotoById = (photoId) => async (dispatch) => {
  try {
    const photo = await getPhotoById(photoId);
    dispatch({
      type: actionTypes.FETCH_PHOTO_BY_ID,
      payload: {
        photo,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const unlikePhoto = (photoId, done) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.UNLIKE_USER_PHOTO,
      payload: {
        photoId,
      },
    });

    await unlikePhotoApi(photoId);
    done('', 'Unliked post!');
  } catch (e) {
    console.log(e);

    dispatch({
      type: actionTypes.LIKE_USER_PHOTO,
      payload: {
        photoId,
      },
    });

    done('Failed to unlike post!');
  }
};

export const likePhoto = (photoId, done) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.LIKE_USER_PHOTO,
      payload: {
        photoId,
      },
    });

    await likePhotoApi(photoId);
    done('', 'Liked post!');
  } catch (e) {
    console.log(e);

    dispatch({
      type: actionTypes.UNLIKE_USER_PHOTO,
      payload: {
        photoId,
      },
    });

    done('Failed to like post!');
  }
};
