// import React, { useState, useEffect, useCallback } from 'react';
// import { getAllBookings, cancelBooking, deleteBooking, getBookingById } from '../api/bookingApi';
// import BookingFormModal from '../components/bookings/BookingFormModal';
// import BookingViewModal from '../components/bookings/BookingViewModal';
// import { PlusCircle, XCircle, Eye, Edit, Trash2 } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth';
// import { format } from 'date-fns';

// const BookingListPage = () => {
//     const { user } = useAuth();
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
    
//     // Modal States
//     const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//     const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//     const [selectedBooking, setSelectedBooking] = useState(null);

//     const isAdmin = user?.role === 'admin';
//     const canEdit = isAdmin || user?.role === 'dubai-staff';

//     const fetchBookings = useCallback(async () => {
//         setLoading(true);
//         try {
//             const { data } = await getAllBookings();
//             setBookings(data);
//         } catch (err) {
//             setError('Failed to fetch bookings.');
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => { fetchBookings(); }, [fetchBookings]);

//     const handleView = async (bookingId) => {
//         try {
//             const { data } = await getBookingById(bookingId);
//             setSelectedBooking(data);
//             setIsViewModalOpen(true);
//         } catch (err) {
//             alert('Failed to fetch booking details.');
//         }
//     };

//     const handleEdit = async (bookingId) => {
//         try {
//             const { data } = await getBookingById(bookingId);
//             setSelectedBooking(data);
//             setIsFormModalOpen(true);
//         } catch (err) {
//             alert('Failed to fetch booking details for editing.');
//         }
//     };

//     const handleCancel = async (id) => {
//         if (window.confirm('Are you sure you want to CANCEL this booking? This will release the booked stock.')) {
//             try {
//                 await cancelBooking(id);
//                 fetchBookings();
//             } catch (err) { alert(err.response?.data?.message || 'Failed to cancel booking.'); }
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to DELETE (archive) this booking? This is for admin cleanup and will NOT revert stock.')) {
//             try {
//                 await deleteBooking(id);
//                 fetchBookings();
//             } catch (err) { alert(err.response?.data?.message || 'Failed to delete booking.'); }
//         }
//     };

//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'Booked': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
//             case 'Partially Dispatched': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
//             case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
//             case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
//             default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700';
//         }
//     };

//     return (
//         <div className="p-4 sm:p-6 md:p-8">
//             {isFormModalOpen && <BookingFormModal booking={selectedBooking} onClose={() => { setIsFormModalOpen(false); setSelectedBooking(null); }} onSave={fetchBookings} />}
//             {isViewModalOpen && <BookingViewModal booking={selectedBooking} onClose={() => { setIsViewModalOpen(false); setSelectedBooking(null); }} />}

//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold">Bookings</h1>
//                 <button onClick={() => { setSelectedBooking(null); setIsFormModalOpen(true); }} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover shadow-sm">
//                     <PlusCircle size={20} className="mr-2" /> New Booking
//                 </button>
//             </div>

//             {loading && <p>Loading...</p>}
//             {error && <p className="text-red-500">{error}</p>}
            
//             {!loading && !error && (
//                 <div className="bg-white dark:bg-dark-foreground shadow-md rounded-lg overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
//                         <thead className="bg-gray-50 dark:bg-dark-border/20">
//                             <tr>
//                                 <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Booking ID</th>
//                                 <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Company</th>
//                                 <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Salesman</th>
//                                 <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Date</th>
//                                 <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider">Status</th>
//                                 <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
//                             {bookings.map(booking => (
//                                 <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-dark-background/50">
//                                     <td className="py-4 px-4 font-mono text-sm">{booking.bookingId}</td>
//                                     <td className="py-4 px-4 text-sm">{booking.company?.companyName || 'N/A'}</td>
//                                     <td className="py-4 px-4 text-sm">{booking.salesman?.username || 'N/A'}</td>
//                                     <td className="py-4 px-4 text-sm">{format(new Date(booking.createdAt), 'dd-MMM-yyyy')}</td>
//                                     <td className="py-4 px-4 text-center"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>{booking.status}</span></td>
                                    
//                                     {/* --- UI CHANGE: DIRECT ACTION ICONS --- */}
//                                     <td className="py-4 px-4 text-center">
//                                         <div className="flex items-center justify-center space-x-3">
//                                             <button onClick={() => handleView(booking._id)} className="text-gray-500 hover:text-blue-500" title="View Details">
//                                                 <Eye size={18} />
//                                             </button>
//                                             {canEdit && booking.status === 'Booked' && (
//                                                 <button onClick={() => handleEdit(booking._id)} className="text-gray-500 hover:text-green-500" title="Edit Booking">
//                                                     <Edit size={18} />
//                                                 </button>
//                                             )}
//                                             {isAdmin && (
//                                                 <button onClick={() => handleDelete(booking._id)} className="text-gray-500 hover:text-red-500" title="Delete Booking">
//                                                     <Trash2 size={18} />
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </td>
//                                     {/* -------------------------------------- */}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BookingListPage;

