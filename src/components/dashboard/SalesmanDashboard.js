import React from 'react';
import { FileText, Briefcase, BarChart, CheckCircle, Clock, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border text-center">
        <Icon size={32} className="mx-auto text-primary" />
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
    </div>
);

const SalesmanDashboard = ({ stats }) => {
    if (!stats) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock size={16} className="text-yellow-500" />;
            case 'Confirmed': return <CheckCircle size={16} className="text-green-500" />;
            case 'Partially Dispatched': return <Truck size={16} className="text-blue-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Open Bookings" value={stats.openBookings} icon={FileText} />
                <StatCard title="Pending Confirmation" value={stats.pendingConfirmation} icon={Clock} />
                <StatCard title="Total Booked Boxes" value={stats.totalBookedBoxes} icon={BarChart} />
                <StatCard title="My Companies" value={stats.myCompaniesCount} icon={Briefcase} />
            </div>
            <div>
                <h3 className="font-bold text-lg mb-4">My Recent Bookings</h3>
                <div className="bg-white dark:bg-dark-foreground p-4 rounded-xl shadow-sm border dark:border-dark-border space-y-2">
                    {stats.recentBookings.map(booking => (
                        <Link to={`/bookings/${booking._id}`} key={booking._id} className="block p-3 hover:bg-gray-50 dark:hover:bg-dark-background rounded-lg">
                            <div className="flex justify-between items-center">
                                <p>ID: <span className="font-mono text-primary">{booking.bookingId}</span></p>
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    {getStatusIcon(booking.status)}
                                    <span>{booking.status}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesmanDashboard;
