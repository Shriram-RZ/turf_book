import { useEffect } from 'react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { NotificationService } from '../../services/notifications';
import { NotificationsList } from '../../components/dashboard/NotificationsList';
import { Skeleton } from '../../components/loaders/Skeleton';
import { CheckCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Notifications = () => {
    const { notifications, notificationsLoading, fetchNotifications } = useDashboardStore();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAllRead = async () => {
        try {
            await NotificationService.markAllAsRead();
            toast.success('All notifications marked as read');
            fetchNotifications(); // Refresh list
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark notifications as read');
        }
    };

    if (notificationsLoading && notifications.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Notifications</h1>
                    <p className="text-gray-400 text-sm">Stay updated with your activities</p>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-4 py-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <CheckCheck size={18} />
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 min-h-[400px]">
                <NotificationsList notifications={notifications} />
            </div>
        </div>
    );
};

export default Notifications;
