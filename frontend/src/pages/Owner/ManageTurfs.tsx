import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { OwnerService } from '../../services/api';

interface Turf {
    id: number;
    name: string;
    location: string;
    status?: string;
}

const ManageTurfs = () => {
    const [turfs, setTurfs] = useState<Turf[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTurfs();
    }, []);

    const fetchTurfs = async () => {
        try {
            const response = await OwnerService.getMyTurfs();
            setTurfs(response.data);
        } catch (error) {
            console.error('Error fetching turfs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (turfId: number) => {
        navigate(`/owner/turfs/edit/${turfId}`);
    };

    const handleDelete = async (turfId: number, turfName: string) => {
        if (window.confirm(`Are you sure you want to delete "${turfName}"? This action cannot be undone.`)) {
            try {
                await OwnerService.deleteTurf(turfId);
                // Refresh the list after deletion
                fetchTurfs();
            } catch (error) {
                console.error('Error deleting turf:', error);
                alert('Failed to delete turf. Please try again.');
            }
        }
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Manage Turfs</h1>
                <Link to="/owner/turfs/add">
                    <Button>
                        <Plus size={18} className="mr-2" /> Add New Turf
                    </Button>
                </Link>
            </div>

            {turfs.length === 0 ? (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
                    <p className="text-gray-400 mb-4">You haven't added any turfs yet.</p>
                    <Link to="/owner/turfs/add">
                        <Button>
                            <Plus size={18} className="mr-2" /> Add Your First Turf
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900 text-gray-400 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">Turf Name</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {turfs.map((turf) => (
                                <tr key={turf.id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{turf.name}</td>
                                    <td className="px-6 py-4 text-gray-400">{turf.location}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-900/50 text-emerald-400">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => navigate(`/owner/turfs/${turf.id}/slots`)}
                                            className="text-purple-400 hover:text-purple-300 p-1 transition-colors"
                                            title="Manage slots"
                                        >
                                            <Calendar size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(turf.id)}
                                            className="text-blue-400 hover:text-blue-300 p-1 transition-colors"
                                            title="Edit turf"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(turf.id, turf.name)}
                                            className="text-red-400 hover:text-red-300 p-1 transition-colors"
                                            title="Delete turf"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageTurfs;
