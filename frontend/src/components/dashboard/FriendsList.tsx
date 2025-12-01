import type { Friend } from '../../types';
import { Users, UserPlus, Search, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { FriendService } from '../../services/api';
import { toast } from 'react-hot-toast';

interface FriendsListProps {
    friends: Friend[];
}

export const FriendsList = ({ friends }: FriendsListProps) => {
    const { currentUser, fetchFriends } = useDashboardStore();
    const [searchQuery, setSearchQuery] = useState('');

    const getFriendName = (friendship: Friend) => {
        if (!currentUser) return 'Unknown';
        if (friendship.userId === currentUser.id) {
            return friendship.friend?.name || 'Unknown';
        } else {
            return friendship.user?.name || 'Unknown';
        }
    };

    const getFriendId = (friendship: Friend) => {
        if (!currentUser) return 0;
        return friendship.userId === currentUser.id ? friendship.friendId : friendship.userId;
    };

    const getFriendAvatar = (friendship: Friend) => {
        if (!currentUser) return undefined;
        if (friendship.userId === currentUser.id) {
            return friendship.friend?.avatarUrl;
        } else {
            return friendship.user?.avatarUrl;
        }
    };

    const handleRemove = async (friendId: number) => {
        if (!confirm('Are you sure you want to remove this friend?')) return;
        try {
            await FriendService.removeFriend(friendId);
            toast.success('Friend removed');
            fetchFriends();
        } catch (error) {
            console.error("Error removing friend", error);
            toast.error('Failed to remove friend');
        }
    };

    const filteredFriends = friends.filter(friendship =>
        getFriendName(friendship).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Users className="text-emerald-500" size={24} />
                    <h3 className="text-xl font-bold text-white">My Friends</h3>
                    <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs font-bold">
                        {friends.length}
                    </span>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Filter friends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
            </div>

            {/* Friends List */}
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {filteredFriends.length > 0 ? (
                    filteredFriends.map((friendship, index) => (
                        <div
                            key={friendship.id}
                            className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-emerald-500/30 transition-colors group"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20 overflow-hidden">
                                    {getFriendAvatar(friendship) ? (
                                        <img src={getFriendAvatar(friendship)} alt={getFriendName(friendship)} className="w-full h-full object-cover" />
                                    ) : (
                                        getFriendName(friendship).charAt(0)
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate">{getFriendName(friendship)}</p>
                                <p className="text-xs text-gray-500">Friend</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleRemove(getFriendId(friendship))}
                                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                                    title="Remove Friend"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">
                            {searchQuery ? 'No friends found' : 'No friends yet'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
