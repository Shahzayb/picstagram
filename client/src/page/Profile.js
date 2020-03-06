import React from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import InfiniteScroll from 'react-infinite-scroller';

import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import {
  fetchUser,
  followUser,
  unfollowUser,
  fetchUserPhoto
} from '../redux/action/user';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  avatar: {
    width: '100px',
    height: '100px',
    marginLeft: 'auto',
    marginRight: theme.spacing(5)
  },
  w_30: {
    width: '30%'
  },
  w_70: {
    width: '70%'
  },
  w_100: {
    width: '100%'
  },
  textCenter: {
    textAlign: 'center'
  },
  mt_1: {
    marginTop: '1rem'
  },
  bio: {
    maxWidth: '300px',
    margin: '0 auto',
    width: '100%',
    marginTop: '1rem'
  },
  d_flex: {
    display: 'flex'
  }
}));

const Profile = props => {
  const classes = useStyles();
  const {
    profile,
    username,
    fetchUser,
    authenticated,
    isMine,
    followUser,
    unfollowUser,
    fetchUserPhoto
  } = props;

  React.useEffect(() => {
    if (!profile) {
      fetchUser(username);
    }
  }, [profile, username, fetchUser]);

  const [loading, setLoading] = React.useState(false);

  const followToggleHandler = () => {
    setLoading(true);
    if (profile.user.isFollowedByMe) {
      unfollowUser(username, () => setLoading(false));
    } else {
      followUser(username, () => setLoading(false));
    }
  };

  return !!profile ? (
    <main>
      <header className={classes.header}>
        <div className={classes.w_30}>
          <Avatar
            className={classes.avatar}
            alt={profile.user.name}
            src={profile.user.profilePicUrl}
          />
        </div>
        <div className={classes.w_70}>
          <Typography component="h1" variant="h4">
            {profile.user.username}
          </Typography>
          <div className={classes.mt_1}>
            {authenticated && (
              <>
                {!isMine && !profile.user.isFollowedByMe && (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={followToggleHandler}
                  >
                    Follow
                    {loading && (
                      <CircularProgress
                        style={{ marginLeft: '8px' }}
                        color="inherit"
                        size={16}
                      />
                    )}
                  </Button>
                )}
                {!isMine && profile.user.isFollowedByMe && (
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={followToggleHandler}
                  >
                    Unfollow
                    {loading && (
                      <CircularProgress
                        style={{ marginLeft: '8px' }}
                        color="inherit"
                        size={16}
                      />
                    )}
                  </Button>
                )}
                {isMine && <Button variant="outlined">Edit Account</Button>}
              </>
            )}
          </div>
        </div>

        <div
          className={`${classes.w_100} ${classes.textCenter} ${classes.mt_1}`}
        >
          <Typography component="h2" variant="h5">
            {profile.user.name}
          </Typography>
          <Typography
            className={`${classes.mt_1} ${classes.bio}`}
            variant="subtitle1"
          >
            {profile.user.bio}
          </Typography>
        </div>
        <List
          color="inherit"
          className={`${classes.w_100} ${classes.mt_1} ${classes.d_flex}`}
        >
          <ListItem component={RouterLink} to={`/${username}`}>
            <ListItemText>{profile.user.photoCount} posts</ListItemText>
          </ListItem>
          <ListItem component={RouterLink} to={`/${username}/follower`}>
            <ListItemText>{profile.user.followerCount} followers</ListItemText>
          </ListItem>
          <ListItem component={RouterLink} to={`/${username}/following`}>
            <ListItemText>{profile.user.followingCount} following</ListItemText>
          </ListItem>
        </List>
      </header>
      <Typography className={classes.mt_1} component="h2" variant="h4">
        Users images
      </Typography>
      <div className={classes.mt_1}>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => {
            fetchUserPhoto(username, profile.photo.pagination.curPage + 1);
          }}
          hasMore={profile.photo.pagination.hasMore}
          loader={
            <div
              className={`${classes.w_100} ${classes.textCenter} ${classes.mt_1}`}
              key="1"
            >
              <CircularProgress color="inherit" size={20} />
            </div>
          }
        >
          <GridList cellHeight={200} className={classes.w_100} cols={3}>
            {profile.photo.data.map(photo => (
              <GridListTile key={photo._id} cols={1}>
                <img src={photo.photoUrl} alt={photo.tags.join(' ')} />
              </GridListTile>
            ))}
          </GridList>
        </InfiniteScroll>
      </div>
    </main>
  ) : (
    <div className={`${classes.w_100} ${classes.textCenter} ${classes.mt_1}`}>
      <CircularProgress color="inherit" size={20} />
    </div>
  );
};

const mapState = ({ profile, auth }, ownProps) => {
  const username = ownProps.match.params.username;
  return {
    profile: profile[username],
    username,
    authenticated: auth.isLoggedIn,
    isMine: !!auth.user && auth.user.username === username
  };
};

const mapDispatch = { fetchUser, followUser, unfollowUser, fetchUserPhoto };

export default connect(mapState, mapDispatch)(Profile);
