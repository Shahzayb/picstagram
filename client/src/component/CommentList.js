import React from 'react';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';

import { Typography } from '@material-ui/core';

import FullWidthSpinner from './FullWidthSpinner';
import Snackbar from './Snackbar';
import { useCommentList } from '../react-query/photo';
import Comment from './Comment';

function CommentList({ photoId }) {
  const {
    status,
    canFetchMore,
    isFetchingMore,
    isFetching,
    fetchMore,
    data,
    error,
  } = useCommentList(photoId);

  const infiniteRef = useInfiniteScroll({
    loading: isFetchingMore || isFetching,
    hasNextPage: !!canFetchMore || isFetchingMore,
    onLoadMore: () => {
      fetchMore();
    },
  });

  return status === 'loading' ? (
    <FullWidthSpinner />
  ) : (
    <div style={{ marginTop: '1rem', padding: '6px' }}>
      {!data[0]?.length && !isFetching && !canFetchMore && (
        <Typography component="p" variant="subtitle1">
          No comments found
        </Typography>
      )}
      <div ref={infiniteRef}>
        {data.map((commentGroup, i) => (
          <React.Fragment key={i}>
            {commentGroup.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </React.Fragment>
        ))}
        {(isFetchingMore || isFetching || !!canFetchMore) && (
          <FullWidthSpinner />
        )}
        {status === 'error' && (
          <Snackbar severity="error" message={error.message} />
        )}
      </div>
    </div>
  );
}

export default CommentList;
