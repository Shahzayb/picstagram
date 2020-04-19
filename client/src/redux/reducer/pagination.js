import * as actionTypes from '../action/type';

const initialPage = { curPage: 0, hasMore: true };

const initialState = {
  timeline: initialPage,
  userPhoto: {
    /**
     * "username": initialPage
     */
  },
  photoComment: {
    /**
     * "photoId": initialPage
     */
  },
  userFollower: {
    /**
     * "username": initialPage
     */
  },
  userFollowing: {
    /**
     * "username": initialPage
     */
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes['UPDATE_TIMELINE_PAGE']: {
      return {
        ...state,
        timeline: { ...action.payload.pagination },
      };
    }
    case actionTypes['UPDATE_USER_PHOTO_PAGE']: {
      return {
        ...state,
        userPhoto: {
          ...state.userPhoto,
          [action.payload.username]: {
            ...action.payload.pagination,
          },
        },
      };
    }
    case actionTypes['UPDATE_PHOTO_COMMENT_PAGE']: {
      return {
        ...state,
        photoComment: {
          ...state.photoComment,
          [action.payload.photoId]: {
            ...action.payload.pagination,
          },
        },
      };
    }
    case actionTypes['UPDATE_USER_FOLLOWING_PAGE']: {
      return {
        ...state,
        userFollowing: {
          ...state.userFollowing,
          [action.payload.username]: {
            ...action.payload.pagination,
          },
        },
      };
    }
    case actionTypes['UPDATE_USER_FOLLOWER_PAGE']: {
      return {
        ...state,
        userFollower: {
          ...state.userFollower,
          [action.payload.username]: {
            ...action.payload.pagination,
          },
        },
      };
    }
    case actionTypes.RESET_PAGINATION: {
      return {
        ...initialState,
      };
    }
    case actionTypes.RESET_TIMELINE_PAGE: {
      return {
        ...state,
        timeline: initialPage,
      };
    }
    default:
      return state;
  }
};
