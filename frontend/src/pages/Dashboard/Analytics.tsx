import { useEffect } from 'react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { AnalyticsCharts } from '../../components/dashboard/AnalyticsCharts';
import { StatsOverview } from '../../components/dashboard/StatsOverview';
import { Skeleton } from '../../components/loaders/Skeleton';

const Analytics = () => {
    const { stats, statsLoading, fetchStats } = useDashboardStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (statsLoading && !stats) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-96 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
                <p className="text-gray-400 text-sm">Detailed insights into your performance</p>
            </div>

            <StatsOverview stats={stats} />

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Performance Trends</h2>
                <AnalyticsCharts stats={stats} />
            </div>
        </div>
    );
};

export default Analytics;
