import { useEffect } from 'react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { AchievementsList } from '../../components/dashboard/AchievementsList';
import { Skeleton } from '../../components/loaders/Skeleton';
import { Trophy, Star, Medal } from 'lucide-react';

const Achievements = () => {
    const { achievements, achievementsLoading, fetchAchievements } = useDashboardStore();

    useEffect(() => {
        fetchAchievements();
    }, [fetchAchievements]);

    if (achievementsLoading && achievements.length === 0) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    // Calculate stats
    const totalAchievements = achievements.length;
    const unlockedCount = achievements.filter(a => a.unlockedAt).length;
    const progressPercentage = totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Achievements</h1>
                    <p className="text-gray-400 text-sm">Track your progress and earn badges</p>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider">Unlocked</p>
                            <p className="text-2xl font-bold text-white">{unlockedCount} / {totalAchievements}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
                            <Star size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider">Completion</p>
                            <p className="text-2xl font-bold text-white">{progressPercentage}%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                            <Medal size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider">Latest</p>
                            <p className="text-sm font-medium text-white truncate">
                                {achievements.find(a => a.unlockedAt)?.name || 'None yet'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <AchievementsList achievements={achievements} />
        </div>
    );
};

export default Achievements;
