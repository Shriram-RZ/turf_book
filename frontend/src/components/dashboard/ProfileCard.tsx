import type { UserProfile } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Edit, Trophy, Target } from 'lucide-react';
import { Button } from '../ui/Button';
import { SkillRatingMeter } from './SkillRatingMeter';

interface ProfileCardProps {
    profile: UserProfile | null;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
    if (!profile) {
        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-gray-700 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-700 rounded w-1/3" />
                        <div className="h-4 bg-gray-700 rounded w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    const winRate = profile.matchesPlayed > 0
        ? Math.round((profile.matchesWon / profile.matchesPlayed) * 100)
        : 0;

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }} />
            </div>

            <div className="relative">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-6">
                        <Avatar
                            src={profile.avatarUrl}
                            fallback={profile.name}
                            size="xl"
                            className="ring-4 ring-emerald-500/20"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
                            <p className="text-gray-400 mb-2">{profile.email}</p>
                            {profile.phone && (
                                <p className="text-sm text-gray-500">{profile.phone}</p>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                                <Badge variant="primary">Level {profile.level}</Badge>
                                <Badge variant="info">{profile.role}</Badge>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">
                        <Edit size={16} className="mr-2" />
                        Edit Profile
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/20 rounded-lg p-4 border border-gray-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy size={18} className="text-yellow-500" />
                            <span className="text-xs text-gray-400">Matches</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{profile.matchesPlayed}</p>
                        <p className="text-xs text-emerald-400">{profile.matchesWon} wins</p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4 border border-gray-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={18} className="text-blue-500" />
                            <span className="text-xs text-gray-400">Win Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{winRate}%</p>
                        <p className="text-xs text-gray-400">{profile.matchesPlayed - profile.matchesWon} losses</p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4 border border-gray-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy size={18} className="text-purple-500" />
                            <span className="text-xs text-gray-400">Skill Rating</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{profile.skillRating}</p>
                        <p className="text-xs text-gray-400">ELO</p>
                    </div>
                </div>

                {/* Skill Rating Meter */}
                <SkillRatingMeter rating={profile.skillRating} />

                {/* Level Progress */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Level Progress</span>
                        <span className="text-sm font-medium text-emerald-400">{profile.levelProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                            style={{ width: `${profile.levelProgress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {100 - profile.levelProgress}% to Level {profile.level + 1}
                    </p>
                </div>
            </div>
        </div>
    );
};
