import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TurfService } from '../../services/api';
import { TurfCard } from '../../components/cards/TurfCard';
import { Skeleton } from '../../components/loaders/Skeleton';
import { Filter, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';

const TurfList = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { data: turfs, isLoading } = useQuery({
        queryKey: ['turfs'],
        queryFn: () => TurfService.getAllTurfs().then(res => res.data),
    });

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white">Explore Turfs</h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search turfs..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <Button variant="secondary" onClick={() => setIsFilterOpen(true)}>
                        <Filter size={18} className="mr-2" /> Filters
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl overflow-hidden h-96">
                            <Skeleton className="h-48 w-full" />
                            <div className="p-5 space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="flex gap-2 pt-2">
                                    <Skeleton className="h-6 w-16 rounded" />
                                    <Skeleton className="h-6 w-16 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {turfs?.map((turf) => (
                        <TurfCard key={turf.id} turf={turf} />
                    ))}
                </div>
            )}

            <Drawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                title="Filters"
            >
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Sports</h4>
                        <div className="space-y-2">
                            {['Football', 'Cricket', 'Badminton', 'Tennis'].map((sport) => (
                                <label key={sport} className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500" />
                                    <span className="text-gray-400">{sport}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Price Range</h4>
                        <div className="flex items-center gap-2">
                            <input type="number" placeholder="Min" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" />
                            <span className="text-gray-500">-</span>
                            <input type="number" placeholder="Max" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <Button className="w-full">Apply Filters</Button>
                </div>
            </Drawer>
        </div>
    );
};

export default TurfList;
