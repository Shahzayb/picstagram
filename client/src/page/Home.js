import React from 'react';

import { makeStyles, Container } from '@material-ui/core';

import TimelinePost from '../component/Post';
import Snackbar from '../component/Snackbar';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';
import { useTimelineQuery } from '../react-query/timeline';
import FullWidthSpinner from '../component/FullWidthSpinner';

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
  mb: {
    marginBottom: theme.spacing(2),
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: theme.spacing(1),
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  px_0: { paddingLeft: 0, paddingRight: 0 },
}));

const Home = (props) => {
  const classes = useStyles();
  const query = useTimelineQuery();

  const infiniteRef = useInfiniteScroll({
    loading: query.isFetchingMore || query.isFetching,
    hasNextPage: !!query.canFetchMore || query.isFetchingMore,
    onLoadMore: () => {
      query.fetchMore();
    },
  });

  return query.status === 'loading' ? (
    <FullWidthSpinner />
  ) : (
    <Container ref={infiniteRef} className={classes.px_0} maxWidth="sm">
      {query.data.map((timeline, i) => (
        <React.Fragment key={i}>
          {timeline.map((photo) => (
            <div key={photo._id} className={classes.mb}>
              <TimelinePost photo={photo} />
            </div>
          ))}
        </React.Fragment>
      ))}
      {(query.isFetchingMore || query.isFetching || !!query.canFetchMore) && (
        <FullWidthSpinner />
      )}
      {query.status === 'error' && (
        <Snackbar severity="error" message={query.error.message} />
      )}
    </Container>
  );
};

export default Home;
