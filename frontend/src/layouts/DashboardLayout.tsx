import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/useAuthStore';
import { LayoutDashboard, Calendar, Settings, LogOut, QrCode, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';

const DashboardLayout = () => {
    const { user, logout } = useAuthStore();
    const location = useLocation();

    // Use new DashboardSidebar for USER role
    if (user?.role === 'USER') {
        return (
            <div className="min-h-screen bg-gray-900 flex">
                <DashboardSidebar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        );
    }

    // Keep existing sidebar for OWNER and ADMIN roles
    const ownerLinks = [
        { name: 'Overview', path: '/owner', icon: LayoutDashboard },
        { name: 'Manage Turfs', path: '/owner/turfs', icon: Settings },
        { name: 'Bookings', path: '/owner/bookings', icon: Calendar },
        { name: 'Scan QR', path: '/owner/scan', icon: QrCode },
    ];

    const adminLinks = [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Approvals', path: '/admin/approvals', icon: Settings },
        { name: 'Users', path: '/admin/users', icon: Users },
    ];

    const links = user?.role === 'ADMIN' ? adminLinks : ownerLinks;

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <Link to="/" className="text-2xl font-bold text-emerald-500">TurfBook</Link>
                    <div className="mt-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                        {user?.role} Dashboard
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={clsx(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "bg-emerald-600 text-white"
                                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                )}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-gray-700 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
