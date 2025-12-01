import { useState, useEffect } from 'react';
import { OwnerService, api } from '../../services/api';
import { Input } from '../../components/ui/Input';
import WalkInBookingModal from '../../components/WalkInBookingModal';
import { Clock } from 'lucide-react';

const OwnerBookings = () => {
    const [turfs, setTurfs] = useState<any[]>([]);
    const [selectedTurf, setSelectedTurf] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadTurfs();
    }, []);

    useEffect(() => {
        if (selectedTurf && selectedDate) {
            loadSlots();
        }
    }, [selectedTurf, selectedDate]);

    const loadTurfs = async () => {
        try {
            const response = await OwnerService.getMyTurfs();
            setTurfs(response.data);
            if (response.data.length > 0) {
                setSelectedTurf(response.data[0].id.toString());
            }
        } catch (err) {
            console.error('Error loading turfs:', err);
        }
    };

    const loadSlots = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/turfs/${selectedTurf}/slots`, {
                params: { date: selectedDate }
            });
            setSlots(response.data);
        } catch (err) {
            console.error('Error loading slots:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotClick = (slot: any) => {
        if (!slot.isAvailable) return;
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const handleBookingConfirm = async (customerName: string, customerPhone: string) => {
        try {
            await api.post('/bookings/owner/book', {
                turfId: parseInt(selectedTurf),
                slotId: selectedSlot.id,
                customerName,
                customerPhone
            });
            await loadSlots(); // Refresh slots
        } catch (err) {
            throw err;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Bookings & Slots</h1>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Select Turf</label>
                        <select
                            value={selectedTurf}
                            onChange={(e) => setSelectedTurf(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        >
                            {turfs.map((turf) => (
                                <option key={turf.id} value={turf.id}>
                                    {turf.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Input
                            label="Select Date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Slots Grid */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    </div>
                ) : slots.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        No slots generated for this date.
                        <br />
                        <span className="text-sm">Go to "My Turfs" to generate slots.</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {slots.map((slot) => (
                            <button
                                key={slot.id}
                                onClick={() => handleSlotClick(slot)}
                                disabled={!slot.isAvailable}
                                className={`
                                    relative p-4 rounded-xl border transition-all duration-200 text-left
                                    ${slot.isAvailable
                                        ? 'bg-gray-900 border-gray-700 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/20 cursor-pointer group'
                                        : 'bg-gray-900/50 border-gray-800 opacity-60 cursor-not-allowed'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`
                                        px-2 py-1 rounded text-xs font-medium
                                        ${slot.isAvailable
                                            ? 'bg-emerald-900/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors'
                                            : 'bg-red-900/30 text-red-400'
                                        }
                                    `}>
                                        {slot.isAvailable ? 'Available' : 'Booked'}
                                    </div>
                                    <span className="text-gray-400 text-xs font-mono">₹{slot.price}</span>
                                </div>

                                <div className="flex items-center text-white font-semibold text-lg mb-1">
                                    <Clock size={16} className="mr-2 text-gray-500" />
                                    {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                                </div>

                                {!slot.isAvailable && (
                                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-800">
                                        Booked
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {selectedSlot && (
                <WalkInBookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleBookingConfirm}
                    slotDetails={{
                        startTime: selectedSlot.startTime,
                        endTime: selectedSlot.endTime,
                        price: selectedSlot.price
                    }}
                />
            )}
        </div>
    );
};

export default OwnerBookings;
