import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { Turf } from '../types';

interface TurfCardProps {
    turf: Turf;
}

const TurfCard: React.FC<TurfCardProps> = ({ turf }) => {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
                src={turf.images && turf.images.length > 0 ? turf.images[0] : 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                alt={turf.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{turf.name}</h3>
                <div className="flex items-center text-gray-400 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{turf.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {turf.amenities && turf.amenities.map((amenity, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full flex items-center">
                            {amenity}
                        </span>
                    ))}
                </div>
                <Link
                    to={`/turfs/${turf.id}`}
                    className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 rounded-md font-medium transition-colors duration-300"
                >
                    View Slots
                </Link>
            </div>
        </div>
    );
};

export default TurfCard;
