import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button } from '@material-ui/core';

import Post from '../component/Post';
import FullWidthSpinner from '../component/FullWidthSpinner';
import { useFetchPhotoById } from '../react-query/photo';

function PostPage() {
  const { photoId } = useParams();

  const { status, data, refetch } = useFetchPhotoById(photoId);

  return status === 'loading' ? (
    <FullWidthSpinner />
  ) : status === 'error' ? (
    <div>
      Failed to fetch photo.{' '}
      <Button size="small" color="secondary" onClick={() => refetch()}>
        Try again
      </Button>
    </div>
  ) : (
    <Container style={{ paddingLeft: 0, paddingRight: 0 }} maxWidth="sm">
      <Post photo={data} />
    </Container>
  );
}

export default PostPage;
