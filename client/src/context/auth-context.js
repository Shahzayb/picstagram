import React from 'react';
import { setAuthUser } from '../react-query/auth';
import { getMyProfile } from '../api/user';
import FullPageSpinner from '../component/FullPageSpinner';

const AuthContext = React.createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider(props) {
  const [isLoading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useLayoutEffect(() => {
    setLoading(true);
    getMyProfile()
      .then((user) => {
        setAuthUser(user);
        setUser(user);
      })
      .catch(() => {
        setAuthUser(null);
        setUser(null);
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = React.useCallback((user, token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    setLoading(true);

    setAuthUser(user);
    setUser(user);
    setLoading(false);
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem('token');
    setLoading(true);
    setAuthUser(null);
    setUser(null);
    setLoading(false);
  }, []);

  const value = React.useMemo(() => ({ user, login, logout }), [
    login,
    logout,
    user,
  ]);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return <AuthContext.Provider value={value} {...props} />;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };
