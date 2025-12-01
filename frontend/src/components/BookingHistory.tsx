import React, { useEffect, useState } from 'react';
import { BookingService } from '../services/api';
import type { Booking } from '../types';
import { Calendar, Clock, MapPin } from 'lucide-react';

const BookingHistory: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await BookingService.getMyBookings();
                setBookings(res.data);
            } catch (error) {
                console.error("Error fetching bookings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <div>Loading bookings...</div>;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="text-indigo-600" /> Booking History
                </h2>
            </div>

            <div className="p-6">
                {bookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Clock className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p>No bookings found yet.</p>
                        <button className="mt-4 text-indigo-600 font-medium hover:underline">Book a Turf</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map(booking => (
                            <div key={booking.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-shadow bg-gray-50">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">ID: #{booking.id}</span>
                                        <div className="flex items-center gap-2 font-bold text-gray-800">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span>Turf #{booking.turfId}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 border border-green-200' :
                                        booking.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                            'bg-gray-100 text-gray-700 border border-gray-200'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>Slot #{booking.slotId}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{new Date(booking.expiresAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                                    <span className="font-bold text-lg text-gray-900">₹{booking.totalAmount}</span>
                                    {booking.status === 'CONFIRMED' && (
                                        <button className="text-indigo-600 text-sm font-medium hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors">
                                            View Ticket
                                        </button>
                                    )}
                                    {booking.status === 'RESERVED' && (
                                        <button className="bg-indigo-600 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-indigo-700 transition-colors shadow-sm">
                                            Pay Now
                                        </button>
                                    )}
                                </div>

                                {booking.qrSecret && booking.status === 'CONFIRMED' && (
                                    <div className="mt-3 pt-3 border-t border-dashed border-gray-300">
                                        <p className="text-xs text-gray-500 mb-1">QR Secret (Show to Owner):</p>
                                        <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono block w-full overflow-hidden text-ellipsis">
                                            {booking.qrSecret}
                                        </code>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;