import React, { useState, useEffect, useCallback } from 'react';
import { getAllBookings, cancelBooking, getBookingById } from '../api/bookingApi';
import BookingFormModal from '../components/bookings/BookingFormModal';
import BookingViewModal from '../components/bookings/BookingViewModal';
import ImageUploadModal from '../components/bookings/ImageUploadModal'; // Import new modal
import { PlusCircle, XCircle, Eye, Edit, Trash2, Calendar, User, FileText, Upload } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';

const BookingListPage = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal States
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const canEdit = user?.role === 'admin' || user?.role === 'dubai-staff';
    const canUpload = canEdit || user?.role === 'labor';

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getAllBookings();
            setBookings(data);
        } catch (err) {
            setError('Failed to fetch bookings.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const handleView = async (bookingId) => {
        try {
            const { data } = await getBookingById(bookingId);
            setSelectedBooking(data);
            setIsViewModalOpen(true);
        } catch (err) { alert('Failed to fetch booking details.'); }
    };

    const handleEdit = async (bookingId) => {
        try {
            const { data } = await getBookingById(bookingId);
            setSelectedBooking(data);
            setIsFormModalOpen(true);
        } catch (err) { alert('Failed to fetch booking details for editing.'); }
    };
    
    const handleOpenUpload = (bookingId) => {
        setSelectedBooking({ _id: bookingId }); // We only need the ID for the upload modal
        setIsUploadModalOpen(true);
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to CANCEL this booking? This will release the booked stock.')) {
            try {
                await cancelBooking(id);
                fetchBookings();
            } catch (err) { alert(err.response?.data?.message || 'Failed to cancel booking.'); }
        }
    };

    const getStatusPill = (status) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        switch (status) {
            case 'Booked': return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`;
            case 'Partially Dispatched': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
            case 'Completed': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
            case 'Cancelled': return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
            default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700`;
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {isFormModalOpen && <BookingFormModal booking={selectedBooking} onClose={() => { setIsFormModalOpen(false); setSelectedBooking(null); }} onSave={fetchBookings} />}
            {isViewModalOpen && <BookingViewModal booking={selectedBooking} onClose={() => { setIsViewModalOpen(false); setSelectedBooking(null); }} />}
            {isUploadModalOpen && <ImageUploadModal bookingId={selectedBooking?._id} onClose={() => { setIsUploadModalOpen(false); setSelectedBooking(null); }} onUploadSuccess={fetchBookings} />}

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">Bookings</h1>
                <button onClick={() => { setSelectedBooking(null); setIsFormModalOpen(true); }} className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover shadow-sm w-full sm:w-auto">
                    <PlusCircle size={20} className="mr-2" /> New Booking
                </button>
            </div>

            {loading && <p className="text-center">Loading bookings...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white dark:bg-dark-foreground rounded-xl shadow-md border dark:border-dark-border flex flex-col transition-shadow hover:shadow-lg">
                            <div className="p-5 flex-grow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-mono text-sm text-primary dark:text-dark-primary">{booking.bookingId}</p>
                                        <h3 className="font-bold text-lg text-text dark:text-dark-text truncate">{booking.company?.companyName || 'N/A'}</h3>
                                    </div>
                                    <span className={getStatusPill(booking.status)}>{booking.status}</span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                                    <p className="flex items-center gap-2"><User size={14} /> {booking.salesman?.username || 'N/A'}</p>
                                    <p className="flex items-center gap-2"><Calendar size={14} /> {format(new Date(booking.createdAt), 'dd MMM, yyyy')}</p>
                                    <p className="flex items-center gap-2"><FileText size={14} /> {booking.unprocessedImages?.length || 0} unprocessed notes</p>
                                </div>
                            </div>
                            <div className="border-t dark:border-dark-border p-3 bg-gray-50/50 dark:bg-dark-background/30 flex items-center justify-end space-x-2">
                                {canUpload && (
                                    <button onClick={() => handleOpenUpload(booking._id)} className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-dark-primary p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-border" title="Upload Delivery Notes">
                                        <Upload size={16} />
                                    </button>
                                )}
                                <button onClick={() => handleView(booking._id)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 rounded-md hover:bg-gray-100 dark:hover:bg-dark-border" title="View Details">
                                    <Eye size={16} />
                                </button>
                                {canEdit && booking.status === 'Booked' && (
                                    <>
                                        <button onClick={() => handleEdit(booking._id)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-500 rounded-md hover:bg-gray-100 dark:hover:bg-dark-border" title="Edit Booking">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleCancel(booking._id)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 rounded-md hover:bg-gray-100 dark:hover:bg-dark-border" title="Cancel Booking">
                                            <XCircle size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingListPage;
