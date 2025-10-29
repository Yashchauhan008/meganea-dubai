import React from 'react';
import { Truck, MapPin, Package } from 'lucide-react';
import { format } from 'date-fns';

const LaborDashboard = ({ stats }) => {
    if (!stats || !stats.upcomingDispatches) return null;

    const getStatusPill = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'In Transit':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Upcoming Dispatches</h2>
            {stats.upcomingDispatches.length > 0 ? (
                <div className="space-y-4">
                    {stats.upcomingDispatches.map(dispatch => (
                        <div key={dispatch._id} className="bg-white dark:bg-dark-foreground p-4 rounded-xl shadow-sm border dark:border-dark-border">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                                <div className="font-bold text-lg">{dispatch.booking.party.name}</div>
                                <div className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusPill(dispatch.status)}`}>{dispatch.status}</div>
                            </div>
                            <div className="border-t dark:border-dark-border pt-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-start gap-2">
                                        <Truck size={16} className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="font-semibold">Dispatch Date</p>
                                            <p className="text-gray-600 dark:text-gray-300">{format(new Date(dispatch.dispatchDate), 'E, dd MMM yyyy')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin size={16} className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="font-semibold">Shipping Address</p>
                                            <p className="text-gray-600 dark:text-gray-300">{dispatch.booking.party.shippingAddress}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Package size={16} className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="font-semibold">Items</p>
                                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                                                {dispatch.deliveredItems.map(item => (
                                                    <li key={item._id}>{item.quantity} boxes - {item.tile.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-dark-foreground rounded-xl border dark:border-dark-border">
                    <Truck size={48} className="mx-auto text-gray-300" />
                    <h3 className="mt-4 text-lg font-semibold">No Upcoming Dispatches</h3>
                    <p className="mt-1 text-sm text-gray-500">Your schedule is clear.</p>
                </div>
            )}
        </div>
    );
};

export default LaborDashboard;
