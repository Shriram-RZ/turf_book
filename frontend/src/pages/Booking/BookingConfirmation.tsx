import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/useAuthStore';
import { BookingService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { QRCodeGenerator } from '../../components/qr/QRCodeGenerator';
import { CheckCircle, Users, CreditCard, Share2 } from 'lucide-react';
import { format } from 'date-fns';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { turf, slot, date } = location.state || {};

    const [step, setStep] = useState(1); // 1: Participants, 2: Payment, 3: Success
    const [participants, setParticipants] = useState<string[]>([]);
    const [newParticipant, setNewParticipant] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [qrSecret, setQrSecret] = useState<string | null>(null);

    if (!turf || !slot || !date) {
        return <div className="text-white text-center mt-10">Invalid booking session. Please start again.</div>;
    }

    const handleAddParticipant = (e: React.FormEvent) => {
        e.preventDefault();
        if (newParticipant) {
            setParticipants([...participants, newParticipant]);
            setNewParticipant('');
        }
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create booking
            const response = await BookingService.initiateBooking(
                user?.id || 1, // Fallback for dev
                turf.id,
                slot.id,
                slot.customPrice || 1000
            );

            setBookingId(response.data.id);
            setQrSecret(response.data.qrSecret || 'MOCK-QR-SECRET-' + Date.now());
            setStep(3);
        } catch (error) {
            console.error('Booking failed', error);
            alert('Booking failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 px-4">
                {[
                    { num: 1, label: 'Participants', icon: Users },
                    { num: 2, label: 'Payment', icon: CreditCard },
                    { num: 3, label: 'Confirmation', icon: CheckCircle },
                ].map((s) => (
                    <div key={s.num} className={`flex flex-col items-center ${step >= s.num ? 'text-emerald-500' : 'text-gray-500'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2 ${step >= s.num ? 'border-emerald-500 bg-emerald-900/20' : 'border-gray-600 bg-gray-800'}`}>
                            <s.icon size={20} />
                        </div>
                        <span className="text-xs font-medium">{s.label}</span>
                    </div>
                ))}
            </div>

            <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
                {/* Header */}
                <div className="bg-gray-900 p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-1">{turf.name}</h2>
                    <p className="text-gray-400 text-sm">
                        {format(new Date(date), 'PPP')} • {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                    </p>
                </div>

                <div className="p-6 md:p-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white">Add Participants</h3>
                            <p className="text-gray-400 text-sm">Invite friends to split the bill or just to notify them.</p>

                            <form onSubmit={handleAddParticipant} className="flex gap-2">
                                <Input
                                    placeholder="Enter email or username"
                                    value={newParticipant}
                                    onChange={(e) => setNewParticipant(e.target.value)}
                                />
                                <Button type="submit" variant="secondary">Add</Button>
                            </form>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar fallback={user?.name || 'ME'} />
                                        <div>
                                            <p className="text-white text-sm font-medium">{user?.name || 'You'}</p>
                                            <p className="text-xs text-gray-400">Organizer</p>
                                        </div>
                                    </div>
                                    <span className="text-emerald-400 text-sm font-bold">Paid</span>
                                </div>
                                {participants.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <Avatar fallback={p} />
                                            <p className="text-gray-300 text-sm">{p}</p>
                                        </div>
                                        <span className="text-yellow-500 text-xs">Pending</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 flex justify-end">
                                <Button onClick={() => setStep(2)}>Continue to Payment</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white">Payment Summary</h3>

                            <div className="bg-gray-700/30 rounded-xl p-4 space-y-3 border border-gray-700">
                                <div className="flex justify-between text-gray-300">
                                    <span>Turf Fee</span>
                                    <span>₹{slot.customPrice || 1000}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Convenience Fee</span>
                                    <span>₹50</span>
                                </div>
                                <div className="border-t border-gray-600 pt-3 flex justify-between text-white font-bold text-lg">
                                    <span>Total Payable</span>
                                    <span>₹{(slot.customPrice || 1000) + 50}</span>
                                </div>
                            </div>

                            <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4">
                                <h4 className="text-blue-400 font-medium mb-2 text-sm">Split Payment Breakdown</h4>
                                <p className="text-gray-400 text-xs">
                                    You are paying the full amount now. Your friends will receive a payment link to reimburse you.
                                </p>
                            </div>

                            <div className="pt-6 flex justify-between">
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={handlePayment} isLoading={isProcessing}>Pay & Confirm</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/30 text-emerald-500 mb-2">
                                <CheckCircle size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-white">Booking Confirmed!</h3>
                            <p className="text-gray-400">Your slot has been successfully booked. Booking ID: #{bookingId}</p>

                            <div className="flex justify-center my-6">
                                <QRCodeGenerator value={qrSecret || 'ERROR'} />
                            </div>

                            <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                Show this QR code at the venue for entry. You can also find this in your dashboard.
                            </p>

                            <div className="flex gap-3 justify-center pt-4">
                                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                                    Go to Dashboard
                                </Button>
                                <Button variant="outline">
                                    <Share2 size={18} className="mr-2" /> Share
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
