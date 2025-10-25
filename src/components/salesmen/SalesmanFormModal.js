// import React, { useState, useEffect } from 'react';
// import { createSalesman, updateSalesman } from '../../api/userApi';
// import Input from '../ui/Input';
// import Select from '../ui/Select';
// import Label from '../ui/Label';
// import { X } from 'lucide-react';

// const SalesmanFormModal = ({ salesman, onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     contactNumber: '',
//     location: 'Dubai', // <-- Default location is set here
//     isActive: true,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const isEditMode = !!salesman;

//   useEffect(() => {
//     if (isEditMode) {
//       setFormData({
//         username: salesman.username || '',
//         email: salesman.email || '',
//         password: '',
//         contactNumber: salesman.contactNumber || '',
//         location: salesman.location || 'Dubai', // Still defaults to Dubai if not set
//         isActive: salesman.isActive !== undefined ? salesman.isActive : true,
//       });
//     }
//   }, [salesman, isEditMode]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     const submissionData = { ...formData };
//     if (isEditMode && !submissionData.password) {
//       delete submissionData.password;
//     }

//     try {
//       if (isEditMode) {
//         await updateSalesman(salesman._id, submissionData);
//       } else {
//         await createSalesman(submissionData);
//       }
//       onSave();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} salesman.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//       <div className="bg-foreground dark:bg-dark-foreground rounded-lg shadow-xl p-8 w-full max-w-2xl relative">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
//           <X size={24} />
//         </button>
//         <h1 className="text-3xl font-bold text-text dark:text-dark-text mb-6">
//           {isEditMode ? 'Edit Salesman' : 'Add New Salesman'}
//         </h1>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="username">Username</Label>
//             <Input id="username" name="username" required value={formData.username} onChange={handleChange} />
//           </div>
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} />
//           </div>
//           <div>
//             <Label htmlFor="contactNumber">Contact Number</Label>
//             <Input id="contactNumber" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} />
//           </div>
//           <div>
//             <Label htmlFor="password">{isEditMode ? 'New Password (optional)' : 'Password'}</Label>
//             <Input id="password" type="password" name="password" required={!isEditMode} onChange={handleChange} />
//           </div>
          
//           {/* ----- UPDATED LOCATION FIELD ----- */}
//           <div>
//             <Label htmlFor="location">Location</Label>
//             <Input 
//               id="location" 
//               name="location" 
//               value="Dubai" 
//               readOnly 
//               className="bg-gray-100 dark:bg-dark-border cursor-not-allowed"
//             />
//           </div>

//           {isEditMode && (
//             <div className="flex items-center">
//               <input id="isActive" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
//               <Label htmlFor="isActive" className="ml-2 mb-0">Active</Label>
//             </div>
//           )}
//           <button type="submit" disabled={loading} className="w-full mt-6 px-4 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:opacity-50">
//             {loading ? 'Saving...' : 'Save Salesman'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SalesmanFormModal;

import React, { useState, useEffect } from 'react';
import { createSalesman, updateSalesman } from '../../api/userApi';
import Input from '../ui/Input';
import Label from '../ui/Label';
import { X } from 'lucide-react';

const SalesmanFormModal = ({ salesman, onClose, onSave }) => {
  const getInitialState = () => ({
    username: salesman?.username || '',
    email: salesman?.email || '',
    password: '',
    contactNumber: salesman?.contactNumber || '',
    isActive: salesman?.isActive ?? true,
  });

  const [formData, setFormData] = useState(getInitialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditMode = !!salesman;

  useEffect(() => {
    setFormData(getInitialState());
  }, [salesman]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submissionData = { ...formData };
      // Don't send an empty password string on update
      if (isEditMode && !submissionData.password) {
        delete submissionData.password;
      }

      if (isEditMode) {
        await updateSalesman(salesman._id, submissionData);
      } else {
        await createSalesman(submissionData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'save' : 'create'} salesman.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-foreground dark:bg-dark-foreground rounded-lg shadow-xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><X /></button>
        <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Salesman' : 'Add New Salesman'}</h1>
        {error && <p className="text-red-500 mb-4 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label htmlFor="username">Username <span className="text-red-500">*</span></Label><Input id="username" name="username" required value={formData.username} onChange={handleChange} /></div>
          <div><Label htmlFor="email">Email <span className="text-red-500">*</span></Label><Input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} /></div>
          <div><Label htmlFor="contactNumber">Contact Number</Label><Input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} /></div>
          <div><Label htmlFor="password">Password {isEditMode ? '(Leave blank to keep current)' : <span className="text-red-500">*</span>}</Label><Input id="password" type="password" name="password" required={!isEditMode} value={formData.password} onChange={handleChange} /></div>
          {isEditMode && (
            <div className="flex items-center">
              <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <Label htmlFor="isActive" className="ml-2">Active</Label>
            </div>
          )}
          <div>
            <button type="submit" disabled={loading} className="w-full mt-4 px-4 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Salesman'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesmanFormModal;
