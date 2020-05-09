import React, { useState } from 'react';
import { useFormik } from 'formik';
import CircularProgress from '@material-ui/core/CircularProgress';
import { object, string } from 'yup';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Copyright from '../component/Copyright';
import { loginUser as loginUserApi } from '../api/user';
import { useAuth } from '../context/auth-context';

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alertContainer: {
    width: '100%',
    margin: theme.spacing(2, 0, 2, 0),
  },
}));

function Login(props) {
  const classes = useStyles();
  const { login: setAuthUser } = useAuth();
  const [isAlertOpen, setAlertOpen] = useState(false);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: object().shape({
      username: string().required('required'),
      password: string().required('required'),
    }),
    onSubmit: (values, formik) => {
      setAlertOpen(false);
      loginUserApi(values)
        .then(({ user, token }) => {
          setAuthUser(user, token);
        })
        .catch(() => {
          setAlertOpen(true);
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
          Sign in
        </Typography>
        <div className={classes.alertContainer}>
          <Collapse in={isAlertOpen}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlertOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              Invalid username or password
            </Alert>
          </Collapse>
        </div>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="text"
            label="Username"
            name="username"
            autoFocus
            {...formik.getFieldProps('username')}
            error={formik.touched.username && !!formik.errors.username}
            // helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && !!formik.errors.password}
            // helperText={formik.touched.password && formik.errors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={formik.isSubmitting}
            onClick={formik.handleSubmit}
          >
            {formik.isSubmitting ? (
              <>
                {'Signing in...'}{' '}
                <CircularProgress style={{ marginLeft: '1rem' }} size={16} />
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                disabled={formik.isSubmitting}
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                disabled={formik.isSubmitting}
                component={RouterLink}
                to="/register"
                variant="body2"
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default Login;
