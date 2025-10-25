// import React, { useState, useEffect } from 'react';
// import { getAllParties, deleteParty, getPartyById } from '../api/partyApi';
// import PartyFormModal from '../components/parties/PartyFormModal';
// import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// const PartyListPage = () => {
//     const [parties, setParties] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
    
//     // Modal State
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingParty, setEditingParty] = useState(null);

//     const fetchParties = async () => {
//         try {
//             setLoading(true);
//             const response = await getAllParties();
//             setParties(response.data);
//         } catch (err) {
//             setError('Failed to fetch parties.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchParties();
//     }, []);

//     const handleAdd = () => {
//         setEditingParty(null);
//         setIsModalOpen(true);
//     };

//     const handleEdit = async (id) => {
//         try {
//             const response = await getPartyById(id);
//             setEditingParty(response.data);
//             setIsModalOpen(true);
//         } catch (err) {
//             setError('Failed to fetch party details.');
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to archive this party?')) {
//             try {
//                 await deleteParty(id);
//                 fetchParties(); // Refresh the list
//             } catch (err) {
//                 setError('Failed to archive party.');
//             }
//         }
//     };

//     const handleSave = () => {
//         fetchParties(); // Refresh the list after a save
//     };

//     if (loading && parties.length === 0) return <div>Loading...</div>;
//     if (error) return <div className="text-red-500">{error}</div>;

//     return (
//         <div className="p-4 sm:p-6 md:p-8">
//             {isModalOpen && (
//                 <PartyFormModal
//                     party={editingParty}
//                     onClose={() => setIsModalOpen(false)}
//                     onSave={handleSave}
//                 />
//             )}
//             <div className="bg-foreground dark:bg-dark-foreground rounded-lg shadow-md p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-3xl font-bold text-text dark:text-dark-text">Parties</h1>
//                     <button onClick={handleAdd} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover">
//                         <PlusCircle size={20} className="mr-2" />
//                         Add Party
//                     </button>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full">
//                         <thead className="bg-gray-100 dark:bg-dark-border/20">
//                             <tr>
//                                 <th className="py-3 px-4 text-left">Party Name</th>
//                                 <th className="py-3 px-4 text-left">Contact Person</th>
//                                 <th className="py-3 px-4 text-left">Contact Number</th>
//                                 <th className="py-3 px-4 text-left">Assigned Salesman</th>
//                                 <th className="py-3 px-4 text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="text-text dark:text-dark-text">
//                             {parties.map((party) => (
//                                 <tr key={party._id} className="border-b border-border dark:border-dark-border">
//                                     <td className="py-3 px-4">{party.partyName}</td>
//                                     <td className="py-3 px-4">{party.contactPerson || '-'}</td>
//                                     <td className="py-3 px-4">{party.contactNumber || '-'}</td>
//                                     <td className="py-3 px-4">{party.salesman?.username || 'N/A'}</td>
//                                     <td className="py-3 px-4">
//                                         <div className="flex space-x-4">
//                                             <button onClick={() => handleEdit(party._id)} className="text-blue-500 hover:text-blue-700">
//                                                 <Edit size={20} />
//                                             </button>
//                                             <button onClick={() => handleDelete(party._id)} className="text-red-500 hover:text-red-700">
//                                                 <Trash2 size={20} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PartyListPage;

import React, { useState, useEffect, useCallback } from 'react';
import { getAllParties, deleteParty, getPartyById } from '../api/partyApi';
import { getAllSalesmen } from '../api/userApi';
import PartyFormModal from '../components/parties/PartyFormModal';
import { PlusCircle, Edit, Trash2, Search, User, Phone, Mail, MapPin } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';

const PartyListPage = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isAdminOrStaff = isAdmin || user?.role === 'dubai-staff';

    const [parties, setParties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParty, setEditingParty] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [salesmanFilter, setSalesmanFilter] = useState('');
    const [salesmen, setSalesmen] = useState([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchParties = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const params = {
                search: debouncedSearchTerm,
                salesman: salesmanFilter,
            };
            const { data } = await getAllParties(params);
            setParties(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch parties.');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, salesmanFilter]);

    useEffect(() => {
        const fetchAllSalesmen = async () => {
            if (isAdminOrStaff) {
                try {
                    const { data } = await getAllSalesmen();
                    setSalesmen(data);
                } catch (err) {
                    console.error("Could not fetch salesmen for filter.");
                }
            }
        };
        fetchAllSalesmen();
    }, [isAdminOrStaff]);

    useEffect(() => {
        fetchParties();
    }, [fetchParties]);

    const handleAdd = () => {
        setEditingParty(null);
        setIsModalOpen(true);
    };

    const handleEdit = async (id) => {
        try {
            const { data } = await getPartyById(id);
            setEditingParty(data); // Pass the full party object
            setIsModalOpen(true);
        } catch (err) {
            setError('Could not fetch party details.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this party?')) {
            try {
                await deleteParty(id);
                fetchParties();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to archive party.');
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {isModalOpen && <PartyFormModal party={editingParty} onClose={() => setIsModalOpen(false)} onSave={fetchParties} />}
            
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-text dark:text-dark-text">Parties</h1>
                <button onClick={handleAdd} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover shadow-sm w-full sm:w-auto">
                    <PlusCircle size={20} className="mr-2" /> Add Party
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-grow min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by party name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border dark:border-dark-border rounded-md bg-foreground dark:bg-dark-foreground focus:ring-2 focus:ring-primary" />
                </div>
                {isAdminOrStaff && (
                    <select value={salesmanFilter} onChange={(e) => setSalesmanFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2 border border-border dark:border-dark-border rounded-md bg-foreground dark:bg-dark-foreground focus:ring-2 focus:ring-primary">
                        <option value="">All Salesmen</option>
                        {salesmen.map(s => <option key={s._id} value={s._id}>{s.username}</option>)}
                    </select>
                )}
            </div>

            {loading && <div className="text-center p-8">Loading...</div>}
            {!loading && error && <div className="p-6 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg"><h2 className="font-bold text-lg">An Error Occurred</h2><p>{error}</p></div>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {parties.map((party) => (
                        <div key={party._id} className="bg-foreground dark:bg-dark-foreground border border-border dark:border-dark-border rounded-xl shadow-md p-5 flex flex-col justify-between transition-shadow hover:shadow-lg">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-text dark:text-dark-text">{party.partyName}</h3>
                                        <p className="text-sm text-primary dark:text-dark-primary font-medium">{party.salesman?.username || 'N/A'}</p>
                                    </div>
                                    <div className="flex space-x-1">
                                        <button onClick={() => handleEdit(party._id)} className="p-2 text-gray-400 hover:text-blue-500"><Edit size={16} /></button>
                                        {isAdmin && (
                                            <button onClick={() => handleDelete(party._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                                    {party.contactPerson && <p className="flex items-center gap-2"><User size={14} /> {party.contactPerson}</p>}
                                    {party.contactNumber && <p className="flex items-center gap-2"><Phone size={14} /> {party.contactNumber}</p>}
                                    {party.email && <p className="flex items-center gap-2"><Mail size={14} /> {party.email}</p>}
                                    {party.address && <p className="flex items-center gap-2"><MapPin size={14} /> {party.address}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PartyListPage;
