import { api } from './api';
import type { Notification } from '../types';

export const NotificationService = {
    getAll: () => {
        return api.get<Notification[]>('/notifications');
    },

    getUnreadCount: () => {
        return api.get<{ count: number }>('/notifications/unread-count');
    },

    markAsRead: (id: number) => {
        return api.put(`/notifications/${id}/read`);
    },

    markAllAsRead: () => {
        return api.put('/notifications/read-all');
    },

    delete: (id: number) => {
        return api.delete(`/notifications/${id}`);
    }
};
