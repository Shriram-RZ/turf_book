import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OccupancyData {
    day: string;
    occupancy: number;
}

interface OccupancyBarChartProps {
    data: OccupancyData[];
}

export const OccupancyBarChart = ({ data }: OccupancyBarChartProps) => {
    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Weekly Occupancy</h3>
            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis
                            dataKey="day"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF' }}
                            tickLine={{ stroke: '#4B5563' }}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF' }}
                            tickLine={{ stroke: '#4B5563' }}
                            unit="%"
                        />
                        <Tooltip
                            cursor={{ fill: '#374151', opacity: 0.4 }}
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                            formatter={(value: number) => [`${value}%`, 'Occupancy']}
                        />
                        <Bar
                            dataKey="occupancy"
                            fill="#3B82F6"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
