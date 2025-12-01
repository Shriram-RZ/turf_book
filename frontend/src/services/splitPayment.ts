import { api } from './api';
import type { BookingParticipant } from '../types';

export const SplitPaymentService = {
    addParticipant: (bookingId: number, userId: number) => {
        // Backend expects userId as request param
        return api.post(`/bookings/${bookingId}/add`, null, {
            params: { userId }
        });
    },

    updateStatus: (bookingId: number, status: 'DECLINED' | 'PAID') => {
        return api.post(`/bookings/${bookingId}/status`, null, {
            params: { status }
        });
    }
};
