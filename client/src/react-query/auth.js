import { useQuery, queryCache } from 'react-query';
import { getMyProfile } from '../api/user';

export function useEnsureLogin() {
  return useQuery('auth', getMyProfile);
}

export function setAuthUser(user) {
  queryCache.setQueryData('auth', user);
}
