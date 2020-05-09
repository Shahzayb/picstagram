import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const centerStyles = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default function () {
  return (
    <div style={centerStyles}>
      <CircularProgress />
    </div>
  );
}
