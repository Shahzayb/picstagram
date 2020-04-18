import React from 'react';
import { connect } from 'react-redux';

import { CircularProgress, Snackbar } from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';

import Button from './ResponsiveButton';
import { followUser, unfollowUser } from '../redux/action/user';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function FollowToggle({ username, followed, followUser, unfollowUser }) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');

  const done = React.useCallback((error, success) => {
    if (success) {
      setSuccess(success);
    } else if (error) {
      setError(error);
    }
    setLoading(false);
  }, []);

  const successCloseHandler = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccess('');
  };

  const errorCloseHandler = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError('');
  };

  const followToggleHandler = () => {
    setLoading(true);
    if (followed) {
      unfollowUser(username, done);
    } else {
      followUser(username, done);
    }
  };

  return (
    <div>
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={errorCloseHandler}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={errorCloseHandler} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={successCloseHandler}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={successCloseHandler} severity="success">
          {success}
        </Alert>
      </Snackbar>
      {!followed && (
        <Button
          color="primary"
          variant="contained"
          onClick={followToggleHandler}
          disabled={loading}
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
      {followed && (
        <Button
          color="primary"
          variant="outlined"
          onClick={followToggleHandler}
          disabled={loading}
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
    </div>
  );
}

const mapDispatch = { followUser, unfollowUser };

export default connect(null, mapDispatch)(FollowToggle);
