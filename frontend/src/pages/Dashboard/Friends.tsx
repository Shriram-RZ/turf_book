import { useEffect, useState } from 'react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { FriendService } from '../../services/api';
import { FriendsList } from '../../components/dashboard/FriendsList';
import { Skeleton } from '../../components/loaders/Skeleton';
import { Search, UserPlus, Mail, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { User } from '../../types';

const Friends = () => {
    const { friends, pendingRequests, friendsLoading, fetchFriends, fetchPendingRequests } = useDashboardStore();
    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);

    useEffect(() => {
        fetchFriends();
        fetchPendingRequests();
    }, [fetchFriends, fetchPendingRequests]);

    const handleInviteEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setIsInviting(true);
        console.log("Sending invite to:", inviteEmail);
        try {
            await FriendService.invite(inviteEmail);
            toast.success('Invitation sent successfully!');
            setInviteEmail('');
        } catch (error) {
            console.error('Error sending invite:', error);
            // @ts-ignore
            toast.error(error.response?.data || 'Failed to send invitation');
        } finally {
            setIsInviting(false);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const results = await FriendService.searchUsers(query);
                setSearchResults(results);
            } catch (error) {
                console.error("Error searching users", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const sendRequest = async (userId: number) => {
        try {
            await FriendService.sendFriendRequest(userId);
            toast.success('Friend request sent!');
            setSearchQuery('');
            setSearchResults([]);
            fetchPendingRequests();
        } catch (error: any) {
            // @ts-ignore
            toast.error(error.response?.data || 'Failed to send request');
        }
    };

    const handleAccept = async (requestId: number) => {
        try {
            await FriendService.acceptFriendRequest(requestId);
            toast.success('Friend request accepted');
            fetchFriends();
            fetchPendingRequests();
        } catch (error) {
            console.error("Error accepting request", error);
            toast.error('Failed to accept request');
        }
    };

    const handleReject = async (requestId: number) => {
        try {
            await FriendService.rejectFriendRequest(requestId);
            toast.success('Friend request rejected');
            fetchPendingRequests();
        } catch (error) {
            console.error("Error rejecting request", error);
            toast.error('Failed to reject request');
        }
    };

    if (friendsLoading && friends.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-40 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Friends</h1>
                    <p className="text-gray-400 text-sm">Manage your friends and send invites</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Search & Invite */}
                <div className="space-y-6">
                    {/* Search Users */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Search size={20} className="text-blue-400" />
                            Find People
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search by name..."
                                className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute left-0 right-0 z-10 mx-6 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                {searchResults.map(user => (
                                    <div key={user.id} className="flex justify-between items-center p-3 hover:bg-gray-700 border-b border-gray-700 last:border-0">
                                        <div>
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => sendRequest(user.id)}
                                            className="text-emerald-400 hover:bg-emerald-500/10 p-2 rounded-full transition-colors"
                                            title="Add Friend"
                                        >
                                            <UserPlus size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Invite via Email */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Mail size={20} className="text-emerald-400" />
                            Invite via Email
                        </h2>
                        <form onSubmit={handleInviteEmail} className="space-y-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isInviting}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isInviting ? 'Sending...' : 'Send Invite'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Lists */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Pending Requests */}
                    {pendingRequests.length > 0 && (
                        <div className="bg-gray-800 p-6 rounded-xl border border-yellow-500/30">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                Pending Requests
                            </h2>
                            <div className="space-y-3">
                                {pendingRequests.map(req => (
                                    <div key={req.id} className="flex justify-between items-center bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold">
                                                {req.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{req.user?.name}</p>
                                                <p className="text-xs text-gray-400">Sent you a friend request</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAccept(req.id)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                                            >
                                                <Check size={16} /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleReject(req.id)}
                                                className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded-lg transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Friends List Component */}
                    <FriendsList friends={friends} />
                </div>
            </div>
        </div>
    );
};

export default Friends;
