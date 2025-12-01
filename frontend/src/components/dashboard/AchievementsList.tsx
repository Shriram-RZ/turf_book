import type { Achievement } from '../../types';
import { Award, Lock, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface AchievementsListProps {
    achievements: Achievement[];
}

export const AchievementsList = ({ achievements }: AchievementsListProps) => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Award className="text-emerald-500" size={24} />
                    <h3 className="text-xl font-bold text-white">Achievements</h3>
                    <Badge variant="primary">{unlockedCount}/{achievements.length}</Badge>
                </div>
                <a href="/dashboard/achievements" className="text-sm text-emerald-400 hover:text-emerald-300">
                    View All →
                </a>
            </div>

            {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className={`relative p-4 rounded-lg border transition-all ${achievement.unlocked
                                ? 'bg-gradient-to-br from-emerald-900/30 to-gray-900/30 border-emerald-500/30'
                                : 'bg-gray-900/30 border-gray-700/50'
                                }`}
                        >
                            {/* Achievement Icon */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${achievement.unlocked
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-900/50'
                                : 'bg-gray-700'
                                }`}>
                                {achievement.unlocked ? (
                                    <span className="text-2xl">{achievement.icon}</span>
                                ) : (
                                    <Lock className="text-gray-500" size={24} />
                                )}
                            </div>

                            {/* Achievement Info */}
                            <h4 className={`font-bold mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                                {achievement.name}
                            </h4>
                            <p className="text-xs text-gray-400 mb-3">{achievement.description}</p>

                            {/* Progress Bar */}
                            {!achievement.unlocked && (
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-500">Progress</span>
                                        <span className="text-xs font-medium text-emerald-400">
                                            {achievement.progress}/{achievement.maxProgress}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Unlocked Badge */}
                            {achievement.unlocked && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle className="text-emerald-400" size={20} />
                                </div>
                            )}

                            {/* Category Badge */}
                            <div className="mt-3">
                                <Badge variant="default" size="sm">
                                    {achievement.category}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No achievements yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start playing to unlock achievements!</p>
                </div>
            )}
        </div>
    );
};
