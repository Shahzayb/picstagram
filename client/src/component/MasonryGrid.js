import React from 'react';
import { makeStyles, Link } from '@material-ui/core';
import Colcade from 'colcade';
import { Link as RouterLink } from 'react-router-dom';
import CloudinaryImage from './CloudinaryImage';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'flex',
    marginTop: theme.spacing(4),
  },
  grid_col: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  grid_item: {
    paddingBottom: theme.spacing(1),
  },
  grid_col_1: {},
  grid_col_2: { display: 'none' },
  grid_col_3: { display: 'none' },
  [theme.breakpoints.up('sm')]: {
    grid_col_2: { display: 'block' },
  },
  [theme.breakpoints.up('md')]: {
    grid_col_3: { display: 'block' },
  },
}));

function MasonryGrid({ photos }) {
  const classes = useStyles();
  React.useLayoutEffect(() => {
    const colc = new Colcade(`.${classes.grid}`, {
      columns: `.${classes.grid_col}`,
      items: `.${classes.grid_item}`,
    });

    return () => {
      colc.destroy();
    };
  }, [classes]);
  return (
    <div className={classes.grid}>
      <div className={`${classes.grid_col} ${classes.grid_col_1}`}></div>
      <div className={`${classes.grid_col} ${classes.grid_col_2}`}></div>
      <div className={`${classes.grid_col} ${classes.grid_col_3}`}></div>

      {photos.map((photo) => (
        <div key={photo._id} className={classes.grid_item}>
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
    </div>
  );
}

export default MasonryGrid;
