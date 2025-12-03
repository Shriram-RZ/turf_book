import axios from 'axios';
import type { Turf, TurfSlot, Booking, Friend, Team } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');

    if (userStr) {
        try {
            const user = JSON.parse(userStr);

            if (user && user.token) {
                // Only set header if not already set
                if (!config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            }
        } catch (e) {
            console.error("[API Interceptor] Error parsing user from local storage", e);
            // Optional: Don't clear immediately to avoid loops, let 401 handle it
        }
    }

    // Reduced logging - only log errors or specific debug flags if needed
    // console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);

    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const refreshToken = user?.refreshToken;

            if (refreshToken) {
                try {
                    const response = await AuthService.refresh(refreshToken);
                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    // Update local storage
                    user.token = accessToken;
                    user.refreshToken = newRefreshToken;
                    localStorage.setItem('user', JSON.stringify(user));

                    api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                    originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;

                    processQueue(null, accessToken);
                    return api(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    // Logout user if refresh fails
                    AuthService.logout();
                    window.location.href = '/login';
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            } else {
                // No refresh token, logout
                AuthService.logout();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const AuthService = {
    login: (email: string, password: string) => {
        return api.post('/auth/login', { email, password });
    },
    register: (name: string, email: string, password: string, phone: string, role: string) => {
        return api.post('/auth/register', { name, email, password, phone, role });
    },
    logout: () => {
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    refresh: (refreshToken: string) => {
        return api.post('/auth/refresh', { refreshToken });
    },
    forgotPassword: (email: string) => {
        return api.post('/auth/forgot-password', { email });
    },
    resetPassword: (token: string, newPassword: string) => {
        return api.post('/auth/reset-password', { token, newPassword });
    },
};

export const TurfService = {
    getAllTurfs: (location?: string) => {
        return api.get<Turf[]>('/turfs', { params: { location } });
    },
    getTurfById: (id: number) => {
        return api.get<Turf>(`/turfs/${id}`);
    },
    getSlots: (turfId: number, date: string) => {
        return api.get<TurfSlot[]>(`/turfs/${turfId}/slots`, { params: { date } });
    },
};

export const BookingService = {
    initiateBooking: (userId: number, turfId: number, slotId: number, totalAmount: number) => {
        return api.post<Booking>('/bookings/initiate', { userId, turfId, slotId, totalAmount });
    },
    addParticipant: (bookingId: number, userId: number) => {
        return api.post(`/bookings/${bookingId}/participants/add`, { userId });
    },
    getMyBookings: () => {
        return api.get<Booking[]>('/bookings/my');
    }
};

export const UserService = {
    getCurrentUser: () => {
        return api.get('/users/me');
    },
    updateProfile: (data: any) => api.put('/users/me', data),
    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/uploads', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    search: (query: string) => {
        return api.get('/users/search', { params: { query } });
    },
    getUserById: (id: number) => {
        return api.get(`/users/${id}`);
    }
};

export const FriendService = {
    invite: (email: string) => {
        return api.post('/friends/invite', { email });
    },
    sendFriendRequest: (friendId: number) => {
        return api.post(`/friends/request/${friendId}`);
    },
    accept: (requestId: number) => {
        return api.post(`/friends/${requestId}/accept`);
    },
    acceptFriendRequest: (requestId: number) => {
        return api.post(`/friends/${requestId}/accept`);
    },
    reject: (requestId: number) => {
        return api.post(`/friends/${requestId}/reject`);
    },
    rejectFriendRequest: (requestId: number) => {
        return api.post(`/friends/${requestId}/reject`);
    },
    getRequests: () => {
        return api.get<Friend[]>('/friends/requests');
    },
    getPendingRequests: () => {
        return api.get<Friend[]>('/friends/requests');
    },
    getSentRequests: () => {
        return api.get<Friend[]>('/friends/requests/sent');
    },
    getFriends: () => {
        return api.get<Friend[]>('/friends/list');
    },
    removeFriend: (friendId: number) => {
        return api.delete(`/friends/${friendId}`);
    },
    searchUsers: (query: string) => {
        return api.get<any[]>(`/users/search`, { params: { query } }).then(res => res.data);
    }
};

export const TeamService = {
    create: (name: string, logoUrl?: string) => {
        return api.post<Team>('/teams', { name, logoUrl });
    },
    getMyTeams: () => {
        return api.get<Team[]>('/teams/my');
    },
    getTeamById: (id: number) => {
        return api.get<Team>(`/teams/${id}`);
    },
    joinTeam: (id: number) => {
        return api.post(`/teams/${id}/join`);
    }
};

export const MatchService = {
    findMatch: (teamId: number) => {
        return api.post('/matches/find', { teamId });
    },
    completeMatch: (matchId: number, winnerTeamId: number) => {
        return api.post(`/matches/${matchId}/complete`, { winnerTeamId });
    }
};

export const OwnerService = {
    scanQR: (qrSecret: string) => {
        return api.post('/owner/scan', { qrSecret });
    },
    generateSlots: (turfId: number, data: any) => {
        return api.post(`/owner/turfs/${turfId}/slots`, data);
    },
    addTurf: (data: any) => {
        return api.post('/owner/turfs', data);
    },
    getMyTurfs: () => {
        return api.get('/owner/turfs');
    },
    deleteTurf: (turfId: number) => {
        return api.delete(`/owner/turfs/${turfId}`);
    },
    getTurfById: (turfId: number) => {
        return api.get(`/owner/turfs/${turfId}`);
    },
    updateTurf: (turfId: number, data: any) => {
        return api.put(`/owner/turfs/${turfId}`, data);
    }
};

// Export the api instance for direct use
export { api };

export default api;
