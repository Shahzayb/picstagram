import React from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import { CircularProgress, makeStyles, Container } from '@material-ui/core';

import TimelinePost from '../component/Post';
import { fetchTimeline } from '../redux/action/timeline';
import orm from '../redux/orm/index';

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
}));

const Home = (props) => {
  const { fetchTimeline, timeline, pagination } = props;
  const classes = useStyles();
  const [fetching, setFetching] = React.useState(false);
  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={() => {
        if (!fetching) {
          setFetching(true);
          fetchTimeline(pagination.curPage + 1, () => {
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
      <Container maxWidth="sm">
        {timeline.map((photo) => (
          <div key={photo._id} className={classes.mb}>
            <TimelinePost photo={photo} />
          </div>
        ))}
      </Container>
    </InfiniteScroll>
  );
};

const mapState = ({ auth, entities, pagination }) => {
  const userId = auth.user._id;
  const session = orm.session(entities);

  const user = session.User.withId(userId);
  const timeline = [];

  user.timeline.toModelArray().forEach((timelineModel) => {
    const timelineObj = { ...timelineModel.ref };
    timelineObj.user = { ...timelineModel.user.ref };
    timeline.push(timelineObj);
  });

  return {
    timeline,
    pagination: pagination.timeline,
  };
};

const mapDispatch = { fetchTimeline };

export default connect(mapState, mapDispatch)(Home);
