import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TurfService } from '../../services/api';
import SlotGrid from '../../components/SlotGrid';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/loaders/Skeleton';
import { MapPin, Share2, Heart, Info } from 'lucide-react';
import type { TurfSlot } from '../../types';
import { format } from 'date-fns';

const TurfDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState<TurfSlot | null>(null);

    const { data: turf, isLoading: isTurfLoading } = useQuery({
        queryKey: ['turf', id],
        queryFn: () => TurfService.getTurfById(Number(id)).then(res => res.data),
        enabled: !!id,
    });

    const { data: slots, isLoading: isSlotsLoading } = useQuery({
        queryKey: ['slots', id, selectedDate],
        queryFn: () => TurfService.getSlots(Number(id), selectedDate).then(res => res.data),
        enabled: !!id,
        refetchInterval: 5000, // Poll every 5 seconds for real-time updates
    });

    const handleBook = () => {
        if (selectedSlot) {
            // Navigate to booking flow with selected slot state
            navigate('/booking/confirm', {
                state: {
                    turf,
                    slot: selectedSlot,
                    date: selectedDate
                }
            });
        }
    };

    if (isTurfLoading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-[400px] w-full rounded-3xl" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-64 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!turf) return <div>Turf not found</div>;

    return (
        <div>
            {/* Gallery Section */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden mb-8 group">
                <img
                    src={turf.images?.[0] || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}
                    alt={turf.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors text-white">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors text-white">
                        <Heart size={20} />
                    </button>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                    <h1 className="text-4xl font-bold text-white mb-2">{turf.name}</h1>
                    <div className="flex items-center text-gray-300">
                        <MapPin size={18} className="mr-2" />
                        {turf.location}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Amenities */}
                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">Amenities</h3>
                        <div className="flex flex-wrap gap-3">
                            {turf.amenities?.map((amenity, i) => (
                                <span key={i} className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700">
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Slot Selection */}
                    <section className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h3 className="text-xl font-bold text-white">Select a Slot</h3>
                            <input
                                type="date"
                                value={selectedDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        {isSlotsLoading ? (
                            <div className="text-center text-gray-400 py-10">Loading slots...</div>
                        ) : slots && slots.length > 0 ? (
                            <SlotGrid
                                slots={slots}
                                selectedSlot={selectedSlot}
                                onSelectSlot={setSelectedSlot}
                            />
                        ) : (
                            <div className="text-center text-gray-400 py-10">No slots available for this date.</div>
                        )}
                    </section>
                </div>

                {/* Booking Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Date</span>
                                <span className="text-white font-medium">{format(new Date(selectedDate), 'PPP')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Time</span>
                                <span className="text-white font-medium">
                                    {selectedSlot ? `${selectedSlot.startTime.substring(0, 5)} - ${selectedSlot.endTime.substring(0, 5)}` : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Price</span>
                                <span className="text-emerald-400 font-bold">
                                    {selectedSlot ? `₹${selectedSlot.customPrice || 1000}` : '-'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 mb-6 flex gap-3">
                            <Info className="text-blue-400 flex-shrink-0" size={20} />
                            <p className="text-xs text-blue-200">
                                Free cancellation up to 24 hours before the slot time.
                            </p>
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            disabled={!selectedSlot}
                            onClick={handleBook}
                        >
                            Proceed to Pay
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TurfDetails;
