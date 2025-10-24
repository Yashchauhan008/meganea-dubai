import React, { useState, useEffect } from 'react';
import { getAllParties, deleteParty, getPartyById } from '../api/partyApi';
import PartyFormModal from '../components/parties/PartyFormModal';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const PartyListPage = () => {
    const [parties, setParties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParty, setEditingParty] = useState(null);

    const fetchParties = async () => {
        try {
            setLoading(true);
            const response = await getAllParties();
            setParties(response.data);
        } catch (err) {
            setError('Failed to fetch parties.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParties();
    }, []);

    const handleAdd = () => {
        setEditingParty(null);
        setIsModalOpen(true);
    };

    const handleEdit = async (id) => {
        try {
            const response = await getPartyById(id);
            setEditingParty(response.data);
            setIsModalOpen(true);
        } catch (err) {
            setError('Failed to fetch party details.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this party?')) {
            try {
                await deleteParty(id);
                fetchParties(); // Refresh the list
            } catch (err) {
                setError('Failed to archive party.');
            }
        }
    };

    const handleSave = () => {
        fetchParties(); // Refresh the list after a save
    };

    if (loading && parties.length === 0) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {isModalOpen && (
                <PartyFormModal
                    party={editingParty}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
            <div className="bg-foreground dark:bg-dark-foreground rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-text dark:text-dark-text">Parties</h1>
                    <button onClick={handleAdd} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover">
                        <PlusCircle size={20} className="mr-2" />
                        Add Party
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-100 dark:bg-dark-border/20">
                            <tr>
                                <th className="py-3 px-4 text-left">Party Name</th>
                                <th className="py-3 px-4 text-left">Contact Person</th>
                                <th className="py-3 px-4 text-left">Contact Number</th>
                                <th className="py-3 px-4 text-left">Assigned Salesman</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-text dark:text-dark-text">
                            {parties.map((party) => (
                                <tr key={party._id} className="border-b border-border dark:border-dark-border">
                                    <td className="py-3 px-4">{party.partyName}</td>
                                    <td className="py-3 px-4">{party.contactPerson || '-'}</td>
                                    <td className="py-3 px-4">{party.contactNumber || '-'}</td>
                                    <td className="py-3 px-4">{party.salesman?.username || 'N/A'}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-4">
                                            <button onClick={() => handleEdit(party._id)} className="text-blue-500 hover:text-blue-700">
                                                <Edit size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(party._id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PartyListPage;
