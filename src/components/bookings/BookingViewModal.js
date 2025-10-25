

// import React, { useEffect, useState } from 'react';
// import { X, User, ShoppingBag, Hash, FileText, Calendar, Box, Image as ImageIcon, Truck } from 'lucide-react';
// import { format } from 'date-fns';

// const BookingViewModal = ({ booking, onClose }) => {
//     const [isVisible, setIsVisible] = useState(false);

//     useEffect(() => {
//         setIsVisible(true);
//     }, []);

//     const handleClose = () => {
//         setIsVisible(false);
//         setTimeout(onClose, 300); // Wait for transition
//     };

//     if (!booking) return null;

//     const totalBookedBoxes = booking.tilesList.reduce((acc, item) => acc + item.quantity, 0);
//     const totalBookedSqM = booking.tilesList.reduce((acc, item) => acc + (item.quantity * (item.tile.conversionFactor || 1)), 0);

//     const getStatusPill = (status) => {
//         const base = "px-3 py-1 text-xs font-bold rounded-full";
//         const colors = {
//             Booked: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
//             'Partially Dispatched': "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
//             Completed: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
//             Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
//         };
//         return `${base} ${colors[status] || 'bg-gray-100 text-gray-800'}`;
//     };

//     return (
//         <div onClick={handleClose} className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
//             <div onClick={e => e.stopPropagation()} className={`bg-white dark:bg-dark-foreground rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
//                 {/* Header */}
//                 <div className="flex justify-between items-center p-5 border-b dark:border-dark-border">
//                     <div className="flex items-center gap-3">
//                         <div className="bg-primary/10 text-primary p-2 rounded-lg"><FileText size={24} /></div>
//                         <div>
//                             <h2 className="text-xl font-bold">Booking Dashboard</h2>
//                             <p className="text-sm font-mono text-gray-500">{booking.bookingId}</p>
//                         </div>
//                     </div>
//                     <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border"><X size={24} /></button>
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-grow overflow-y-auto p-6 space-y-8">
//                     {/* Key Info Grid */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
//                         <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg"><div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><ShoppingBag size={14} /> Company</div><div className="font-semibold text-base truncate">{booking.company?.companyName}</div></div>
//                         <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg"><div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><User size={14} /> Salesman</div><div className="font-semibold text-base truncate">{booking.salesman?.username}</div></div>
//                         <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg"><div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Calendar size={14} /> Booking Date</div><div className="font-semibold text-base">{format(new Date(booking.createdAt), 'dd MMM, yyyy')}</div></div>
//                         <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg"><div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Hash size={14} /> LPO Number</div><div className="font-semibold text-base">{booking.lpoNumber || 'N/A'}</div></div>
//                         <div className="col-span-1 lg:col-span-2 bg-gray-50 dark:bg-dark-background p-3 rounded-lg flex items-center justify-between">
//                             <div><div className="text-gray-500 dark:text-gray-400">Status</div><div className="font-semibold text-base"><span className={getStatusPill(booking.status)}>{booking.status}</span></div></div>
//                             <div className="text-right"><div className="text-gray-500 dark:text-gray-400">Total Booked</div><div className="font-semibold text-base">{totalBookedBoxes} boxes / {totalBookedSqM.toFixed(2)} m²</div></div>
//                         </div>
//                     </div>

//                     {/* --- TABS FOR SWITCHING VIEWS --- */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Section 1: Original Booking Items */}
//                         <div>
//                             <h3 className="font-semibold mb-3 text-lg flex items-center gap-2"><Box size={20} /> Original Booking Items</h3>
//                             <div className="border rounded-lg dark:border-dark-border overflow-hidden">
//                                 <table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-dark-background"><tr><th className="p-3 text-left font-medium">Tile</th><th className="p-3 text-right font-medium">Quantity</th></tr></thead>
//                                     <tbody>{booking.tilesList.map(item => (<tr key={item.tile._id} className="border-t dark:border-dark-border"><td className="p-3 font-semibold">{item.tile.name}<p className="font-normal text-xs text-gray-500">{item.tile.size}</p></td><td className="p-3 text-right font-mono">{item.quantity} boxes</td></tr>))}</tbody>
//                                 </table>
//                             </div>
//                         </div>

