import React from 'react';
import { useParams } from 'react-router-dom';

import CreateComment from '../component/CreateComment';
import CommentList from '../component/CommentList';

const Comments = () => {
  const { photoId } = useParams();

  return (
    <main>
      <CreateComment photoId={photoId} />
      <CommentList photoId={photoId} />
    </main>
  );
};

export default Comments;
