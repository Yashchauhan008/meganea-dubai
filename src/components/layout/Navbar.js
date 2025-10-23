import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react'; // npm install lucide-react

const Navbar = () => {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();

  return (
    <nav className="bg-nav-bg dark:bg-dark-nav-bg shadow-md border-b border-border dark:border-dark-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary dark:text-dark-primary">
            Mega Nea Dubai
          </Link>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-foreground dark:hover:bg-dark-foreground">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {isAuthenticated ? (
              <>
                <span className="text-text-secondary dark:text-dark-text-secondary hidden sm:block">
                  Welcome, {user?.username}
                </span>
                <NavLink to="/dashboard" className="flex items-center space-x-2 text-text dark:text-dark-text hover:text-primary dark:hover:text-dark-primary">
                  <LayoutDashboard size={20} />
                  <span className="hidden md:inline">Dashboard</span>
                </NavLink>
                <button onClick={logout} className="flex items-center space-x-2 text-red-500 hover:text-red-700">
                  <LogOut size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-md font-semibold text-white bg-primary hover:bg-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover transition-colors"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
