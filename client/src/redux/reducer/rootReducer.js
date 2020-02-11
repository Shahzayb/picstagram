import { combineReducers } from 'redux';

import auth from './auth';

const combinedReducer = combineReducers({
  auth
});

export default combinedReducer;
