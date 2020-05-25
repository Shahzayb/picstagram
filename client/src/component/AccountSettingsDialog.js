import React from 'react';

import { Link as RouterLink } from 'react-router-dom';

import Link from '@material-ui/core/Link';
import { IconButton, Dialog, List, ListItem } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useAuth } from '../context/auth-context';

function SimpleDialog(props) {
  const { logout } = useAuth();
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="account-settings-dialog"
      open={open}
      maxWidth="xs"
      fullWidth
    >
      <List>
        <ListItem button onClick={() => handleClose()}>
          <Link
            color="inherit"
            component={RouterLink}
            to="/account/change-password"
            title="change password"
            underline="none"
            style={{ width: '100%', height: '100%' }}
          >
            Change Password
          </Link>
        </ListItem>

        <ListItem button onClick={() => handleClose()}>
          <Link
            color="inherit"
            component={RouterLink}
            to="/account/edit"
            title="edit account"
            underline="none"
            style={{ width: '100%', height: '100%' }}
          >
            Edit Profile
          </Link>
        </ListItem>

        <ListItem
          button
          onClick={() => {
            logout();
            handleClose();
          }}
        >
          Logout
        </ListItem>

        <ListItem button onClick={() => handleClose()}>
          Cancel
        </ListItem>
      </List>
    </Dialog>
  );
}

function AccountSettingsDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <IconButton
        onClick={() => setOpen(true)}
        size="small"
        aria-label="settings menu"
        component="button"
      >
        <SettingsIcon />
      </IconButton>
      <SimpleDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default AccountSettingsDialog;
