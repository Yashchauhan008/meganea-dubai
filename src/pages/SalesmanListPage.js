// import React, { useState, useEffect, useCallback } from 'react';
// import { getAllSalesmen, deleteSalesman, getUserById } from '../api/userApi';
// import SalesmanFormModal from '../components/salesmen/SalesmanFormModal';
// import { PlusCircle, Edit, Trash2, Search, User, Phone, Mail } from 'lucide-react';
// import useDebounce from '../hooks/useDebounce';
// import { useAuth } from '../hooks/useAuth';

// const SalesmanListPage = () => {
//     const { user } = useAuth();
//     const isAdmin = user?.role === 'admin';

//     const [salesmen, setSalesmen] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingSalesman, setEditingSalesman] = useState(null);
    
//     const [searchTerm, setSearchTerm] = useState('');
//     const debouncedSearchTerm = useDebounce(searchTerm, 500);

//     const fetchSalesmen = useCallback(async () => {
//         try {
//             setLoading(true);
//             setError('');
//             const params = { search: debouncedSearchTerm };
//             const { data } = await getAllSalesmen(params);
//             setSalesmen(data);
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to fetch salesmen.');
//         } finally {
//             setLoading(false);
//         }
//     }, [debouncedSearchTerm]);

//     useEffect(() => {
//         fetchSalesmen();
//     }, [fetchSalesmen]);

//     const handleAdd = () => {
//         setEditingSalesman(null);
//         setIsModalOpen(true);
//     };

//     const handleEdit = async (id) => {
//         try {
//             const { data } = await getUserById(id);
//             setEditingSalesman(data);
//             setIsModalOpen(true);
//         } catch (err) {
//             setError('Could not fetch salesman details.');
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to archive this salesman?')) {
//             try {
//                 await deleteSalesman(id);
//                 fetchSalesmen();
//             } catch (err) {
//                 setError(err.response?.data?.message || 'Failed to archive salesman.');
//             }
//         }
//     };

//     return (
//         <div className="p-4 sm:p-6 md:p-8">
//             {isModalOpen && <SalesmanFormModal salesman={editingSalesman} onClose={() => setIsModalOpen(false)} onSave={fetchSalesmen} />}
            
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//                 <h1 className="text-3xl font-bold text-text dark:text-dark-text">Salesmen</h1>
//                 <button onClick={handleAdd} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover shadow-sm w-full sm:w-auto">
//                     <PlusCircle size={20} className="mr-2" /> Add Salesman
//                 </button>
//             </div>

//             <div className="flex flex-wrap items-center gap-4 mb-6">
//                 <div className="relative flex-grow min-w-[250px]">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                     <input type="text" placeholder="Search by username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border dark:border-dark-border rounded-md bg-foreground dark:bg-dark-foreground focus:ring-2 focus:ring-primary" />
//                 </div>
//             </div>

//             {loading && <div className="text-center p-8">Loading...</div>}
//             {!loading && error && <div className="p-6 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg"><h2 className="font-bold text-lg">An Error Occurred</h2><p>{error}</p></div>}
            
//             {!loading && !error && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {salesmen.map((salesman) => (
//                         <div key={salesman._id} className="bg-foreground dark:bg-dark-foreground border border-border dark:border-dark-border rounded-xl shadow-md p-5 flex flex-col justify-between transition-shadow hover:shadow-lg">
//                             <div>
//                                 <div className="flex justify-between items-start mb-4">
//                                     <div>
//                                         <h3 className="font-bold text-lg text-text dark:text-dark-text">{salesman.username}</h3>
//                                         <p className={`text-xs font-semibold ${salesman.isActive ? 'text-green-500' : 'text-red-500'}`}>{salesman.isActive ? 'Active' : 'Inactive'}</p>
//                                     </div>
//                                     {isAdmin && (
//                                         <div className="flex space-x-1">
//                                             <button onClick={() => handleEdit(salesman._id)} className="p-2 text-gray-400 hover:text-blue-500"><Edit size={16} /></button>
//                                             <button onClick={() => handleDelete(salesman._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
//                                     <p className="flex items-center gap-2"><Mail size={14} /> {salesman.email}</p>
//                                     {salesman.contactNumber && <p className="flex items-center gap-2"><Phone size={14} /> {salesman.contactNumber}</p>}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SalesmanListPage;

import React, { useState, useEffect, useCallback } from 'react';
import { getAllSalesmen, deleteSalesman, getUserById, getSalesmanCompanies } from '../api/userApi';
import SalesmanFormModal from '../components/salesmen/SalesmanFormModal';
import { PlusCircle, Edit, Trash2, Search, User, Phone, Mail, ChevronDown, Loader2 } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';

