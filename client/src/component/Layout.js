import React from 'react';

import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  sm_px_8: {},
  [theme.breakpoints.down('sm')]: {
    sm_px_8: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <Container
      className={classes.sm_px_8}
      maxWidth="md"
      style={{ paddingTop: '2rem' }}
    >
      {children}
    </Container>
  );
};

export default Layout;
