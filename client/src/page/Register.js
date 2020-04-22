import React from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { useFormik } from 'formik';
import { object as yupObject, string as yupString } from 'yup';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import Copyright from '../component/Copyright';
import { postUser as registerUserApi } from '../api/user';
import { loginUser } from '../redux/action/auth';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const initialValues = {
  name: '',
  username: '',
  email: '',
  password: '',
};

const validationSchema = yupObject().shape({
  name: yupString().required('required'),
  username: yupString().required('required'),
  email: yupString().required('required').email('invalid email'),
  password: yupString()
    .required('required')
    .min(8, 'must be 8 characters or more'),
});

function Register(props) {
  const classes = useStyles();
  const { loginUser } = props;

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, formik) => {
      registerUserApi(values)
        .then(({ user, token }) => {
          loginUser(user, token);
        })
        .catch((res) => {
          if (res.status === 422) {
            res.json().then(({ errors }) => {
              errors.forEach(({ param, msg }) => {
                formik.setFieldError(param, msg);
              });
            });
          }
          formik.setSubmitting(false);
        });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                variant="outlined"
                required
                fullWidth
                label="Full Name"
                autoFocus
                {...formik.getFieldProps('name')}
                error={formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Username"
                name="username"
                {...formik.getFieldProps('username')}
                error={formik.touched.username && !!formik.errors.username}
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                name="email"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                {...formik.getFieldProps('password')}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={formik.isSubmitting}
            onClick={formik.handleSubmit}
          >
            Sign Up
            {formik.isSubmitting ? (
              <CircularProgress style={{ marginLeft: '1rem' }} size={16} />
            ) : null}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                disabled={formik.isSubmitting}
                component={RouterLink}
                to="/login"
                variant="body2"
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

const mapDispatch = { loginUser };

export default connect(null, mapDispatch)(Register);
