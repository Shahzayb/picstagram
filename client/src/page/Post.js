import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@material-ui/core';

import Post from '../component/Post';
import FullWidthSpinner from '../component/FullWidthSpinner';
import Snackbar from '../component/Snackbar';
import { useFetchPhotoById } from '../react-query/photo';

function PostPage() {
  const { photoId } = useParams();

  const { status, data, error } = useFetchPhotoById(photoId);

  return status === 'loading' ? (
    <FullWidthSpinner />
  ) : status === 'error' ? (
    <Snackbar severity="error" message={error.message} />
  ) : (
    <Container style={{ paddingLeft: 0, paddingRight: 0 }} maxWidth="sm">
      <Post photo={data} />
    </Container>
  );
}

export default PostPage;
