

// import React, { useState, useEffect } from 'react';
// import { getRestockRequestById, recordArrival, updateShippedQuantity, forceCompleteRequest, editArrivalHistory } from '../../api/restockApi';
// import { useAuth } from '../../hooks/useAuth';
// import { X, CheckCircle, PackagePlus, Edit2, AlertTriangle, History, Save } from 'lucide-react';
// import { format } from 'date-fns';

// const RestockViewModal = ({ requestId, onClose, onUpdate }) => {
//     const { user } = useAuth();
//     const [request, setRequest] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     // State for editing arrival history
//     const [editingArrival, setEditingArrival] = useState(null); // { itemId, arrivalId, qty, notes }
    
//     // State for the arrival form (Dubai Team)
//     const [arrivalTile, setArrivalTile] = useState('');
//     const [arrivalQty, setArrivalQty] = useState('');
//     const [arrivalNotes, setArrivalNotes] = useState('');
//     const [isSubmittingArrival, setIsSubmittingArrival] = useState(false);

//     // State for editing shipped quantity (India Team)
//     const [editingItemId, setEditingItemId] = useState(null);
//     const [shippedQtyInput, setShippedQtyInput] = useState(0);

//     // Role-based permissions
//     const canRecordArrival = user?.role === 'admin' || user?.role === 'dubai-staff';
//     const canEditShipped = user?.role === 'admin' || user?.role === 'india-staff';
//     const canForceComplete = user?.role === 'admin';
//     const canEditHistory = user?.role === 'admin';

//     const isRequestMutable = !['Completed', 'Cancelled', 'Completed with Discrepancy'].includes(request?.status);

//     const fetchRequestDetails = async () => {
//         if (!requestId) return;
//         setLoading(true);
//         try {
//             const { data } = await getRestockRequestById(requestId);
//             setRequest(data);
//             const firstPending = data.requestedItems.find(item => item.quantityArrived < item.quantityRequested);
//             if (firstPending) {
//                 setArrivalTile(firstPending.tile._id);
//             }
//         } catch (err) {
//             setError('Failed to load request details.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchRequestDetails();
//     }, [requestId]);

//     const arrivalHistory = request?.requestedItems.reduce((acc, item) => {
//         item.arrivalHistory.forEach(arrival => {
//             acc.push({
//                 tileName: item.tile.name,
//                 itemId: item._id,
//                 ...arrival
//             });
//         });
//         return acc;
//     }, []).sort((a, b) => new Date(b.arrivalDate) - new Date(a.arrivalDate));

//     const handleRecordArrival = async (e) => {
//         e.preventDefault();
//         setIsSubmittingArrival(true);
//         try {
//             await recordArrival(requestId, {
//                 tileId: arrivalTile,
//                 quantity: parseInt(arrivalQty, 10),
//                 notes: arrivalNotes,
//             });
//             onUpdate();
//             onClose();
//         } catch (err) {
//             alert(err.response?.data?.message || 'Failed to record arrival.');
//         } finally {
//             setIsSubmittingArrival(false);
//         }
//     };

//     const handleEditShippedClick = (item) => {
//         setEditingItemId(item._id);
//         setShippedQtyInput(item.quantityShipped);
//     };

//     const handleSaveShipped = async (itemId) => {
//         try {
//             await updateShippedQuantity(requestId, {
//                 itemId: itemId,
//                 quantityShipped: shippedQtyInput,
//             });
//             setEditingItemId(null);
//             fetchRequestDetails();
//         } catch (err) {
//             alert(err.response?.data?.message || 'Failed to update shipped quantity.');
//         }
//     };

//     const handleForceComplete = async () => {
//         if (window.confirm('Are you sure you want to force complete this request? This action cannot be undone.')) {
//             try {
//                 await forceCompleteRequest(requestId);
//                 onUpdate();
//                 onClose();
//             } catch (err) {
//                 alert(err.response?.data?.message || 'Failed to force complete.');
//             }
//         }
//     };

//     const handleEditArrivalClick = (arrival) => {
//         setEditingArrival({
//             itemId: arrival.itemId,
//             arrivalId: arrival._id,
//             qty: arrival.quantity,
//             notes: arrival.notes || ''
//         });
//     };

