import React, { createContext, useState, useContext, useMemo } from 'react';

const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('auth-token'));
  const [userName, setUserName] = useState(() => sessionStorage.getItem('user-name') || sessionStorage.getItem('name') || '');
  const [userEmail, setUserEmail] = useState(() => sessionStorage.getItem('email') || '');

  const login = (newToken, name = '', email = '') => {
    if (newToken) {
      sessionStorage.setItem('auth-token', newToken);
      setToken(newToken);
    }

    if (name) {
      const trimmedName = name.trim();
      sessionStorage.setItem('user-name', trimmedName);
      sessionStorage.setItem('name', trimmedName);
      setUserName(trimmedName);
    }

    if (email) {
      const normalizedEmail = email.toLowerCase();
      sessionStorage.setItem('email', normalizedEmail);
      setUserEmail(normalizedEmail);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user-name');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    setToken(null);
    setUserName('');
    setUserEmail('');
  };

  const value = useMemo(() => ({
    isLoggedIn: Boolean(token),
    token,
    userName,
    userEmail,
    login,
    logout,
    setUserName,
  }), [token, userName, userEmail]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
