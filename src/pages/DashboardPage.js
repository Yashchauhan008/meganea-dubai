// import React from 'react';
// import { useAuth } from '../hooks/useAuth';

// const DashboardPage = () => {
//   const { user } = useAuth();

//   return (
//     <div className="p-6 bg-foreground dark:bg-dark-foreground rounded-lg shadow-md">
//       <h1 className="text-3xl font-bold text-text dark:text-dark-text mb-2">
//         Dashboard
//       </h1>
//       <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-6">
//         Welcome back, <span className="font-semibold text-primary dark:text-dark-primary">{user?.username}</span>!
//       </p>
//       <div className="border-t border-border dark:border-dark-border pt-6">
//         <h2 className="text-xl font-semibold mb-4">Your Details</h2>
//         <ul className="space-y-2 text-text dark:text-dark-text">
//           <li><strong>Email:</strong> {user?.email}</li>
//           {/* ADDED: Display Contact Number */}
//           <li><strong>Contact Number:</strong> {user?.contactNumber || 'Not Specified'}</li>
//           <li><strong>Role:</strong> <span className="capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-sm">{user?.role}</span></li>
//           <li><strong>Location:</strong> {user?.location || 'Not Specified'}</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getDashboardData } from '../api/dashboardApi'; // Updated API function

// Import all dashboard components
import AdminDashboard from '../components/dashboard/AdminDashboard';
import DubaiStaffDashboard from '../components/dashboard/DubaiStaffDashboard';
import LaborDashboard from '../components/dashboard/LaborDashboard';

const DashboardPage = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;

            setLoading(true);
            setError('');
            try {
                // Single API call for all roles
                const { data } = await getDashboardData();
                setDashboardData(data);
            } catch (err) {
                setError('Failed to load dashboard data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    const renderDashboardByRole = () => {
        if (!dashboardData) return null;

        switch (user.role) {
            case 'admin':
                return <AdminDashboard stats={dashboardData} />;
            case 'dubai-staff':
                return <DubaiStaffDashboard stats={dashboardData} />;
            case 'labor':
                return <LaborDashboard stats={dashboardData} />;
            // Add other roles like 'salesman' here in the future
            default:
                return <p className="text-gray-500">Welcome! A dashboard for your role will be available soon.</p>;
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back, {user?.username || 'user'}!</p>
            </div>

            {loading && <p>Loading dashboard...</p>}
            {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>}
            {!loading && !error && renderDashboardByRole()}
        </div>
    );
};

export default DashboardPage;
