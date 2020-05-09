import React from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function CustomSnackbar({ open, onClose, severity, message }) {
  const isControlled = typeof open === 'boolean' && onClose;
  const [innerOpen, setInnerOpen] = React.useState(true);
  const closeHandler = React.useCallback(
    (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      if (isControlled) {
        onClose();
      }
      if (!isControlled) {
        setInnerOpen(false);
      }
    },
    [onClose, isControlled]
  );
  return (
    <Snackbar
      open={isControlled ? open : innerOpen}
      autoHideDuration={3000}
      onClose={closeHandler}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert onClose={closeHandler} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar;
