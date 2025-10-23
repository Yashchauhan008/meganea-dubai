import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { loginUser } from '../../api/authApi';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      auth.login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-foreground dark:bg-dark-foreground rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-text dark:text-dark-text">
        Welcome Back!
      </h2>
      {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-dark-primary dark:focus:border-dark-primary"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-dark-primary dark:focus:border-dark-primary"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-dark-primary disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
      <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline dark:text-dark-primary">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