//                         {/* Section 2: Unprocessed Notes */}
//                         <div>
//                             <h3 className="font-semibold mb-3 text-lg flex items-center gap-2"><ImageIcon size={20} /> Unprocessed Delivery Notes</h3>
//                             <div className="space-y-3">
//                                 {booking.unprocessedImages?.length > 0 ? booking.unprocessedImages.map(img => (
//                                     <a key={img._id} href={img.imageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gray-50 dark:bg-dark-background p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border">
//                                         <img src={img.imageUrl} alt="Note" className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
//                                         <div className="text-xs"><p className="font-semibold">Delivery Note</p><p className="text-gray-500">Uploaded: {format(new Date(img.uploadedAt), 'dd MMM, hh:mm a')}</p></div>
//                                     </a>
//                                 )) : <p className="text-sm text-gray-500 text-center py-4">No notes waiting for processing.</p>}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Section 3: Processed Dispatches */}
//                     <div>
//                         <h3 className="font-semibold mb-3 text-lg flex items-center gap-2"><Truck size={20} /> Processed Dispatches</h3>
//                         <div className="space-y-4">
//                             {booking.dispatchOrders?.length > 0 ? booking.dispatchOrders.map(order => (
//                                 <div key={order._id} className="bg-gray-50 dark:bg-dark-background rounded-lg border dark:border-dark-border p-4">
//                                     <div className="flex justify-between items-center mb-3">
//                                         <div><p className="font-bold text-primary dark:text-dark-primary">{order.dispatchNumber}</p><p className="text-xs text-gray-500">Processed by {order.createdBy.username} on {format(new Date(order.createdAt), 'dd MMM, yyyy')}</p></div>
//                                         <div className="text-right"><p className="text-xs text-gray-500">Invoice #</p><p className="font-semibold">{order.invoiceNumber || 'N/A'}</p></div>
//                                     </div>
//                                     <table className="w-full text-xs bg-white dark:bg-dark-foreground rounded-md"><thead className="bg-gray-100 dark:bg-dark-border/20"><tr><th className="p-2 text-left font-medium">Delivered Tile</th><th className="p-2 text-right font-medium">Quantity</th></tr></thead>
//                                         <tbody>{order.dispatchedItems.map(item => (<tr key={item._id}><td className="p-2">{item.tile.name}</td><td className="p-2 text-right font-mono">{item.quantity} boxes</td></tr>))}</tbody>
//                                     </table>
//                                 </div>
//                             )) : <p className="text-sm text-gray-500 text-center py-4">No dispatches have been created for this booking yet.</p>}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BookingViewModal;


import React, { useEffect, useState, useMemo } from 'react';
import { X, User, ShoppingBag, Hash, FileText, Calendar, Box, Image as ImageIcon, Truck, PackageCheck, PackageX } from 'lucide-react';
import { format } from 'date-fns';

