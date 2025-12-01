import { ActivityFeed } from '../../components/dashboard/ActivityFeed';

const Activity = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Activity Log</h1>
                <p className="text-gray-400 text-sm">Recent actions and updates</p>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <ActivityFeed />
            </div>
        </div>
    );
};

export default Activity;
