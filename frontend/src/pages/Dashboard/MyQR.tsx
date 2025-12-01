import { QRCodeGenerator } from '../../components/qr/QRCodeGenerator';
import { useAuthStore } from '../../context/useAuthStore';

const MyQR = () => {
    const { user } = useAuthStore();

    // In a real app, this would be a dynamic QR code for the user's identity or next booking
    const qrValue = `USER-${user?.id}-${Date.now()}`;

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold text-white mb-2">My QR Code</h1>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                Show this QR code at the venue for quick check-in. This code is unique to your account.
            </p>

            <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <QRCodeGenerator value={qrValue} size={250} />
            </div>
        </div>
    );
};

export default MyQR;
