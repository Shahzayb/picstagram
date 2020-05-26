import React from 'react';

import { useFormik } from 'formik';
import { object as yupObject, string as yupString } from 'yup';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { changePassword as changePasswordApi } from '../api/user';

const validationSchema = yupObject().shape({
  old_password: yupString()
    .required('required')
    .min(8, 'password is too short'),
  new_password: yupString()
    .required('required')
    .min(8, 'password is too short'),
});

function ChangePassword() {
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
    },
    validationSchema,
    onSubmit: (values, formik) => {
      setSuccess(false);
      setError(false);

      changePasswordApi(values)
        .then(() => {
          setSuccess(true);
        })
        .catch((res) => {
          if (res.status === 422) {
            res.json().then(({ errors }) => {
              errors.forEach(({ param, msg }) => {
                formik.setFieldError(param, msg);
              });
            });
          } else {
            setError(true);
          }
        })
        .finally(() => {
          formik.setSubmitting(false);
        });
    },
  });

  return (
    <Container style={{ paddingLeft: 0, paddingRight: 0 }} maxWidth="sm">
      {error && (
        <Alert
          severity="error"
          onClose={() => {
            setError(false);
          }}
        >
          Failed to change password
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          onClose={() => {
            setSuccess(false);
          }}
        >
          Password is changed successfully
        </Alert>
      )}

      <Typography component="h1" variant="h5">
        Change Password
      </Typography>
      <form style={{ marginTop: '2rem' }} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Old Password"
              autoFocus
              type="password"
              {...formik.getFieldProps('old_password')}
              error={
                formik.touched.old_password && !!formik.errors.old_password
              }
              helperText={
                formik.touched.old_password && formik.errors.old_password
              }
              onBlur={() => {}}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="New Password"
              type="password"
              {...formik.getFieldProps('new_password')}
              error={
                formik.touched.new_password && !!formik.errors.new_password
              }
              helperText={
                formik.touched.new_password && formik.errors.new_password
              }
              onBlur={() => {}}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: '2rem' }}
          disabled={formik.isSubmitting}
          onClick={formik.handleSubmit}
        >
          Update
          {formik.isSubmitting ? (
            <CircularProgress style={{ marginLeft: '1rem' }} size={16} />
          ) : null}
        </Button>
      </form>
    </Container>
  );
}

export default ChangePassword;
