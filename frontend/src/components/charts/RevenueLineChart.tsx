import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
    date: string;
    amount: number;
}

interface RevenueLineChartProps {
    data: RevenueData[];
}

export const RevenueLineChart = ({ data }: RevenueLineChartProps) => {
    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Revenue Trend</h3>
            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF' }}
                            tickLine={{ stroke: '#4B5563' }}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF' }}
                            tickLine={{ stroke: '#4B5563' }}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                            itemStyle={{ color: '#10B981' }}
                            formatter={(value: number) => [`₹${value}`, 'Revenue']}
                        />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ fill: '#10B981', strokeWidth: 2 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
