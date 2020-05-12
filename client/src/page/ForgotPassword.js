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

import { useFormik } from 'formik';
import CircularProgress from '@material-ui/core/CircularProgress';
import { object, string } from 'yup';

import Copyright from '../component/Copyright';
import { useForgotPassword } from '../react-query/user';

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

function ForgotPassword() {
  const classes = useStyles();
  const [mutate, { data, error, reset }] = useForgotPassword();

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: object().shape({
      email: string().required('email is required').email('invalid email'),
    }),
    onSubmit: (values, formik) => {
      reset();
      mutate(values.email).finally(() => {
        formik.setSubmitting(false);
      });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      {!!error && (
        <Alert severity="error">Account with this email does not exist</Alert>
      )}
      {!!data && (
        <Alert severity="success">
          Reset link is sent to your email address.
        </Alert>
      )}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forget Password
        </Typography>

        <form style={{ marginTop: '2rem' }} className={classes.form} noValidate>
          <TextField
            name="email"
            variant="outlined"
            required
            fullWidth
            label="Your Email"
            autoFocus
            {...formik.getFieldProps('email')}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
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
            Submit Email
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

export default ForgotPassword;
