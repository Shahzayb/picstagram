import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { Alert } from '@material-ui/lab';

import ImageDropzone from '../component/ImageDropzone';
import ImagePreview from '../component/ImagePreview';
import TextEditor from '../component/TextEditor';
import { getSignature, uploadImage } from '../api/cloudinary';

const useStyles = makeStyles((theme) => ({
  flex_bw: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    margin: '0 auto',
  },
  paper: {
    width: '100%',
    height: '100%',
    maxWidth: '700px',
    backgroundColor: '#fff',
    padding: theme.spacing(1),
    overflow: 'auto',
    boxShadow: theme.shadows[2],
    outline: 'none',
  },
  closeBtn: {
    minWidth: 'auto',
    minHeight: 'auto',
  },
  gutter_all: {
    '& > *': {
      marginBottom: '2rem',
    },
  },
  flex_center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  [theme.breakpoints.up('sm')]: {
    paper: {
      width: '80%',
      height: '80%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '4px',
    },
    container: {
      width: '60%',
    },
  },
  [theme.breakpoints.up('md')]: {
    container: {
      width: '50%',
    },
  },
}));

const CreatePost = (props) => {
  const classes = useStyles();
  const [image, setImage] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [isUploadFailed, setUploadFailed] = React.useState(false);
  const [isUploaded, setUploaded] = React.useState(false);

  const uploadHandler = React.useCallback(async () => {
    try {
      setUploading(true);
      setUploadFailed(false);
      setUploaded(false);
      const sig = await getSignature(title);

      await uploadImage(image, sig);

      setUploading(false);
      setTitle('');
      setImage(null);
      setUploaded(true);

      // now image is uploaded, remove cached images
      // resetMyProfile();
    } catch (e) {
      console.log(e);
      setUploading(false);
      setUploaded(false);
      setUploadFailed(true);
    }
  }, [image, title]);

  return (
    <main>
      {!props.insideModal && (
        <Typography component="h1" variant="h4" gutterBottom>
          Make a post
        </Typography>
      )}
      <div className={`${classes.gutter_all}`}>
        {isUploadFailed && (
          <Alert
            severity="error"
            action={
              <Button onClick={uploadHandler} color="inherit" size="small">
                RETRY
              </Button>
            }
          >
            Image upload is failed — click retry button to upload again!
          </Alert>
        )}
        {isUploaded && <Alert>Image is successfully uploaded</Alert>}

        <ImageDropzone
          onDropAccepted={(file) => {
            setImage(file);
          }}
          onDropRejected={console.log}
          disabled={uploading}
        />
        <div className={classes.container}>
          {image && <ImagePreview image={image} />}
          <TextEditor disabled={uploading} value={title} onChange={setTitle} />
        </div>
        <div className={classes.flex_center}>
          <Button
            onClick={uploadHandler}
            variant="contained"
            color="primary"
            endIcon={uploading ? <CircularProgress size={20} /> : <SendIcon />}
            disabled={uploading || !title || !image}
          >
            Send
          </Button>
        </div>
      </div>
    </main>
  );
};

export default CreatePost;