//     const handleSaveArrivalEdit = async () => {
//         if (!editingArrival) return;
//         try {
//             await editArrivalHistory(requestId, {
//                 itemId: editingArrival.itemId,
//                 arrivalId: editingArrival.arrivalId,
//                 newQuantity: editingArrival.qty,
//                 newNotes: editingArrival.notes
//             });
//             setEditingArrival(null);
//             fetchRequestDetails();
//         } catch (err) {
//             alert(err.response?.data?.message || 'Failed to save changes.');
//         }
//     };

//     if (loading || !request) return <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"><p className="text-white">Loading...</p></div>;
//     if (error) return <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"><div className="bg-white p-6 rounded-lg">{error} <button onClick={onClose}>Close</button></div></div>;

//     return (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//             <div className="bg-white dark:bg-dark-foreground rounded-lg shadow-xl p-6 md:p-8 w-full max-w-7xl max-h-[90vh] flex flex-col">
//                 {/* Header */}
//                 <div className="flex justify-between items-start mb-4 border-b pb-4 dark:border-dark-border">
//                     <div>
//                         <h1 className="text-2xl md:text-3xl font-bold">Restock Details</h1>
//                         <p className="font-mono text-primary dark:text-dark-primary">{request.requestId}</p>
//                     </div>
//                     <div className="flex items-center gap-4">
//                         {canForceComplete && isRequestMutable && (
//                             <button onClick={handleForceComplete} className="flex items-center gap-2 text-xs bg-red-100 text-red-700 font-bold py-2 px-3 rounded-md hover:bg-red-200">
//                                 <AlertTriangle size={14} /> Force Complete
//                             </button>
//                         )}
//                         <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border"><X size={24}/></button>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow min-h-0">
//                     {/* Center Column */}
//                     <div className="lg:col-span-2 flex flex-col min-h-0 gap-6">
//                         {/* Item Status Table */}
//                         <div className="flex flex-col">
//                             <h2 className="font-bold text-xl mb-3">Item Status</h2>
//                             <div className="overflow-y-auto border dark:border-dark-border rounded-lg">
//                                 <table className="w-full text-sm">
//                                     <thead className="bg-gray-50 dark:bg-dark-background text-left">
//                                         <tr>
//                                             <th className="p-3 font-medium">Tile</th>
//                                             <th className="p-3 font-medium text-center">Requested</th>
//                                             <th className="p-3 font-medium text-center">Shipped</th>
//                                             <th className="p-3 font-medium text-center">Arrived</th>
//                                             <th className="p-3 font-medium text-center">Remaining</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {request.requestedItems.map(item => {
//                                             const remaining = item.quantityRequested - item.quantityArrived;
//                                             return (
//                                                 <tr key={item.tile._id} className="border-t dark:border-dark-border">
//                                                     <td className="p-3"><p className="font-semibold">{item.tile.name}</p><p className="text-xs text-gray-500">{item.tile.size}</p></td>
//                                                     <td className="p-3 text-center font-mono">{item.quantityRequested}</td>
//                                                     <td className="p-3 text-center font-mono text-blue-600">
//                                                         {editingItemId === item._id ? (
//                                                             <div className="flex items-center justify-center gap-2">
//                                                                 <input type="number" value={shippedQtyInput} onChange={(e) => setShippedQtyInput(parseInt(e.target.value, 10) || 0)} className="w-16 p-1 text-center border rounded-md dark:bg-dark-foreground" autoFocus />
//                                                                 <button onClick={() => handleSaveShipped(item._id)} className="text-green-500"><CheckCircle size={18}/></button>
//                                                             </div>
//                                                         ) : (
//                                                             <div className="flex items-center justify-center gap-2 group">
//                                                                 <span>{item.quantityShipped}</span>
//                                                                 {canEditShipped && isRequestMutable && (
//                                                                     <button onClick={() => handleEditShippedClick(item)} className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={14}/></button>
//                                                                 )}
//                                                             </div>
//                                                         )}
//                                                     </td>
//                                                     <td className="p-3 text-center font-mono text-green-600">{item.quantityArrived}</td>
//                                                     <td className={`p-3 text-center font-mono font-bold ${remaining > 0 ? 'text-red-600' : 'text-gray-500'}`}>{remaining}</td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>

