import { api } from './api';
import type { Achievement } from '../types';

export const AchievementService = {
    getAll: () => {
        return api.get<Achievement[]>('/achievements/my');
    },

    getProgress: () => {
        return api.get<Achievement[]>('/achievements/progress');
    },

    getUnlocked: () => {
        return api.get<Achievement[]>('/achievements/unlocked');
    },

    getByCategory: (category: string) => {
        return api.get<Achievement[]>(`/achievements/category/${category}`);
    }
};
