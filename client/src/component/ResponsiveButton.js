import React from 'react';
import { Button, withWidth } from '@material-ui/core';

function ResponsiveButton({ width, children, ...rest }) {
  // This is equivalent to theme.breakpoints.down("sm")
  const isSmallScreen = /xs|sm/.test(width);
  const buttonProps = {
    size: isSmallScreen ? 'small' : 'medium',
  };
  return (
    <Button {...rest} {...buttonProps}>
      {children}
    </Button>
  );
}

export default withWidth()(ResponsiveButton);
