import React from 'react';
import { FileText, FileWarning, AlertTriangle, CheckSquare, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActionCard = ({ title, value, icon: Icon, to, bgColor }) => (
    <Link to={to} className={`block p-6 rounded-xl shadow-sm border dark:border-dark-border ${bgColor} text-white hover:opacity-90 transition-opacity`}>
        <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{title}</p>
            <Icon size={20} />
        </div>
        <p className="text-3xl font-bold mt-1">{value}</p>
    </Link>
);

const DubaiStaffDashboard = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="space-y-8">
            {/* Action Required Section */}
            <div>
                <h2 className="text-xl font-bold mb-4">Action Required</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ActionCard title="Bookings to Approve" value={stats.pendingBookings} icon={CheckSquare} to="/bookings" bgColor="bg-blue-600" />
                    <ActionCard title="Pending Invoices" value={stats.pendingInvoices} icon={FileWarning} to="/dispatches" bgColor="bg-yellow-600" />
                    <ActionCard title="Pending Restocks" value={stats.pendingRestocks} icon={BarChart} to="/restocks" bgColor="bg-purple-600" />
                    <ActionCard title="Stock Alerts" value={stats.stockAlerts?.length || 0} icon={AlertTriangle} to="/tiles" bgColor="bg-red-600" />
                </div>
            </div>

            {/* Stock Alerts List */}
            <div className="bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><AlertTriangle className="text-red-500" size={20} /> Stock Alerts</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                    {stats.stockAlerts?.length > 0 ? stats.stockAlerts.map(tile => (
                        <div key={tile._id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="font-semibold text-red-800 dark:text-red-300">{tile.name}</p>
                            <div className="flex justify-between text-xs font-mono text-red-600 dark:text-red-400">
                                <span>Available: {tile.stockDetails.availableStock}</span>
                                <span>Booked: {tile.stockDetails.bookedStock}</span>
                                <span>Threshold: {tile.restockThreshold}</span>
                            </div>
                        </div>
                    )) : <p className="text-gray-500">No stock alerts. Everything looks good!</p>}
                </div>
            </div>
        </div>
    );
};

export default DubaiStaffDashboard;
