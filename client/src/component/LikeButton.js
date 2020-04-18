import React from 'react';
import { connect } from 'react-redux';

import { makeStyles, Snackbar, ButtonBase } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import HeartIcon from '@material-ui/icons/Favorite';

import { likePhoto, unlikePhoto } from '../redux/action/photo';

const useStyles = makeStyles((theme) => ({
  unliked: {
    fill: 'transparent',
    stroke: 'currentColor',
  },
  liked: {
    fill: theme.palette.error.light,
  },
  icon: {
    fontSize: '30px',
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function LikeButton({ photoId, liked, likePhoto, unlikePhoto }) {
  const classes = useStyles();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

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

  return (
    <>
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
      <ButtonBase
        onClick={() => {
          setPending(true);
          const cb = (error, success) => {
            if (error) {
              setError(error);
            } else if (success) {
              setSuccess(success);
            }
            setPending(false);
          };
          if (liked) {
            unlikePhoto(photoId, cb);
          } else {
            likePhoto(photoId, cb);
          }
        }}
        disableRipple
        disableTouchRipple
        disabled={pending}
      >
        <HeartIcon
          className={`${liked ? classes.liked : classes.unliked} ${
            classes.icon
          }`}
        />
      </ButtonBase>
    </>
  );
}

const mapDispatch = { likePhoto, unlikePhoto };

export default connect(null, mapDispatch)(LikeButton);