// A new component for the accordion content
const CompaniesAccordion = ({ salesmanId }) => {
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setIsLoading(true);
                const { data } = await getSalesmanCompanies(salesmanId);
                setCompanies(data);
            } catch (error) {
                console.error("Failed to fetch companies for salesman", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, [salesmanId]);

    if (isLoading) {
        return <div className="p-4 text-center text-sm">Loading companies...</div>;
    }

    if (companies.length === 0) {
        return <div className="p-4 text-center text-sm text-gray-500">No companies assigned to this salesman.</div>;
    }

    return (
        <div className="bg-gray-50 dark:bg-dark-background/50 p-4 mt-4 rounded-b-lg">
            <h4 className="font-bold mb-2 text-sm">Assigned Companies:</h4>
            <ul className="space-y-2">
                {companies.map(company => (
                    <li key={company._id} className="text-xs text-text-secondary dark:text-dark-text-secondary">
                        <p className="font-semibold text-text dark:text-dark-text">{company.companyName}</p>
                        {company.contactPerson && <p>{company.contactPerson} - {company.contactNumber}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
};


const SalesmanListPage = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [salesmen, setSalesmen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSalesman, setEditingSalesman] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // State to manage which accordion is open
    const [openAccordionId, setOpenAccordionId] = useState(null);

    const fetchSalesmen = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const params = { search: debouncedSearchTerm };
            const { data } = await getAllSalesmen(params);
            setSalesmen(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch salesmen.');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        fetchSalesmen();
    }, [fetchSalesmen]);

    const handleAdd = () => {
        setEditingSalesman(null);
        setIsModalOpen(true);
    };

    const handleEdit = async (id) => {
        try {
            const { data } = await getUserById(id);
            setEditingSalesman(data);
            setIsModalOpen(true);
        } catch (err) {
            setError('Could not fetch salesman details.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this salesman?')) {
            try {
                await deleteSalesman(id);
                fetchSalesmen();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to archive salesman.');
            }
        }
    };

    const toggleAccordion = (id) => {
        setOpenAccordionId(openAccordionId === id ? null : id);
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {isModalOpen && <SalesmanFormModal salesman={editingSalesman} onClose={() => setIsModalOpen(false)} onSave={fetchSalesmen} />}
            
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-text dark:text-dark-text">Salesmen</h1>
                <button onClick={handleAdd} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover shadow-sm w-full sm:w-auto">
                    <PlusCircle size={20} className="mr-2" /> Add Salesman
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-grow min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border dark:border-dark-border rounded-md bg-foreground dark:bg-dark-foreground focus:ring-2 focus:ring-primary" />
                </div>
            </div>

            {loading && <div className="text-center p-8"><Loader2 className="animate-spin inline-block" /></div>}
            {!loading && error && <div className="p-6 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg"><h2 className="font-bold text-lg">An Error Occurred</h2><p>{error}</p></div>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {salesmen.map((salesman) => (
                        <div key={salesman._id} className="bg-foreground dark:bg-dark-foreground border border-border dark:border-dark-border rounded-xl shadow-md flex flex-col transition-shadow hover:shadow-lg">
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-text dark:text-dark-text">{salesman.username}</h3>
                                        <p className={`text-xs font-semibold ${salesman.isActive ? 'text-green-500' : 'text-red-500'}`}>{salesman.isActive ? 'Active' : 'Inactive'}</p>
                                    </div>
                                    {isAdmin && (
                                        <div className="flex space-x-1">
                                            <button onClick={() => handleEdit(salesman._id)} className="p-2 text-gray-400 hover:text-blue-500"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(salesman._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                                    <p className="flex items-center gap-2"><Mail size={14} /> {salesman.email}</p>
                                    {salesman.contactNumber && <p className="flex items-center gap-2"><Phone size={14} /> {salesman.contactNumber}</p>}
                                </div>
                            </div>
                            
                            {/* Accordion Trigger */}
                            <div className="border-t border-border dark:border-dark-border mt-auto">
                                <button onClick={() => toggleAccordion(salesman._id)} className="w-full flex justify-between items-center p-3 text-sm font-medium text-text-secondary dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-background/50 rounded-b-xl">
                                    <span>View Assigned Companies</span>
                                    <ChevronDown size={18} className={`transition-transform ${openAccordionId === salesman._id ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {/* Accordion Content */}
                            {openAccordionId === salesman._id && <CompaniesAccordion salesmanId={salesman._id} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SalesmanListPage;
