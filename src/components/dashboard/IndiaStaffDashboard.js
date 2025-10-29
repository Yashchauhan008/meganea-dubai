import React from 'react';
import { Inbox, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndiaStaffDashboard = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* New Requests */}
            <div className="bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Inbox className="text-blue-500" /> New Restock Requests</h3>
                <div className="space-y-3">
                    {stats.newRestockRequests.length > 0 ? stats.newRestockRequests.map(req => (
                        <Link to="/restocks" key={req._id} className="block p-3 bg-gray-50 dark:bg-dark-background rounded-lg hover:bg-gray-100">
                            <p className="font-mono text-primary">{req.requestId}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{req.notes || 'No notes provided.'}</p>
                        </Link>
                    )) : <p className="text-gray-500">No new requests.</p>}
                </div>
            </div>

            {/* Processing Requests */}
            <div className="bg-white dark:bg-dark-foreground p-6 rounded-xl shadow-sm border dark:border-dark-border">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><RefreshCw className="text-purple-500" /> In Progress</h3>
                <div className="space-y-3">
                    {stats.processingRestocks.length > 0 ? stats.processingRestocks.map(req => (
                        <Link to="/restocks" key={req._id} className="block p-3 bg-gray-50 dark:bg-dark-background rounded-lg hover:bg-gray-100">
                            <p className="font-mono text-primary">{req.requestId}</p>
                        </Link>
                    )) : <p className="text-gray-500">No requests are currently being processed.</p>}
                </div>
            </div>
        </div>
    );
};

export default IndiaStaffDashboard;
