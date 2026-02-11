import React, { createContext, useState, useContext, useMemo } from 'react';

const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('auth-token'));
  const [userName, setUserName] = useState(() => sessionStorage.getItem('user-name') || '');

  const login = (newToken, name = '') => {
    sessionStorage.setItem('auth-token', newToken);
    setToken(newToken);

    if (name) {
      sessionStorage.setItem('user-name', name);
      setUserName(name);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user-name');
    setToken(null);
    setUserName('');
  };

  const value = useMemo(() => ({
    isLoggedIn: Boolean(token),
    token,
    userName,
    login,
    logout,
  }), [token, userName]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
