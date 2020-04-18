import { ORM } from 'redux-orm';

import { User, Photo } from './models';

const orm = new ORM();
orm.register(User, Photo);

export default orm;
