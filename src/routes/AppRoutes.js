import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import SidebarLayout from '../components/layout/SidebarLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import PartyListPage from '../pages/PartyListPage';
import SalesmanListPage from '../pages/SalesmanListPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes (No Layout) --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected Routes (Wrapped in Layout) --- */}
        <Route
          path="/*"
          element={
            <ProtectedRoute> {/* General authentication check */}
              <SidebarLayout>
                <Routes>
                  {/* Common Routes (accessible by all logged-in users) */}
                  <Route path="/dashboard" element={<DashboardPage />} />

                  {/* Role-Specific Routes */}
                  <Route
                    path="/parties"
                    element={
                      <ProtectedRoute roles={['admin', 'dubai-staff', 'salesman']}>
                        <PartyListPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/salesmen"
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <SalesmanListPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Example for a future Accountant page */}
                  {/*
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute roles={['admin', 'accountant']}>
                        <ReportsPage />
                      </ProtectedRoute>
                    }
                  />
                  */}

                  {/* Fallback for any other authenticated route */}
                  <Route path="*" element={<DashboardPage />} />
                </Routes>
              </SidebarLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
