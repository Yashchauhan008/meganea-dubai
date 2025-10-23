import React, { createContext, useState, useEffect, useMemo } from 'react';
import { getMe, logoutUser as logout } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => {
          // Token is invalid or expired
          setUser(null);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // useMemo helps to prevent re-rendering of consumers when the value hasn't changed
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      theme,
      login,
      logout: logoutUser,
      toggleTheme,
    }),
    [user, loading, theme]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
