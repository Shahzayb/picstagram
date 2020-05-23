import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { Typography, Avatar } from '@material-ui/core';
import Link from '@material-ui/core/Link';

import { Button, List, ListItem } from '@material-ui/core';
import {
  connectInfiniteHits,
  connectStateResults,
} from 'react-instantsearch-dom';
import MobileUserSearchTextInput from '../component/MobileUserSearchTextInput';

function UserSearch() {
  return (
    <div style={{ position: 'relative', margin: '0 auto' }}>
      <MobileUserSearchTextInput />
      <SearchList />
    </div>
  );
}

function CustomHits(props) {
  const { hits, hasMore, refine } = props;
  return (
    <>
      <List>
        {hits.map((hit, idx) => (
          <ListItem key={idx} dense button>
            <Link
              underline="none"
              color="inherit"
              component={RouterLink}
              to={`/@${hit.username}`}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Avatar
                style={{ marginRight: '1rem' }}
                alt={hit.name}
                src={hit.avatar}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6">{hit.username}</Typography>
                <Typography variant="body2">{hit.name}</Typography>
              </div>
            </Link>
          </ListItem>
        ))}
      </List>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
        }}
      >
        <Button
          size="small"
          onClick={() => {
            if (hasMore) {
              refine();
            }
          }}
          disabled={!hasMore}
          label="Load More"
        >
          Load More
        </Button>
      </div>
    </>
  );
}

function Results({ searchState, searchResults, error, children }) {
  let body;
  if (!searchResults || !searchResults.nbHits) {
    body = (
      <div style={{ textAlign: 'center', marginTop: '1rem', color: '#555' }}>
        No results found.
      </div>
    );
  } else if (error) {
    body = (
      <div style={{ textAlign: 'center', marginTop: '1rem', color: '#555' }}>
        Failed to fetch users.
      </div>
    );
  } else {
    body = children;
  }
  return (
    <>{searchState.query && <div style={{ marginTop: '1rem' }}>{body}</div>}</>
  );
}

function SearchDrawer(props) {
  return (
    <StateResults>
      <CustomHits {...props} />
    </StateResults>
  );
}

const StateResults = connectStateResults(Results);

const SearchList = connectInfiniteHits(SearchDrawer);

export default UserSearch;
