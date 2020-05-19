import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Paper, CircularProgress, Button } from '@material-ui/core';
import { Typography, Avatar } from '@material-ui/core';
import Link from '@material-ui/core/Link';

import {
  useUserSuggestionList,
  useToggleFollowSuggested,
} from '../react-query/user';
import { useAuth } from '../context/auth-context';

const flexCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
};

function FollowToggle({ followerUsername, followeeUsername, isFollowed }) {
  const [mutate, { status }] = useToggleFollowSuggested();

  return (
    <div>
      <Button
        size="small"
        color="primary"
        onClick={() => {
          mutate({ followerUsername, followeeUsername, isFollowed })
            .then(console.log)
            .catch(console.error);
        }}
        disabled={status === 'loading'}
      >
        {!isFollowed ? 'Follow' : 'Unfollow'}
      </Button>
    </div>
  );
}

function UserProfile({ user }) {
  const {
    user: { username },
  } = useAuth();

  return (
    <div>
      <Link
        underline="none"
        color="inherit"
        component={RouterLink}
        to={`/@${user.username}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar alt={user.name} src={user.profilePicUrl} />
        <Typography style={{ paddingTop: '8px' }} variant="caption">
          {user.username}
        </Typography>
      </Link>
      <FollowToggle
        followerUsername={username}
        followeeUsername={user.username}
        isFollowed={user.isFollowedByMe}
      />
    </div>
  );
}

function UserSuggestion() {
  const {
    user: { username },
  } = useAuth();
  const { status, data } = useUserSuggestionList(username);

  return (
    <Paper
      style={{
        marginBottom: '3rem',
        position: 'relative',
        height: '160px',
      }}
      variant="outlined"
      square
    >
      {status === 'error' || status === 'loading' ? (
        <div style={flexCenter}>
          <CircularProgress size={20} />
        </div>
      ) : (
        <div
          style={{
            height: '100%',
            width: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {data?.length === 0 && (
            <div style={{ ...flexCenter, color: '#555' }}>
              No Suggestions Found
            </div>
          )}
          {data.map((user) => (
            <div style={{ padding: '1rem' }} key={user._id}>
              <UserProfile user={user} />
            </div>
          ))}
        </div>
      )}
    </Paper>
  );
}

export default UserSuggestion;
