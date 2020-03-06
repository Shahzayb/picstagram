import React from 'react';
import Container from '@material-ui/core/Container';

const Layout = ({ children }) => {
  return (
    <Container maxWidth="md" style={{ paddingTop: '2rem' }}>
      {children}
    </Container>
  );
};

export default Layout;
