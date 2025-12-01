import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Shield,
    Calendar,
    Trophy,
    Bell,
    Award,
    Activity,
    BarChart3,
    Settings
} from 'lucide-react';

interface NavItem {
    name: string;
    path: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Friends', path: '/dashboard/friends', icon: Users },
    { name: 'Teams', path: '/teams', icon: Shield },
    { name: 'Bookings', path: '/dashboard/bookings', icon: Calendar },
    { name: 'Match History', path: '/dashboard/matches', icon: Trophy },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { name: 'Achievements', path: '/dashboard/achievements', icon: Award },
    { name: 'Activity', path: '/dashboard/activity', icon: Activity },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
];

export const DashboardSidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700">
                <Link to="/" className="text-2xl font-bold text-emerald-500">
                    TurfBook
                </Link>
                <p className="text-xs text-gray-400 mt-1">Player Dashboard</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Settings */}
            <div className="p-4 border-t border-gray-700">
                <Link
                    to="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <Settings size={20} />
                    <span className="font-medium">Settings</span>
                </Link>
            </div>
        </aside>
    );
};
