import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeGeneratorProps {
    value: string;
    size?: number;
    className?: string;
}

export const QRCodeGenerator = ({ value, size = 200, className }: QRCodeGeneratorProps) => {
    return (
        <div className={`bg-white p-4 rounded-xl shadow-lg inline-block ${className}`}>
            <QRCodeCanvas
                value={value}
                size={size}
                level={"H"}
                includeMargin={true}
            />
            <p className="text-center text-xs text-gray-500 mt-2 font-mono break-all max-w-[200px]">
                {value}
            </p>
        </div>
    );
};
