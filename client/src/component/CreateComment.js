import React from 'react';

import { useFormik } from 'formik';
import { object as yupObject, string as yupString } from 'yup';

import {
  TextField,
  Button,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';

import Snackbar from './Snackbar';
import { useCreateComment } from '../react-query/photo';

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

function CreateComment({ photoId }) {
  const classes = useStyles();
  const [mutate, { data, error, reset }] = useCreateComment();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, formik) => {
      mutate({ photoId, comment: values.comment })
        .then(() => {
          formik.resetForm();
        })
        .finally(() => {
          formik.setSubmitting(false);
        });
    },
  });

  return (
    <div className={`${classes.p1}`}>
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
        message={'Added comment'}
      />

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

export default CreateComment;
