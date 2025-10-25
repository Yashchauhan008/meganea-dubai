// import React, { useState, useEffect } from 'react';
// import { createDispatchOrder, updateDispatchOrder } from '../../api/dispatchApi';
// import { X, Box } from 'lucide-react';

// const DispatchFormModal = ({ data, onClose, onSave }) => {
//     const isEditMode = !!data.dispatch;

//     const booking = isEditMode ? data.dispatch.booking : data.booking;
//     const image = isEditMode ? data.dispatch.sourceImage : data.image;
//     const dispatchToEdit = isEditMode ? data.dispatch : null;

//     const [invoiceNumber, setInvoiceNumber] = useState(dispatchToEdit?.invoiceNumber || '');
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         // --- THIS IS THE CRITICAL FIX ---
//         // Always check if 'booking' and 'booking.tilesList' exist before proceeding.
//         if (!booking || !booking.tilesList) {
//             setError("Error: Associated booking data is incomplete. Cannot load items.");
//             return; // Stop execution to prevent the crash.
//         }
//         // --- END OF FIX ---

//         let formItems = [];

//         if (isEditMode) {
//             formItems = dispatchToEdit.dispatchedItems.map(dispatchedItem => {
//                 const bookingItem = booking.tilesList.find(bi => bi.tile._id === dispatchedItem.tile._id);
//                 const otherDispatches = booking.dispatchOrders.filter(o => o._id !== dispatchToEdit._id);
                
//                 let totalInOtherDispatches = 0;
//                 otherDispatches.forEach(od => {
//                     const item = od.dispatchedItems.find(oi => oi.tile._id === dispatchedItem.tile._id);
//                     if (item) totalInOtherDispatches += item.quantity;
//                 });

//                 const maxAllowed = (bookingItem?.quantity || 0) - totalInOtherDispatches;

//                 return {
//                     tile: dispatchedItem.tile,
//                     quantity: dispatchedItem.quantity,
//                     maxAllowed: maxAllowed,
//                 };
//             });
//         } else {
//             const previouslyDispatched = data.previouslyDispatched || {};
//             formItems = booking.tilesList.map(bookedItem => {
//                 const alreadyDispatched = previouslyDispatched[bookedItem.tile._id] || 0;
//                 return {
//                     tile: bookedItem.tile,
//                     quantity: 0,
//                     maxAllowed: bookedItem.quantity - alreadyDispatched,
//                 };
//             }).filter(item => item.maxAllowed > 0);
//         }
//         setItems(formItems);
//     }, [data, isEditMode, booking, dispatchToEdit]);

//     const handleQuantityChange = (tileId, value) => {
//         const newQuantity = parseInt(value, 10) || 0;
//         setItems(prev => prev.map(item => item.tile._id === tileId ? { ...item, quantity: newQuantity } : item));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         const itemsToSubmit = items.filter(item => item.quantity > 0).map(item => ({
//             tile: item.tile._id,
//             quantity: item.quantity,
//         }));

//         for (const item of itemsToSubmit) {
//             const formItem = items.find(i => i.tile._id === item.tile);
//             if (item.quantity > formItem.maxAllowed) {
//                 setError(`Quantity for ${formItem.tile.name} cannot exceed max allowed of ${formItem.maxAllowed}.`);
//                 setLoading(false);
//                 return;
//             }
//         }

//         const finalDispatchData = { invoiceNumber, dispatchedItems: itemsToSubmit };

//         try {
//             if (isEditMode) {
//                 await updateDispatchOrder(dispatchToEdit._id, finalDispatchData);
//             } else {
//                 finalDispatchData.bookingId = booking._id;
//                 finalDispatchData.unprocessedImageId = data.image._id;
//                 await createDispatchOrder(finalDispatchData);
//             }
//             onSave();
//             onClose();
//         } catch (err) {
//             setError(err.response?.data?.message || `Failed to save dispatch order.`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//             <div className="bg-white dark:bg-dark-foreground rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-2xl font-bold">{isEditMode ? 'Edit' : 'Create'} Dispatch Order</h2>
//                     <button onClick={onClose}><X /></button>
//                 </div>

//                 {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow overflow-y-auto">
//                     <div className="flex flex-col">
//                         <h3 className="font-semibold mb-2">Delivery Note Image</h3>
//                         <div className="border rounded-lg overflow-hidden flex-grow">
//                             <img src={image?.imageUrl} alt="Delivery Note" className="w-full h-full object-contain" />
//                         </div>
//                     </div>

//                     <form id="dispatch-form" onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <label htmlFor="invoiceNumber" className="font-medium">Invoice Number</label>
//                             <input id="invoiceNumber" type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border" />
//                         </div>
//                         <div>
//                             <h3 className="font-semibold">Dispatched Quantities</h3>
//                             <p className="text-xs text-gray-500">
//                                 {isEditMode ? "Correct the quantities for this specific dispatch." : "Enter the quantities delivered in this dispatch."}
//                             </p>
//                         </div>
//                         <div className="space-y-3 max-h-96 overflow-y-auto pr-2 -mr-2">
//                             {items.length > 0 ? items.map(item => {
//                                 const isOverDispatched = item.quantity > item.maxAllowed;
//                                 return (
//                                     <div key={item.tile._id} className={`p-3 rounded-lg grid grid-cols-3 gap-4 items-center ${isOverDispatched ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-dark-background'}`}>
//                                         <div className="col-span-2">
//                                             <p className="font-bold text-sm">{item.tile.name}</p>
//                                             <p className="text-xs text-gray-500">Max Allowed: {item.maxAllowed} boxes</p>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <input type="number" min="0" max={item.maxAllowed} value={item.quantity} onChange={e => handleQuantityChange(item.tile._id, e.target.value)} className={`w-full p-2 border rounded-md dark:bg-dark-background dark:border-dark-border ${isOverDispatched ? 'border-red-500' : ''}`} />
//                                             <label className="text-sm">Boxes</label>
//                                         </div>
//                                     </div>
//                                 );
//                             }) : <p className="text-center text-gray-500 py-8">No items available for this dispatch.</p>}
//                         </div>
//                     </form>
//                 </div>

