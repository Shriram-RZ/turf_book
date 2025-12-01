interface SkillRatingMeterProps {
    rating: number;
}

export const SkillRatingMeter = ({ rating }: SkillRatingMeterProps) => {
    // ELO rating tiers
    const getTier = (rating: number) => {
        if (rating >= 2000) return { name: 'Master', color: 'from-purple-500 to-pink-500', textColor: 'text-purple-400' };
        if (rating >= 1800) return { name: 'Diamond', color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-400' };
        if (rating >= 1600) return { name: 'Platinum', color: 'from-emerald-500 to-teal-500', textColor: 'text-emerald-400' };
        if (rating >= 1400) return { name: 'Gold', color: 'from-yellow-500 to-orange-500', textColor: 'text-yellow-400' };
        if (rating >= 1200) return { name: 'Silver', color: 'from-gray-400 to-gray-500', textColor: 'text-gray-400' };
        return { name: 'Bronze', color: 'from-orange-700 to-orange-900', textColor: 'text-orange-400' };
    };

    const tier = getTier(rating);
    const progress = ((rating % 200) / 200) * 100;

    return (
        <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="text-xs text-gray-400">Current Tier</p>
                    <p className={`text-lg font-bold ${tier.textColor}`}>{tier.name}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Rating</p>
                    <p className="text-lg font-bold text-white">{rating}</p>
                </div>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${tier.color} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-xs text-gray-500 mt-2">
                {Math.ceil((200 - (rating % 200)))} points to next tier
            </p>
        </div>
    );
};
