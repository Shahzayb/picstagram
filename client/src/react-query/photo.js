import {
  useMutation,
  queryCache,
  useInfiniteQuery,
  useQuery,
} from 'react-query';
import {
  likePhoto,
  unlikePhoto,
  getComments,
  postComment,
  getPhotoById,
} from '../api/photo';
import { pageSize } from '../config/env';
import { getUserPhoto } from '../api/user';

const toggleLike = async ({ photoId, liked }) => {
  try {
    if (!liked) {
      await likePhoto(photoId);
    } else {
      await unlikePhoto(photoId);
    }
    if (!liked) {
      return Promise.resolve('Photo liked');
    } else {
      return Promise.resolve('Photo unliked');
    }
  } catch (e) {
    throw new Error(liked ? 'Failed to unlike photo' : 'Failed to like photo');
  }
};

export const useToggleLike = () => {
  return useMutation(toggleLike, {
    onMutate: ({ photoId, liked }) => {
      const previousTimeline = queryCache.getQueryData('timeline');
      const previousPhoto = queryCache.getQueryData(['photos', photoId]);

      if (previousPhoto) {
        queryCache.setQueryData(['photos', photoId], (data) => {
          if (data) {
            return {
              ...data,
              isLikedByMe: !data.isLikedByMe,
              likeCount: data.isLikedByMe
                ? data.likeCount - 1
                : data.likeCount + 1,
            };
          }
        });
      }
      if (previousTimeline) {
        queryCache.setQueryData('timeline', (groups) => {
          groups.forEach((group) => {
            group.forEach((photo) => {
              if (photo._id === photoId) {
                if (!photo.isLikedByMe) {
                  photo.likeCount += 1;
                } else {
                  photo.likeCount -= 1;
                }
                photo.isLikedByMe = !photo.isLikedByMe;
              }
            });
          });

          return [...groups];
        });
      }
      return () => {
        if (previousTimeline) {
          queryCache.setQueryData('timeline', previousTimeline);
        }
        if (previousPhoto) {
          queryCache.setQueryData(['photos', photoId], previousPhoto);
        }
      };
    },
    onError: (err, data, rollback) => rollback(),
  });
};

async function commentList(key, photoId, page = 1) {
  try {
    const data = await getComments(photoId, page);
    return data;
  } catch (e) {
    throw new Error('failed to fetch comments');
  }
}

export function useCommentList(photoId) {
  return useInfiniteQuery(['comments', photoId], commentList, {
    getFetchMore: (lastGroup, allGroups) => {
      if (lastGroup.length === pageSize) {
        return allGroups.length + 1;
      }
      return 0;
    },
  });
}

async function createComment({ photoId, comment }) {
  try {
    const data = await postComment(photoId, comment);
    return data;
  } catch (e) {
    throw new Error('Failed to create comment');
  }
}

export function useCreateComment() {
  return useMutation(createComment, {
    onSuccess: (data, { photoId, comment }) => {
      queryCache.refetchQueries(['comments', photoId], {
        force: true,
      });
    },
  });
}

async function fetchPhotoById(key, photoId) {
  try {
    const data = await getPhotoById(photoId);
    return data;
  } catch (e) {
    throw new Error('Failed to fetch photo');
  }
}

export function useFetchPhotoById(photoId) {
  return useQuery(['photos', photoId], fetchPhotoById);
}

async function userPhotosList(key, username, page = 1) {
  try {
    return await getUserPhoto(username, page);
  } catch (e) {
    throw new Error('Failed to get photos');
  }
}

export function useUserPhotosList(username) {
  return useInfiniteQuery(['user_photos', username], userPhotosList, {
    getFetchMore: (lastGroup, allGroups) => {
      if (lastGroup.length === pageSize) {
        return allGroups.length + 1;
      }
      return 0;
    },
  });
}
