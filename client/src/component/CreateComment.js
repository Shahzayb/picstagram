import React from 'react';
import { connect } from 'react-redux';

import { useFormik } from 'formik';
import { object as yupObject, string as yupString } from 'yup';

import {
  TextField,
  Button,
  makeStyles,
  Snackbar,
  CircularProgress,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { createComment } from '../redux/action/photo';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  p1: {
    padding: theme.spacing(1),
  },
  commentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
  },
  grow: {
    flex: 1,
  },
  w100: {
    width: '100%', // Fix IE 11 issue.
  },
}));

const initialValues = {
  comment: '',
};

const validationSchema = yupObject().shape({
  comment: yupString()
    .trim()
    .required('required')
    .max(120, 'comment is too long'),
});

function CreateComment({ photoId, createComment }) {
  const classes = useStyles();
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, formik) => {
      setError(false);
      setSuccess(false);
      createComment(photoId, values.comment, (error, success) => {
        if (success) {
          setSuccess(true);
          formik.resetForm();
        } else {
          setError(true);
        }
        formik.setSubmitting(false);
      });
    },
  });

  const successCloseHandler = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccess(false);
  };

  const errorCloseHandler = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(false);
  };

  return (
    <div className={`${classes.p1}`}>
      <Snackbar
        open={error}
        autoHideDuration={3000}
        onClose={errorCloseHandler}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={errorCloseHandler} severity="error">
          Failed to add comment!
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={successCloseHandler}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={successCloseHandler} severity="success">
          Added comment!
        </Alert>
      </Snackbar>

      <div className={classes.commentContainer}>
        <TextField
          className={classes.grow}
          label="Add a comment"
          type="text"
          variant="outlined"
          name="comment"
          size="small"
          {...formik.getFieldProps('comment')}
          helperText={formik.touched.comment && formik.errors.comment}
          onBlur={() => {}}
        />
        <Button
          disabled={formik.isSubmitting}
          onClick={formik.handleSubmit}
          disableRipple
          disableTouchRipple
          color="primary"
        >
          {!formik.isSubmitting ? 'Post' : <CircularProgress size={20} />}
        </Button>
      </div>
    </div>
  );
}

const mapDispatch = { createComment };

export default connect(null, mapDispatch)(CreateComment);
