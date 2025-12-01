import React, { useState } from 'react';
import { OwnerService } from '../services/api';
import { QrCode, Calendar } from 'lucide-react';

const OwnerDashboard: React.FC = () => {
    const [qrSecret, setQrSecret] = useState('');
    const [scanResult, setScanResult] = useState<string | null>(null);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await OwnerService.scanQR(qrSecret);
            setScanResult(`Success: ${res.data}`);
        } catch (error: any) {
            setScanResult(`Error: ${error.response?.data || 'Invalid QR'}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Owner Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* QR Scanner Mock */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <QrCode className="text-blue-600" size={24} />
                        <h2 className="text-xl font-bold">QR Check-in</h2>
                    </div>

                    <form onSubmit={handleScan} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter QR Secret
                            </label>
                            <input
                                type="text"
                                value={qrSecret}
                                onChange={(e) => setQrSecret(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                placeholder="Scan or type code..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Validate Ticket
                        </button>
                    </form>

                    {scanResult && (
                        <div className={`mt-4 p-3 rounded ${scanResult.startsWith('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {scanResult}
                        </div>
                    )}
                </div>

                {/* Slot Management Mock */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="text-green-600" size={24} />
                        <h2 className="text-xl font-bold">Manage Slots</h2>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Generate slots for your turfs here. (Functionality implemented in backend, UI pending)
                    </p>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-not-allowed">
                        Generate Slots
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
