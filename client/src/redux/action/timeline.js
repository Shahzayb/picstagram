import * as actionTypes from '../action/type';
import { pageSize } from '../../config/env';
import { getTimeline } from '../../api/timeline';

export const fetchTimeline = (page, done) => async (dispatch, getState) => {
  try {
    const user = getState().auth.user;
    const photos = await getTimeline(page);
    dispatch({
      type: actionTypes.FETCH_TIMELINE,
      payload: {
        user,
        photos,
      },
    });

    dispatch({
      type: actionTypes.UPDATE_TIMELINE_PAGE,
      payload: {
        pagination: {
          curPage: page,
          hasMore: photos.length === pageSize,
        },
      },
    });
  } catch (e) {
    console.log(e);
  } finally {
    done();
  }
};
