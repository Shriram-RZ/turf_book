import React, { useState } from 'react';
import { Button } from './ui/Button';
import { X, Clock, CreditCard, Users } from 'lucide-react';
import { BookingService } from '../services/api';
import type { TurfSlot, Booking } from '../types';
import SplitLobby from './SplitLobby';

interface UserBookingModalProps {
    slot: TurfSlot;
    turfId: number;
    userId: number;
    onClose: () => void;
    onSuccess: () => void;
}

const UserBookingModal: React.FC<UserBookingModalProps> = ({ slot, turfId, userId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSplitLobby, setShowSplitLobby] = useState(false);
    const [booking, setBooking] = useState<Booking | null>(null);

    const handleBooking = async (isSplit: boolean) => {
        setLoading(true);
        setError('');
        try {
            // Initiate booking
            const res = await BookingService.initiateBooking(
                userId,
                turfId,
                slot.id,
                slot.customPrice || 1000 // Default price if not set
            );

            if (isSplit) {
                setBooking(res.data);
                setShowSplitLobby(true);
            } else {
                // In a real app, we would redirect to payment gateway here
                // For now, we'll simulate a successful payment flow
                await new Promise(resolve => setTimeout(resolve, 1000));
                onSuccess();
            }
        } catch (err: any) {
            console.error("Booking error:", err);
            setError(err.response?.data || err.message || 'Failed to book slot');
        } finally {
            setLoading(false);
        }
    };

    if (showSplitLobby && booking) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="w-full max-w-2xl relative">
                    <button
                        onClick={onClose}
                        className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <SplitLobby booking={booking} onComplete={onSuccess} />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-xl transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Confirm Booking</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-5 mb-6 border border-gray-700 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-2">
                            <Clock size={16} /> Time
                        </span>
                        <span className="text-white font-medium">
                            {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-2">
                            <CreditCard size={16} /> Price
                        </span>
                        <span className="text-emerald-400 font-bold text-lg">
                            ₹{slot.customPrice || 1000}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-800/50 text-red-200 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <Button
                            onClick={() => handleBooking(false)}
                            isLoading={loading}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                        >
                            Pay Now
                        </Button>
                        <Button
                            onClick={() => handleBooking(true)}
                            isLoading={loading}
                            variant="outline"
                            className="flex-1 border-indigo-500 text-indigo-400 hover:bg-indigo-900/30 hover:text-indigo-300"
                        >
                            <Users size={16} className="mr-2" /> Split
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full text-gray-400 hover:text-white"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserBookingModal;
