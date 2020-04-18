import React from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink, Route } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';

import FollowToggle from '../component/FollowToggle';
import UserPhotos from '../component/UserPhotosList';
import ResponsiveButton from '../component/ResponsiveButton';
import Followers from '../component/FollowersList';
import Following from '../component/FollowingList';

import { fetchUser, followUser, unfollowUser } from '../redux/action/user';

import { fetchUserPhoto } from '../redux/action/photo';

import orm from '../redux/orm/';

const useStyles = makeStyles((theme) => ({
  loader: {
    width: '100%',
    textAlign: 'center',
    marginTop: theme.spacing(1),
  },
  dFlex: {
    display: 'flex',
  },
  avatar: {
    height: '80px',
    width: '80px',
  },
  ul: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    marginTop: theme.spacing(3),
  },
  textCenter: {
    textAlign: 'center',
  },
  mb2: {
    marginBottom: '2rem',
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  const { user, username, fetchUser, authenticated, isMine } = props;

  React.useEffect(() => {
    if (!user) {
      fetchUser(username);
    }
  }, [user, username, fetchUser]);

  if (!user) {
    return (
      <div className={classes.loader}>
        <CircularProgress color="inherit" size={20} />
      </div>
    );
  }

  return (
    !!user && (
      <main>
        <header>
          <div className={`${classes.dFlex} ${classes.mb2}`}>
            <div style={{ marginRight: '3rem' }}>
              <Avatar
                className={classes.avatar}
                alt={user.name}
                src={user.profilePicUrl}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography gutterBottom variant="h5" component="h1">
                {user.username}
              </Typography>
              <div>
                {authenticated && !isMine && (
                  <FollowToggle
                    username={username}
                    followed={user.isFollowedByMe}
                  />
                )}
                {authenticated && isMine && (
                  <ResponsiveButton variant="outlined">
                    Edit Account
                  </ResponsiveButton>
                )}
              </div>
            </div>
          </div>

          <div>
            <Typography gutterBottom variant="subtitle2" component="h2">
              {user.name}
            </Typography>
            <Typography variant="body1">{user.bio}</Typography>
          </div>
          <ul className={classes.ul}>
            <li className={classes.textCenter}>
              <Link
                underline="none"
                color="inherit"
                component={RouterLink}
                to={`/@${user.username}`}
              >
                <Typography variant="h6">{user.photoCount}</Typography>
                <Typography variant="body2">posts</Typography>
              </Link>
            </li>
            <li className={classes.textCenter}>
              <Link
                underline="none"
                color="inherit"
                component={RouterLink}
                to={{
                  pathname: `/@${user.username}/followers`,
                }}
              >
                <Typography variant="h6">{user.followerCount}</Typography>
                <Typography variant="body2">followers</Typography>
              </Link>
            </li>
            <li className={classes.textCenter}>
              <Link
                underline="none"
                color="inherit"
                component={RouterLink}
                to={{
                  pathname: `/@${user.username}/following`,
                }}
              >
                <Typography variant="h6">{user.followingCount}</Typography>
                <Typography variant="body2">following</Typography>
              </Link>
            </li>
          </ul>
        </header>
        <UserPhotos username={username} />
        <Route exact path="/@:username/followers">
          <Followers username={username} />
        </Route>
        <Route exact path="/@:username/following">
          <Following username={username} />
        </Route>
      </main>
    )
  );
};

const mapState = ({ auth, entities }, ownProps) => {
  const username = ownProps.match.params.username;
  const session = orm.session(entities);

  const user = session.User.get({ username });

  return {
    user: user && user.isComplete && user.ref,
    username,
    authenticated: auth.isLoggedIn,
    isMine: !!auth.user && auth.user.username === username,
  };
};

const mapDispatch = {
  fetchUser,
  followUser,
  unfollowUser,
  fetchUserPhoto,
};

export default connect(mapState, mapDispatch)(Profile);
