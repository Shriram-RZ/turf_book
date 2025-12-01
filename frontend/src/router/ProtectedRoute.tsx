import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../context/useAuthStore';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    // Reduced logging noise - only log significant state changes or blocks
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
    }

    if (!isAuthenticated) {
        console.warn('ProtectedRoute: User not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user) {
        const hasRole = allowedRoles.includes(user.role);
        if (!hasRole) {
            console.warn(`ProtectedRoute: Role mismatch. User role: ${user.role}, Allowed: ${allowedRoles}. Redirecting to /`);
            return <Navigate to="/" replace />;
        }
    }

    // Only log if we are actually rendering the outlet to avoid spam
    // console.log('ProtectedRoute: Access granted'); 
    return <Outlet />;
};
