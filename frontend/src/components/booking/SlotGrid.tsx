import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

interface Slot {
    id: number;
    startTime: string;
    endTime: string;
    price: number;
    isBooked: boolean;
}

interface SlotGridProps {
    turfId: number;
    selectedDate: Date;
    onSlotSelect: (slot: Slot) => void;
}

export const SlotGrid = ({ turfId, selectedDate, onSlotSelect }: SlotGridProps) => {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    useEffect(() => {
        fetchSlots();
    }, [turfId, selectedDate]);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/turfs/${turfId}/slots`,
                { params: { date: dateStr } }
            );
            setSlots(response.data);
        } catch (error) {
            console.error('Error fetching slots:', error);
            setSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotClick = (slot: Slot) => {
        if (!slot.isBooked) {
            setSelectedSlot(slot.id);
            onSlotSelect(slot);
        }
    };

    if (loading) {
        return <div className="text-gray-400">Loading slots...</div>;
    }

    if (slots.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-400">No slots available for this date.</p>
                <p className="text-sm text-gray-500 mt-2">Please select a different date or contact the turf owner.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {slots.map((slot) => (
                <button
                    key={slot.id}
                    onClick={() => handleSlotClick(slot)}
                    disabled={slot.isBooked}
                    className={`
                        p-4 rounded-lg border-2 transition-all
                        ${slot.isBooked
                            ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                            : selectedSlot === slot.id
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : 'bg-gray-800 border-gray-700 text-white hover:border-emerald-500'
                        }
                    `}
                >
                    <div className="text-sm font-semibold">
                        {slot.startTime} - {slot.endTime}
                    </div>
                    <div className="text-xs mt-1">
                        {slot.isBooked ? 'Booked' : `₹${slot.price}`}
                    </div>
                </button>
            ))}
        </div>
    );
};
