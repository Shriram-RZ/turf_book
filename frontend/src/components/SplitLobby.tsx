import React, { useState, useEffect } from 'react';
import { SplitPaymentService } from '../services/splitPayment';
import { useDashboardStore } from '../stores/dashboardStore';
import type { Booking, BookingParticipant } from '../types';
import { UserPlus, Users, Check, Loader, Share2 } from 'lucide-react';

interface SplitLobbyProps {
    booking: Booking;
    onComplete: () => void;
}

const SplitLobby: React.FC<SplitLobbyProps> = ({ booking, onComplete }) => {
    const { friends, fetchFriends } = useDashboardStore();
    const [participants, setParticipants] = useState<BookingParticipant[]>(booking.participants || []);
    const [inviting, setInviting] = useState<number | null>(null);

    useEffect(() => {
        if (friends.length === 0) {
            fetchFriends();
        }
        // Initialize participants with the creator if empty
        if (participants.length === 0 && booking.userId) {
            setParticipants([{
                id: 0,
                bookingId: booking.id,
                userId: booking.userId,
                shareAmount: booking.totalAmount,
                status: 'PENDING'
            }]);
        }
    }, [fetchFriends, friends.length, booking.userId, booking.id, booking.totalAmount, participants.length]);

    const handleInvite = async (friendId: number) => {
        setInviting(friendId);
        try {
            await SplitPaymentService.addParticipant(booking.id, friendId);

            // Optimistically update UI
            const newCount = participants.length + 1;
            const newShare = booking.totalAmount / newCount;

            const friendUser = friends.find(f => f.friendId === friendId)?.friend;

            setParticipants(prev => {
                const updated = prev.map(p => ({ ...p, shareAmount: newShare }));
                return [
                    ...updated,
                    {
                        id: Date.now(), // temp id
                        bookingId: booking.id,
                        userId: friendId,
                        shareAmount: newShare,
                        status: 'PENDING',
                        user: friendUser
                    }
                ];
            });
        } catch (error) {
            console.error("Failed to add participant", error);
            alert('Failed to add participant');
        } finally {
            setInviting(null);
        }
    };

    const getParticipantName = (p: BookingParticipant) => {
        if (p.user) return p.user.name;
        // Try to find in friends
        const friend = friends.find(f => f.friendId === p.userId || f.userId === p.userId);
        if (friend) {
            return friend.friendId === p.userId ? friend.friend?.name : friend.user?.name;
        }
        return `User #${p.userId}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl w-full mx-auto">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2"><Users /> Split Lobby</h3>
                    <p className="text-indigo-200 text-sm">Booking #{booking.id}</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">₹{booking.totalAmount}</div>
                    <div className="text-indigo-200 text-xs">Total Amount</div>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Participants List */}
                <div>
                    <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Share2 size={18} /> Split Breakdown
                    </h4>
                    <div className="space-y-3">
                        {participants.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                                        {getParticipantName(p).charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{getParticipantName(p)}</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">₹{p.shareAmount.toFixed(2)}</div>
                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${p.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {p.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100">
                        <p>Everyone must pay their share to confirm the booking.</p>
                    </div>
                </div>

                {/* Invite Friends */}
                <div>
                    <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <UserPlus size={18} /> Invite Friends
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {friends.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">No friends found. Add friends from dashboard.</p>
                        ) : (
                            friends.map(friendship => {
                                const friendUser = friendship.friend;
                                if (!friendUser) return null;
                                const targetId = friendship.friendId;
                                const isAdded = participants.some(p => p.userId === targetId);

                                return (
                                    <div key={friendship.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
                                                {friendUser.name.charAt(0)}
                                            </div>
                                            <span className="text-sm text-gray-600">{friendUser.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleInvite(targetId)}
                                            disabled={isAdded || inviting === targetId}
                                            className={`p-2 rounded-full transition-all ${isAdded
                                                ? 'text-green-500 bg-green-50 cursor-default'
                                                : 'text-indigo-600 hover:bg-indigo-50 hover:scale-110'
                                                }`}
                                        >
                                            {isAdded ? <Check size={18} /> : inviting === targetId ? <Loader size={18} className="animate-spin" /> : <UserPlus size={18} />}
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                <button
                    onClick={onComplete}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow transition-all"
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
};

export default SplitLobby;
