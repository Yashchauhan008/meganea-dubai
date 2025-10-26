import React, { useState, useEffect, useCallback } from 'react';
import { getAllRestockRequests, updateRestockRequestStatus } from '../api/restockApi';
import { useAuth } from '../hooks/useAuth';
import { PlusCircle, RefreshCw, ChevronDown, CheckCircle, XCircle, Truck, Package, Hourglass } from 'lucide-react';
import { format } from 'date-fns';
import RestockFormModal from '../components/restocks/RestockFormModal';
import RestockViewModal from '../components/restocks/RestockViewModal';
import EditRestockRequestModal from '../components/restocks/EditRestockRequestModal';

// We will create these modal components in the next steps
// import RestockFormModal from '../components/restocks/RestockFormModal';
// import RestockViewModal from '../components/restocks/RestockViewModal';

const RestockListPage = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');
    const [isEditOpen, setIsEditOpen] = useState(false);
const [editingRequest, setEditingRequest] = useState(null);

    // Placeholder states for modals we will create later
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const canCreate = user?.role === 'admin' || user?.role === 'dubai-staff';
    const canProcess = user?.role === 'admin' || user?.role === 'india-staff';

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getAllRestockRequests();
            setRequests(data);
        } catch (err) {
            setError('Failed to fetch restock requests.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleStatusUpdate = async (requestId, newStatus) => {
        if (newStatus === 'Cancelled' && !window.confirm('Are you sure you want to cancel this request? This will revert the "restocking" stock count.')) {
            return;
        }
        try {
            await updateRestockRequestStatus(requestId, { status: newStatus });
            fetchRequests(); // Refresh the list
        } catch (err) {
            alert(err.response?.data?.message || `Failed to update status to ${newStatus}.`);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Pending': return { icon: Hourglass, color: 'text-yellow-500', pill: 'bg-yellow-100 text-yellow-800' };
            case 'Processing': return { icon: RefreshCw, color: 'text-blue-500', pill: 'bg-blue-100 text-blue-800' };
            case 'Partially Arrived': return { icon: Package, color: 'text-purple-500', pill: 'bg-purple-100 text-purple-800' };
            case 'Completed': return { icon: CheckCircle, color: 'text-green-500', pill: 'bg-green-100 text-green-800' };
            case 'Cancelled': return { icon: XCircle, color: 'text-red-500', pill: 'bg-red-100 text-red-800' };
            default: return { icon: Hourglass, color: 'text-gray-500', pill: 'bg-gray-100 text-gray-800' };
        }
    };

    const handleView = (requestId) => {
        setSelectedRequest(requestId); // We just need to pass the ID
        setIsViewOpen(true);
    };

    const handleEdit = (request) => {
        setEditingRequest(request);
        setIsEditOpen(true);
    };

    const filteredRequests = requests.filter(req => filter === 'All' || req.status === filter);

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {/* We will add modals here later */}
            {/* {isFormOpen && <RestockFormModal onClose={() => setIsFormOpen(false)} onSave={fetchRequests} />} */}
            {/* {isViewOpen && <RestockViewModal request={selectedRequest} onClose={() => setIsViewOpen(false)} onUpdate={fetchRequests} />} */}

            {isFormOpen && <RestockFormModal onClose={() => setIsFormOpen(false)} onSave={fetchRequests} />}

            {isViewOpen && <RestockViewModal requestId={selectedRequest} onClose={() => setIsViewOpen(false)} onUpdate={fetchRequests} />}

            {isEditOpen && <EditRestockRequestModal request={editingRequest} onClose={() => setIsEditOpen(false)} onSave={fetchRequests} />}


            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Restock Requests</h1>
                    <p className="text-gray-500 mt-1">Track items requested from the India warehouse.</p>
                </div>
                {canCreate && (
                <button 
                    onClick={() => setIsFormOpen(true)} // <-- UPDATE THIS LINE
                    className="w-full sm:w-auto flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover shadow-sm"
                >
                    <PlusCircle size={20} className="mr-2" /> New Restock Request
                </button>
            )}
            </div>

            {/* Filter Controls */}
            <div className="mb-6 flex items-center gap-4">
                <label className="font-medium">Status:</label>
                <select value={filter} onChange={e => setFilter(e.target.value)} className="p-2 border rounded-md dark:bg-dark-background dark:border-dark-border">
                    {['All', 'Pending', 'Processing', 'Partially Arrived', 'Completed', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {loading && <p className="text-center">Loading requests...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRequests.map(req => {
                        const { icon: Icon, color, pill } = getStatusInfo(req.status);
                        const totalRequested = req.requestedItems.reduce((sum, item) => sum + item.quantityRequested, 0);
                        const totalArrived = req.requestedItems.reduce((sum, item) => sum + item.quantityArrived, 0);

                        return (
                            <div key={req._id} className="bg-white dark:bg-dark-foreground rounded-xl shadow-md border dark:border-dark-border flex flex-col">
                                <div className="p-5 flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className={`font-mono text-sm ${color}`}>{req.requestId}</p>
                                            <p className="text-xs text-gray-500">by {req.requestedBy?.username || 'N/A'}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${pill}`}>{req.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Requested on {format(new Date(req.createdAt), 'dd MMM, yyyy')}
                                    </p>
                                    <div className="space-y-1 text-sm mb-4">
                                        <h4 className="font-semibold text-xs uppercase text-gray-400">Summary</h4>
                                        <p><strong>{req.requestedItems.length}</strong> unique tile types</p>
                                        <p><strong>{totalRequested}</strong> total boxes requested</p>
                                        <p><strong>{totalArrived}</strong> total boxes arrived</p>
                                    </div>
                                    {req.notes && (
                                        <div className="mt-2">
                                            <h4 className="font-semibold text-xs uppercase text-gray-400">Notes</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-dark-background p-2 rounded-md whitespace-pre-wrap">{req.notes}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t dark:border-dark-border p-3 bg-gray-50/50 dark:bg-dark-background/30 flex items-center justify-end space-x-2">
                                {(user?.role === 'admin' || user?.role === 'dubai-staff') && req.status === 'Pending' && (
                                    <button onClick={() => handleEdit(req)} className="text-sm font-semibold text-green-600 hover:underline">Edit</button>
                                )}
                                <button onClick={() => handleView(req._id)} className="text-sm font-semibold text-primary dark:text-dark-primary hover:underline">
                                    View Details
                                </button>
                                    {canProcess && req.status === 'Pending' && (
                                        <button onClick={() => handleStatusUpdate(req._id, 'Processing')} className="text-sm font-semibold text-blue-600 hover:underline">Mark as Processing</button>
                                    )}
                                    {canProcess && (req.status === 'Pending' || req.status === 'Processing') && (
                                        <button onClick={() => handleStatusUpdate(req._id, 'Cancelled')} className="text-sm font-semibold text-red-600 hover:underline">Cancel</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                     {filteredRequests.length === 0 && (
                        <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
                            <Truck size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-4 text-lg font-semibold">No Requests Found</h3>
                            <p className="text-gray-500 mt-1 text-sm">There are no restock requests with the selected status.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RestockListPage;
