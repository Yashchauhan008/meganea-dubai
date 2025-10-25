import React, { useState, useEffect, useCallback } from 'react';
import { getAllDispatchOrders, getDispatchOrderById, deleteDispatchOrder } from '../api/dispatchApi';
import DispatchFormModal from '../components/dispatch/DispatchFormModal'; // We will use this for editing
import { Calendar, User, Hash, Edit, Trash2, Box, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DispatchOrderListPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDispatch, setSelectedDispatch] = useState(null);

    const isAdmin = user?.role === 'admin';

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getAllDispatchOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to fetch dispatch orders.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleEdit = (orderToEdit) => {
        // The 'orderToEdit' object from the list already contains the populated booking.
        const booking = orderToEdit.booking;

        if (!booking || !booking.dispatchOrders) {
            alert("Could not edit: The parent booking details are missing.");
            return;
        }

        // Calculate what was dispatched in OTHER orders for this booking.
        const previouslyDispatched = {};
        booking.dispatchOrders.forEach(order => {
            // Exclude the dispatch we are currently editing from the calculation.
            if (order._id !== orderToEdit._id) {
                order.dispatchedItems.forEach(item => {
                    const tileId = item.tile._id.toString();
                    previouslyDispatched[tileId] = (previouslyDispatched[tileId] || 0) + item.quantity;
                });
            }
        });

        // Set the state needed for the modal.
        setSelectedDispatch({
            dispatch: orderToEdit,
            booking: booking,
            previouslyDispatched: previouslyDispatched,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (orderId) => {
        if (window.confirm('Are you sure you want to DELETE this dispatch order? This action is permanent and will revert the stock levels.')) {
            try {
                await deleteDispatchOrder(orderId);
                fetchOrders(); // Refresh the list
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete dispatch order.');
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {isModalOpen && (
                <DispatchFormModal
                    dispatchData={selectedDispatch}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchOrders}
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">All Dispatch Orders</h1>
                    <p className="text-gray-500 mt-1">A historical log of all processed deliveries.</p>
                </div>
                <Link to="/dispatches/process" className="w-full sm:w-auto bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-hover shadow-sm text-center">
                    Process New Notes
                </Link>
            </div>

            {loading && <p className="text-center">Loading orders...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white dark:bg-dark-foreground rounded-xl shadow-md border dark:border-dark-border flex flex-col">
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="font-mono text-sm text-primary dark:text-dark-primary">{order.dispatchNumber}</p>
                                        <h3 className="font-bold text-lg text-text dark:text-dark-text truncate">{order.booking?.party?.partyName || 'N/A'}</h3>
                                        <p className="text-xs text-gray-400">Booking: {order.booking?.bookingId}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => handleEdit(order)} className="p-2 text-gray-500 hover:text-green-500" title="Edit Dispatch"><Edit size={16} /></button>
                                        {isAdmin && <button onClick={() => handleDelete(order._id)} className="p-2 text-gray-500 hover:text-red-500" title="Delete Dispatch"><Trash2 size={16} /></button>}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                                    <p className="flex items-center gap-2"><Calendar size={14} /> {format(new Date(order.dispatchedAt), 'dd MMM, yyyy')}</p>
                                    <p className="flex items-center gap-2"><User size={14} /> Created by: {order.createdBy?.username || 'N/A'}</p>
                                    <p className="flex items-center gap-2"><Hash size={14} /> Invoice: {order.invoiceNumber || '-'}</p>
                                </div>
                                <div className="border-t dark:border-dark-border pt-3">
                                    <h4 className="font-semibold text-sm mb-2">Delivered Tiles</h4>
                                    <ul className="space-y-2 text-sm">
                                        {order.dispatchedItems.map(item => (
                                            <li key={item._id} className="flex justify-between items-center bg-gray-50 dark:bg-dark-background/50 p-2 rounded-md">
                                                <div>
                                                    <p className="font-semibold">{item.tile?.name || 'Deleted Tile'}</p>
                                                    <p className="text-xs text-gray-500">{item.tile?.size || ''}</p>
                                                </div>
                                                <span className="font-mono text-base font-bold">
                                                    {item.quantity}
                                                    <span className="text-xs font-normal ml-1">boxes</span>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {order.sourceImage?.imageUrl && (
                                <div className="p-3 bg-gray-50 dark:bg-dark-background/30 border-t dark:border-dark-border mt-auto">
                                    <a href={order.sourceImage.imageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-blue-500 hover:underline">
                                        <ImageIcon size={14} className="mr-2" /> View Delivery Note
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                    {orders.length === 0 && (
                        <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
                            <Hash size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-4 text-lg font-semibold">No Dispatch Orders Found</h3>
                            <p className="text-gray-500 mt-1">No deliveries have been processed yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DispatchOrderListPage;
