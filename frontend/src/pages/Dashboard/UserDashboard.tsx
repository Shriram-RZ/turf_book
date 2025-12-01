import { useEffect } from 'react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { ProfileCard } from '../../components/dashboard/ProfileCard';
import { StatsOverview } from '../../components/dashboard/StatsOverview';
import { FriendsList } from '../../components/dashboard/FriendsList';
import { TeamCard } from '../../components/dashboard/TeamCard';
import { NotificationsList } from '../../components/dashboard/NotificationsList';
import { MatchHistoryTable } from '../../components/dashboard/MatchHistoryTable';
import { AnalyticsCharts } from '../../components/dashboard/AnalyticsCharts';
import { AchievementsList } from '../../components/dashboard/AchievementsList';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { Skeleton } from '../../components/loaders/Skeleton';

const UserDashboard = () => {
    const {
        profile,
        friends,
        teams,
        notifications,
        matchHistory,
        achievements,
        stats,
        loading,
        fetchDashboardData
    } = useDashboardStore();

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading && !profile) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-6">
                <Skeleton className="h-48 w-full rounded-xl" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-64 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome back! Here's your performance overview.</p>
            </div>

            {/* Top Section: Profile + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ProfileCard profile={profile} />
                </div>
                <div>
                    <StatsOverview stats={stats} />
                </div>
            </div>

            {/* Friends & Teams Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FriendsList friends={friends} />
                <div className="space-y-6">
                    {teams && teams.length > 0 ? (
                        teams.slice(0, 2).map(team => (
                            <TeamCard key={team.id} team={team} />
                        ))
                    ) : (
                        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                            <p className="text-gray-400 mb-4">You're not part of any team yet</p>
                            <a href="/teams" className="text-emerald-400 hover:text-emerald-300">
                                Create or Join a Team →
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Notifications & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NotificationsList notifications={notifications?.slice(0, 5) || []} />
                <ActivityFeed />
            </div>

            {/* Analytics Charts */}
            <AnalyticsCharts stats={stats} />

            {/* Match History */}
            <MatchHistoryTable matches={matchHistory?.slice(0, 5) || []} />

            {/* Achievements */}
            <AchievementsList achievements={achievements?.slice(0, 6) || []} />
        </div>
    );
};

export default UserDashboard;
