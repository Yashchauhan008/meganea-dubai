import React, { useState, useEffect } from 'react';
import { getAllSalesmen, deleteSalesman, getUserById } from '../api/userApi';
import SalesmanFormModal from '../components/salesmen/SalesmanFormModal';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const SalesmanListPage = () => {
    const [salesmen, setSalesmen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSalesman, setEditingSalesman] = useState(null);

    const fetchSalesmen = async () => {
        try {
            setLoading(true);
            const response = await getAllSalesmen();
            setSalesmen(response.data);
        } catch (err) {
            setError('Failed to fetch salesmen.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesmen();
    }, []);

    const handleAdd = () => {
        setEditingSalesman(null);
        setIsModalOpen(true);
    };

    const handleEdit = async (id) => {
        try {
            const response = await getUserById(id);
            setEditingSalesman(response.data);
            setIsModalOpen(true);
        } catch (err) {
            setError('Failed to fetch salesman details.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this salesman?')) {
            try {
                await deleteSalesman(id);
                fetchSalesmen();
            } catch (err) {
                setError('Failed to archive salesman.');
            }
        }
    };

    if (loading && salesmen.length === 0) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {isModalOpen && (
                <SalesmanFormModal
                    salesman={editingSalesman}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchSalesmen}
                />
            )}
            <div className="bg-foreground dark:bg-dark-foreground rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-text dark:text-dark-text">Salesmen</h1>
                    <button onClick={handleAdd} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover">
                        <PlusCircle size={20} className="mr-2" />
                        Add Salesman
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-100 dark:bg-dark-border/20">
                            <tr>
                                <th className="py-3 px-4 text-left">Username</th>
                                <th className="py-3 px-4 text-left">Email</th>
                                <th className="py-3 px-4 text-left">Contact Number</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-text dark:text-dark-text">
                            {salesmen.map((salesman) => (
                                <tr key={salesman._id} className="border-b border-border dark:border-dark-border">
                                    <td className="py-3 px-4">{salesman.username}</td>
                                    <td className="py-3 px-4">{salesman.email}</td>
                                    <td className="py-3 px-4">{salesman.contactNumber}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${salesman.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {salesman.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-4">
                                            <button onClick={() => handleEdit(salesman._id)} className="text-blue-500 hover:text-blue-700">
                                                <Edit size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(salesman._id)} className="text-red-500 hover:text-red-700">
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

export default SalesmanListPage;
