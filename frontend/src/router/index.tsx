import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import TurfList from '../pages/Turfs/TurfList';
import TurfDetails from '../pages/Turfs/TurfDetails';
import BookingConfirmation from '../pages/Booking/BookingConfirmation';
import TeamList from '../pages/Teams/TeamList';
import TeamDetails from '../pages/Teams/TeamDetails';

// Dashboard Pages
import UserDashboard from '../pages/Dashboard/UserDashboard';
import MyBookings from '../pages/Dashboard/MyBookings';
import MyQR from '../pages/Dashboard/MyQR';
import Friends from '../pages/Dashboard/Friends';
import MatchHistory from '../pages/Dashboard/MatchHistory';
import Notifications from '../pages/Dashboard/Notifications';
import Achievements from '../pages/Dashboard/Achievements';
import Activity from '../pages/Dashboard/Activity';
import Analytics from '../pages/Dashboard/Analytics';
import Settings from '../pages/Dashboard/Settings';

// Owner Pages
import OwnerDashboard from '../pages/Owner/OwnerDashboard';
import ManageTurfs from '../pages/Owner/ManageTurfs';
import AddTurf from '../pages/Owner/AddTurf';
import ManageSlots from '../pages/Owner/ManageSlots';
import ScanQR from '../pages/Owner/ScanQR';
import OwnerBookings from '../pages/Owner/OwnerBookings';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import Approvals from '../pages/Admin/Approvals';
import UserManagement from '../pages/Admin/UserManagement';
import AuthDebug from '../pages/Debug/AuthDebug';

export const router = createBrowserRouter([
    {
        path: '/debug/auth',
        element: <AuthDebug />
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'turfs', element: <TurfList /> },
            { path: 'turfs/:id', element: <TurfDetails /> },
        ],
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
        ],
    },
    {
        path: '/booking',
        element: <ProtectedRoute allowedRoles={['USER']} />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: 'confirm', element: <BookingConfirmation /> },
                ],
            },
        ],
    },
    {
        path: '/dashboard',
        element: <ProtectedRoute allowedRoles={['USER']} />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <UserDashboard /> },
                    { path: 'bookings', element: <MyBookings /> },
                    { path: 'qr', element: <MyQR /> },
                    { path: 'friends', element: <Friends /> },
                    { path: 'matches', element: <MatchHistory /> },
                    { path: 'notifications', element: <Notifications /> },
                    { path: 'achievements', element: <Achievements /> },
                    { path: 'activity', element: <Activity /> },
                    { path: 'analytics', element: <Analytics /> },
                    { path: 'settings', element: <Settings /> },
                ],
            },
        ],
    },
    {
        path: '/owner',
        element: <ProtectedRoute allowedRoles={['OWNER']} />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <OwnerDashboard /> },
                    { path: 'turfs', element: <ManageTurfs /> },
                    { path: 'turfs/add', element: <AddTurf /> },
                    { path: 'turfs/edit/:id', element: <AddTurf /> },
                    { path: 'turfs/:turfId/slots', element: <ManageSlots /> },
                    { path: 'bookings', element: <OwnerBookings /> },
                    { path: 'scan', element: <ScanQR /> },
                ],
            },
        ],
    },
    {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <AdminDashboard /> },
                    { path: 'approvals', element: <Approvals /> },
                    { path: 'users', element: <UserManagement /> },
                ],
            },
        ],
    },
    {
        path: '/teams',
        element: <ProtectedRoute allowedRoles={['USER']} />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { index: true, element: <TeamList /> },
                    { path: ':id', element: <TeamDetails /> },
                ],
            },
        ],
    },
]);
