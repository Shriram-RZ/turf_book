import { useQuery } from '@tanstack/react-query';
import { BookingService } from '../../services/api';
import { Skeleton } from '../../components/loaders/Skeleton';
import { Badge } from '../../components/ui/Badge';

const MyBookings = () => {
    const { data: bookings, isLoading } = useQuery({
        queryKey: ['my-bookings'],
        queryFn: () => BookingService.getMyBookings().then(res => res.data),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-white mb-6">My Bookings</h1>
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">My Bookings</h1>

            {bookings?.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                    <p className="text-gray-400">You haven't made any bookings yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings?.map((booking) => (
                        <div key={booking.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-white">Booking #{booking.id}</h3>
                                    <Badge variant={booking.status === 'CONFIRMED' ? 'success' : 'warning'}>
                                        {booking.status}
                                    </Badge>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    {/* We might need to fetch turf details separately or include in booking response */}
                                    Turf ID: {booking.turfId} • Slot ID: {booking.slotId}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-emerald-400 font-bold text-lg">₹{booking.totalAmount}</p>
                                <p className="text-gray-500 text-xs">Paid via Split Pay</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
