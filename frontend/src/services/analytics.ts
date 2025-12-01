import { api } from './api';
import type { UserStats, SkillHistoryPoint, MonthlyMatchData, OwnerAnalytics, RevenueDataPoint, OccupancyDataPoint } from '../types';

export const AnalyticsService = {
    getUserStats: () => {
        return api.get<UserStats>('/analytics/my');
    },

    getSkillHistory: (days: number = 30) => {
        return api.get<SkillHistoryPoint[]>('/analytics/skill-history', { params: { days } });
    },

    getMonthlyMatches: (months: number = 6) => {
        return api.get<MonthlyMatchData[]>('/analytics/monthly-matches', { params: { months } });
    },

    getPerformanceInsights: () => {
        return api.get('/analytics/insights');
    },

    // Owner analytics
    getOwnerAnalytics: () => {
        return api.get<OwnerAnalytics>('/analytics/owner');
    },

    getOwnerRevenue: (days: number = 7) => {
        return api.get<RevenueDataPoint[]>('/analytics/owner/revenue', { params: { days } });
    },

    getOwnerOccupancy: (days: number = 7) => {
        return api.get<OccupancyDataPoint[]>('/analytics/owner/occupancy', { params: { days } });
    }
};
