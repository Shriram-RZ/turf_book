import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
    onScan: (decodedText: string) => void;
    onError?: (error: any) => void;
}

export const QRScanner = ({ onScan, onError }: QRScannerProps) => {
    const [scanResult, setScanResult] = useState<string | null>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                setScanResult(decodedText);
                onScan(decodedText);
                scanner.clear();
            },
            (errorMessage) => {
                if (onError) onError(errorMessage);
            }
        );

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, [onScan, onError]);

    return (
        <div className="w-full max-w-md mx-auto">
            <div id="reader" className="overflow-hidden rounded-xl border-2 border-emerald-500 shadow-lg bg-gray-900"></div>
            {scanResult && (
                <div className="mt-4 p-4 bg-emerald-900/30 border border-emerald-800 rounded-lg text-center">
                    <p className="text-emerald-400 font-medium">Scanned Successfully!</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">{scanResult}</p>
                </div>
            )}
        </div>
    );
};
