import React from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import {
  Typography,
  CircularProgress,
  makeStyles,
  Link,
} from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';
import Masonry from 'react-masonry-css';

import CloudinaryImage from './CloudinaryImage';

import { fetchUserPhoto } from '../redux/action/photo';

import orm from '../redux/orm';

const useStyles = makeStyles((theme) => ({
  w_100: {
    width: '100%',
  },
  textCenter: {
    textAlign: 'center',
  },
  mt_1: {
    marginTop: '1rem',
  },

  masonryGrid: {
    display: 'flex',
    marginLeft: '-1rem' /* gutter size offset */,
    width: 'auto',
  },
  masonryGridColumn: {
    paddingLeft: '1rem' /* gutter size */,
    backgroundClip: 'padding-box',
  },
}));

const breakpointColumnsObj = {
  default: 3,
  992: 2,
  768: 1,
};

function UserPhotos({ username, fetchUserPhoto, photos, pagination }) {
  const classes = useStyles();
  const [fetching, setFetching] = React.useState(false);
  return (
    <div>
      <Typography
        gutterBottom
        className={classes.mt_1}
        component="h2"
        variant="h5"
      >
        Posts
      </Typography>
      {photos.length === 0 && !pagination.hasMore && (
        <Typography component="p" variant="subtitle1">
          No photos found
        </Typography>
      )}
      <InfiniteScroll
        pageStart={0}
        loadMore={() => {
          if (!fetching) {
            setFetching(true);
            fetchUserPhoto(username, pagination.curPage + 1, () => {
              setFetching(false);
            });
          }
        }}
        hasMore={pagination.hasMore}
        loader={
          <div
            className={`${classes.w_100} ${classes.textCenter} ${classes.mt_1}`}
            key="1"
          >
            <CircularProgress color="inherit" size={20} />
          </div>
        }
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={classes.masonryGrid}
          columnClassName={classes.masonryGridColumn}
        >
          {photos.map((photo) => (
            <Link
              underline="none"
              color="inherit"
              component={RouterLink}
              to={`/p/${photo._id}`}
            >
              <CloudinaryImage
                key={photo._id}
                publicId={photo.cloudinaryPublicId}
                alt={photo.tags.join(' ')}
              />
            </Link>
          ))}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
}

const mapState = ({ entities, pagination }, ownProps) => {
  const username = ownProps.username;
  const userPhotoPagination = pagination.userPhoto[username] || {
    curPage: 0,
    hasMore: true,
  };
  const session = orm.session(entities);

  const user = session.User.get({ username });

  return {
    pagination: userPhotoPagination,
    photos: user ? user.photos.toRefArray() : [],
  };
};

const mapDispatch = { fetchUserPhoto };

export default connect(mapState, mapDispatch)(UserPhotos);
