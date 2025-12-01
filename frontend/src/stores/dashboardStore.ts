import { create } from 'zustand';
import type { UserProfile, Friend, Team, Notification, Match, Achievement, UserStats } from '../types';

interface DashboardState {
    // Data
    profile: UserProfile | null;
    friends: Friend[];
    pendingRequests: Friend[]; // Added pendingRequests
    teams: Team[];
    notifications: Notification[];
    matchHistory: Match[];
    achievements: Achievement[];
    stats: UserStats | null;

    // Loading states
    loading: boolean;
    profileLoading: boolean;
    friendsLoading: boolean;
    teamsLoading: boolean;
    notificationsLoading: boolean;
    matchHistoryLoading: boolean;
    achievementsLoading: boolean;
    statsLoading: boolean;

    // Actions
    setProfile: (profile: UserProfile | null) => void;
    setFriends: (friends: Friend[]) => void;
    setPendingRequests: (requests: Friend[]) => void;
    setTeams: (teams: Team[]) => void;
    setNotifications: (notifications: Notification[]) => void;
    setMatchHistory: (matches: Match[]) => void;
    setAchievements: (achievements: Achievement[]) => void;
    setStats: (stats: UserStats | null) => void;

    // Fetch actions (to be implemented with API calls)
    fetchDashboardData: () => Promise<void>;
    fetchProfile: () => Promise<void>;
    fetchFriends: () => Promise<void>;
    fetchPendingRequests: () => Promise<void>;
    fetchTeams: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
    fetchMatchHistory: () => Promise<void>;
    fetchAchievements: () => Promise<void>;
    fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    // Initial state
    profile: null,
    friends: [],
    pendingRequests: [],
    teams: [],
    notifications: [],
    matchHistory: [],
    achievements: [],
    stats: null,

    loading: false,
    profileLoading: false,
    friendsLoading: false,
    teamsLoading: false,
    notificationsLoading: false,
    matchHistoryLoading: false,
    achievementsLoading: false,
    statsLoading: false,

    // Setters
    setProfile: (profile) => set({ profile }),
    setFriends: (friends) => set({ friends }),
    setPendingRequests: (pendingRequests) => set({ pendingRequests }),
    setTeams: (teams) => set({ teams }),
    setNotifications: (notifications) => set({ notifications }),
    setMatchHistory: (matchHistory) => set({ matchHistory }),
    setAchievements: (achievements) => set({ achievements }),
    setStats: (stats) => set({ stats }),

    // Fetch actions
    fetchDashboardData: async () => {
        // Check if we have a token/user before fetching
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            console.warn('No user found, skipping dashboard fetch');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (!user || !user.token) {
                console.warn('No token found in user data, skipping dashboard fetch');
                return;
            }
        } catch (e) {
            console.error('Error parsing user data', e);
            return;
        }

        set({ loading: true });
        try {
            const { fetchProfile, fetchFriends, fetchPendingRequests, fetchTeams, fetchNotifications, fetchMatchHistory, fetchAchievements, fetchStats } = useDashboardStore.getState();

            await Promise.allSettled([
                fetchProfile(),
                fetchFriends(),
                fetchPendingRequests(),
                fetchTeams(),
                fetchNotifications(),
                fetchMatchHistory(),
                fetchAchievements(),
                fetchStats()
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            set({ loading: false });
        }
    },

    fetchProfile: async () => {
        set({ profileLoading: true });
        try {
            const { UserService } = await import('../services/api');
            const response = await UserService.getCurrentUser();
            set({ profile: response.data });
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Don't clear profile on error to avoid UI flicker if we had data
        } finally {
            set({ profileLoading: false });
        }
    },

    fetchFriends: async () => {
        set({ friendsLoading: true });
        try {
            const { FriendService } = await import('../services/api');
            const response = await FriendService.getFriends();
            set({ friends: response.data || [] });
        } catch (error) {
            console.error('Error fetching friends:', error);
            set({ friends: [] });
        } finally {
            set({ friendsLoading: false });
        }
    },

    fetchPendingRequests: async () => {
        try {
            const { FriendService } = await import('../services/api');
            const response = await FriendService.getPendingRequests();
            set({ pendingRequests: response.data || [] });
        } catch (error) {
            console.error('Error fetching pending requests:', error);
            set({ pendingRequests: [] });
        }
    },

    fetchTeams: async () => {
        set({ teamsLoading: true });
        try {
            const { TeamService } = await import('../services/team');
            const response = await TeamService.getMyTeams();
            set({ teams: response.data || [] });
        } catch (error) {
            console.error('Error fetching teams:', error);
            set({ teams: [] });
        } finally {
            set({ teamsLoading: false });
        }
    },

    fetchNotifications: async () => {
        set({ notificationsLoading: true });
        try {
            const { NotificationService } = await import('../services/notifications');
            const response = await NotificationService.getAll();
            set({ notifications: response.data || [] });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            set({ notifications: [] });
        } finally {
            set({ notificationsLoading: false });
        }
    },

    fetchMatchHistory: async () => {
        set({ matchHistoryLoading: true });
        try {
            const { MatchHistoryService } = await import('../services/matches');
            const response = await MatchHistoryService.getHistory();
            set({ matchHistory: response.data || [] });
        } catch (error) {
            console.error('Error fetching match history:', error);
            set({ matchHistory: [] });
        } finally {
            set({ matchHistoryLoading: false });
        }
    },

    fetchAchievements: async () => {
        set({ achievementsLoading: true });
        try {
            const { AchievementService } = await import('../services/achievements');
            const response = await AchievementService.getAll();
            set({ achievements: response.data || [] });
        } catch (error) {
            console.error('Error fetching achievements:', error);
            set({ achievements: [] });
        } finally {
            set({ achievementsLoading: false });
        }
    },

    fetchStats: async () => {
        set({ statsLoading: true });
        try {
            const { AnalyticsService } = await import('../services/analytics');
            const response = await AnalyticsService.getUserStats();
            set({ stats: response.data });
        } catch (error) {
            console.error('Error fetching stats:', error);
            set({ stats: null });
        } finally {
            set({ statsLoading: false });
        }
    },
}));
