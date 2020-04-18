import * as actionTypes from '../action/type';

const initialState = {
  photo: [],
  pagination: { curPage: 0, hasMore: true },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TIMELINE: {
      return {
        photo: [...state.photo, ...action.payload.photo],
        pagination: { ...action.payload.pagination },
      };
    }
    case actionTypes.RESET_TIMELINE: {
      return initialState;
    }
    case actionTypes.LIKE_USER_PHOTO: {
      const photoId = action.payload.photoId;
      const userTimelinePhotos = [...state.photo];
      if (userTimelinePhotos) {
        userTimelinePhotos.forEach((photo, index) => {
          if (photo._id === photoId) {
            userTimelinePhotos[index] = {
              ...photo,
              isLikedByMe: true,
              likeCount: photo.likeCount + 1,
            };
          }
        });
        return {
          ...state,
          photo: userTimelinePhotos,
        };
      }
      return state;
    }
    case actionTypes.UNLIKE_USER_PHOTO: {
      const photoId = action.payload.photoId;
      const userTimelinePhotos = [...state.photo];
      if (userTimelinePhotos) {
        userTimelinePhotos.forEach((photo, index) => {
          if (photo._id === photoId) {
            userTimelinePhotos[index] = {
              ...photo,
              isLikedByMe: false,
              likeCount: photo.likeCount - 1,
            };
          }
        });
        return {
          ...state,
          photo: userTimelinePhotos,
        };
      }
      return state;
    }
    default:
      return state;
  }
};
