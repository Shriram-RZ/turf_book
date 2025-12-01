import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { OwnerService, api } from '../../services/api';

const ManageSlots = () => {
    const { turfId } = useParams();
    const navigate = useNavigate();
    const [turf, setTurf] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '06:00',
        endTime: '23:00',
        slotDuration: '60',
        pricePerSlot: '500'
    });

    useEffect(() => {
        if (turfId) {
            loadTurf();
        }
    }, [turfId]);

    const loadTurf = async () => {
        try {
            const response = await OwnerService.getTurfById(parseInt(turfId!));
            setTurf(response.data);
        } catch (err) {
            console.error('Error loading turf:', err);
            setError('Failed to load turf details');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerateSlots = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post(
                `/turfs/${turfId}/slots/generate`,
                null,
                {
                    params: {
                        date: formData.date,
                        startTime: formData.startTime,
                        endTime: formData.endTime,
                        slotDurationMinutes: parseInt(formData.slotDuration),
                        pricePerSlot: parseFloat(formData.pricePerSlot)
                    }
                }
            );
            setSuccess(`Successfully generated slots for ${formData.date}`);
            setFormData({ ...formData, date: new Date(new Date(formData.date).getTime() + 86400000).toISOString().split('T')[0] });
        } catch (err: any) {
            const errorMessage = typeof err.response?.data === 'string'
                ? err.response.data
                : err.response?.data?.message || 'Failed to generate slots. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <button
                onClick={() => navigate('/owner/turfs')}
                className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to Turfs
            </button>

            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <h1 className="text-2xl font-bold text-white mb-2">Manage Time Slots</h1>
                {turf && (
                    <p className="text-gray-400 mb-6">
                        {turf.name} - {turf.location}
                    </p>
                )}

                {error && (
                    <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-900/50 border border-emerald-800 text-emerald-200 p-3 rounded-lg mb-6 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleGenerateSlots} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Slot Duration (minutes)"
                            name="slotDuration"
                            type="number"
                            value={formData.slotDuration}
                            onChange={handleChange}
                            placeholder="e.g., 60"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Start Time"
                            name="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="End Time"
                            name="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Input
                        label="Price per Slot (₹)"
                        name="pricePerSlot"
                        type="number"
                        value={formData.pricePerSlot}
                        onChange={handleChange}
                        placeholder="e.g., 500"
                        required
                    />

                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Preview</h3>
                        <p className="text-sm text-gray-400">
                            This will generate slots from <span className="text-emerald-400">{formData.startTime}</span> to{' '}
                            <span className="text-emerald-400">{formData.endTime}</span> on{' '}
                            <span className="text-emerald-400">{formData.date}</span>, each lasting{' '}
                            <span className="text-emerald-400">{formData.slotDuration} minutes</span> at{' '}
                            <span className="text-emerald-400">₹{formData.pricePerSlot}</span> per slot.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/owner/turfs')}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading} className="flex-1">
                            Generate Slots
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageSlots;
