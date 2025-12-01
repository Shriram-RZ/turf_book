import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { Turf } from '../../types';

interface TurfCardProps {
    turf: Turf;
}

export const TurfCard = ({ turf }: TurfCardProps) => {
    return (
        <Link to={`/turfs/${turf.id}`} className="group block bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={turf.images?.[0] || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                    alt={turf.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2">
                    <Badge variant="success" className="bg-emerald-600/90 text-white border-none backdrop-blur-sm">
                        Available
                    </Badge>
                </div>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{turf.name}</h3>
                    <div className="flex items-center bg-gray-700 px-2 py-1 rounded text-yellow-400 text-xs font-bold">
                        <Star size={12} className="mr-1 fill-current" />
                        4.5
                    </div>
                </div>
                <div className="flex items-center text-gray-400 text-sm mb-4">
                    <MapPin size={14} className="mr-1" />
                    {turf.location}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {turf.amenities?.slice(0, 3).map((amenity, i) => (
                        <span key={i} className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-700">
                            {amenity}
                        </span>
                    ))}
                    {turf.amenities?.length > 3 && (
                        <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-700">
                            +{turf.amenities.length - 3}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="text-gray-400 text-xs">Starting from</div>
                    <div className="text-emerald-400 font-bold">₹1000/hr</div>
                </div>
            </div>
        </Link>
    );
};