//                         {/* Arrival History Log */}
//                         <div className="flex flex-col min-h-0">
//                             <h2 className="font-bold text-xl mb-3 flex items-center gap-2"><History size={20}/> Arrival History</h2>
//                             <div className="flex-grow overflow-y-auto border dark:border-dark-border rounded-lg p-3 space-y-3">
//                                 {arrivalHistory.length > 0 ? arrivalHistory.map(arrival => (
//                                     <div key={arrival._id} className="p-4 bg-gray-50 dark:bg-dark-background rounded-lg">
//                                         {editingArrival?.arrivalId === arrival._id ? (
//                                             // --- NEW EDITING UI (MATCHING THE IMAGE) ---
//                                             <div className="space-y-4">
//                                                 <div className="flex justify-between items-center">
//                                                     <p className="font-bold text-lg">{arrival.tileName}</p>
//                                                     <div className="flex items-center gap-2">
//                                                         <input type="number" value={editingArrival.qty} onChange={(e) => setEditingArrival({...editingArrival, qty: parseInt(e.target.value, 10) || 0})} className="w-24 p-2 border rounded-md dark:bg-dark-foreground dark:border-dark-border text-center" />
//                                                         <span className="text-sm text-gray-500">Boxes</span>
//                                                     </div>
//                                                 </div>
//                                                 <div>
//                                                     <textarea value={editingArrival.notes} onChange={(e) => setEditingArrival({...editingArrival, notes: e.target.value})} rows="2" className="w-full p-2 border rounded-md text-sm dark:bg-dark-foreground dark:border-dark-border" placeholder="Edit arrival notes..."></textarea>
//                                                 </div>
//                                                 <div className="flex justify-end items-center gap-4">
//                                                     <button onClick={() => setEditingArrival(null)} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:underline">Cancel</button>
//                                                     <button onClick={handleSaveArrivalEdit} className="text-sm font-semibold px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover flex items-center gap-2"><Save size={16}/> Save</button>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             // Original Display UI
//                                             <div className="group">
//                                                 <div className="flex justify-between items-start">
//                                                     <div>
//                                                         <p className="font-semibold">{arrival.tileName}</p>
//                                                         <p className="text-xs text-gray-500">{format(new Date(arrival.arrivalDate), 'dd MMM yyyy, h:mm a')}</p>
//                                                     </div>
//                                                     <div className="flex items-center gap-3">
//                                                         <span className="font-bold text-lg text-green-600">{arrival.quantity} <span className="text-sm font-normal">Boxes</span></span>
//                                                         {canEditHistory && (
//                                                             <button onClick={() => handleEditArrivalClick(arrival)} className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={16}/></button>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                                 {arrival.notes && (
//                                                     <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-foreground p-2 rounded border dark:border-dark-border whitespace-pre-wrap">{arrival.notes}</p>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 )) : (
//                                     <div className="text-center py-8 text-gray-500"><p>No arrivals have been recorded for this request yet.</p></div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Column: Record Arrival Form */}
//                     <div className="lg:col-span-1">
//                         {canRecordArrival && (
//                             <form onSubmit={handleRecordArrival} className="bg-gray-50 dark:bg-dark-background p-6 rounded-lg h-full flex flex-col">
//                                 <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><PackagePlus size={24} /> Record New Arrival</h2>
//                                 {!isRequestMutable ? (
//                                     <div className="flex-grow flex items-center justify-center text-center bg-white dark:bg-dark-foreground rounded-md p-4">
//                                         <p className="font-semibold">This request is {request.status} and cannot be modified.</p>
//                                     </div>
//                                 ) : (
//                                     <div className="space-y-4 flex-grow flex flex-col">
//                                         <div>
//                                             <label className="font-medium text-sm">Tile *</label>
//                                             <select value={arrivalTile} onChange={e => setArrivalTile(e.target.value)} required className="w-full mt-1 p-2 border rounded-md dark:bg-dark-foreground dark:border-dark-border">
//                                                 <option value="" disabled>Select a tile...</option>
//                                                 {request.requestedItems.map(item => <option key={item.tile._id} value={item.tile._id}>{item.tile.name}</option>)}
//                                             </select>
//                                         </div>
//                                         <div>
//                                             <label className="font-medium text-sm">Quantity Arrived (Boxes) *</label>
//                                             <input type="number" min="1" value={arrivalQty} onChange={e => setArrivalQty(e.target.value)} required className="w-full mt-1 p-2 border rounded-md dark:bg-dark-foreground dark:border-dark-border" />
//                                         </div>
//                                         <div>
//                                             <label className="font-medium text-sm">Notes (e.g., Container #)</label>
//                                             <textarea value={arrivalNotes} onChange={e => setArrivalNotes(e.target.value)} rows="3" className="w-full mt-1 p-2 border rounded-md dark:bg-dark-foreground dark:border-dark-border" />
//                                         </div>
//                                         <div className="flex-grow"></div>
//                                         <button type="submit" disabled={isSubmittingArrival} className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary-hover disabled:opacity-50">
//                                             {isSubmittingArrival ? 'Saving...' : 'Confirm Arrival'}
//                                         </button>
//                                     </div>
//                                 )}
//                             </form>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RestockViewModal;

