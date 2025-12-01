import { create } from 'zustand';
import { AuthService } from '../services/api';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
    },
    logout: () => {
        AuthService.logout();
        set({ user: null, isAuthenticated: false });
    },
    checkAuth: () => {
        const user = AuthService.getCurrentUser();
        if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
        } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));
