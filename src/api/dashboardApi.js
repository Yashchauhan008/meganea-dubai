import api from './api';

// This is the single, unified function to get dashboard data for any role.
// It matches the backend controller and route.
export const getDashboardData = () => {
  return api.get('/dashboard');
};
