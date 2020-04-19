import * as actionTypes from '../action/type';
import { getMyProfile } from '../../api/user';

export const ensureLogin = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch({
        type: actionTypes.LOGIN_START,
      });

      dispatch({
        type: actionTypes.RESET_ENTITIES,
      });

      dispatch({
        type: actionTypes.RESET_PAGINATION,
      });

      // getMyProfile will throw an exception if response is not ok
      const user = await getMyProfile(token);

      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: { user },
      });
    } else {
      dispatch({
        type: actionTypes.LOGIN_FAIL,
      });
    }
  } catch (e) {
    console.error(e);
    localStorage.removeItem('token');
    dispatch({
      type: actionTypes.LOGIN_FAIL,
    });
  }
};

export const loginUser = (user, token) => (dispatch) => {
  localStorage.setItem('token', token);

  dispatch({
    type: actionTypes.RESET_ENTITIES,
  });

  dispatch({
    type: actionTypes.RESET_PAGINATION,
  });

  dispatch({
    type: actionTypes.LOGIN_SUCCESS,
    payload: {
      user,
    },
  });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');

  dispatch({
    type: actionTypes.LOGOUT,
  });

  dispatch({
    type: actionTypes.RESET_ENTITIES,
  });

  dispatch({
    type: actionTypes.RESET_PAGINATION,
  });
};
