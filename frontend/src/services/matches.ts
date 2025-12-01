import { api } from './api';
import type { Match, MatchFilters } from '../types';

export const MatchHistoryService = {
    getHistory: (filters?: MatchFilters) => {
        return api.get<Match[]>('/matches/history', { params: filters });
    },

    getDetails: (id: number) => {
        return api.get<Match>(`/matches/${id}`);
    },

    getUpcoming: () => {
        return api.get<Match[]>('/matches/upcoming');
    }
};
