import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress, Container } from '@material-ui/core';

import Post from '../component/Post';
import orm from '../redux/orm/index';
import { fetchPhotoById } from '../redux/action/photo';

function PostPage({ photo, fetchPhotoById, photoId }) {
  React.useEffect(() => {
    if (!photo) {
      fetchPhotoById(photoId);
    }
  }, [photo, photoId, fetchPhotoById]);

  if (!photo) {
    return (
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          marginTop: '1rem',
        }}
      >
        <CircularProgress color="inherit" size={20} />
      </div>
    );
  }

  return (
    <Container style={{ paddingLeft: 0, paddingRight: 0 }} maxWidth="sm">
      <Post photo={photo} />
    </Container>
  );
}

const mapState = ({ entities }, ownProps) => {
  console.log(ownProps);
  const photoId = ownProps.match.params.photoId;
  const session = orm.session(entities);
  const { Photo } = session;

  const photo = Photo.withId(photoId);

  return {
    photo,
    photoId,
  };
};

const mapDispatch = { fetchPhotoById };

export default connect(mapState, mapDispatch)(PostPage);
