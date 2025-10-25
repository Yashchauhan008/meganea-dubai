// import React, { useState, useEffect } from 'react';
// import { createDispatchOrder } from '../../api/dispatchApi';
// import { X, AlertTriangle, Box, Hash } from 'lucide-react';

// const DispatchFormModal = ({ imageData, onClose, onSave }) => {
//     const { booking, image } = imageData;
    
//     // State for the form inputs
//     const [invoiceNumber, setInvoiceNumber] = useState('');
//     const [dispatchedItems, setDispatchedItems] = useState([]);
    
//     // UI State
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     // Initialize the form state when the component mounts
//     useEffect(() => {
//         if (booking && booking.tilesList) {
//             // Initialize dispatchedItems with quantities set to 0
//             const initialItems = booking.tilesList.map(item => ({
//                 tile: item.tile,
//                 quantity: 0, // Start with 0, user will fill this in
//                 bookedQuantity: item.quantity, // Keep track of the original booked amount
//             }));
//             setDispatchedItems(initialItems);
//         }
//     }, [booking]);

//     const handleQuantityChange = (tileId, value) => {
//         const newQuantity = parseInt(value, 10) || 0;
//         setDispatchedItems(prev =>
//             prev.map(item =>
//                 item.tile._id === tileId ? { ...item, quantity: newQuantity } : item
//             )
//         );
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         // Filter out items where the quantity is 0
//         const itemsToSubmit = dispatchedItems
//             .filter(item => item.quantity > 0)
//             .map(item => ({
//                 tile: item.tile._id,
//                 quantity: item.quantity,
//             }));

//         if (itemsToSubmit.length === 0) {
//             setError('You must enter a quantity for at least one item.');
//             setLoading(false);
//             return;
//         }

//         const dispatchData = {
//             bookingId: booking._id,
//             unprocessedImageId: image._id,
//             invoiceNumber,
//             dispatchedItems: itemsToSubmit,
//         };

//         try {
//             await createDispatchOrder(dispatchData);
//             onSave(); // This will re-fetch the bookings on the DispatchPage
//             onClose();
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to create dispatch order.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//             <div className="bg-white dark:bg-dark-foreground rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-2xl font-bold">Create Dispatch Order</h2>
//                     <button onClick={onClose}><X /></button>
//                 </div>

//                 {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow overflow-y-auto">
//                     {/* Left Side: Image Viewer */}
//                     <div className="flex flex-col">
//                         <h3 className="font-semibold mb-2">Delivery Note Image</h3>
//                         <div className="border rounded-lg overflow-hidden flex-grow">
//                             <img src={image.imageUrl} alt="Delivery Note" className="w-full h-full object-contain" />
//                         </div>
//                     </div>

//                     {/* Right Side: Form */}
//                     <form id="dispatch-form" onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <label htmlFor="invoiceNumber" className="font-medium">Invoice Number</label>
//                             <input
//                                 id="invoiceNumber"
//                                 type="text"
//                                 value={invoiceNumber}
//                                 onChange={e => setInvoiceNumber(e.target.value)}
//                                 className="w-full mt-1 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border"
//                             />
//                         </div>

//                         <div>
//                             <h3 className="font-semibold">Enter Dispatched Quantities</h3>
//                             <p className="text-xs text-gray-500">Based on the image, enter the quantities that were delivered.</p>
//                         </div>

//                         <div className="space-y-3 max-h-96 overflow-y-auto pr-2 -mr-2">
//                             {dispatchedItems.map(item => {
//                                 const isOverDispatched = item.quantity > item.bookedQuantity;
//                                 return (
//                                     <div key={item.tile._id} className={`p-3 rounded-lg grid grid-cols-3 gap-4 items-center ${isOverDispatched ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-dark-background'}`}>
//                                         <div className="col-span-2">
//                                             <p className="font-bold text-sm">{item.tile.name}</p>
//                                             <p className="text-xs text-gray-500">Booked: {item.bookedQuantity} boxes</p>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <input
//                                                 type="number"
//                                                 min="0"
//                                                 value={item.quantity}
//                                                 onChange={e => handleQuantityChange(item.tile._id, e.target.value)}
//                                                 className={`w-full p-2 border rounded-md dark:bg-dark-background dark:border-dark-border ${isOverDispatched ? 'border-red-500' : ''}`}
//                                             />
//                                             <label className="text-sm">Boxes</label>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </form>
//                 </div>

//                 <div className="mt-6 pt-4 border-t dark:border-dark-border flex justify-end">
//                     <button type="submit" form="dispatch-form" disabled={loading} className="bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-primary-hover disabled:opacity-50">
//                         {loading ? 'Saving...' : 'Create Dispatch'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DispatchFormModal;


