import { useMutation, queryCache } from 'react-query';
import { deleteComment } from '../api/comment';

export function useDeleteComment() {
  return useMutation(({ commentId }) => deleteComment(commentId), {
    onSuccess: (data, { commentId, photoId }) => {
      queryCache.setQueryData(['comments', photoId], (groups) => {
        groups.forEach((group, i) => {
          groups[i] = group.filter((comment) => comment._id !== commentId);
        });
        return groups;
      });
    },
  });
}
