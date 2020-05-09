import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { format, register } from 'timeago.js';
import en_short from 'timeago.js/lib/lang/en_short';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';

import { Typography, Link, Avatar } from '@material-ui/core';

import FullWidthSpinner from './FullWidthSpinner';
import Snackbar from './Snackbar';
import { useCommentList } from '../react-query/photo';

register('en_short', en_short);

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
              <div
                style={{
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'start',
                }}
                key={comment._id}
              >
                <Link
                  underline="none"
                  color="inherit"
                  component={RouterLink}
                  to={`/@${comment.user.username}`}
                >
                  <Avatar
                    style={{ marginRight: '1rem' }}
                    alt={comment.user.username}
                    src={comment.user.profilePicUrl}
                  />
                </Link>
                <div style={{ flex: 1 }}>
                  <Link
                    underline="none"
                    color="inherit"
                    component={RouterLink}
                    to={`/@${comment.user.username}`}
                    style={{ marginRight: '5px' }}
                  >
                    <Typography
                      style={{ fontSize: '16px' }}
                      component="span"
                      variant="h6"
                    >
                      {comment.user.username}
                    </Typography>
                  </Link>
                  <Typography
                    style={{ fontSize: '16px', wordBreak: 'break-all' }}
                    component="span"
                  >
                    {comment.comment}
                  </Typography>
                  <Typography
                    style={{ fontSize: '10px' }}
                    variant="caption"
                    display="block"
                  >
                    {format(comment.createdAt, 'en_short')}
                  </Typography>
                </div>
              </div>
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
