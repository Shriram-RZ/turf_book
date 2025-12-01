import type { UserStats } from '../../types';
import { TrendingUp, TrendingDown, Minus, Flame, Award } from 'lucide-react';

interface StatsOverviewProps {
    stats: UserStats | null;
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
    if (!stats) {
        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
                <div className="h-6 bg-gray-700 rounded animate-pulse" />
                <div className="h-20 bg-gray-700 rounded animate-pulse" />
                <div className="h-20 bg-gray-700 rounded animate-pulse" />
            </div>
        );
    }

    const getTrendIcon = (change: number) => {
        if (change > 0) return <TrendingUp size={16} className="text-green-500" />;
        if (change < 0) return <TrendingDown size={16} className="text-red-500" />;
        return <Minus size={16} className="text-gray-500" />;
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>

            {/* Win Rate */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Win Rate</span>
                    <Award size={18} className="text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{(stats?.winRate || 0).toFixed(1)}%</p>
                <p className="text-xs text-gray-500">
                    {stats?.wins || 0}W - {stats?.losses || 0}L - {stats?.draws || 0}D
                </p>
            </div>

            {/* Current Streak */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Current Streak</span>
                    <Flame size={18} className={(stats?.currentStreak || 0) > 0 ? 'text-orange-500' : 'text-gray-600'} />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats?.currentStreak || 0}</p>
                <p className="text-xs text-gray-500">
                    Best: {stats?.bestStreak || 0} {(stats?.bestStreak || 0) === 1 ? 'win' : 'wins'}
                </p>
            </div>

            {/* Average Rating Change */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Avg. Rating Change</span>
                    {getTrendIcon(stats?.averageRatingChange || 0)}
                </div>
                <p className={`text-3xl font-bold ${(stats?.averageRatingChange || 0) > 0 ? 'text-green-400' : (stats?.averageRatingChange || 0) < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {(stats?.averageRatingChange || 0) > 0 ? '+' : ''}{(stats?.averageRatingChange || 0).toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">per match</p>
            </div>

            {/* Performance Insights */}
            {stats?.strongestTime && (
                <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30">
                    <p className="text-xs text-emerald-400 mb-1">💡 Peak Performance</p>
                    <p className="text-sm text-white">{stats.strongestTime}</p>
                </div>
            )}

            {stats?.preferredTurf && (
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                    <p className="text-xs text-blue-400 mb-1">🏟️ Favorite Turf</p>
                    <p className="text-sm text-white">{stats.preferredTurf}</p>
                </div>
            )}
        </div>
    );
};
