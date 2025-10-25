import React, { useEffect, useState } from 'react';
import { X, User, ShoppingBag, Hash, FileText, Calendar, Box } from 'lucide-react';
import { format } from 'date-fns';

const BookingViewModal = ({ booking, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Trigger the transition on mount
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Wait for the transition to finish before calling the parent's onClose
        setTimeout(onClose, 300);
    };

    if (!booking) return null;

    const totalBoxes = booking.tilesList.reduce((acc, item) => acc + item.quantity, 0);
    const totalSqM = booking.tilesList.reduce((acc, item) => acc + (item.quantity * (item.tile.conversionFactor || 1)), 0);

    const getStatusPill = (status) => {
        const baseClasses = "px-3 py-1 text-xs font-bold rounded-full";
        switch (status) {
            case 'Booked': return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`;
            case 'Partially Dispatched': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
            case 'Completed': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
            case 'Cancelled': return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
            default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700`;
        }
    };

    return (
        <div 
            onClick={handleClose}
            className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`bg-white dark:bg-dark-foreground rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b dark:border-dark-border">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-lg"><FileText size={24}/></div>
                        <div>
                            <h2 className="text-xl font-bold">Booking Details</h2>
                            <p className="text-sm font-mono text-gray-500">{booking.bookingId}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border"><X size={24}/></button>
                </div>

                {/* Main Content */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {/* Key Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><ShoppingBag size={14}/> Party</div>
                            <div className="font-semibold text-base truncate">{booking.party?.partyName}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><User size={14}/> Salesman</div>
                            <div className="font-semibold text-base truncate">{booking.salesman?.username}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Calendar size={14}/> Booking Date</div>
                            <div className="font-semibold text-base">{format(new Date(booking.createdAt), 'dd MMM, yyyy')}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-background p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Hash size={14}/> LPO Number</div>
                            <div className="font-semibold text-base">{booking.lpoNumber || 'N/A'}</div>
                        </div>
                        <div className="col-span-1 lg:col-span-2 bg-gray-50 dark:bg-dark-background p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <div className="text-gray-500 dark:text-gray-400">Status</div>
                                <div className="font-semibold text-base"><span className={getStatusPill(booking.status)}>{booking.status}</span></div>
                            </div>
                            <div className="text-right">
                                <div className="text-gray-500 dark:text-gray-400">Total Quantity</div>
                                <div className="font-semibold text-base">{totalBoxes} boxes / {totalSqM.toFixed(2)} m²</div>
                            </div>
                        </div>
                    </div>

                    {/* Tiles List */}
                    <div>
                        <h3 className="font-semibold mb-3">Booked Items</h3>
                        <div className="border rounded-lg dark:border-dark-border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-dark-background">
                                    <tr>
                                        <th className="p-3 text-left font-medium">Tile Name</th>
                                        <th className="p-3 text-left font-medium">Size</th>
                                        <th className="p-3 text-right font-medium">Quantity (Boxes)</th>
                                        <th className="p-3 text-right font-medium">Quantity (m²)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {booking.tilesList.map(item => (
                                        <tr key={item.tile._id} className="border-t dark:border-dark-border">
                                            <td className="p-3 font-semibold">{item.tile.name}</td>
                                            <td className="p-3 text-gray-500">{item.tile.size}</td>
                                            <td className="p-3 text-right font-mono">{item.quantity}</td>
                                            <td className="p-3 text-right font-mono">{(item.quantity * (item.tile.conversionFactor || 1)).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                        <div>
                            <h3 className="font-semibold mb-2">Notes</h3>
                            <p className="text-sm bg-gray-50 dark:bg-dark-background p-3 rounded-lg text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{booking.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingViewModal;
