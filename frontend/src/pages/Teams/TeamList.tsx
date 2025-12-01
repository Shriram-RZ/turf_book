import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TeamService } from '../../services/api';
import { Link } from 'react-router-dom';
import { Users, Plus, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const TeamList = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const queryClient = useQueryClient();

    const { data: teams, isLoading } = useQuery({
        queryKey: ['my-teams'],
        queryFn: () => TeamService.getMyTeams().then(res => res.data),
    });

    const createTeamMutation = useMutation({
        mutationFn: (name: string) => TeamService.create(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-teams'] });
            setIsCreating(false);
            setNewTeamName('');
        },
    });

    const handleCreateTeam = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTeamName.trim()) {
            createTeamMutation.mutate(newTeamName);
        }
    };

    if (isLoading) return <div className="text-white text-center py-10">Loading teams...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Shield className="text-emerald-500" />
                    My Teams
                </h1>
                <Button onClick={() => setIsCreating(!isCreating)}>
                    <Plus size={20} className="mr-2" />
                    Create Team
                </Button>
            </div>

            {isCreating && (
                <div className="bg-gray-800 p-6 rounded-xl mb-8 border border-gray-700 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-xl font-bold text-white mb-4">Create New Team</h3>
                    <form onSubmit={handleCreateTeam} className="flex gap-4">
                        <input
                            type="text"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            placeholder="Enter team name"
                            className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                        />
                        <Button type="submit" disabled={createTeamMutation.isPending}>
                            {createTeamMutation.isPending ? 'Creating...' : 'Create'}
                        </Button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams?.map((team) => (
                    <Link
                        key={team.id}
                        to={`/teams/${team.id}`}
                        className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-400 font-bold text-xl">
                                {team.name.charAt(0)}
                            </div>
                            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                                Rating: {team.skillRating || 1200}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                            {team.name}
                        </h3>
                        <div className="flex items-center text-gray-400 text-sm">
                            <Users size={16} className="mr-2" />
                            {team.members?.length || 1} Members
                        </div>
                    </Link>
                ))}

                {teams?.length === 0 && !isCreating && (
                    <div className="col-span-full text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
                        <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No Teams Yet</h3>
                        <p className="text-gray-500 mb-6">Create a team to start playing matches!</p>
                        <Button onClick={() => setIsCreating(true)}>Create Your First Team</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamList;
