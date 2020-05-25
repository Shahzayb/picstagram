import React from 'react';
import { Link } from '@material-ui/core';
import StackGrid from 'react-stack-grid';
import { Link as RouterLink } from 'react-router-dom';
import CloudinaryImage from './CloudinaryImage';

function MasonryGrid({ photos }) {
  return (
    <StackGrid columnWidth={300} monitorImagesLoaded>
      {photos.map((photo) => (
        <div key={photo._id}>
          <Link
            underline="none"
            color="inherit"
            component={RouterLink}
            to={`/p/${photo._id}`}
          >
            <CloudinaryImage
              publicId={photo.cloudinaryPublicId}
              alt={photo.tags.join(' ')}
            />
          </Link>
        </div>
      ))}
    </StackGrid>
  );
}

export default MasonryGrid;
