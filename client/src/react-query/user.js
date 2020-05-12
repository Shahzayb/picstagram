import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  queryCache,
} from 'react-query';
import {
  getProfile,
  followUser,
  unfollowUser,
  getUserFollower,
  getUserFollowing,
  forgotPassword,
  resetPassword,
} from '../api/user';
import { pageSize } from '../config/env';

async function fetchUser(key, username) {
  try {
    const data = await getProfile(username);
    return data;
  } catch (e) {
    throw new Error('Failed to fetch profile');
  }
}

export function useFetchUser(username) {
  return useQuery(['users', username], fetchUser);
}

export function useForgotPassword() {
  return useMutation(forgotPassword);
}

export function useResetPassword() {
  return useMutation(({ password, userId, query }) => {
    return resetPassword(password, userId, query).catch((res) => {
      if (res.status === 422) {
        return res.json().then(({ errors }) => {
          return Promise.reject(errors[0].msg);
        });
      } else {
        return Promise.reject('invalid userId or token');
      }
    });
  });
}

async function toggleFollow({
  followerUsername,
  followeeUsername,
  isFollowed,
}) {
  try {
    let msg = '';
    if (!isFollowed) {
      await followUser(followeeUsername);
      msg = 'User followed';
    } else {
      await unfollowUser(followeeUsername);
      msg = 'User unfollowed';
    }
    return msg;
  } catch (e) {
    throw new Error(`Failed to ${isFollowed ? 'unfollow' : 'follow'} user`);
  }
}

export function useToggleFollow() {
  return useMutation(toggleFollow, {
    onMutate: ({ followerUsername, followeeUsername, isFollowed }) => {
      const previousFollowerUser = queryCache.getQueryData([
        'users',
        followerUsername,
      ]);
      const previousFolloweeUser = queryCache.getQueryData([
        'users',
        followeeUsername,
      ]);

      if (previousFollowerUser) {
        queryCache.setQueryData(['users', followerUsername], (oldUser) => {
          if (oldUser) {
            return {
              ...oldUser,
              followingCount: isFollowed
                ? oldUser.followingCount - 1
                : oldUser.followingCount + 1,
            };
          }
        });
      }

      if (previousFolloweeUser) {
        queryCache.setQueryData(['users', followeeUsername], (oldUser) => {
          if (oldUser) {
            return {
              ...oldUser,
              followerCount: isFollowed
                ? oldUser.followerCount - 1
                : oldUser.followerCount + 1,
              isFollowedByMe: !isFollowed,
            };
          }
        });
      }

      return () => {
        if (previousFollowerUser) {
          queryCache.setQueryData(
            ['users', followerUsername],
            previousFollowerUser
          );
        }
        if (previousFolloweeUser) {
          queryCache.setQueryData(
            ['users', followeeUsername],
            previousFolloweeUser
          );
        }
      };
    },
    onSuccess: (data, { followerUsername, followeeUsername, isFollowed }) => {
      queryCache.refetchQueries(['following', followerUsername], {
        force: true,
      });
      queryCache.refetchQueries(['followers', followeeUsername], {
        force: true,
      });
      queryCache.refetchQueries('timeline', { force: true });
    },
    onError: (err, vars, rollback) => {
      rollback();
      throw err;
    },
  });
}

async function followersList(key, username, page = 1) {
  try {
    return await getUserFollower(username, page);
  } catch (e) {
    throw new Error('Failed to fetch followers');
  }
}

export function useFollowersList(username) {
  return useInfiniteQuery(['followers', username], followersList, {
    getFetchMore: (lastGroup, allGroups) => {
      if (lastGroup.length === pageSize) {
        return allGroups.length + 1;
      }
      return 0;
    },
  });
}

async function followingList(key, username, page = 1) {
  try {
    return await getUserFollowing(username, page);
  } catch (e) {
    throw new Error('Failed to fetch following');
  }
}

export function useFollowingList(username) {
  return useInfiniteQuery(['following', username], followingList, {
    getFetchMore: (lastGroup, allGroups) => {
      if (lastGroup.length === pageSize) {
        return allGroups.length + 1;
      }
      return 0;
    },
  });
}
