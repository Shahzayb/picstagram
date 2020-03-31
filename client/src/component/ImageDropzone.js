import React from 'react';
import { useDropzone } from 'react-dropzone';

import { makeStyles } from '@material-ui/core/styles';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dropzone: {
    border: ' 2px dashed rgb(219, 219, 219)',
    padding: '1rem',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'rgb(243, 243, 243)'
    }
  }
}));

export default function ImageDropzone({
  onDropAccepted,
  onDropRejected,
  disabled = false
}) {
  const classes = useStyles();
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpg, image/jpeg, image/png',
    maxSize: 10 * 1024 * 1024, // 1kb min size
    multiple: false,
    onDropAccepted: (file, event) => {
      console.log('accepted', file, event);
      if (onDropAccepted) {
        onDropAccepted(file[0]);
      }
    },
    onDropRejected: (file, event) => {
      console.log('rejected', file, event);
      if (onDropRejected) {
        onDropRejected(file[0]);
      }
    },
    disabled
  });

  return (
    <div {...getRootProps({ className: classes.dropzone })}>
      <input {...getInputProps()} />
      <Typography align="center" paragraph>
        <AddAPhotoIcon />
      </Typography>
      <Typography align="center" paragraph>
        Drag 'n' drop photo here, or click to select photo
      </Typography>
    </div>
  );
}
