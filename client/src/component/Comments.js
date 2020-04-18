import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Typography, Divider } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import CreateComment from './CreateComment';

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

const Comments = () => {
  const classes = useStyles();
  const history = useHistory();
  const { photoId } = useParams();

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
          <Typography>Comments</Typography>
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
          <CreateComment photoId={photoId} />
        </div>
      </div>
    </Modal>
  );
};

export default Comments;
