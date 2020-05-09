import React from 'react';
import { CircularProgress } from '@material-ui/core';

import Button from './ResponsiveButton';
import Snackbar from './Snackbar';
import { useToggleFollow } from '../react-query/user';

function FollowToggle({ followerUsername, followeeUsername, isFollowed }) {
  const [mutate, { status, data, error, reset }] = useToggleFollow();

  return (
    <div>
      <Snackbar
        open={!!error}
        onClose={() => reset()}
        severity="error"
        message={error?.message}
      />
      <Snackbar
        open={!!data}
        onClose={() => reset()}
        severity="success"
        message={data}
      />

      <Button
        color="primary"
        variant={!isFollowed ? 'contained' : 'outlined'}
        onClick={() => {
          mutate({ followerUsername, followeeUsername, isFollowed })
            .then(console.log)
            .catch(console.error);
        }}
        disabled={status === 'loading'}
      >
        {!isFollowed ? 'Follow' : 'Unfollow'}
        {status === 'loading' && (
          <CircularProgress
            style={{ marginLeft: '8px' }}
            color="inherit"
            size={16}
          />
        )}
      </Button>
    </div>
  );
}

export default FollowToggle;
