import React from 'react';
import { Link as RouterLink, useParams, useLocation } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

import FollowToggle from '../component/FollowToggle';
import UserPhotosList from '../component/UserPhotosList';
import ResponsiveButton from '../component/ResponsiveButton';
import { useAuth } from '../context/auth-context';
import { useFetchUser } from '../react-query/user';
import FullWidthSpinner from '../component/FullWidthSpinner';
import { isSmallScreen } from '../util/screen';
import AccountSettingsDialog from '../component/AccountSettingsDialog';

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

const Profile = () => {
  const classes = useStyles();
  const { username } = useParams();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const authenticated = !!authUser;
  const isMine = authUser?.username === username;

  const insideModal = !isSmallScreen();

  const { status, data: user, refetch } = useFetchUser(username);

  return status === 'loading' ? (
    <FullWidthSpinner />
  ) : status === 'error' ? (
    <div>
      Failed to fetch user.{' '}
      <Button size="small" color="secondary" onClick={() => refetch()}>
        Try again
      </Button>
    </div>
  ) : (
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography gutterBottom variant="h5" component="h1">
                {user.username}
              </Typography>
              {isMine && (
                <Typography
                  component="div"
                  gutterBottom
                  style={{ marginLeft: '10px' }}
                >
                  <AccountSettingsDialog />
                </Typography>
              )}
            </div>
            <div>
              {authenticated && !isMine && (
                <FollowToggle
                  followerUsername={authUser.username}
                  followeeUsername={username}
                  isFollowed={user.isFollowedByMe}
                />
              )}
              {authenticated && isMine && (
                <ResponsiveButton variant="outlined">
                  <Link
                    color="inherit"
                    component={RouterLink}
                    to="/account/edit"
                    title="edit account"
                    underline="none"
                    style={{ width: '100%', height: '100%' }}
                  >
                    Edit Profile
                  </Link>
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
                state: { background: insideModal ? location : null },
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
                state: { background: insideModal ? location : null },
              }}
            >
              <Typography variant="h6">{user.followingCount}</Typography>
              <Typography variant="body2">following</Typography>
            </Link>
          </li>
        </ul>
      </header>
      <UserPhotosList username={username} />
    </main>
  );
};

export default Profile;
