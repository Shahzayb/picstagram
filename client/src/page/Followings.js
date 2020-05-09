import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Typography, Avatar } from '@material-ui/core';
import Link from '@material-ui/core/Link';

import { useInfiniteScroll } from 'react-infinite-scroll-hook';

import FullWidthSpinner from '../component/FullWidthSpinner';
import Snackbar from '../component/Snackbar';
import { useFollowingList } from '../react-query/user';

const useStyles = makeStyles((theme) => ({
  gutter_2: {
    marginBottom: theme.spacing(2),
  },

  flex_i_center: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex_col_center: {
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center',
    flexDirection: 'column',
  },
}));

function Following({ insideModal }) {
  const classes = useStyles();
  const { username } = useParams();

  const {
    status,
    canFetchMore,
    isFetchingMore,
    isFetching,
    fetchMore,
    data,
    error,
  } = useFollowingList(username);

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
      {!insideModal && (
        <Typography
          style={{ marginBottom: '2rem' }}
          component="h1"
          variant="h4"
        >
          Following
        </Typography>
      )}
      {!data[0]?.length && !isFetching && !canFetchMore && (
        <Typography component="p" variant="subtitle1">
          No followings found
        </Typography>
      )}
      <div ref={infiniteRef}>
        {data.map((followingGroup, i) => (
          <React.Fragment key={i}>
            {followingGroup.map((following) => (
              <div className={classes.gutter_2} key={following._id}>
                <Link
                  underline="none"
                  color="inherit"
                  component={RouterLink}
                  to={`/@${following.username}`}
                  className={classes.flex_i_center}
                >
                  <Avatar
                    style={{ marginRight: '1rem' }}
                    alt={following.name}
                    src={following.profilePicUrl}
                  />
                  <div className={classes.flex_col_center}>
                    <Typography variant="h6">{following.username}</Typography>
                    <Typography variant="body2">{following.name}</Typography>
                  </div>
                </Link>
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

export default Following;
