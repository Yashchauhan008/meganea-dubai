import React, { useState, useEffect, useCallback } from 'react';
import { getAllCompanies, deleteCompany, getCompanyById } from '../api/companyApi';
import { getAllSalesmen } from '../api/userApi';
import CompanyFormModal from '../components/companies/CompanyFormModal';
import { PlusCircle, Edit, Trash2, Search, User, Phone, Mail, MapPin } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';

const CompanyListPage = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isAdminOrStaff = isAdmin || user?.role === 'dubai-staff';

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [salesmanFilter, setSalesmanFilter] = useState('');
    const [salesmen, setSalesmen] = useState([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchCompanies = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const params = {
                search: debouncedSearchTerm,
                salesman: salesmanFilter,
            };
            const { data } = await getAllCompanies(params);
            setCompanies(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch companies.');
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
        fetchCompanies();
    }, [fetchCompanies]);

    const handleAdd = () => {
        setEditingCompany(null);
        setIsModalOpen(true);
    };

    const handleEdit = async (id) => {
        try {
            const { data } = await getCompanyById(id);
            setEditingCompany(data); // Pass the full company object
            setIsModalOpen(true);
        } catch (err) {
            setError('Could not fetch company details.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this company?')) {
            try {
                await deleteCompany(id);
                fetchCompanies();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to archive company.');
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {isModalOpen && <CompanyFormModal company={editingCompany} onClose={() => setIsModalOpen(false)} onSave={fetchCompanies} />}
            
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-text dark:text-dark-text">Companies</h1>
                <button onClick={handleAdd} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover shadow-sm w-full sm:w-auto">
                    <PlusCircle size={20} className="mr-2" /> Add Company
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-grow min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by company name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border dark:border-dark-border rounded-md bg-foreground dark:bg-dark-foreground focus:ring-2 focus:ring-primary" />
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
                    {companies.map((company) => (
                        <div key={company._id} className="bg-foreground dark:bg-dark-foreground border border-border dark:border-dark-border rounded-xl shadow-md p-5 flex flex-col justify-between transition-shadow hover:shadow-lg">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-text dark:text-dark-text">{company.companyName}</h3>
                                        <p className="text-sm text-primary dark:text-dark-primary font-medium">{company.salesman?.username || 'N/A'}</p>
                                    </div>
                                    <div className="flex space-x-1">
                                        <button onClick={() => handleEdit(company._id)} className="p-2 text-gray-400 hover:text-blue-500"><Edit size={16} /></button>
                                        {isAdmin && (
                                            <button onClick={() => handleDelete(company._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                                    {company.contactPerson && <p className="flex items-center gap-2"><User size={14} /> {company.contactPerson}</p>}
                                    {company.contactNumber && <p className="flex items-center gap-2"><Phone size={14} /> {company.contactNumber}</p>}
                                    {company.email && <p className="flex items-center gap-2"><Mail size={14} /> {company.email}</p>}
                                    {company.address && <p className="flex items-center gap-2"><MapPin size={14} /> {company.address}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyListPage;
