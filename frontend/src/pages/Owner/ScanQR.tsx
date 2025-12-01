import { useState } from 'react';
import { QRScanner } from '../../components/qr/QRScanner';
import { CheckCircle, XCircle } from 'lucide-react';

const ScanQR = () => {
    const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleScan = async (decodedText: string) => {
        try {
            // In a real app, we would verify this with the backend
            // const response = await OwnerService.scanQR(decodedText);

            // Mock verification
            console.log("Scanned:", decodedText);
            setScanStatus('success');
            setMessage('Booking Verified Successfully!');

            // Reset after 3 seconds
            setTimeout(() => {
                setScanStatus('idle');
                setMessage('');
            }, 3000);
        } catch (error) {
            setScanStatus('error');
            setMessage('Invalid or Expired QR Code');
        }
    };

    return (
        <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Scan Booking QR</h1>
            <p className="text-gray-400 mb-8">
                Use your camera to scan the customer's booking QR code for check-in.
            </p>

            <div className="mb-8">
                <QRScanner onScan={handleScan} />
            </div>

            {scanStatus === 'success' && (
                <div className="bg-emerald-900/30 border border-emerald-800 p-6 rounded-xl flex flex-col items-center animate-fade-in">
                    <CheckCircle size={48} className="text-emerald-500 mb-2" />
                    <h3 className="text-xl font-bold text-emerald-400">Verified!</h3>
                    <p className="text-emerald-200">{message}</p>
                </div>
            )}

            {scanStatus === 'error' && (
                <div className="bg-red-900/30 border border-red-800 p-6 rounded-xl flex flex-col items-center animate-fade-in">
                    <XCircle size={48} className="text-red-500 mb-2" />
                    <h3 className="text-xl font-bold text-red-400">Error!</h3>
                    <p className="text-red-200">{message}</p>
                </div>
            )}
        </div>
    );
};

export default ScanQR;
