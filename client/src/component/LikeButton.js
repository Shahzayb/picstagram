import React from 'react';

import { makeStyles, ButtonBase } from '@material-ui/core';
import HeartIcon from '@material-ui/icons/Favorite';

import Snackbar from './Snackbar';
import { useToggleLike } from '../react-query/photo';

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

function LikeButton({ photoId, liked }) {
  const classes = useStyles();

  const [mutate, { status, data, error, reset }] = useToggleLike();

  return (
    <>
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

      <ButtonBase
        onClick={() => {
          mutate({ photoId, liked }).then(console.log).catch(console.error);
        }}
        disableRipple
        disableTouchRipple
        disabled={status === 'loading'}
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

export default LikeButton;
