import { combineReducers } from 'redux';
import { createReducer } from 'redux-orm';

import auth from './auth';
import profile from './user';
import timeline from './timeline';
import orm from '../orm/index';

const combinedReducer = combineReducers({
  orm: createReducer(orm),
  auth,
  profile,
  timeline,
});

export default combinedReducer;
