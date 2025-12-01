import React, { useEffect, useState } from 'react';
import { TeamService } from '../services/team';
import { useDashboardStore } from '../stores/dashboardStore';
import type { Team } from '../types';
import { Users, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeamList: React.FC = () => {
    const { teams, fetchTeams, loading: storeLoading } = useDashboardStore();
    const [newTeamName, setNewTeamName] = useState('');

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await TeamService.create(newTeamName);
            setNewTeamName('');
            fetchTeams();
        } catch (error) {
            alert('Failed to create team');
        }
    };

    if (storeLoading && teams.length === 0) return <div>Loading teams...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">My Teams</h2>

            <form onSubmit={handleCreateTeam} className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="New Team Name"
                    className="flex-1 p-2 border rounded"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    required
                />
                <button type="submit" className="bg-green-600 text-white p-2 rounded flex items-center gap-2">
                    <Plus size={18} /> Create
                </button>
            </form>

            <div className="grid grid-cols-1 gap-4">
                {teams.length === 0 ? (
                    <p className="text-gray-500">No teams yet.</p>
                ) : (
                    teams.map(team => (
                        <Link key={team.id} to={`/teams/${team.id}`} className="border p-4 rounded flex items-center gap-4 hover:bg-gray-50 transition-colors">
                            <div className="bg-gray-200 p-3 rounded-full">
                                <Users size={24} className="text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-bold">{team.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {team.members ? team.members.length : 0} Members
                                </p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeamList;
