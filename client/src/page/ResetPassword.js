import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

import { useParams, useLocation } from 'react-router-dom';

import { useFormik } from 'formik';
import CircularProgress from '@material-ui/core/CircularProgress';
import { object, string } from 'yup';

import Copyright from '../component/Copyright';
import { useResetPassword } from '../react-query/user';
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

function ResetPassword(props) {
  const classes = useStyles();
  const { userId } = useParams();
  const { search } = useLocation();
  const { login } = useAuth();

  const [mutate, { data, error, reset }] = useResetPassword();

  React.useEffect(() => {
    if (data) {
      login(data.user, data.token);
    }
  }, [data, login]);

  const formik = useFormik({
    initialValues: { password: '' },
    validationSchema: object().shape({
      password: string()
        .required('password is required')
        .min(8, 'password should be atleast 8 characters long'),
    }),
    onSubmit: (values, formik) => {
      reset();
      mutate({ password: values.password, userId, query: search }).finally(
        () => {
          formik.setSubmitting(false);
        }
      );
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      {!!error && <Alert severity="error">{error}</Alert>}
      {!!data && (
        <Alert severity="success">Your password is changed successfully.</Alert>
      )}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>

        <form style={{ marginTop: '2rem' }} className={classes.form} noValidate>
          <TextField
            name="password"
            variant="outlined"
            required
            fullWidth
            type="password"
            label="Your Password"
            autoFocus
            {...formik.getFieldProps('password')}
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
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
            Submit New Password
            {formik.isSubmitting && (
              <CircularProgress style={{ marginLeft: '1rem' }} size={16} />
            )}
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default ResetPassword;
