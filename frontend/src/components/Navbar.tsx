import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/useAuthStore';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/Button';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/dashboard';
        if (user.role === 'ADMIN') return '/admin';
        if (user.role === 'OWNER') return '/owner';
        return '/dashboard';
    };

    return (
        <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-emerald-500 font-bold text-xl">TurfBook</Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/turfs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Browse Turfs</Link>
                            <Link to="/turfs">
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                    Book a Turf
                                </Button>
                            </Link>
                            {isAuthenticated && (
                                <Link to="/teams" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Teams</Link>
                            )}
                            {isAuthenticated && user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        <User className="w-5 h-5" />
                                        <span>{user.email}</span>
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                                            <div className="py-1">
                                                <Link
                                                    to={getDashboardLink()}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                                    Dashboard
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setShowDropdown(false);
                                                        handleLogout();
                                                    }}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                    <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-sm font-medium">Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
