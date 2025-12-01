import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { OwnerService } from '../../services/api';

const AddTurf = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        pricePerHour: '',
        amenities: '',
        images: ''
    });

    useEffect(() => {
        if (isEditMode && id) {
            loadTurfData(parseInt(id));
        }
    }, [id, isEditMode]);

    const loadTurfData = async (turfId: number) => {
        try {
            const response = await OwnerService.getTurfById(turfId);
            const turf = response.data;
            setFormData({
                name: turf.name || '',
                location: turf.location || '',
                description: turf.description || '',
                pricePerHour: turf.pricePerHour?.toString() || '',
                amenities: Array.isArray(turf.amenities) ? turf.amenities.join(', ') : '',
                images: Array.isArray(turf.images) ? turf.images.join(', ') : ''
            });
        } catch (err) {
            console.error('Error loading turf:', err);
            setError('Failed to load turf data');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const amenitiesArray = formData.amenities.split(',').map(a => a.trim()).filter(a => a);
            const imagesArray = formData.images.split(',').map(i => i.trim()).filter(i => i);

            const turfData = {
                name: formData.name,
                location: formData.location,
                description: formData.description,
                pricePerHour: parseFloat(formData.pricePerHour),
                amenities: amenitiesArray,
                images: imagesArray
            };

            if (isEditMode && id) {
                await OwnerService.updateTurf(parseInt(id), turfData);
            } else {
                await OwnerService.addTurf(turfData);
            }

            navigate('/owner/turfs');
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} turf. Please try again.`);
        } finally {
            setIsLoading(false);
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
                <h1 className="text-2xl font-bold text-white mb-6">
                    {isEditMode ? 'Edit Turf' : 'Add New Turf'}
                </h1>

                {error && (
                    <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Turf Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Green Valley Sports Arena"
                        required
                    />

                    <Input
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Koramangala, Bangalore"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your turf..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 min-h-[100px]"
                            required
                        />
                    </div>

                    <Input
                        label="Price per Hour (₹)"
                        name="pricePerHour"
                        type="number"
                        value={formData.pricePerHour}
                        onChange={handleChange}
                        placeholder="e.g., 1000"
                        required
                    />

                    <Input
                        label="Amenities (comma-separated)"
                        name="amenities"
                        value={formData.amenities}
                        onChange={handleChange}
                        placeholder="e.g., Parking, Changing Room, Floodlights"
                    />

                    <Input
                        label="Image URLs (comma-separated)"
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/owner/turfs')}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading} className="flex-1">
                            {isEditMode ? 'Update Turf' : 'Add Turf'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTurf;
