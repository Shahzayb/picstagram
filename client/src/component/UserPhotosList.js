import React from 'react';

import { Typography, makeStyles } from '@material-ui/core';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';

import FullWidthSpinner from './FullWidthSpinner';
import Snackbar from './Snackbar';
import { useUserPhotosList } from '../react-query/photo';
import MasonryGrid from './MasonryGrid';

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
}));

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

  // flat the array
  const photos = data.flat();

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
        <MasonryGrid photos={photos} />
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
