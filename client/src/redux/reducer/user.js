import * as actionTypes from '../action/type';

const userSkeleton = {
  user: {},
  photo: {
    data: [],
    pagination: { curPage: 0, hasMore: true },
  },
  following: {
    data: [],
    pagination: { curPage: 0, hasMore: true },
  },
  follower: {
    data: [],
    pagination: { curPage: 0, hasMore: true },
  },
};

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER: {
      const user = state[action.payload.username] || userSkeleton;
      return {
        ...state,
        [action.payload.username]: {
          ...user,
          user: { ...action.payload.user },
        },
      };
    }
    case actionTypes.FETCH_USER_PHOTO: {
      const user = state[action.payload.username] || userSkeleton;
      return {
        ...state,
        [action.payload.username]: {
          ...user,
          photo: {
            data: [...user.photo.data, ...action.payload.photo],
            pagination: { ...action.payload.pagination },
          },
        },
      };
    }
    case actionTypes.FETCH_USER_FOLLOWER: {
      const user = state[action.payload.username] || userSkeleton;
      return {
        ...state,
        [action.payload.username]: {
          ...user,
          follower: {
            data: [...user.follower.data, ...action.payload.follower],
            pagination: { ...action.payload.pagination },
          },
        },
      };
    }
    case actionTypes.FETCH_USER_FOLLOWING: {
      const user = state[action.payload.username] || userSkeleton;
      return {
        ...state,
        [action.payload.username]: {
          ...user,
          following: {
            data: [...user.following.data, ...action.payload.following],
            pagination: { ...action.payload.pagination },
          },
        },
      };
    }
    case actionTypes.FOLLOW_USER: {
      const follower = state[action.payload.follower];
      const followee = state[action.payload.followee];
      if (!follower && !followee) {
        return state;
      }
      const updatedState = { ...state };
      if (follower) {
        updatedState[action.payload.follower] = {
          ...follower,
          user: {
            ...follower.user,
            followingCount: follower.user.followingCount + 1,
          },
          following: { ...userSkeleton.following },
        };
      }
      if (followee) {
        updatedState[action.payload.followee] = {
          ...followee,
          user: {
            ...followee.user,
            followerCount: followee.user.followerCount + 1,
            isFollowedByMe: true,
          },
          follower: { ...userSkeleton.follower },
        };
      }
      return updatedState;
    }
    case actionTypes.UNFOLLOW_USER: {
      const follower = state[action.payload.follower];
      const followee = state[action.payload.followee];
      if (!follower && !followee) {
        return state;
      }
      const updatedState = { ...state };
      if (follower) {
        updatedState[action.payload.follower] = {
          ...follower,
          user: {
            ...follower.user,
            followingCount: follower.user.followingCount - 1,
          },
          following: { ...userSkeleton.following },
        };
      }
      if (followee) {
        updatedState[action.payload.followee] = {
          ...followee,
          user: {
            ...followee.user,
            followerCount: followee.user.followerCount - 1,
            isFollowedByMe: false,
          },
          follower: { ...userSkeleton.follower },
        };
      }
      return updatedState;
    }
    case actionTypes.RESET_USER: {
      const user = userSkeleton;
      return {
        ...state,
        [action.payload.username]: {
          ...user,
        },
      };
    }

    case actionTypes.RESET:
      return initialState;
    default:
      return state;
  }
};
