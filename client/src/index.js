import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query-devtools';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ReactQueryConfigProvider } from 'react-query';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure } from 'react-instantsearch-dom';

import { AuthProvider } from './context/auth-context';
import history from './lib/history';

const algoliaClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY
);

const searchClient = {
  search(requests) {
    if (requests.every(({ params }) => !params.query || !params.query.trim())) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          processingTimeMS: 0,
        })),
      });
    }

    return algoliaClient.search(requests);
  },
};

const queryConfig = {
  refetchAllOnWindowFocus: false,
  staleTime: 60 * 60 * 1000,
  cacheTime: 30 * 60 * 1000,
};

// Save a reference to the root element for reuse
const rootEl = document.getElementById('root');

// Create a reusable render method that we can call more than once
let render = () => {
  // Dynamically import our main App component, and render it
  const App = require('./App').default;

  ReactDOM.render(
    <InstantSearch
      searchClient={searchClient}
      indexName={process.env.REACT_APP_ALGOLIA_SEARCH_INDEX_NAME}
    >
      <Configure hitsPerPage={8} />
      <CssBaseline />
      <Router history={history}>
        <ReactQueryConfigProvider config={queryConfig}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ReactQueryConfigProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </InstantSearch>,
    rootEl
  );
};

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    // Support hot reloading of components.
    // Whenever the App component file or one of its dependencies
    // is changed, re-import the updated component and re-render it
    module.hot.accept('./App', () => {
      setTimeout(render);
    });
  }
}

render();
