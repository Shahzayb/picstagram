import React from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { format, register } from 'timeago.js';
import en_short from 'timeago.js/lib/lang/en_short';

import {
  Typography,
  CircularProgress,
  makeStyles,
  Link,
  Avatar,
} from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';

import { fetchComment } from '../redux/action/photo';

import orm from '../redux/orm';

register('en_short', en_short);

function CommentList({ comments, pagination, fetchComment, photoId }) {
  const [fetching, setFetching] = React.useState(false);
  return (
    <div style={{ marginTop: '1rem', padding: '6px' }}>
      {comments.length === 0 && !pagination.hasMore && (
        <Typography component="p" variant="subtitle1">
          No comments found
        </Typography>
      )}
      <InfiniteScroll
        pageStart={0}
        loadMore={() => {
          if (!fetching) {
            setFetching(true);
            fetchComment(photoId, pagination.curPage + 1, () => {
              setFetching(false);
            });
          }
        }}
        hasMore={pagination.hasMore}
        loader={
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: '1rem',
            }}
            key="1"
          >
            <CircularProgress color="inherit" size={20} />
          </div>
        }
      >
        {comments.map((comment) => (
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
      </InfiniteScroll>
    </div>
  );
}

const mapState = ({ entities, pagination }, ownProps) => {
  const photoId = ownProps.photoId;
  const photoCommentPagination = pagination.photoComment[photoId] || {
    curPage: 0,
    hasMore: true,
  };
  const session = orm.session(entities);

  const photo = session.Photo.withId(photoId);

  const comments = [];
  if (photo) {
    photo.comments.toModelArray().forEach((comment) => {
      const commentObj = { ...comment.ref };
      commentObj.user = { ...comment.user.ref };
      comments.push(commentObj);
    });
  }
  // debugger;

  return {
    pagination: photoCommentPagination,
    comments,
  };
};

const mapDispatch = { fetchComment };

export default connect(mapState, mapDispatch)(CommentList);
