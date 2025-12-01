import type { Notification } from '../../types';
import { Bell, UserPlus, Trophy, Info, AlertCircle, CheckCircle, X, Trash2, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { NotificationService } from '../../services/notifications';
import { useDashboardStore } from '../../stores/dashboardStore';
import { toast } from 'react-hot-toast';

interface NotificationsListProps {
    notifications: Notification[];
}

export const NotificationsList = ({ notifications }: NotificationsListProps) => {
    const { fetchNotifications } = useDashboardStore();

    const handleMarkRead = async (id: number) => {
        try {
            await NotificationService.markAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await NotificationService.delete(id);
            toast.success('Notification deleted');
            fetchNotifications();
        } catch (error) {
            console.error('Failed to delete notification', error);
            toast.error('Failed to delete');
        }
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'REQUEST':
                return <UserPlus size={20} className="text-blue-500" />;
            case 'MATCH_CHALLENGE':
                return <Trophy size={20} className="text-orange-500" />;
            case 'APPROVAL':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'ALERT':
                return <AlertCircle size={20} className="text-red-500" />;
            default:
                return <Info size={20} className="text-gray-500" />;
        }
    };

    const getVariant = (type: Notification['type']): 'success' | 'error' | 'warning' | 'info' | 'default' => {
        switch (type) {
            case 'APPROVAL':
                return 'success';
            case 'ALERT':
                return 'error';
            case 'MATCH_CHALLENGE':
                return 'warning';
            case 'REQUEST':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Bell className="text-emerald-500" size={24} />
                    <h3 className="text-xl font-bold text-white">Notifications</h3>
                    {notifications.filter(n => !n.read).length > 0 && (
                        <Badge variant="error" size="sm">
                            {notifications.filter(n => !n.read).length} New
                        </Badge>
                    )}
                </div>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-lg border transition-all hover:bg-gray-700/50 ${notification.read
                                ? 'bg-gray-900/30 border-gray-700/50 opacity-75'
                                : 'bg-gray-900/70 border-emerald-500/30 shadow-sm shadow-emerald-900/10'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-2 bg-gray-800 rounded-full border border-gray-700">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className={`text-sm ${notification.read ? 'text-gray-400' : 'text-white font-medium'}`}>
                                            {notification.message}
                                        </p>
                                        <div className="flex gap-1">
                                            {!notification.read && (
                                                <button
                                                    onClick={() => handleMarkRead(notification.id)}
                                                    className="text-gray-500 hover:text-emerald-400 p-1 rounded hover:bg-emerald-500/10 transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="text-gray-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={getVariant(notification.type)} size="sm">
                                            {notification.type.replace('_', ' ')}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                            {notification.createdAt
                                                ? (() => {
                                                    try {
                                                        return formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
                                                    } catch {
                                                        return 'Just now';
                                                    }
                                                })()
                                                : 'Just now'
                                            }
                                        </span>
                                    </div>
                                    {notification.actionable && !notification.read && (
                                        <div className="flex gap-2 mt-3">
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs">
                                                <CheckCircle size={14} className="mr-1" />
                                                Accept
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:text-white h-8 text-xs">
                                                <X size={14} className="mr-1" />
                                                Decline
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-gray-700/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-300 font-medium">No notifications</p>
                        <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
