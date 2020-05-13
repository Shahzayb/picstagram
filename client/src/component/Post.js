import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { format } from 'timeago.js';

import {
  Paper,
  Link,
  Avatar,
  makeStyles,
  Typography,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import Snackbar from './Snackbar';
import CloudinaryImage from './CloudinaryImage';
import CreateComment from './CreateComment';
import LikeButton from './LikeButton';
import { isSmallScreen } from '../util/screen';
import { useAuth } from '../context/auth-context';
import { useDeletePhoto } from '../react-query/photo';

const useStyles = makeStyles((theme) => ({
  avatar: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: theme.spacing(1),
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  p1: {
    padding: theme.spacing(1),
  },
  unliked: {
    fill: 'transparent',
    stroke: 'currentColor',
  },
  liked: {
    fill: theme.palette.error.light,
  },

  child_mb1: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
  icon: {
    fontSize: '30px',
  },
  ml1: {
    marginLeft: theme.spacing(1),
  },
  fontSize16: {
    fontSize: '16px',
  },
  fontSize14: {
    fontSize: '14px',
  },
  commentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grow: {
    flex: 1,
  },
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
    color: 'white',
    backdropFilter: 'opacity(0.5)',
  },
}));

function Post({ photo }) {
  const classes = useStyles();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [mutate, { status, data, error, reset }] = useDeletePhoto();
  const insideModal = !isSmallScreen();

  const isMine = photo.user._id === authUser._id;

  return (
    <Paper style={{ position: 'relative' }} variant="outlined" square>
      <Snackbar
        open={!!error}
        onClose={() => reset()}
        severity="error"
        message={'Failed to delete post'}
      />
      <Snackbar
        open={!!data}
        onClose={() => reset()}
        severity="success"
        message={'Post is successfully deleted'}
      />
      {status === 'loading' && (
        <div className={classes.overlay}>
          <CircularProgress color="inherit" size={60} />
        </div>
      )}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          component={RouterLink}
          to={`/@${photo.user.username}`}
          underline="none"
          color="inherit"
          className={classes.avatar}
        >
          <Avatar
            component="span"
            alt={photo.user.name}
            src={photo.user.profilePicUrl}
          />
          <Typography className={classes.fontSize16} variant="h6">
            {photo.user.username}
          </Typography>
        </Link>
        {isMine && (
          <IconButton
            onClick={() => {
              mutate(photo._id);
            }}
            aria-label="delete"
            className={classes.delete}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </header>
      <CloudinaryImage
        publicId={photo.cloudinaryPublicId}
        alt={photo.tags.join(' ')}
      />
      <footer>
        <div className={`${classes.p1} ${classes.child_mb1}`}>
          <div>
            <LikeButton photoId={photo._id} liked={photo.isLikedByMe} />
          </div>
          <Typography className={classes.fontSize16} variant="h6">
            {photo.likeCount.toLocaleString()} likes
          </Typography>
          <div>
            <Link
              component={RouterLink}
              to={`/@${photo.user.username}`}
              underline="none"
              color="inherit"
            >
              <Typography
                className={classes.fontSize16}
                component="span"
                variant="h6"
              >
                {photo.user.username}
              </Typography>
            </Link>
            <Typography className={classes.ml1} component="span">
              {photo.title}
            </Typography>
          </div>
          <Link
            component={RouterLink}
            to={{
              pathname: `/p/${photo._id}/comments`,
              state: { background: insideModal ? location : null },
            }}
            underline="none"
            color="inherit"
          >
            <Typography
              className={classes.fontSize14}
              component="span"
              variant="h6"
              color="textSecondary"
            >
              View Comments
            </Typography>
          </Link>
          <Typography
            style={{ fontSize: '10px' }}
            variant="overline"
            display="block"
          >
            {format(photo.createdAt)}
          </Typography>
        </div>
        <CreateComment photoId={photo._id} />
      </footer>
    </Paper>
  );
}

export default Post;
