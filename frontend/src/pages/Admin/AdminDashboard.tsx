import { Users, CheckSquare, AlertTriangle, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-500', bg: 'bg-blue-900/20' },
        { label: 'Pending Approvals', value: '5', icon: CheckSquare, color: 'text-yellow-500', bg: 'bg-yellow-900/20' },
        { label: 'System Alerts', value: '0', icon: AlertTriangle, color: 'text-green-500', bg: 'bg-green-900/20' },
        { label: 'Active Sessions', value: '45', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-900/20' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400">System overview and management.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                        </div>
                        <h3 className="text-gray-400 font-medium">{stat.label}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Recent Registrations</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                                        U{i}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">New User {i}</p>
                                        <p className="text-gray-400 text-xs">user{i}@example.com</p>
                                    </div>
                                </div>
                                <span className="text-gray-500 text-xs">2 mins ago</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">System Health</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">API Latency</span>
                            <span className="text-emerald-400 font-bold">45ms</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Database Load</span>
                            <span className="text-emerald-400 font-bold">12%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Storage Usage</span>
                            <span className="text-yellow-400 font-bold">65%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
