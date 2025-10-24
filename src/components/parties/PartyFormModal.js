import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createParty, updateParty, getSalesmen } from '../../api/partyApi';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Label from '../ui/Label';
import { X } from 'lucide-react';

const PartyFormModal = ({ party, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    partyName: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    address: '',
    salesman: '',
  });
  const [salesmen, setSalesmen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const isEditMode = !!party;

  useEffect(() => {
    // Pre-fill form if in edit mode
    if (isEditMode) {
      setFormData({
        partyName: party.partyName || '',
        contactPerson: party.contactPerson || '',
        contactNumber: party.contactNumber || '',
        email: party.email || '',
        address: party.address || '',
        salesman: party.salesman?._id || '',
      });
    }

    // Fetch salesmen list if user is not a salesman
    if (user?.role !== 'salesman') {
      const fetchSalesmen = async () => {
        try {
          const response = await getSalesmen();
          setSalesmen(response.data);
        } catch (err) {
          setError('Failed to load salesmen list.');
        }
      };
      fetchSalesmen();
    } else {
        // If user is a salesman, set them as the default
        if (!isEditMode) {
            setFormData(prev => ({ ...prev, salesman: user._id }));
        }
    }
  }, [party, isEditMode, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditMode) {
        await updateParty(party._id, formData);
      } else {
        await createParty(formData);
      }
      onSave(); // Trigger refresh on the parent list
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} party.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-foreground dark:bg-dark-foreground rounded-lg shadow-xl p-8 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          <X size={24} />
        </button>
        <h1 className="text-3xl font-bold text-text dark:text-dark-text mb-6">
          {isEditMode ? 'Edit Party' : 'Add New Party'}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="partyName">Party Name</Label>
            <Input id="partyName" type="text" name="partyName" required value={formData.partyName} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input id="contactPerson" type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input id="contactNumber" type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>
          
          {user?.role !== 'salesman' ? (
            <div>
              <Label htmlFor="salesman">Assign Salesman</Label>
              <Select id="salesman" name="salesman" required value={formData.salesman} onChange={handleChange}>
                <option value="">Select a Salesman</option>
                {salesmen.map(s => (
                  <option key={s._id} value={s._id}>{s.username}</option>
                ))}
              </Select>
            </div>
          ) : (
            <input type="hidden" name="salesman" value={formData.salesman} />
          )}
          
          <button type="submit" disabled={loading} className="w-full mt-6 px-4 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Party'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartyFormModal;
