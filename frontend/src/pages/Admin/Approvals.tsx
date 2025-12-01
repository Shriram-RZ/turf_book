import { Button } from '../../components/ui/Button';
import { Check, X } from 'lucide-react';

const Approvals = () => {
    const pendingApprovals = [
        { id: 1, type: 'OWNER', name: 'John Doe', email: 'john@turf.com', details: 'Turf Owner Request' },
        { id: 2, type: 'TURF', name: 'City Arena', location: 'Downtown', details: 'New Turf Listing' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Pending Approvals</h1>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-900 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {pendingApprovals.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.type === 'OWNER' ? 'bg-blue-900/50 text-blue-400' : 'bg-purple-900/50 text-purple-400'
                                        }`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                                <td className="px-6 py-4 text-gray-400">{item.details}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                        <Check size={16} className="mr-1" /> Approve
                                    </Button>
                                    <Button size="sm" variant="danger">
                                        <X size={16} className="mr-1" /> Reject
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Approvals;
