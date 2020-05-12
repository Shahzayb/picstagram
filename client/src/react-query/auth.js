import { queryCache } from 'react-query';

export function setAuthUser(user) {
  queryCache.setQueryData('auth', user);
}
