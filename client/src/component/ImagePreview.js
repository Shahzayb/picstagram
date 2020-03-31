import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  img: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '5px',
    width: '100%'
  }
}));

export default function ImagePreview(props) {
  const classes = useStyles();
  const { image } = props;
  const [src, setSrc] = React.useState(null);
  React.useEffect(() => {
    const src = window.URL.createObjectURL(image);
    setSrc(src);
    return () => {
      window.URL.revokeObjectURL(src);
    };
  }, [image]);
  return <img className={classes.img} src={src} alt="preview" />;
}
