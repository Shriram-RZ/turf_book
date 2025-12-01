import { useAuth } from '../context/AuthContext';
import FriendList from '../components/FriendList';
import TeamList from '../components/TeamList';
import BookingHistory from '../components/BookingHistory';
import UserProfile from '../components/UserProfile';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.name}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Profile & Social */}
                    <div className="lg:col-span-4 space-y-8">
                        <UserProfile user={user} />
                        <FriendList />
                        <TeamList />
                    </div>

                    {/* Right Column: Bookings & Stats */}
                    <div className="lg:col-span-8 space-y-8">
                        <BookingHistory />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
