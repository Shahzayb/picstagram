import React from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import CreateComment from '../component/CreateComment';
import CommentList from '../component/CommentList';

const useStyles = makeStyles((theme) => ({}));

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
