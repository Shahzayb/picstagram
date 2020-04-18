import React from 'react';
import { connect } from 'react-redux';
import { useHistory, Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Avatar,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import InfiniteScroll from 'react-infinite-scroller';
import Link from '@material-ui/core/Link';

import { fetchUserFollower } from '../redux/action/user';
import orm from '../redux/orm/index';

const useStyles = makeStyles((theme) => ({
  flex_bw: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gutter_1: {
    marginBottom: theme.spacing(1),
  },
  gutter_2: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    width: '100%',
    height: '100%',
    maxWidth: '700px',
    backgroundColor: '#fff',
    padding: theme.spacing(1),
    overflow: 'auto',
    boxShadow: theme.shadows[2],
    outline: 'none',
  },
  closeBtn: {
    minWidth: 'auto',
    minHeight: 'auto',
  },
  flex_center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  [theme.breakpoints.up('sm')]: {
    paper: {
      width: '80%',
      height: '80%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '4px',
    },
  },
}));

function Followers({ fetchUserFollower, username, pagination, followers }) {
  const classes = useStyles();
  const history = useHistory();
  const [fetching, setFetching] = React.useState(false);

  const handleClose = React.useCallback(() => {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.replace('/');
    }
  }, [history]);
  return (
    <Modal className={classes.flex_center} open onClose={handleClose}>
      <div className={classes.paper}>
        <header className={`${classes.flex_bw} ${classes.gutter_1}`}>
          <Typography>Followers</Typography>
          <Button
            className={classes.closeBtn}
            size="small"
            onClick={handleClose}
          >
            <CloseIcon />
          </Button>
        </header>
        <Divider className={classes.gutter_2} />
        <div>
          {followers.length === 0 && !pagination.hasMore && (
            <Typography component="p" variant="subtitle1">
              No followers found
            </Typography>
          )}
          <InfiniteScroll
            pageStart={0}
            loadMore={() => {
              if (!fetching) {
                setFetching(true);
                fetchUserFollower(username, pagination.curPage + 1, () => {
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
            {followers.map((follower) => (
              <div className={classes.gutter_2} key={follower._id}>
                <Link
                  underline="none"
                  color="inherit"
                  component={RouterLink}
                  to={`/@${follower.username}`}
                  className={classes.flex_i_center}
                >
                  <Avatar
                    style={{ marginRight: '1rem' }}
                    alt={follower.name}
                    src={follower.profilePicUrl}
                  />
                  <div className={classes.flex_col_center}>
                    <Typography variant="h6">{follower.username}</Typography>
                    <Typography variant="body2">{follower.name}</Typography>
                  </div>
                </Link>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </Modal>
  );
}

const mapState = ({ entities, pagination }, ownProps) => {
  const username = ownProps.username;
  const userFollowerPagination = pagination.userFollower[username] || {
    curPage: 0,
    hasMore: true,
  };
  const session = orm.session(entities);

  const user = session.User.get({ username });

  return {
    pagination: userFollowerPagination,
    followers: user ? user.followers.toRefArray() : [],
  };
};

const mapDispatch = { fetchUserFollower };

export default connect(mapState, mapDispatch)(Followers);
