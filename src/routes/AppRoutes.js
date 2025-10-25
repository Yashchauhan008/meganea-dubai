// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';
// import SidebarLayout from '../components/layout/SidebarLayout';
// import LoginPage from '../pages/LoginPage';
// import RegisterPage from '../pages/RegisterPage';
// import DashboardPage from '../pages/DashboardPage';
// import PartyListPage from '../pages/PartyListPage';
// import SalesmanListPage from '../pages/SalesmanListPage';
// import TileListPage from '../pages/TileListPage';

// const AppRoutes = () => {
//     return (
//         <Router>
//             <Routes>
//                 {/* --- Public Routes (No Layout) --- */}
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/register" element={<RegisterPage />} />

//                 {/* --- Protected Routes (Wrapped in Layout) --- */}
//                 <Route
//                     path="/*"
//                     element={
//                         <ProtectedRoute> {/* General authentication check */}
//                             <SidebarLayout>
//                                 <Routes>
//                                     {/* Common Routes (accessible by all logged-in users) */}
//                                     <Route path="/dashboard" element={<DashboardPage />} />

//                                     {/* Role-Specific Routes */}
//                                     <Route
//                                         path="/parties"
//                                         element={
//                                             <ProtectedRoute roles={['admin', 'dubai-staff', 'salesman']}>
//                                                 <PartyListPage />
//                                             </ProtectedRoute>
//                                         }
//                                     />

//                                     <Route
//                                         path="/salesmen"
//                                         element={
//                                             <ProtectedRoute roles={['admin']}>
//                                                 <SalesmanListPage />
//                                             </ProtectedRoute>
//                                         }
//                                     />

//                                     <Route
//                                         path="/tiles"
//                                         element={
//                                             <ProtectedRoute roles={['admin', 'dubai-staff', 'india-staff']}>
//                                                 <TileListPage />
//                                             </ProtectedRoute>
//                                         }
//                                     />

//                                     {/* Fallback for any other authenticated route */}
//                                     <Route path="*" element={<DashboardPage />} />
//                                 </Routes>
//                             </SidebarLayout>
//                         </ProtectedRoute>
//                     }
//                 />
//             </Routes>
//         </Router>
//     );
// };

// export default AppRoutes;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import SidebarLayout from '../components/layout/SidebarLayout';

// Page Imports
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import PartyListPage from '../pages/PartyListPage';
import SalesmanListPage from '../pages/SalesmanListPage';
import TileListPage from '../pages/TileListPage';
// 1. --- IMPORT THE NEW BOOKING LIST PAGE ---
import BookingListPage from '../pages/BookingListPage'; 

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
                                    {/* Common Route (accessible by all logged-in users) */}
                                    <Route path="/dashboard" element={<DashboardPage />} />

                                    {/* Role-Specific Routes */}
                                    <Route
                                        path="/tiles"
                                        element={
                                            <ProtectedRoute roles={['admin', 'dubai-staff', 'india-staff']}>
                                                <TileListPage />
                                            </ProtectedRoute>
                                        }
                                    />
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

                                    {/* 2. --- ADD THE NEW ROUTE FOR BOOKINGS --- */}
                                    <Route
                                        path="/bookings"
                                        element={
                                            <ProtectedRoute roles={['admin', 'dubai-staff', 'salesman']}>
                                                <BookingListPage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    
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
