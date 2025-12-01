import { useState } from 'react';
import { useAuthStore } from '../../context/useAuthStore';
import { UserService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { User, Lock, Bell, Shield, Camera } from 'lucide-react';

const Settings = () => {
    const { user, login } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        avatarUrl: user?.avatarUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await UserService.uploadImage(file);
            const imageUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '') + response.data.url;
            setFormData({ ...formData, avatarUrl: imageUrl });
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await UserService.updateProfile({
                name: formData.name,
                phone: formData.phone,
                avatarUrl: formData.avatarUrl
            });
            // Update local user state
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...response.data };
            login(updatedUser);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
                <p className="text-gray-400 text-sm">Manage your account preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-medium">
                        <User size={18} />
                        Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors font-medium">
                        <Lock size={18} />
                        Security
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors font-medium">
                        <Bell size={18} />
                        Notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors font-medium">
                        <Shield size={18} />
                        Privacy
                    </button>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Settings */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-white mb-6">Profile Information</h2>

                        {/* Avatar Upload */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
                                    {formData.avatarUrl ? (
                                        <img
                                            src={formData.avatarUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <User size={40} />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                                    <Camera size={24} className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            <div>
                                <h3 className="text-white font-medium">Profile Photo</h3>
                                <p className="text-sm text-gray-400 mb-2">
                                    {uploading ? 'Uploading...' : 'Click the photo to upload a new image'}
                                </p>
                                <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-gray-900/50 border border-gray-700 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
