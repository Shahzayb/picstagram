import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function FullWidthSpinner() {
  return (
    <div
      style={{ width: '100%', textAlign: 'center', marginTop: '1rem' }}
      key="1"
    >
      <CircularProgress color="inherit" size={20} />
    </div>
  );
}

export default FullWidthSpinner;
