import { Mail, Phone, Shield } from 'lucide-react';

interface UserProfileProps {
    user: any;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    if (!user) return null;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
                <div className="absolute -bottom-12 left-6">
                    <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-16 pb-6 px-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <Mail size={16} />
                            <span className="text-sm">{user.email}</span>
                        </div>
                        {user.phone && (
                            <div className="flex items-center gap-2 text-gray-500 mt-1">
                                <Phone size={16} />
                                <span className="text-sm">{user.phone}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1">
                            <Shield size={12} /> {user.role || 'PLAYER'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8 border-t pt-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">0</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Matches</div>
                    </div>
                    <div className="text-center border-l border-r">
                        <div className="text-2xl font-bold text-gray-800">0</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">MOM</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">0</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Rating</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
