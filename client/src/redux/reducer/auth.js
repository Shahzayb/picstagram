import * as actionTypes from '../action/type';

const initialState = {
  user: null,
  loading: true,
  isLoggedIn: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return {
        ...state,
        isLoggedIn: false,
        loading: true
      };

    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
        loading: false
      };
    case actionTypes.LOGIN_FAIL:
    case actionTypes.LOGOUT:
      return { ...initialState, loading: false };
    default:
      return state;
  }
};
