import React, { useState, useEffect } from 'react';
import { createParty, updateParty } from '../../api/partyApi';
import { getAllSalesmen } from '../../api/userApi';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Label from '../ui/Label';
import { X } from 'lucide-react';

const PartyFormModal = ({ party, onClose, onSave }) => {
  const getInitialState = () => ({
    partyName: party?.partyName || '',
    contactPerson: party?.contactPerson || '',
    contactNumber: party?.contactNumber || '',
    email: party?.email || '',
    address: party?.address || '',
    salesman: party?.salesman?._id || '',
  });

  const [formData, setFormData] = useState(getInitialState);
  const [salesmen, setSalesmen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditMode = !!party;

  useEffect(() => {
    const fetchSalesmen = async () => {
      try {
        const { data } = await getAllSalesmen();
        setSalesmen(data);
      } catch (err) {
        console.error("Failed to fetch salesmen");
      }
    };
    fetchSalesmen();
  }, []);

  useEffect(() => {
    setFormData(getInitialState());
  }, [party]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
      onSave();
      onClose();
    } catch (err) {
      // This part catches the error from the backend and displays it
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'save' : 'create'} party.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-foreground dark:bg-dark-foreground rounded-lg shadow-xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><X /></button>
        <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Party' : 'Add New Party'}</h1>
        {error && <p className="text-red-500 mb-4 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label htmlFor="partyName">Party Name <span className="text-red-500">*</span></Label><Input id="partyName" name="partyName" required value={formData.partyName} onChange={handleChange} /></div>
          <div><Label htmlFor="contactNumber">Contact Number <span className="text-red-500">*</span></Label><Input id="contactNumber" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} /></div>
          <div><Label htmlFor="contactPerson">Contact Person</Label><Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} /></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} /></div>
          <div><Label htmlFor="address">Address</Label><Input id="address" name="address" value={formData.address} onChange={handleChange} /></div>
          <div>
            <Label htmlFor="salesman">Assign Salesman <span className="text-red-500">*</span></Label>
            <Select id="salesman" name="salesman" required value={formData.salesman} onChange={handleChange}>
              <option value="" disabled>Select a Salesman</option>
              {salesmen.map(s => <option key={s._id} value={s._id}>{s.username}</option>)}
            </Select>
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full mt-4 px-4 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Party'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartyFormModal;
