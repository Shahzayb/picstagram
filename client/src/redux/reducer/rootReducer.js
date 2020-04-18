import { combineReducers } from 'redux';

import auth from './auth';
import entities from './entities';
import pagination from './pagination';

const combinedReducer = combineReducers({
  entities,
  pagination,
  auth,
});

export default combinedReducer;
