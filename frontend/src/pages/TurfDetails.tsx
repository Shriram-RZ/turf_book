import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SlotGrid from '../components/SlotGrid';
import UserBookingModal from '../components/UserBookingModal';
import { TurfService } from '../services/api';
import type { Turf, TurfSlot } from '../types';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Calendar } from 'lucide-react';

const TurfDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [turf, setTurf] = useState<Turf | null>(null);
    const [slots, setSlots] = useState<TurfSlot[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState<TurfSlot | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const { user } = useContext(AuthContext);
    // const navigate = useNavigate(); // Removed unused navigate

    useEffect(() => {
        const fetchTurf = async () => {
            if (id) {
                try {
                    const response = await TurfService.getTurfById(parseInt(id));
                    setTurf(response.data);
                } catch (error) {
                    console.error('Error fetching turf:', error);
                }
            }
        };
        fetchTurf();
    }, [id]);

    useEffect(() => {
        const fetchSlots = async () => {
            if (id) {
                try {
                    const response = await TurfService.getSlots(parseInt(id), selectedDate);
                    setSlots(response.data);
                } catch (error) {
                    console.error('Error fetching slots:', error);
                }
            }
        };
        fetchSlots();

        // Poll for updates every 5 seconds (Simple real-time fallback)
        const interval = setInterval(fetchSlots, 5000);
        return () => clearInterval(interval);
    }, [id, selectedDate]);

    const handleBookingSuccess = async () => {
        alert('Booking Confirmed!');
        const response = await TurfService.getSlots(parseInt(id!), selectedDate);
        setSlots(response.data);
        setSelectedSlot(null);
        setShowBookingModal(false);
    };

    if (!turf) return <div className="text-white text-center mt-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
                    <img
                        src={turf.images && turf.images.length > 0 ? turf.images[0] : 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                        alt={turf.name}
                        className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-white mb-2">{turf.name}</h1>
                        <div className="flex items-center text-gray-400 mb-4">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span>{turf.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {turf.amenities && turf.amenities.map((amenity, index) => (
                                <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Available Slots</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm">
                                {slots.length} slots found for {selectedDate}
                            </span>
                            <div className="flex items-center bg-gray-700 rounded-md px-3 py-2">
                                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-transparent text-white focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {slots.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            No slots available for this date. Please select another date.
                        </div>
                    ) : (
                        <SlotGrid
                            slots={slots}
                            onSelectSlot={setSelectedSlot}
                            selectedSlot={selectedSlot}
                        />
                    )}

                    {selectedSlot && (
                        <div className="mt-8 border-t border-gray-700 pt-6 flex justify-between items-center">
                            <div>
                                <p className="text-gray-400">Selected Slot</p>
                                <p className="text-xl text-white font-bold">
                                    {selectedSlot.startTime.substring(0, 5)} - {selectedSlot.endTime.substring(0, 5)}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
                            >
                                Book Now (₹{selectedSlot.customPrice || 1000})
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showBookingModal && selectedSlot && user && (
                <UserBookingModal
                    slot={selectedSlot}
                    turfId={turf.id}
                    userId={user.id}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
};

export default TurfDetails;
