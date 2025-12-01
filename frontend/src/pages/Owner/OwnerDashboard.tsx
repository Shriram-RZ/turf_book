import { useEffect, useState } from 'react';
import { RevenueLineChart } from '../../components/charts/RevenueLineChart';
import { OccupancyBarChart } from '../../components/charts/OccupancyBarChart';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import { AnalyticsService } from '../../services/analytics';
import type { OwnerAnalytics, RevenueDataPoint, OccupancyDataPoint } from '../../types';

const OwnerDashboard = () => {
    const [analytics, setAnalytics] = useState<OwnerAnalytics | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
    const [occupancyData, setOccupancyData] = useState<OccupancyDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [analyticsRes, revenueRes, occupancyRes] = await Promise.all([
                AnalyticsService.getOwnerAnalytics(),
                AnalyticsService.getOwnerRevenue(7),
                AnalyticsService.getOwnerOccupancy(7)
            ]);

            setAnalytics(analyticsRes.data);
            setRevenueData(revenueRes.data);
            setOccupancyData(occupancyRes.data);
        } catch (err: any) {
            console.error('Error fetching dashboard data:', err);
            setError(err.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-lg">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500 text-lg">{error}</div>
            </div>
        );
    }

    if (!analytics) {
        return null;
    }

    // Safety check to ensure analytics data structure is valid before rendering
    if (typeof analytics.totalRevenue === 'undefined' || typeof analytics.activeBookings === 'undefined') {
        console.error('Invalid analytics data received:', analytics);
        return <div className="text-red-500">Error: Invalid data format received from server</div>;
    }

    const stats = [
        {
            label: 'Total Revenue',
            value: `₹${analytics.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-900/20'
        },
        {
            label: 'Active Bookings',
            value: analytics.activeBookings.toString(),
            icon: Calendar,
            color: 'text-blue-500',
            bg: 'bg-blue-900/20'
        },
        {
            label: 'Total Customers',
            value: analytics.totalCustomers.toString(),
            icon: Users,
            color: 'text-purple-500',
            bg: 'bg-purple-900/20'
        },
        {
            label: 'Occupancy Rate',
            value: `${analytics.occupancyRate.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'text-yellow-500',
            bg: 'bg-yellow-900/20'
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
                <p className="text-gray-400">Overview of your turf business.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                        </div>
                        <h3 className="text-gray-400 font-medium">{stat.label}</h3>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RevenueLineChart data={revenueData} />
                <OccupancyBarChart data={occupancyData} />
            </div>
        </div>
    );
};

export default OwnerDashboard;
