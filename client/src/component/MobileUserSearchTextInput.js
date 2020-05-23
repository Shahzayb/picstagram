import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: { width: '100%' },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,

    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
    boxShadow: theme.shadows[1],
  },
  inputInput: {
    padding: theme.spacing(2, 2, 2, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
  },
}));

function UserSearchTextInput({ currentRefinement, refine, onFocus }) {
  const classes = useStyles();
  return (
    <form noValidate action="" role="search" className={classes.root}>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          value={currentRefinement}
          onChange={(e) => refine(e.target.value)}
          placeholder="Search"
          type="search"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onFocus={onFocus}
        />
      </div>
    </form>
  );
}

export default connectSearchBox(UserSearchTextInput);
