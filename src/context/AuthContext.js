import React, { createContext, useState, useEffect, useMemo } from 'react';
import { getMe, logoutUser as apiLogout } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Theme management useEffect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Authentication check useEffect
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // <-- Get stored user

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // <-- Set user from localStorage immediately
      } catch (error) {
        setUser(null); // Handle potential JSON parsing errors
      }
    }
    setLoading(false); // <-- Stop loading, UI can now render based on stored user
  }, []);

  const login = (data) => {
    // Store both user object and token
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    apiLogout(); // This is just removing the token from localStorage
    localStorage.removeItem('user'); // <-- Remove user object
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      theme,
      login,
      logout,
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
