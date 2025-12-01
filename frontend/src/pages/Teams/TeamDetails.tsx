import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TeamService } from '../../services/team';
import { useDashboardStore } from '../../stores/dashboardStore';
import type { Team } from '../../types';
import { Users, Trophy, Swords, UserPlus, Trash2, LogOut, Shield, Loader } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const TeamDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { friends, fetchFriends, currentUser } = useDashboardStore();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [inviting, setInviting] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            fetchTeamData(parseInt(id));
        }
        if (friends.length === 0) {
            fetchFriends();
        }
    }, [id, fetchFriends, friends.length]);

    const fetchTeamData = async (teamId: number) => {
        try {
            const res = await TeamService.getTeamById(teamId);
            setTeam(res.data);
        } catch (error) {
            console.error("Error fetching team", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (friendId: number) => {
        if (!team) return;
        setInviting(friendId);
        try {
            await TeamService.invitePlayer(team.id, friendId);
            alert('Invitation sent!');
        } catch (error) {
            alert('Failed to invite player');
        } finally {
            setInviting(null);
        }
    };

    const handleRemove = async (userId: number) => {
        if (!team) return;
        if (!confirm('Are you sure you want to remove this player?')) return;
        try {
            await TeamService.removePlayer(team.id, userId);
            fetchTeamData(team.id);
        } catch (error) {
            alert('Failed to remove player');
        }
    };

    const handleLeave = async () => {
        if (!team || !currentUser) return;
        if (!confirm('Are you sure you want to leave this team?')) return;
        try {
            await TeamService.removePlayer(team.id, currentUser.id);
            navigate('/teams');
        } catch (error) {
            alert('Failed to leave team');
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader className="animate-spin text-white" /></div>;
    if (!team) return <div className="text-white text-center py-10">Team not found</div>;

    const isCaptain = currentUser?.id === team.captainId;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900/50 to-gray-900 rounded-3xl p-8 mb-8 border border-emerald-900/30 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-emerald-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-emerald-900/50">
                            {team.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{team.name}</h1>
                            <div className="flex items-center gap-4 text-gray-300">
                                <span className="flex items-center bg-black/30 px-3 py-1 rounded-full border border-white/10">
                                    <Trophy size={16} className="mr-2 text-yellow-500" />
                                    Rating: {team.skillRating || 1200}
                                </span>
                                <span className="flex items-center bg-black/30 px-3 py-1 rounded-full border border-white/10">
                                    <Users size={16} className="mr-2 text-blue-400" />
                                    {team.members?.length || 0} Members
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {!isCaptain && (
                            <Button
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-500/10"
                                onClick={handleLeave}
                            >
                                <LogOut size={20} className="mr-2" />
                                Leave Team
                            </Button>
                        )}
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-none shadow-lg shadow-orange-900/20"
                            onClick={async () => {
                                if (!team) return;
                                try {
                                    const { MatchService } = await import('../../services/api'); // Or import at top
                                    await MatchService.findMatch(team.id);
                                    alert('Matchmaking started! You will be notified when a match is found.');
                                } catch (error) {
                                    console.error('Error finding match', error);
                                    alert('Failed to start matchmaking');
                                }
                            }}
                        >
                            <Swords size={20} className="mr-2" />
                            Find Match
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Members List */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-white mb-6">Team Roster</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {team.members?.map((member) => (
                            <div key={member.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center gap-4 relative group">
                                <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center text-xl font-bold text-gray-300">
                                    {member.user?.avatarUrl ? (
                                        <img
                                            src={member.user.avatarUrl}
                                            alt={member.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        member.user?.name?.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{member.user?.name}</h3>
                                    <p className="text-sm text-gray-400">{member.role}</p>
                                </div>
                                {member.userId === team.captainId && (
                                    <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded border border-yellow-500/30">
                                        Captain
                                    </span>
                                )}
                                {isCaptain && member.userId !== currentUser?.id && (
                                    <button
                                        onClick={() => handleRemove(member.userId)}
                                        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove member"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Invite Friends (Only Captain) */}
                    {isCaptain && (
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <UserPlus className="text-emerald-500" /> Invite Friends
                            </h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {friends.length === 0 ? (
                                    <p className="text-gray-500 text-sm italic">No friends to invite.</p>
                                ) : (
                                    friends.map(friendship => {
                                        const friendUser = friendship.userId === currentUser?.id ? friendship.friend : friendship.user;
                                        if (!friendUser) return null;
                                        const friendId = friendship.userId === currentUser?.id ? friendship.friendId : friendship.userId;

                                        const isMember = team.members?.some(m => m.userId === friendId);

                                        if (isMember) return null;

                                        return (
                                            <div key={friendship.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                                                <span className="text-sm font-medium text-gray-200">{friendUser.name}</span>
                                                <button
                                                    onClick={() => handleInvite(friendId)}
                                                    disabled={inviting === friendId}
                                                    className="text-emerald-400 hover:bg-emerald-500/20 p-2 rounded-full transition-colors"
                                                >
                                                    {inviting === friendId ? <Loader size={16} className="animate-spin" /> : <UserPlus size={16} />}
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Season Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                                <span className="text-gray-400">Matches Played</span>
                                <span className="text-white font-bold text-lg">0</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                                <span className="text-gray-400">Won</span>
                                <span className="text-emerald-400 font-bold text-lg">0</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                                <span className="text-gray-400">Win Rate</span>
                                <span className="text-white font-bold text-lg">0%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamDetails;
