// import React from 'react';
// import { BarChart, Boxes, FileText, Truck, AlertTriangle } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const StatCard = ({ title, value, icon: Icon, color }) => (
//     <div className="bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border">
//         <div className="flex justify-between items-center">
//             <div>
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
//                 <p className="text-3xl font-bold">{value}</p>
//             </div>
//             <div className={`p-3 rounded-full ${color}`}>
//                 <Icon size={24} className="text-white" />
//             </div>
//         </div>
//     </div>
// );

// const AdminDashboard = ({ stats }) => {
//     if (!stats) return null;

//     return (
//         <div className="space-y-8">
//             {/* KPI Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <StatCard title="Total Tile Designs" value={stats.totalTiles} icon={Boxes} color="bg-blue-500" />
//                 <StatCard title="Active Bookings" value={stats.activeBookings} icon={FileText} color="bg-green-500" />
//                 <StatCard title="Pending Dispatches" value={stats.pendingDispatches} icon={Truck} color="bg-yellow-500" />
//                 <StatCard title="Pending Restocks" value={stats.pendingRestocks} icon={BarChart} color="bg-purple-500" />
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Stock Alerts */}
//                 <div className="bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border">
//                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><AlertTriangle className="text-red-500" /> Stock Alerts</h3>
//                     <div className="space-y-3">
//                         {stats.stockAlerts.length > 0 ? stats.stockAlerts.map(tile => (
//                             <div key={tile._id} className="p-3 bg-gray-50 dark:bg-dark-background rounded-lg">
//                                 <p className="font-semibold">{tile.name}</p>
//                                 <div className="flex justify-between text-sm font-mono">
//                                     <span>Available: {tile.stockDetails.availableStock}</span>
//                                     <span>Booked: {tile.stockDetails.bookedStock}</span>
//                                     <span className="text-red-500">Threshold: {tile.restockThreshold}</span>
//                                 </div>
//                             </div>
//                         )) : <p className="text-gray-500">No stock alerts. Everything looks good!</p>}
//                     </div>
//                 </div>

//                 {/* Recent Bookings */}
//                 <div className="bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border">
//                     <h3 className="font-bold text-lg mb-4">Recent Bookings</h3>
//                     <div className="space-y-3">
//                         {stats.recentBookings.map(booking => (
//                             <div key={booking._id} className="p-3 bg-gray-50 dark:bg-dark-background rounded-lg text-sm">
//                                 <p>ID: <Link to={`/bookings/${booking._id}`} className="font-mono text-primary hover:underline">{booking.bookingId}</Link></p>
//                                 <p>Company: <span className="font-semibold">{booking.party.name}</span></p>
//                                 <p>Salesman: <span className="font-semibold">{booking.salesman.username}</span></p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;

import React from 'react';
import { BarChart, Boxes, FileText, FileWarning, AlertTriangle, UserCheck, TrendingUp } from 'lucide-react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Legend } from 'recharts';

// A more subdued, professional StatCard component
const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border">
        <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <Icon className="text-gray-400 dark:text-gray-500" size={20} />
        </div>
        <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
);

const ChartContainer = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Icon className="text-gray-500" size={20} /> {title}
        </h3>
        <div style={{ width: '100%', height: 300 }}>
            {children}
        </div>
    </div>
);

const AdminDashboard = ({ stats }) => {
    if (!stats) {
        return <div>Loading dashboard components...</div>;
    }

    const bookingChartData = stats.bookingActivity?.map(item => ({
        date: item._id,
        Bookings: item.count
    })) || [];

    return (
        <div className="space-y-8">
            {/* KPI Cards - Professional, Monochromatic Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Tile Designs" value={stats.totalTiles} icon={Boxes} />
                <StatCard title="Active Bookings" value={stats.activeBookings} icon={FileText} />
                <StatCard title="Pending Invoices" value={stats.pendingInvoices} icon={FileWarning} />
                <StatCard title="Pending Restocks" value={stats.pendingRestocks} icon={BarChart} />
            </div>

            {/* Booking Activity Chart */}
            <ChartContainer title="Booking Activity (Last 30 Days)" icon={TrendingUp}>
                <ResponsiveContainer>
                    <ComposedChart data={bookingChartData}>
                        <defs>
                            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(200, 200, 200, 0.5)', 
                                borderRadius: '0.5rem',
                                color: '#111827'
                            }} 
                            cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }}
                        />
                        <Bar dataKey="Bookings" fill="url(#colorBookings)" barSize={20} />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartContainer>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Salesmen */}
                <div className="lg:col-span-1 bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><UserCheck className="text-gray-500" size={20} /> Top Salesmen</h3>
                    <div className="space-y-4">
                        {stats.topSalesmen?.length > 0 ? stats.topSalesmen.map((salesman, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="font-semibold">{salesman.name}</span>
                                <span className="font-bold text-lg text-primary">{salesman.count} <span className="text-sm font-normal text-gray-500">bookings</span></span>
                            </div>
                        )) : <p className="text-gray-500 text-sm">No booking data available.</p>}
                    </div>
                </div>

                {/* Top Booked Tiles */}
                <div className="lg:col-span-1 bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Boxes className="text-gray-500" size={20} /> Top Booked Tiles</h3>
                    <div className="space-y-4">
                        {stats.topTiles?.length > 0 ? stats.topTiles.map((tile, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="font-semibold truncate pr-4">{tile.name}</span>
                                <span className="font-bold text-lg text-primary">{tile.count} <span className="text-sm font-normal text-gray-500">boxes</span></span>
                            </div>
                        )) : <p className="text-gray-500 text-sm">No booking data available.</p>}
                    </div>
                </div>

                {/* Stock Alerts */}
                <div className="lg:col-span-1 bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><AlertTriangle className="text-red-500" size={20} /> Stock Alerts</h3>
                    <div className="space-y-3 max-h-72 overflow-y-auto">
                        {stats.stockAlerts?.length > 0 ? stats.stockAlerts.map(tile => (
                            <div key={tile._id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <p className="font-semibold text-red-800 dark:text-red-300">{tile.name}</p>
                                <div className="flex justify-between text-xs font-mono text-red-600 dark:text-red-400">
                                    <span>Avl: {tile.stockDetails.availableStock}</span>
                                    <span>Bkd: {tile.stockDetails.bookedStock}</span>
                                    <span>Thr: {tile.restockThreshold}</span>
                                </div>
                            </div>
                        )) : <p className="text-gray-500">No stock alerts. Everything looks good!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