const BookingViewModal = ({ booking, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for transition
    };

    // --- LOGIC FOR REMAINING ITEMS ---
    // useMemo ensures this complex calculation only runs when the booking data changes.
    const remainingItems = useMemo(() => {
        if (!booking || !booking.tilesList) return [];

        const dispatchedTotals = new Map();
        booking.dispatchOrders?.forEach(order => {
            order.dispatchedItems.forEach(item => {
                // Ensure we handle cases where a tile might have been deleted
                if (!item.tile) return; 
                // Always use strings for map keys to ensure consistency
                const tileId = item.tile._id.toString(); 
                const currentQty = dispatchedTotals.get(tileId) || 0;
                dispatchedTotals.set(tileId, currentQty + item.quantity);
            });
        });

        return booking.tilesList.map(bookedItem => {
            // Always use strings for lookup
            const tileId = bookedItem.tile._id.toString(); 
            const totalDispatched = dispatchedTotals.get(tileId) || 0;
            const remainingQty = bookedItem.quantity - totalDispatched;
            
            return {
                ...bookedItem,
                quantityRemaining: remainingQty,
            };
        }).filter(item => item.quantityRemaining > 0);

    }, [booking]);
    // --- END OF LOGIC ---


    if (!booking) return null;

    const totalBookedBoxes = booking.tilesList.reduce((acc, item) => acc + item.quantity, 0);
    const totalBookedSqM = booking.tilesList.reduce((acc, item) => acc + (item.quantity * (item.tile.conversionFactor || 1)), 0);

    const getStatusPill = (status) => {
        const base = "px-3 py-1 text-xs font-bold rounded-full";
        const colors = {
            Booked: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
            'Partially Dispatched': "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
            Completed: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
            Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
        };
        return `${base} ${colors[status] || 'bg-gray-100 text-gray-800'}`;
    };

    return (
        <div onClick={handleClose} className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div onClick={e => e.stopPropagation()} className={`bg-white dark:bg-dark-foreground rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b dark:border-dark-border">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-lg"><FileText size={24} /></div>
                        <div>
                            <h2 className="text-xl font-bold">Booking Dashboard</h2>
                            <p className="text-sm font-mono text-gray-500">{booking.bookingId}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border"><X size={24} /></button>
                </div>

                {/* Main Content */}
                <div className="flex-grow overflow-y-auto p-6 space-y-8">
                    {/* Key Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg"><div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><ShoppingBag size={14} /> Company</div><div className="font-semibold text-base truncate">{booking.company?.companyName}</div></div>
                        <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg"><div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><User size={14} /> Salesman</div><div className="font-semibold text-base truncate">{booking.salesman?.username}</div></div>
                        <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg"><div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Calendar size={14} /> Booking Date</div><div className="font-semibold text-base">{format(new Date(booking.createdAt), 'dd MMM, yyyy')}</div></div>
                        <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg"><div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Hash size={14} /> LPO Number</div><div className="font-semibold text-base">{booking.lpoNumber || 'N/A'}</div></div>
                        <div className="col-span-1 lg:col-span-2 bg-gray-50 dark:bg-dark-background p-3 rounded-lg flex items-center justify-between">
                            <div><div className="text-gray-500 dark:text-gray-400">Status</div><div className="font-semibold text-base"><span className={getStatusPill(booking.status)}>{booking.status}</span></div></div>
                            <div className="text-right"><div className="text-gray-500 dark:text-gray-400">Total Booked</div><div className="font-semibold text-base">{totalBookedBoxes} boxes / {totalBookedSqM.toFixed(2)} m²</div></div>
                        </div>
                    </div>

                    {/* --- NEW: Remaining Items Section --- */}
                    {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                        <div>
                            <h3 className="font-semibold mb-3 text-lg flex items-center gap-2 text-yellow-600 dark:text-yellow-400"><PackageX size={20} /> Remaining Items to Deliver</h3>
                            <div className="border-2 border-yellow-300 dark:border-yellow-700 rounded-lg overflow-hidden">
                                {remainingItems.length > 0 ? (
                                    <table className="w-full text-sm"><thead className="bg-yellow-50 dark:bg-yellow-900/20"><tr><th className="p-3 text-left font-medium">Tile</th><th className="p-3 text-right font-medium">Quantity Remaining</th></tr></thead>
                                        <tbody>{remainingItems.map(item => (<tr key={item.tile._id} className="border-t border-yellow-200 dark:border-yellow-800"><td className="p-3 font-semibold">{item.tile.name}<p className="font-normal text-xs text-gray-500">{item.tile.size}</p></td><td className="p-3 text-right font-mono font-bold">{item.quantityRemaining} boxes</td></tr>))}</tbody>
                                    </table>
                                ) : (
                                    <div className="p-4 text-center text-gray-500">All items have been dispatched, pending status update.</div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* ---------------------------------- */}


                    {/* Tabs for Original Booking, Notes, and Dispatches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-3 text-lg flex items-center gap-2"><Box size={20} /> Original Booking Items</h3>
                            <div className="border rounded-lg dark:border-dark-border overflow-hidden">
                                <table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-dark-background"><tr><th className="p-3 text-left font-medium">Tile</th><th className="p-3 text-right font-medium">Quantity</th></tr></thead>
                                    <tbody>{booking.tilesList.map(item => (<tr key={item.tile._id} className="border-t dark:border-dark-border"><td className="p-3 font-semibold">{item.tile.name}<p className="font-normal text-xs text-gray-500">{item.tile.size}</p></td><td className="p-3 text-right font-mono">{item.quantity} boxes</td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3 text-lg flex items-center gap-2"><ImageIcon size={20} /> Unprocessed Delivery Notes</h3>
                            <div className="space-y-3">
                                {booking.unprocessedImages?.length > 0 ? booking.unprocessedImages.map(img => (
                                    <a key={img._id} href={img.imageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gray-50 dark:bg-dark-background p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border">
                                        <img src={img.imageUrl} alt="Note" className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                                        <div className="text-xs"><p className="font-semibold">Delivery Note</p><p className="text-gray-500">Uploaded: {format(new Date(img.uploadedAt), 'dd MMM, hh:mm a')}</p></div>
                                    </a>
                                )) : <p className="text-sm text-gray-500 text-center py-4">No notes waiting for processing.</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3 text-lg flex items-center gap-2"><PackageCheck size={20} /> Processed Dispatches</h3>
                        <div className="space-y-4">
                            {booking.dispatchOrders?.length > 0 ? booking.dispatchOrders.map(order => (
                                <div key={order._id} className="bg-gray-50 dark:bg-dark-background rounded-lg border dark:border-dark-border p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <div><p className="font-bold text-primary dark:text-dark-primary">{order.dispatchNumber}</p><p className="text-xs text-gray-500">Processed by {order.createdBy.username} on {format(new Date(order.createdAt), 'dd MMM, yyyy')}</p></div>
                                        <div className="text-right"><p className="text-xs text-gray-500">Invoice #</p><p className="font-semibold">{order.invoiceNumber || 'N/A'}</p></div>
                                    </div>
                                    <table className="w-full text-xs bg-white dark:bg-dark-foreground rounded-md"><thead className="bg-gray-100 dark:bg-dark-border/20"><tr><th className="p-2 text-left font-medium">Delivered Tile</th><th className="p-2 text-right font-medium">Quantity</th></tr></thead>
                                        <tbody>{order.dispatchedItems.map(item => (<tr key={item._id}><td className="p-2">{item.tile.name}</td><td className="p-2 text-right font-mono">{item.quantity} boxes</td></tr>))}</tbody>
                                    </table>
                                </div>
                            )) : <p className="text-sm text-gray-500 text-center py-4">No dispatches have been created for this booking yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingViewModal;
