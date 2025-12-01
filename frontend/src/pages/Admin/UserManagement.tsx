import { Button } from '../../components/ui/Button';
import { Trash2, Ban } from 'lucide-react';

const UserManagement = () => {
    const users = [
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'USER', status: 'Active' },
        { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'OWNER', status: 'Active' },
        { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'USER', status: 'Suspended' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-900 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                                <td className="px-6 py-4 text-gray-400">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-gray-700 text-gray-300 text-xs font-bold">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Button size="sm" variant="secondary">
                                        <Ban size={16} className="mr-1" /> Suspend
                                    </Button>
                                    <Button size="sm" variant="danger">
                                        <Trash2 size={16} className="mr-1" /> Delete
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

export default UserManagement;
