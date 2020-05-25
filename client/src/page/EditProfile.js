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

import { updateUser as updateUserApi } from '../api/user';
import { useAuth } from '../context/auth-context';

const validationSchema = yupObject().shape({
  name: yupString().trim().required('required'),
  username: yupString().trim().required('required'),
  email: yupString().trim().required('required').email('invalid email'),
  bio: yupString().trim().max(120, 'bio is too long'),
});

function EditProfile() {
  return (
    <Container style={{ paddingLeft: 0, paddingRight: 0 }} maxWidth="sm">
      <Typography component="h1" variant="h5">
        Edit Profile
      </Typography>

      <EditProfileForm />
    </Container>
  );
}

function EditProfileForm() {
  const { user: profile, login } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: profile.name,
      username: profile.username,
      email: profile.email,
      bio: profile.bio,
    },
    validationSchema,
    onSubmit: (values, formik) => {
      updateUserApi(values)
        .then(({ user, token }) => {
          login(user, token);
        })
        .catch((res) => {
          if (res.status === 422) {
            res.json().then(({ errors }) => {
              errors.forEach(({ param, msg }) => {
                formik.setFieldError(param, msg);
              });
            });
          }
        })
        .finally(() => {
          formik.setSubmitting(false);
        });
    },
  });

  return (
    <form style={{ marginTop: '2rem' }} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            variant="outlined"
            fullWidth
            label="Full Name"
            autoFocus
            {...formik.getFieldProps('name')}
            error={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
            onBlur={() => {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            label="Username"
            name="username"
            {...formik.getFieldProps('username')}
            error={formik.touched.username && !!formik.errors.username}
            helperText={formik.touched.username && formik.errors.username}
            onBlur={() => {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            label="Email Address"
            name="email"
            {...formik.getFieldProps('email')}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
            onBlur={() => {}}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            name="bio"
            label="Bio"
            multiline
            rows="4"
            {...formik.getFieldProps('bio')}
            error={formik.touched.bio && !!formik.errors.bio}
            helperText={formik.touched.bio && formik.errors.bio}
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
  );
}

export default EditProfile;
