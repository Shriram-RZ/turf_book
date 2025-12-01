import { api } from './api';
import type { ActivityItem } from '../types';

export const ActivityService = {
    getFeed: (limit: number = 20) => {
        return api.get<ActivityItem[]>('/activity/feed', { params: { limit } });
    },

    getFriendActivity: (friendId: number, limit: number = 10) => {
        return api.get<ActivityItem[]>(`/activity/friend/${friendId}`, { params: { limit } });
    }
};
