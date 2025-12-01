import { Activity, Trophy, Users, Calendar, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock activity data (in real app, this would come from API)
const mockActivities = [
    {
        id: 1,
        type: 'FRIEND_WIN' as const,
        message: 'John Doe won a match against Thunder Squad',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        userId: 1,
        userName: 'John Doe'
    },
    {
        id: 2,
        type: 'TEAM_RANK_CHANGE' as const,
        message: 'Lightning Strikers moved up to #3 in rankings',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    },
    {
        id: 3,
        type: 'BOOKING_CONFIRMED' as const,
        message: 'Your booking for Green Field Turf is confirmed',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
        id: 4,
        type: 'ACHIEVEMENT_UNLOCKED' as const,
        message: 'You unlocked "First Win" achievement!',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString()
    }
];

export const ActivityFeed = () => {
    const getIcon = (type: typeof mockActivities[0]['type']) => {
        switch (type) {
            case 'FRIEND_WIN':
                return <Trophy size={18} className="text-yellow-500" />;
            case 'TEAM_RANK_CHANGE':
                return <Users size={18} className="text-blue-500" />;
            case 'BOOKING_CONFIRMED':
                return <Calendar size={18} className="text-green-500" />;
            case 'ACHIEVEMENT_UNLOCKED':
                return <Award size={18} className="text-purple-500" />;
            default:
                return <Activity size={18} className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Activity className="text-emerald-500" size={24} />
                    <h3 className="text-xl font-bold text-white">Activity Feed</h3>
                </div>
                <a href="/dashboard/activity" className="text-sm text-emerald-400 hover:text-emerald-300">
                    View All →
                </a>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {mockActivities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-emerald-500/30 transition-colors"
                    >
                        <div className="mt-0.5">{getIcon(activity.type)}</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