import React, { useState, useEffect } from 'react';
import { createDispatchOrder, updateDispatchOrder } from '../../api/dispatchApi';
import { X, Box } from 'lucide-react';

const DispatchFormModal = ({ data, onClose, onSave }) => {    // Check if we are in edit mode by seeing if a 'dispatch' object exists
    const isEditMode = !!data.dispatch;
    
    // Destructure the data passed in
    const booking = isEditMode ? data.dispatch.booking : data.booking;
    const image = isEditMode ? data.dispatch.sourceImage : data.image;
    const previouslyDispatched = data.previouslyDispatched;
    const dispatch = isEditMode ? data.dispatch : null;

    const [invoiceNumber, setInvoiceNumber] = useState(dispatch?.invoiceNumber || '');
    const [dispatchedItems, setDispatchedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        if (booking && booking.tilesList) {
            const initialItems = booking.tilesList.map(item => {
                const tileId = item.tile._id;
                const alreadyDispatchedInOtherOrders = previouslyDispatched?.[tileId] || 0;
                const originalBooked = item.quantity;
                
                const currentDispatchQty = isEditMode ? (dispatch.dispatchedItems.find(d => d.tile._id === tileId)?.quantity || 0) : 0;
                
                return {
                    tile: item.tile,
                    quantity: currentDispatchQty,
                    remaining: originalBooked - alreadyDispatchedInOtherOrders,
                };
            }).filter(item => item.remaining > 0 || item.quantity > 0);

            setDispatchedItems(initialItems);
        }
    }, [booking, dispatch, isEditMode, previouslyDispatched]);

    const handleQuantityChange = (tileId, value) => {
        const newQuantity = parseInt(value, 10) || 0;
        setDispatchedItems(prev =>
            prev.map(item =>
                item.tile._id === tileId ? { ...item, quantity: newQuantity } : item
            )
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const itemsToSubmit = dispatchedItems.filter(item => item.quantity > 0).map(item => ({
            tile: item.tile._id,
            quantity: item.quantity,
        }));

        for (const item of itemsToSubmit) {
            const formItem = dispatchedItems.find(i => i.tile._id === item.tile);
            if (item.quantity > formItem.remaining) {
                setError(`Quantity for ${formItem.tile.name} cannot exceed the remaining booked amount of ${formItem.remaining}.`);
                setLoading(false);
                return;
            }
        }

        const finalDispatchData = { invoiceNumber, dispatchedItems: itemsToSubmit };

        try {
            if (isEditMode) {
                await updateDispatchOrder(dispatch._id, finalDispatchData);
            } else {
                finalDispatchData.bookingId = booking._id;
                finalDispatchData.unprocessedImageId = image._id;
                await createDispatchOrder(finalDispatchData);
            }
            onSave();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} dispatch order.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-foreground rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{isEditMode ? 'Edit' : 'Create'} Dispatch Order</h2>
                    <button onClick={onClose}><X /></button>
                </div>

                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow overflow-y-auto">
                    <div className="flex flex-col">
                        <h3 className="font-semibold mb-2">Delivery Note Image</h3>
                        <div className="border rounded-lg overflow-hidden flex-grow">
                            <img src={image.imageUrl} alt="Delivery Note" className="w-full h-full object-contain" />
                        </div>
                    </div>

                    <form id="dispatch-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="invoiceNumber" className="font-medium">Invoice Number</label>
                            <input id="invoiceNumber" type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Enter Dispatched Quantities</h3>
                            <p className="text-xs text-gray-500">Enter the quantities that were delivered for this specific dispatch.</p>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 -mr-2">
                            {dispatchedItems.map(item => {
                                const isOverDispatched = item.quantity > item.remaining;
                                return (
                                    <div key={item.tile._id} className={`p-3 rounded-lg grid grid-cols-3 gap-4 items-center ${isOverDispatched ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-dark-background'}`}>
                                        <div className="col-span-2">
                                            <p className="font-bold text-sm">{item.tile.name}</p>
                                            <p className="text-xs text-gray-500">Max Allowed: {item.remaining} boxes</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="number" min="0" max={item.remaining} value={item.quantity} onChange={e => handleQuantityChange(item.tile._id, e.target.value)} className={`w-full p-2 border rounded-md dark:bg-dark-background dark:border-dark-border ${isOverDispatched ? 'border-red-500' : ''}`} />
                                            <label className="text-sm">Boxes</label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </form>
                </div>

                <div className="mt-6 pt-4 border-t dark:border-dark-border flex justify-end">
                    <button type="submit" form="dispatch-form" disabled={loading} className="bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-primary-hover disabled:opacity-50">
                        {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Dispatch')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DispatchFormModal;