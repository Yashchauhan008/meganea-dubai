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
//         <ul className="space-y-2">
//           <li><strong>Email:</strong> {user?.email}</li>
//           <li><strong>Role:</strong> <span className="capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-sm">{user?.role}</span></li>
//           <li><strong>Location:</strong> {user?.location || 'Not Specified'}</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 bg-foreground dark:bg-dark-foreground rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-text dark:text-dark-text mb-2">
        Dashboard
      </h1>
      <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-6">
        Welcome back, <span className="font-semibold text-primary dark:text-dark-primary">{user?.username}</span>!
      </p>
      <div className="border-t border-border dark:border-dark-border pt-6">
        <h2 className="text-xl font-semibold mb-4">Your Details</h2>
        <ul className="space-y-2 text-text dark:text-dark-text">
          <li><strong>Email:</strong> {user?.email}</li>
          {/* ADDED: Display Contact Number */}
          <li><strong>Contact Number:</strong> {user?.contactNumber || 'Not Specified'}</li>
          <li><strong>Role:</strong> <span className="capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-sm">{user?.role}</span></li>
          <li><strong>Location:</strong> {user?.location || 'Not Specified'}</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
