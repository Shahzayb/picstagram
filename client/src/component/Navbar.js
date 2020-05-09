import React from 'react';
import { useLocation } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

import ResponsiveButton from './ResponsiveButton';
import { isSmallScreen } from '../util/screen';
import { useAuth } from '../context/auth-context';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  ml_auto: {
    marginLeft: 'auto',
  },
  spacing: {
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
    display: 'flex',
    alignItems: 'center',
  },
}));

function Navbar(props) {
  const classes = useStyles();
  const location = useLocation();
  const { user, logout } = useAuth();
  const authenticated = !!user;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const insideModal = !isSmallScreen();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Link
            underline="none"
            color="inherit"
            component={RouterLink}
            to="/"
            title="home"
          >
            <Typography variant="h6" style={{ paddingRight: '1rem' }}>
              Pistagram
            </Typography>
          </Link>

          <div className={`${classes.spacing} ${classes.ml_auto}`}>
            {authenticated && (
              <Link
                color="inherit"
                component={RouterLink}
                to={{
                  pathname: '/post',
                  state: { background: insideModal ? location : null },
                }}
                title="make post"
              >
                <AddAPhotoIcon fontSize="large" />
              </Link>
            )}

            {authenticated && (
              <>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar alt={user.name} src={user.profilePicUrl} />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  id={menuId}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Link
                      underline="none"
                      color="inherit"
                      component={RouterLink}
                      to={`/@${user.username}`}
                    >
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handleMenuClose(e);
                      logout();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
            {!authenticated && (
              <>
                <ResponsiveButton
                  variant="contained"
                  component={RouterLink}
                  to="/login"
                >
                  Login
                </ResponsiveButton>
                <ResponsiveButton
                  color="inherit"
                  variant="outlined"
                  component={RouterLink}
                  to="/register"
                >
                  Sign up
                </ResponsiveButton>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
