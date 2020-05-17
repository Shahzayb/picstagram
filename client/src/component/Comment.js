import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { format, register } from 'timeago.js';
import en_short from 'timeago.js/lib/lang/en_short';
import {
  Typography,
  Link,
  Avatar,
  makeStyles,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import Snackbar from './Snackbar';
import { useAuth } from '../context/auth-context';
import { useDeleteComment } from '../react-query/comment';

register('en_short', en_short);

const useStyles = makeStyles((theme) => ({
  delete: {
    color: theme.palette.error.light,
    marginRight: '5px',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    backdropFilter: 'opacity(0.8)',
  },
}));

function Comment({ comment }) {
  const classes = useStyles();

  const {
    user: { _id: authUserId },
  } = useAuth();

  const isMine = authUserId === comment.user._id;

  const [mutate, { status, error, reset }] = useDeleteComment();
  return (
    <div
      style={{
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'start',
        position: 'relative',
      }}
    >
      <Snackbar
        open={status === 'error'}
        onClose={() => reset()}
        severity="error"
        message={'Failed to delete post'}
      />
      <Snackbar
        open={status === 'success'}
        onClose={() => reset()}
        severity="success"
        message={'Post is successfully deleted'}
      />
      {status === 'loading' && (
        <div className={classes.overlay}>
          <CircularProgress color="inherit" size={25} />
        </div>
      )}

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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            style={{ fontSize: '10px', marginRight: '8px' }}
            variant="caption"
            display="block"
          >
            {format(comment.createdAt, 'en_short')}
          </Typography>

          {isMine && (
            <IconButton
              size="small"
              onClick={() => {
                mutate({ commentId: comment._id, photoId: comment.photoId });
              }}
              aria-label="delete"
              className={classes.delete}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
