// import React, { useState } from 'react';
// import { registerUser } from '../../api/authApi';
// import { useNavigate, Link } from 'react-router-dom';

// const RegisterForm = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     role: 'salesman', // Default role
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);
//     try {
//       await registerUser(formData);
//       setSuccess('Registration successful! Please log in.');
//       setTimeout(() => navigate('/login'), 2000);
//     } catch (err) {
//       setError(err.message || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md p-8 space-y-6 bg-foreground dark:bg-dark-foreground rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-center text-text dark:text-dark-text">
//         Create an Account
//       </h2>
//       {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
//       {success && <p className="text-center text-green-500 bg-green-100 dark:bg-green-900/30 p-3 rounded-md">{success}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Username */}
//         <div>
//           <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Username</label>
//           <input
//             name="username"
//             type="text"
//             required
//             onChange={handleChange}
//             className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md"
//           />
//         </div>
//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Email</label>
//           <input
//             name="email"
//             type="email"
//             required
//             onChange={handleChange}
//             className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md"
//           />
//         </div>
//         {/* Password */}
//         <div>
//           <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Password</label>
//           <input
//             name="password"
//             type="password"
//             required
//             onChange={handleChange}
//             className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md"
//           />
//         </div>
//         {/* Role: In a real app, this might be admin-only. For now, it's a dropdown. */}
//         <div>
//           <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Role</label>
//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md"
//           >
//             <option value="salesman">Salesman</option>
//             <option value="dubai-staff">Dubai Staff</option>
//             <option value="india-staff">India Staff</option>
//             <option value="labor">Labor</option>
//             {/* Admin role should likely be set via backend only */}
//           </select>
//         </div>
//         <div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover disabled:opacity-50"
//           >
//             {loading ? 'Registering...' : 'Register'}
//           </button>
//         </div>
//       </form>
//        <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
//         Already have an account?{' '}
//         <Link to="/login" className="font-medium text-primary hover:underline dark:text-dark-primary">
//           Login here
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default RegisterForm;
import React, { useState } from 'react';
import { registerUser } from '../../api/authApi';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    // ADDED: contactNumber to initial state
    contactNumber: '',
    role: 'salesman', 
    location: 'Dubai', // Default location
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await registerUser(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-foreground dark:bg-dark-foreground rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-text dark:text-dark-text">
        Create an Account
      </h2>
      {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
      {success && <p className="text-center text-green-500 bg-green-100 dark:bg-green-900/30 p-3 rounded-md">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Username</label>
          <input
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Email</label>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md"
          />
        </div>
        {/* ADDED: Contact Number Field */}
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Contact Number</label>
          <input
            name="contactNumber"
            type="tel"
            required
            value={formData.contactNumber}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md"
          />
        </div>
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Password</label>
          <input
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md"
          />
        </div>
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md"
          >
            <option value="Dubai">Dubai</option>
            <option value="India">India</option>
          </select>
        </div>
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md"
          >
            <option value="salesman">Salesman</option>
            <option value="dubai-staff">Dubai Staff</option>
            <option value="india-staff">India Staff</option>
            <option value="labor">Labor</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
       <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline dark:text-dark-primary">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
