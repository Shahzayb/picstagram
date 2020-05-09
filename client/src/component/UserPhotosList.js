import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Typography, makeStyles, Link } from '@material-ui/core';
import Masonry from 'react-masonry-css';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';

import CloudinaryImage from './CloudinaryImage';
import FullWidthSpinner from './FullWidthSpinner';
import Snackbar from './Snackbar';
import { useUserPhotosList } from '../react-query/photo';

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

function UserPhotosList({ username }) {
  const classes = useStyles();

  const {
    status,
    canFetchMore,
    isFetchingMore,
    isFetching,
    fetchMore,
    data,
    error,
  } = useUserPhotosList(username);

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
    <div>
      <Typography
        gutterBottom
        className={classes.mt_1}
        component="h2"
        variant="h5"
      >
        Posts
      </Typography>
      {!data[0]?.length && !isFetching && !canFetchMore && (
        <Typography component="p" variant="subtitle1">
          No photos found
        </Typography>
      )}
      <div ref={infiniteRef}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          columnClassName={classes.masonryGridColumn}
          className={classes.masonryGrid}
        >
          {data.map((photosGroup) =>
            photosGroup.map((photo) => (
              <Link
                underline="none"
                color="inherit"
                component={RouterLink}
                to={`/p/${photo._id}`}
                key={photo._id}
              >
                <CloudinaryImage
                  publicId={photo.cloudinaryPublicId}
                  alt={photo.tags.join(' ')}
                />
              </Link>
            ))
          )}
        </Masonry>
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

export default UserPhotosList;
