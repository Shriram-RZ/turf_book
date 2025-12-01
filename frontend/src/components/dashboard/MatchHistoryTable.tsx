import type { Match } from '../../types';
import { Trophy, Calendar, MapPin, TrendingUp, TrendingDown, Shield } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';

interface MatchHistoryTableProps {
    matches: Match[];
}

export const MatchHistoryTable = ({ matches }: MatchHistoryTableProps) => {
    const getResultBadge = (result: Match['result']) => {
        switch (result) {
            case 'WIN':
                return <Badge variant="success">WIN</Badge>;
            case 'LOSE':
                return <Badge variant="error">LOSE</Badge>;
            case 'DRAW':
                return <Badge variant="default">DRAW</Badge>;
        }
    };

    const getRatingChangeColor = (change: number) => {
        if (change > 0) return 'text-green-400';
        if (change < 0) return 'text-red-400';
        return 'text-gray-400';
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Trophy className="text-emerald-500" size={24} />
                    <h3 className="text-xl font-bold text-white">Recent Matches</h3>
                </div>
                <a href="/dashboard/matches" className="text-sm text-emerald-400 hover:text-emerald-300">
                    View All →
                </a>
            </div>

            {matches.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left text-xs font-medium text-gray-400 pb-3">Opponent</th>
                                <th className="text-left text-xs font-medium text-gray-400 pb-3">Turf</th>
                                <th className="text-left text-xs font-medium text-gray-400 pb-3">Date</th>
                                <th className="text-center text-xs font-medium text-gray-400 pb-3">Result</th>
                                <th className="text-center text-xs font-medium text-gray-400 pb-3">Score</th>
                                <th className="text-right text-xs font-medium text-gray-400 pb-3">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {matches.map((match) => (
                                <tr key={match.id} className="hover:bg-gray-900/50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <Shield className="text-gray-500" size={16} />
                                            <span className="font-medium text-white">{match.opponentTeam}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <MapPin size={14} />
                                            <span className="text-sm">{match.turf}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Calendar size={14} />
                                            <span className="text-sm">{format(new Date(match.date), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        {getResultBadge(match.result)}
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className="text-sm font-medium text-white">{match.score}</span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className={`flex items-center justify-end gap-1 font-medium ${getRatingChangeColor(match.ratingChange)}`}>
                                            {match.ratingChange > 0 ? (
                                                <>
                                                    <TrendingUp size={14} />
                                                    <span>+{match.ratingChange}</span>
                                                </>
                                            ) : match.ratingChange < 0 ? (
                                                <>
                                                    <TrendingDown size={14} />
                                                    <span>{match.ratingChange}</span>
                                                </>
                                            ) : (
                                                <span>0</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No matches played yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start playing to see your match history!</p>
                </div>
            )}
        </div>
    );
};
