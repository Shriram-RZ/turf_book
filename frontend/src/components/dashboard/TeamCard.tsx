import type { Team } from '../../types';
import { Users, Trophy, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface TeamCardProps {
    team: Team;
}

export const TeamCard = ({ team }: TeamCardProps) => {
    const memberCount = team.members?.length || 0;

    return (
        <a
            href={`/teams/${team.id}`}
            className="block bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-all group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-emerald-900/20">
                        {team.logoUrl ? (
                            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            team.name.charAt(0)
                        )}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {team.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="primary" size="sm">
                                <Trophy size={12} className="mr-1" />
                                {team.skillRating || 1200}
                            </Badge>
                            <Badge variant="default" size="sm">
                                <Users size={12} className="mr-1" />
                                {memberCount}
                            </Badge>
                        </div>
                    </div>
                </div>
                <ChevronRight className="text-gray-600 group-hover:text-emerald-400 transition-colors" size={20} />
            </div>

            {/* Team Members Preview */}
            {team.members && team.members.length > 0 && (
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {team.members.slice(0, 4).map((member) => (
                            <Avatar
                                key={member.id}
                                src={member.avatarUrl}
                                fallback={member.name}
                                size="sm"
                                className="ring-2 ring-gray-800"
                            />
                        ))}
                    </div>
                    {memberCount > 4 && (
                        <span className="text-xs text-gray-400">+{memberCount - 4} more</span>
                    )}
                </div>
            )}
        </a>
    );
};
