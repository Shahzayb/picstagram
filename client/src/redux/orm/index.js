import { ORM } from 'redux-orm';

import { User, Photo, Comment } from './models';

const orm = new ORM();
orm.register(User, Photo, Comment);

export default orm;
