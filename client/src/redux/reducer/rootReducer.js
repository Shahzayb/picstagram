import { combineReducers } from 'redux';

import auth from './auth';
import profile from './user';

const combinedReducer = combineReducers({
  auth,
  profile
});

export default combinedReducer;
