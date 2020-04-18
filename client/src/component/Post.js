import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import {
  Paper,
  Link,
  Avatar,
  makeStyles,
  ButtonBase,
  Typography,
} from '@material-ui/core';

import CloudinaryImage from './CloudinaryImage';
import CreateComment from './CreateComment';
import LikeButton from './LikeButton';

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
  commentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grow: {
    flex: 1,
  },
}));

function TimelinePost({ photo }) {
  const classes = useStyles();
  const location = useLocation();

  return (
    <Paper variant="outlined" square>
      <header>
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
          <span>{photo.user.username}</span>
        </Link>
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
              pathname: `/photo/${photo._id}/comments`,
              state: { background: location },
            }}
            underline="none"
            color="inherit"
          >
            <Typography
              className={classes.fontSize16}
              component="span"
              variant="h6"
              color="textSecondary"
            >
              View Comments
            </Typography>
          </Link>
        </div>
        <CreateComment photoId={photo._id} />
      </footer>
    </Paper>
  );
}

export default TimelinePost;
