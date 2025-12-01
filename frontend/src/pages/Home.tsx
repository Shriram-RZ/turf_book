import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TurfCard from '../components/TurfCard';
import { TurfService } from '../services/api';
import type { Turf } from '../types';

const Home = () => {
    const [turfs, setTurfs] = useState<Turf[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTurfs = async () => {
            try {
                const response = await TurfService.getAllTurfs();
                setTurfs(response.data);
            } catch (error) {
                console.error('Error fetching turfs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTurfs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">Find Your Turf</h1>

                {loading ? (
                    <div className="text-white text-center">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {turfs.map((turf) => (
                            <TurfCard key={turf.id} turf={turf} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
