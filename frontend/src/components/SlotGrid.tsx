import type { TurfSlot } from '../types';
import { clsx } from 'clsx';

interface SlotGridProps {
    slots: TurfSlot[];
    onSelectSlot: (slot: TurfSlot) => void;
    selectedSlot: TurfSlot | null;
}

const SlotGrid: React.FC<SlotGridProps> = ({ slots, onSelectSlot, selectedSlot }) => {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {slots.map((slot) => {
                const isAvailable = slot.isAvailable && !slot.isLocked;
                const isSelected = selectedSlot?.id === slot.id;

                return (
                    <button
                        key={slot.id}
                        disabled={!isAvailable}
                        onClick={() => onSelectSlot(slot)}
                        className={clsx(
                            "p-4 rounded-lg text-center transition-all duration-200 border",
                            isAvailable && !isSelected && "bg-gray-800 border-gray-700 hover:border-emerald-500 text-white cursor-pointer",
                            isSelected && "bg-emerald-600 border-emerald-500 text-white ring-2 ring-emerald-400",
                            !isAvailable && "bg-red-900/50 border-red-900 text-gray-500 cursor-not-allowed"
                        )}
                    >
                        <div className="text-sm font-medium">
                            {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                        </div>
                        <div className="text-xs mt-1 text-gray-400">
                            ₹{slot.customPrice || '1000'}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default SlotGrid;
