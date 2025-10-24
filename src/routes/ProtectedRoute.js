import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// This component now accepts an array of allowed roles
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if the user's role is included
  if (roles && !roles.includes(user.role)) {
    // User is authenticated but not authorized
    // You can redirect to an "Unauthorized" page or back to the dashboard
    return <Navigate to="/dashboard" state={{ error: "Unauthorized" }} replace />;
  }

  // If authenticated and authorized, render the child component
  return children;
};

export default ProtectedRoute;
