import { useEffect } from 'react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { MatchHistoryTable } from '../../components/dashboard/MatchHistoryTable';
import { Skeleton } from '../../components/loaders/Skeleton';
import { Filter } from 'lucide-react';

const MatchHistory = () => {
    const { matchHistory, matchHistoryLoading, fetchMatchHistory } = useDashboardStore();

    useEffect(() => {
        fetchMatchHistory();
    }, [fetchMatchHistory]);

    if (matchHistoryLoading && matchHistory.length === 0) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48 rounded-lg" />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Match History</h1>
                    <p className="text-gray-400 text-sm">View your past matches and results</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-colors text-sm">
                    <Filter size={16} />
                    Filter Matches
                </button>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <MatchHistoryTable matches={matchHistory} />
            </div>
        </div>
    );
};

export default MatchHistory;
