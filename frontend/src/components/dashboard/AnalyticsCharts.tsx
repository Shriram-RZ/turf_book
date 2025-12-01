import type { UserStats } from '../../types';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface AnalyticsChartsProps {
    stats: UserStats | null;
}

export const AnalyticsCharts = ({ stats }: AnalyticsChartsProps) => {
    if (!stats) {
        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="h-64 bg-gray-700 rounded animate-pulse" />
            </div>
        );
    }

    // Ensure stats properties exist with defaults
    const wins = stats.wins || 0;
    const losses = stats.losses || 0;
    const draws = stats.draws || 0;

    // Win/Loss/Draw data for pie chart
    const winLossData = [
        { name: 'Wins', value: wins, color: '#10b981' },
        { name: 'Losses', value: losses, color: '#ef4444' },
        { name: 'Draws', value: draws, color: '#6b7280' }
    ];

    // Mock monthly data (in real app, this would come from API)
    const monthlyData = [
        { month: 'Jan', matches: 5, wins: 3 },
        { month: 'Feb', matches: 8, wins: 5 },
        { month: 'Mar', matches: 6, wins: 4 },
        { month: 'Apr', matches: 10, wins: 7 },
        { month: 'May', matches: 12, wins: 8 },
        { month: 'Jun', matches: 9, wins: 6 }
    ];

    // Mock skill rating history
    const skillHistory = [
        { date: 'Week 1', rating: 1150 },
        { date: 'Week 2', rating: 1180 },
        { date: 'Week 3', rating: 1200 },
        { date: 'Week 4', rating: 1220 },
        { date: 'Week 5', rating: 1250 },
        { date: 'Week 6', rating: 1280 }
    ];

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-emerald-500" size={24} />
                <h3 className="text-xl font-bold text-white">Performance Analytics</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Win Rate Donut Chart */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-sm font-medium text-gray-400 mb-4">Win/Loss Distribution</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={winLossData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {winLossData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-2">
                        {winLossData.map((item) => (
                            <div key={item.name} className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-gray-400">{item.name}: {item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Matches Bar Chart */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-sm font-medium text-gray-400 mb-4">Monthly Activity</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={monthlyData}>
                            <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="matches" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Skill Rating Line Chart */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-sm font-medium text-gray-400 mb-4">Skill Rating Trend</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={skillHistory}>
                            <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} domain={['dataMin - 50', 'dataMax + 50']} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
