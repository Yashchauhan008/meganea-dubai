// import React, { useState, useEffect, useCallback } from 'react';
// import { getAllBookings, getBookingById } from '../api/bookingApi';
// import DispatchFormModal from '../components/dispatch/DispatchFormModal';
// import { FileText } from 'lucide-react';
// import { format } from 'date-fns';

// const DispatchPage = () => {
//     const [bookingsWithImages, setBookingsWithImages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
    
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedImageData, setSelectedImageData] = useState(null);
//     const [selectedData, setSelectedData] = useState(null); // Rename state for clarity


//     const fetchBookingsToProcess = useCallback(async () => {
//         setLoading(true);
//         try {
//             const { data } = await getAllBookings();
//             const filtered = data.filter(b => b.unprocessedImages && b.unprocessedImages.length > 0);
//             setBookingsWithImages(filtered);
//         } catch (err) {
//             setError('Failed to fetch bookings for processing.');
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchBookingsToProcess();
//     }, [fetchBookingsToProcess]);

//     const handleProcessImage = async (bookingId, image) => {
//         try {
//             const { data: fullBooking } = await getBookingById(bookingId);
            
//             const previouslyDispatched = {};
//             if (fullBooking.dispatchOrders && fullBooking.dispatchOrders.length > 0) {
//                 fullBooking.dispatchOrders.forEach(order => {
//                     order.dispatchedItems.forEach(item => {
//                         const tileId = item.tile._id.toString();
//                         previouslyDispatched[tileId] = (previouslyDispatched[tileId] || 0) + item.quantity;
//                     });
//                 });
//             }

//             // Set the state with the correct structure for the modal
//             setSelectedData({ // <-- Use the renamed state setter
//                 booking: fullBooking,
//                 image: image,
//                 previouslyDispatched: previouslyDispatched,
//             });
//             setIsModalOpen(true);
//         } catch (err) {
//             alert('Error: Could not load booking details. Please refresh and try again.');
//         }
//     };

//     return (
//         <div className="p-4 sm:p-6 md:p-8">
//             {isModalOpen && (
//                 <DispatchFormModal 
//                 data={selectedData} 
//                 onClose={() => setIsModalOpen(false)} 
//                 onSave={fetchBookingsToProcess} 
//             />
//             )}

//             <div className="mb-6">
//                 <h1 className="text-3xl font-bold">Dispatch Workbench</h1>
//                 <p className="text-gray-500 mt-1">Review uploaded delivery notes and create dispatch orders.</p>
//             </div>

//             {loading && <p className="text-center">Loading unprocessed notes...</p>}
//             {error && <p className="text-center text-red-500">{error}</p>}
            
//             {!loading && !error && bookingsWithImages.length === 0 && (
//                 <div className="text-center py-16 border-2 border-dashed rounded-lg">
//                     <FileText size={48} className="mx-auto text-gray-400" />
//                     <h3 className="mt-4 text-lg font-semibold">All Clear!</h3>
//                     <p className="text-gray-500 mt-1">There are no delivery notes waiting to be processed.</p>
//                 </div>
//             )}