//                 <div className="mt-6 pt-4 border-t dark:border-dark-border flex justify-end">
//                     <button type="submit" form="dispatch-form" disabled={loading} className="bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-primary-hover disabled:opacity-50">
//                         {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Dispatch')}
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

const DispatchFormModal = ({ data, onClose, onSave }) => {
    const isEditMode = !!data.dispatch;

    const booking = isEditMode ? data.dispatch.booking : data.booking;
    const image = isEditMode ? data.dispatch.sourceImage : data.image;
    const dispatchToEdit = isEditMode ? data.dispatch : null;

    const [invoiceNumber, setInvoiceNumber] = useState(dispatchToEdit?.invoiceNumber || '');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!booking || !booking.tilesList) {
            setError("Error: Associated booking data is incomplete. Cannot load items.");
            return;
        }

        // --- THIS IS THE NEW, COMPREHENSIVE LOGIC ---

        // 1. Calculate what has been dispatched in OTHER orders (excluding the one being edited).
        const dispatchedInOtherOrders = new Map();
        booking.dispatchOrders?.forEach(order => {
            // If in edit mode, skip the dispatch we are currently editing.
            if (isEditMode && order._id === dispatchToEdit._id) {
                return; 
            }
            order.dispatchedItems.forEach(item => {
                const tileId = item.tile._id.toString();
                const currentQty = dispatchedInOtherOrders.get(tileId) || 0;
                dispatchedInOtherOrders.set(tileId, currentQty + item.quantity);
            });
        });

        // 2. Iterate through the PARENT BOOKING's tiles list to build the form.
        const formItems = booking.tilesList.map(bookedItem => {
            const tileId = bookedItem.tile._id.toString();
            const totalBooked = bookedItem.quantity;
            const totalInOtherDispatches = dispatchedInOtherOrders.get(tileId) || 0;

            // The maximum quantity allowed for this tile in this specific dispatch
            // is the original booked amount minus what's already in other dispatches.
            const maxAllowed = totalBooked - totalInOtherDispatches;

            // If editing, the current quantity is what was saved in this dispatch.
            // If creating, the current quantity starts at 0.
            const currentQty = isEditMode
                ? dispatchToEdit.dispatchedItems.find(d => d.tile._id.toString() === tileId)?.quantity || 0
                : 0;

            return {
                tile: bookedItem.tile,
                quantity: currentQty,
                maxAllowed: maxAllowed,
            };
        }).filter(item => item.maxAllowed > 0 || item.quantity > 0); // Only show items that are relevant.

        setItems(formItems);
        // --- END OF NEW LOGIC ---

    }, [data, isEditMode, booking, dispatchToEdit]);

    const handleQuantityChange = (tileId, value) => {
        const newQuantity = parseInt(value, 10) || 0;
        setItems(prev => prev.map(item => item.tile._id === tileId ? { ...item, quantity: newQuantity } : item));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const itemsToSubmit = items.filter(item => item.quantity > 0).map(item => ({
            tile: item.tile._id,
            quantity: item.quantity,
        }));

        for (const item of itemsToSubmit) {
            const formItem = items.find(i => i.tile._id === item.tile);
            if (item.quantity > formItem.maxAllowed) {
                setError(`Quantity for ${formItem.tile.name} cannot exceed max allowed of ${formItem.maxAllowed}.`);
                setLoading(false);
                return;
            }
        }

        const finalDispatchData = { invoiceNumber, dispatchedItems: itemsToSubmit };

        try {
            if (isEditMode) {
                await updateDispatchOrder(dispatchToEdit._id, finalDispatchData);
            } else {
                finalDispatchData.bookingId = booking._id;
                finalDispatchData.unprocessedImageId = data.image._id;
                await createDispatchOrder(finalDispatchData);
            }
            onSave();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to save dispatch order.`);
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
                            <img src={image?.imageUrl} alt="Delivery Note" className="w-full h-full object-contain" />
                        </div>
                    </div>

                    <form id="dispatch-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="invoiceNumber" className="font-medium">Invoice Number</label>
                            <input id="invoiceNumber" type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-dark-background dark:border-dark-border" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Dispatched Quantities</h3>
                            <p className="text-xs text-gray-500">
                                {isEditMode ? "Correct or add quantities for this specific dispatch." : "Enter the quantities delivered in this dispatch."}
                            </p>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 -mr-2">
                            {items.length > 0 ? items.map(item => {
                                const isOverDispatched = item.quantity > item.maxAllowed;
                                return (
                                    <div key={item.tile._id} className={`p-3 rounded-lg grid grid-cols-3 gap-4 items-center ${isOverDispatched ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-dark-background'}`}>
                                        <div className="col-span-2">
                                            <p className="font-bold text-sm">{item.tile.name}</p>
                                            <p className="text-xs text-gray-500">Max Allowed: {item.maxAllowed} boxes</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="number" min="0" max={item.maxAllowed} value={item.quantity} onChange={e => handleQuantityChange(item.tile._id, e.target.value)} className={`w-full p-2 border rounded-md dark:bg-dark-background dark:border-dark-border ${isOverDispatched ? 'border-red-500' : ''}`} />
                                            <label className="text-sm">Boxes</label>
                                        </div>
                                    </div>
                                );
                            }) : <p className="text-center text-gray-500 py-8">No items available for this dispatch.</p>}
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
