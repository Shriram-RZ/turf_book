export interface User {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'OWNER' | 'ADMIN';
    avatarUrl?: string;
    phone?: string;
}

export interface Turf {
    id: number;
    name: string;
    location: string;
    amenities: string[]; // Parsed from JSON
    images: string[]; // Parsed from JSON
    pricingRules: any;
}

export interface TurfSlot {
    id: number;
    turfId: number;
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    isLocked: boolean;
    customPrice?: number;
}

export interface Booking {
    id: number;
    userId: number;
    turfId: number;
    slotId: number;
    status: 'RESERVED' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | 'COMPLETED';
    totalAmount: number;
    expiresAt: string;
    qrSecret?: string;
    checkedInAt?: string;
    participants?: BookingParticipant[];
}

export type FriendStatus = 'SENT' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REMOVED' | 'BLOCKED';

export interface Friend {
    id: number;
    userId: number;
    friendId: number;
    status: FriendStatus;
    friend?: User;
    user?: User;
}

export type TeamMemberStatus = 'INVITED' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REMOVED';
export type TeamRole = 'CAPTAIN' | 'PLAYER';

export interface TeamMember {
    id: number;
    teamId: number;
    userId: number;
    role: TeamRole;
    status: TeamMemberStatus;
    user?: User;
}

export interface Team {
    id: number;
    name: string;
    captainId: number;
    logoUrl?: string;
    skillRating?: number;
    members?: TeamMember[];
}

export type ParticipantStatus = 'SENT' | 'PENDING' | 'PAID' | 'DECLINED' | 'REJECTED';

export interface BookingParticipant {
    id: number;
    bookingId: number;
    userId: number;
    shareAmount: number;
    status: ParticipantStatus;
    user?: User;
}

// Extended User Profile for Dashboard
export interface UserProfile extends User {
    phone?: string;
    skillRating: number;
    matchesPlayed: number;
    matchesWon: number;
    level: number;
    levelProgress: number; // 0-100
}

// Notifications
export type NotificationType = 'INFO' | 'ALERT' | 'REQUEST' | 'APPROVAL' | 'MATCH_CHALLENGE';

export interface Notification {
    id: number;
    type: NotificationType;
    message: string;
    createdAt: string;
    read: boolean;
    actionable: boolean;
    relatedId?: number;
    relatedType?: 'FRIEND' | 'TEAM' | 'MATCH' | 'BOOKING';
}

// Match History
export type MatchResult = 'WIN' | 'LOSE' | 'DRAW';

export interface Match {
    id: number;
    teamAId: number;
    teamBId: number;
    opponentTeam: string;
    turf: string;
    turfId: number;
    date: string;
    slot: string;
    slotId: number;
    result: MatchResult;
    score: string;
    ratingChange: number;
    createdAt: string;
}

export interface MatchFilters {
    dateFrom?: string;
    dateTo?: string;
    result?: MatchResult;
    opponentTeam?: string;
    turfId?: number;
}

// Achievements
export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'MATCHES' | 'WINS' | 'TEAM' | 'SOCIAL' | 'SPECIAL';
    unlocked: boolean;
    progress: number;
    maxProgress: number;
    unlockedAt?: string;
}

// User Statistics
export interface UserStats {
    winRate: number;
    totalMatches: number;
    wins: number;
    losses: number;
    draws: number;
    currentStreak: number;
    bestStreak: number;
    favoritePosition?: string;
    strongestTime?: string;
    preferredTurf?: string;
    averageRatingChange: number;
}

// Analytics Data
export interface SkillHistoryPoint {
    date: string;
    rating: number;
}

export interface MonthlyMatchData {
    month: string;
    matches: number;
    wins: number;
    losses: number;
}

export interface ActivityItem {
    id: number;
    type: 'FRIEND_WIN' | 'TEAM_RANK_CHANGE' | 'BOOKING_CONFIRMED' | 'ACHIEVEMENT_UNLOCKED';
    message: string;
    timestamp: string;
    userId?: number;
    userName?: string;
}

// Friend with extended info
export interface FriendProfile extends User {
    skillRating: number;
    matchesPlayed: number;
    matchesWon: number;
    isOnline: boolean;
    rank?: number;
}

// Owner Analytics
export interface OwnerAnalytics {
    totalRevenue: number;
    activeBookings: number;
    totalCustomers: number;
    occupancyRate: number;
}

export interface RevenueDataPoint {
    date: string;
    amount: number;
}

export interface OccupancyDataPoint {
    day: string;
    occupancy: number;
}