//             <div className="space-y-8">
//                 {bookingsWithImages.map(booking => (
//                     <div key={booking._id} className="bg-white dark:bg-dark-foreground rounded-lg shadow-md border dark:border-dark-border">
//                         <div className="p-4 border-b dark:border-dark-border">
//                             <h2 className="font-bold text-lg">{booking.company?.companyName || 'Unknown Company'}</h2>
//                             <p className="text-sm text-gray-500 font-mono">{booking.bookingId}</p>
//                         </div>
//                         <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                             {booking.unprocessedImages.map(image => (
//                                 <div key={image._id} className="border rounded-lg overflow-hidden group">
//                                     <img src={image.imageUrl} alt="Delivery Note" className="w-full h-40 object-cover" />
//                                     <div className="p-3">
//                                         <p className="text-xs text-gray-500">Uploaded on:</p>
//                                         <p className="text-sm font-semibold">{format(new Date(image.uploadedAt), 'dd MMM yyyy, h:mm a')}</p>
//                                         <button 
//                                             onClick={() => handleProcessImage(booking._id, image)}
//                                             className="w-full mt-3 bg-primary text-white text-sm font-bold py-2 rounded-md hover:bg-primary-hover"
//                                         >
//                                             Process Note
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default DispatchPage;
import React, { useState, useEffect, useCallback } from 'react';
import { getAllBookings, getBookingById, deleteUnprocessedImage } from '../api/bookingApi';
import DispatchFormModal from '../components/dispatch/DispatchFormModal';
import { FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';

const DispatchPage = () => {
    const { user } = useAuth(); // Get the current logged-in user
    const [bookingsWithImages, setBookingsWithImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const fetchBookingsToProcess = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getAllBookings();
            const filtered = data.filter(b => b.unprocessedImages && b.unprocessedImages.length > 0);
            setBookingsWithImages(filtered);
        } catch (err) {
            setError('Failed to fetch bookings for processing.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookingsToProcess();
    }, [fetchBookingsToProcess]);

    const handleProcessImage = async (bookingId, image) => {
        try {
            const { data: fullBooking } = await getBookingById(bookingId);
            
            const previouslyDispatched = {};
            if (fullBooking.dispatchOrders && fullBooking.dispatchOrders.length > 0) {
                fullBooking.dispatchOrders.forEach(order => {
                    order.dispatchedItems.forEach(item => {
                        const tileId = item.tile._id.toString();
                        previouslyDispatched[tileId] = (previouslyDispatched[tileId] || 0) + item.quantity;
                    });
                });
            }

            setSelectedData({
                booking: fullBooking,
                image: image,
                previouslyDispatched: previouslyDispatched,
            });
            setIsModalOpen(true);
        } catch (err) {
            alert('Error: Could not load booking details. Please refresh and try again.');
        }
    };

    const handleDeleteNote = async (bookingId, imageId) => {
        if (window.confirm('Are you sure you want to permanently delete this delivery note? This action cannot be undone.')) {
            try {
                await deleteUnprocessedImage(bookingId, imageId);
                fetchBookingsToProcess(); 
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete the note.');
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {isModalOpen && (
                <DispatchFormModal 
                    data={selectedData} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={fetchBookingsToProcess} 
                />
            )}

            <div className="mb-6">
                <h1 className="text-3xl font-bold">Dispatch Workbench</h1>
                <p className="text-gray-500 mt-1">Review uploaded delivery notes and create dispatch orders.</p>
            </div>

            {loading && <p className="text-center">Loading unprocessed notes...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            
            {!loading && !error && bookingsWithImages.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <FileText size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold">All Clear!</h3>
                    <p className="text-gray-500 mt-1">There are no delivery notes waiting to be processed.</p>
                </div>
            )}

            <div className="space-y-8">
                {bookingsWithImages.map(booking => (
                    <div key={booking._id} className="bg-white dark:bg-dark-foreground rounded-lg shadow-md border dark:border-dark-border">
                        <div className="p-4 border-b dark:border-dark-border">
                            <h2 className="font-bold text-lg">{booking.company?.companyName || 'Unknown Company'}</h2>
                            <p className="text-sm text-gray-500 font-mono">{booking.bookingId}</p>
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {booking.unprocessedImages.map(image => {
                                // --- PERMISSION LOGIC FOR ALL ACTIONS ---
                                const isUploader = user?._id === image.uploadedBy;
                                const isAdminOrStaff = user?.role === 'admin' || user?.role === 'dubai-staff';
                                
                                // Rule for deleting: Admin, Staff, or the original uploader
                                const canDelete = isAdminOrStaff || isUploader;
                                
                                // Rule for processing: ONLY Admin or Staff
                                const canProcess = isAdminOrStaff;
                                // -----------------------------------------
                                
                                return (
                                    <div key={image._id} className="border rounded-lg overflow-hidden group flex flex-col">
                                        <a href={image.imageUrl} target="_blank" rel="noopener noreferrer" className="block">
                                            <img src={image.imageUrl} alt="Delivery Note" className="w-full h-40 object-cover" />
                                        </a>
                                        <div className="p-3 flex flex-col flex-grow">
                                            <p className="text-xs text-gray-500">Uploaded on:</p>
                                            <p className="text-sm font-semibold mb-3">{format(new Date(image.uploadedAt), 'dd MMM yyyy, h:mm a')}</p>
                                            
                                            <div className="mt-auto flex items-center gap-2">
                                                {/* --- CONDITIONAL "PROCESS NOTE" BUTTON --- */}
                                                {canProcess && (
                                                    <button 
                                                        onClick={() => handleProcessImage(booking._id, image)}
                                                        className="flex-grow bg-primary text-white text-sm font-bold py-2 rounded-md hover:bg-primary-hover"
                                                    >
                                                        Process Note
                                                    </button>
                                                )}
                                                
                                                {/* Conditional delete button (logic remains the same) */}
                                                {canDelete && (
                                                    <button 
                                                        onClick={() => handleDeleteNote(booking._id, image._id)}
                                                        // If the process button is hidden, make the delete button take up full width
                                                        className={`p-2 text-red-500 bg-red-100 dark:bg-red-900/30 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 ${!canProcess ? 'w-full' : ''}`}
                                                        title="Delete Note"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DispatchPage;

