import * as actionTypes from '../action/type';
import { pageSize } from '../../config/env';
import { getTimeline } from '../../api/timeline';

export const fetchTimeline = (page) => async (dispatch) => {
  try {
    const photo = await getTimeline(page);
    dispatch({
      type: actionTypes.FETCH_TIMELINE,
      payload: {
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

export const resetTimeline = () => {
  return {
    type: actionTypes.RESET_TIMELINE,
  };
};
