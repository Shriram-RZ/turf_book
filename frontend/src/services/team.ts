import { api } from './api';
import type { Team, TeamMember } from '../types';

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

    invitePlayer: (teamId: number, userId: number) => {
        return api.post(`/teams/${teamId}/invite/${userId}`);
    },

    acceptInvite: (teamId: number) => {
        return api.post(`/teams/${teamId}/accept`);
    },

    rejectInvite: (teamId: number) => {
        return api.post(`/teams/${teamId}/reject`);
    },

    removePlayer: (teamId: number, userId: number) => {
        return api.delete(`/teams/${teamId}/remove/${userId}`);
    },

    getPendingInvites: () => {
        return api.get<Team[]>('/teams/invites/pending');
    }
};
