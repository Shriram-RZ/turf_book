import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { X } from 'lucide-react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (customerName: string, customerPhone: string) => Promise<void>;
    slotDetails: {
        startTime: string;
        endTime: string;
        price: number;
    };
}

const WalkInBookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onConfirm, slotDetails }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onConfirm(customerName, customerPhone);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">New Walk-in Booking</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Time Slot</span>
                        <span className="text-white font-medium">{slotDetails.startTime} - {slotDetails.endTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Price</span>
                        <span className="text-emerald-400 font-bold">₹{slotDetails.price}</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                        required
                    />
                    <Input
                        label="Phone Number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Enter phone number"
                        required
                    />

                    <div className="flex gap-3 mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={loading}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        >
                            Confirm Booking
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WalkInBookingModal;