import React, { useState, useEffect, useMemo } from 'react';
import { getRestockRequestById, recordArrival, updateShippedQuantity, forceCompleteRequest, editArrivalHistory } from '../../api/restockApi';
import { useAuth } from '../../hooks/useAuth';
import { X, CheckCircle, PackagePlus, Edit2, AlertTriangle, History, Save } from 'lucide-react';
import { format } from 'date-fns';

const RestockViewModal = ({ requestId, onClose, onUpdate }) => {
    const { user } = useAuth();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for editing arrival history
    const [editingArrival, setEditingArrival] = useState(null);
    
    // State for the arrival form
    const [arrivalTile, setArrivalTile] = useState('');
    const [arrivalQty, setArrivalQty] = useState('');
    const [arrivalNotes, setArrivalNotes] = useState('');
    const [isSubmittingArrival, setIsSubmittingArrival] = useState(false);

    // State for editing shipped quantity
    const [editingItemId, setEditingItemId] = useState(null);
    const [shippedQtyInput, setShippedQtyInput] = useState(0);

    // Role-based permissions
    const canRecordArrival = user?.role === 'admin' || user?.role === 'dubai-staff';
    const canEditShipped = user?.role === 'admin' || user?.role === 'india-staff';
    const canForceComplete = user?.role === 'admin';
    const canEditHistory = user?.role === 'admin';

    const isRequestMutable = !['Completed', 'Cancelled', 'Completed with Discrepancy'].includes(request?.status);

    const fetchRequestDetails = async () => {
        if (!requestId) return;
        setLoading(true);
        try {
            const { data } = await getRestockRequestById(requestId);
            setRequest(data);
        } catch (err) {
            setError('Failed to load request details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequestDetails();
    }, [requestId]);

    // Smartly filter tiles for the arrival dropdown to only show items with pending quantities
    const pendingArrivalItems = useMemo(() => {
        if (!request) return [];
        return request.requestedItems.filter(item => item.quantityArrived < item.quantityRequested);
    }, [request]);

    // Set default tile and quantity when the component loads or data changes
    useEffect(() => {
        if (pendingArrivalItems.length > 0) {
            const firstPendingItem = pendingArrivalItems[0];
            setArrivalTile(firstPendingItem.tile._id);
            const remaining = firstPendingItem.quantityRequested - firstPendingItem.quantityArrived;
            setArrivalQty(remaining);
        } else {
            setArrivalTile('');
            setArrivalQty('');
        }
    }, [request, pendingArrivalItems]); // Rerun when request data is fetched

    // Memoize arrival history calculation
    const arrivalHistory = useMemo(() => {
        if (!request) return [];
        return request.requestedItems.reduce((acc, item) => {
            item.arrivalHistory.forEach(arrival => acc.push({ tileName: item.tile.name, itemId: item._id, ...arrival }));
            return acc;
        }, []).sort((a, b) => new Date(b.arrivalDate) - new Date(a.arrivalDate));
    }, [request]);

    const handleRecordArrival = async (e) => {
        e.preventDefault();
        setIsSubmittingArrival(true);
        try {
            await recordArrival(requestId, {
                tileId: arrivalTile,
                quantity: parseInt(arrivalQty, 10),
                notes: arrivalNotes,
            });
            onUpdate(); // Refresh the list page
            onClose(); // Close the modal
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to record arrival.');
        } finally {
            setIsSubmittingArrival(false);
        }
    };

    // Calculate remaining quantity for the currently selected tile in the form
    const selectedTileRemainingQty = useMemo(() => {
        if (!arrivalTile || !request) return 0;
        const selectedItem = request.requestedItems.find(item => item.tile._id === arrivalTile);
        return selectedItem ? selectedItem.quantityRequested - selectedItem.quantityArrived : 0;
    }, [arrivalTile, request]);

    const handleEditShippedClick = (item) => { setEditingItemId(item._id); setShippedQtyInput(item.quantityShipped); };
    const handleSaveShipped = async (itemId) => { try { await updateShippedQuantity(requestId, { itemId, quantityShipped: shippedQtyInput }); setEditingItemId(null); fetchRequestDetails(); } catch (err) { alert(err.response?.data?.message || 'Failed to update shipped quantity.'); } };
    const handleForceComplete = async () => { if (window.confirm('Are you sure? This action cannot be undone.')) { try { await forceCompleteRequest(requestId); onUpdate(); onClose(); } catch (err) { alert(err.response?.data?.message || 'Failed to force complete.'); } } };
    const handleEditArrivalClick = (arrival) => { setEditingArrival({ itemId: arrival.itemId, arrivalId: arrival._id, qty: arrival.quantity, notes: arrival.notes || '' }); };
    const handleSaveArrivalEdit = async () => { if (!editingArrival) return; try { await editArrivalHistory(requestId, { itemId: editingArrival.itemId, arrivalId: editingArrival.arrivalId, newQuantity: editingArrival.qty, newNotes: editingArrival.notes }); setEditingArrival(null); fetchRequestDetails(); } catch (err) { alert(err.response?.data?.message || 'Failed to save changes.'); } };

    if (loading) return <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"><p className="text-white">Loading...</p></div>;
    if (error) return <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"><div className="bg-white p-6 rounded-lg">{error} <button onClick={onClose}>Close</button></div></div>;
    if (!request) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-foreground rounded-lg shadow-xl p-6 md:p-8 w-full max-w-7xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 border-b pb-4 dark:border-dark-border">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Restock Details</h1>
                        <p className="font-mono text-primary dark:text-dark-primary">{request.requestId}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {canForceComplete && isRequestMutable && (
                            <button onClick={handleForceComplete} className="flex items-center gap-2 text-xs bg-red-100 text-red-700 font-bold py-2 px-3 rounded-md hover:bg-red-200">
                                <AlertTriangle size={14} /> Force Complete
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border"><X size={24}/></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow min-h-0">
                    {/* Center Column */}
                    <div className="lg:col-span-2 flex flex-col min-h-0 gap-6">
                        {/* Item Status Table */}
                        <div className="flex flex-col">
                            <h2 className="font-bold text-xl mb-3">Item Status</h2>
                            <div className="overflow-y-auto border dark:border-dark-border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-dark-background text-left">
                                        <tr>
                                            <th className="p-3 font-medium">Tile</th>
                                            <th className="p-3 font-medium text-center">Requested</th>
                                            <th className="p-3 font-medium text-center">Shipped</th>
                                            <th className="p-3 font-medium text-center">Arrived</th>
                                            <th className="p-3 font-medium text-center">Remaining</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {request.requestedItems.map(item => {
                                            const remaining = item.quantityRequested - item.quantityArrived;
                                            return (
                                                <tr key={item.tile._id} className="border-t dark:border-dark-border">
                                                    <td className="p-3"><p className="font-semibold">{item.tile.name}</p><p className="text-xs text-gray-500">{item.tile.size}</p></td>
                                                    <td className="p-3 text-center font-mono">{item.quantityRequested}</td>
                                                    <td className="p-3 text-center font-mono text-blue-600">
                                                        {editingItemId === item._id ? (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <input type="number" value={shippedQtyInput} onChange={(e) => setShippedQtyInput(parseInt(e.target.value, 10) || 0)} className="w-16 p-1 text-center border rounded-md dark:bg-dark-foreground" autoFocus />
                                                                <button onClick={() => handleSaveShipped(item._id)} className="text-green-500"><CheckCircle size={18}/></button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-2 group">
                                                                <span>{item.quantityShipped}</span>
                                                                {canEditShipped && isRequestMutable && (
                                                                    <button onClick={() => handleEditShippedClick(item)} className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={14}/></button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-center font-mono text-green-600">{item.quantityArrived}</td>
                                                    <td className={`p-3 text-center font-mono font-bold ${remaining > 0 ? 'text-red-600' : 'text-gray-500'}`}>{remaining}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Arrival History Log */}
                        <div className="flex flex-col min-h-0">
                            <h2 className="font-bold text-xl mb-3 flex items-center gap-2"><History size={20}/> Arrival History</h2>
                            <div className="flex-grow overflow-y-auto border dark:border-dark-border rounded-lg p-3 space-y-3">
                                {arrivalHistory.length > 0 ? arrivalHistory.map(arrival => (
                                    <div key={arrival._id} className="p-4 bg-gray-50 dark:bg-dark-background rounded-lg">
                                        {editingArrival?.arrivalId === arrival._id ? (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-bold text-lg">{arrival.tileName}</p>
                                                    <div className="flex items-center gap-2">
                                                        <input type="number" value={editingArrival.qty} onChange={(e) => setEditingArrival({...editingArrival, qty: parseInt(e.target.value, 10) || 0})} className="w-24 p-2 border rounded-md dark:bg-dark-foreground dark:border-dark-border text-center" />
                                                        <span className="text-sm text-gray-500">Boxes</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <textarea value={editingArrival.notes} onChange={(e) => setEditingArrival({...editingArrival, notes: e.target.value})} rows="2" className="w-full p-2 border rounded-md text-sm dark:bg-dark-foreground dark:border-dark-border" placeholder="Edit arrival notes..."></textarea>
                                                </div>
                                                <div className="flex justify-end items-center gap-4">
                                                    <button onClick={() => setEditingArrival(null)} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:underline">Cancel</button>
                                                    <button onClick={handleSaveArrivalEdit} className="text-sm font-semibold px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover flex items-center gap-2"><Save size={16}/> Save</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="group">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold">{arrival.tileName}</p>
                                                        <p className="text-xs text-gray-500">{format(new Date(arrival.arrivalDate), 'dd MMM yyyy, h:mm a')}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-lg text-green-600">{arrival.quantity} <span className="text-sm font-normal">Boxes</span></span>
                                                        {canEditHistory && (
                                                            <button onClick={() => handleEditArrivalClick(arrival)} className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={16}/></button>
                                                        )}
                                                    </div>
                                                </div>
                                                {arrival.notes && (
                                                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-foreground p-2 rounded border dark:border-dark-border whitespace-pre-wrap">{arrival.notes}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-500"><p>No arrivals have been recorded for this request yet.</p></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Record Arrival Form */}
                    <div className="lg:col-span-1">
                        {canRecordArrival && (
                            <form onSubmit={handleRecordArrival} className="bg-gray-50 dark:bg-dark-background p-6 rounded-lg h-full flex flex-col">
                                <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><PackagePlus size={24} /> Record New Arrival</h2>
                                {!isRequestMutable || pendingArrivalItems.length === 0 ? (
                                    <div className="flex-grow flex items-center justify-center text-center bg-white dark:bg-dark-foreground rounded-md p-4">
                                        <p className="font-semibold">
                                            {pendingArrivalItems.length === 0 && isRequestMutable ? 'All items for this request have arrived.' : `This request is ${request.status} and cannot be modified.`}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 flex-grow flex flex-col">
                                        <div>
                                            <label className="font-medium text-sm">Tile *</label>
                                            <select value={arrivalTile} onChange={e => setArrivalTile(e.target.value)} required className="w-full mt-1 p-2 border rounded-md dark:bg-dark-foreground dark:border-dark-border">
                                                <option value="" disabled>Select a tile...</option>
                                                {pendingArrivalItems.map(item => <option key={item.tile._id} value={item.tile._id}>{item.tile.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="font-medium text-sm">Quantity Arrived (Boxes) *</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max={selectedTileRemainingQty} 
                                                value={arrivalQty} 
                                                onChange={e => setArrivalQty(e.target.value)} 
                                                required 
                                                className="w-full mt-1 p-2 border rounded-md dark:bg-dark-foreground dark:border-dark-border" 
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Remaining for this tile: {selectedTileRemainingQty}</p>
                                        </div>
                                        <div>
                                            <label className="font-medium text-sm">Notes (e.g., Container #)</label>
                                            <textarea value={arrivalNotes} onChange={e => setArrivalNotes(e.target.value)} rows="3" className="w-full mt-1 p-2 border rounded-md dark:bg-dark-foreground dark:border-dark-border" />
                                        </div>
                                        <div className="flex-grow"></div>
                                        <button type="submit" disabled={isSubmittingArrival} className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary-hover disabled:opacity-50">
                                            {isSubmittingArrival ? 'Saving...' : 'Confirm Arrival'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestockViewModal;
