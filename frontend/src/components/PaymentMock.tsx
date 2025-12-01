import React, { useState } from 'react';
import { CreditCard, Smartphone, CheckCircle, Loader } from 'lucide-react';

interface PaymentMockProps {
    amount: number;
    onSuccess: (paymentId: string) => void;
    onCancel: () => void;
}

const PaymentMock: React.FC<PaymentMockProps> = ({ amount, onSuccess, onCancel }) => {
    const [method, setMethod] = useState<'card' | 'upi'>('card');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePay = () => {
        setProcessing(true);
        // Simulate network delay
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setTimeout(() => {
                onSuccess(`PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
            }, 1500);
        }, 2000);
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">Payment Successful!</h3>
                <p className="text-gray-500 mt-2">Redirecting you back...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full mx-auto border border-gray-100">
            <div className="bg-gray-900 p-6 text-white">
                <h3 className="text-xl font-bold">Secure Payment</h3>
                <p className="text-gray-400 text-sm mt-1">Complete your transaction</p>
                <div className="mt-4 text-3xl font-bold">₹{amount.toFixed(2)}</div>
            </div>

            <div className="p-6">
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setMethod('card')}
                        className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${method === 'card'
                                ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                    >
                        <CreditCard size={20} /> Card
                    </button>
                    <button
                        onClick={() => setMethod('upi')}
                        className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${method === 'upi'
                                ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                    >
                        <Smartphone size={20} /> UPI
                    </button>
                </div>

                {method === 'card' ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">Card Number</label>
                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">Expiry</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">CVC</label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">Cardholder Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">UPI ID</label>
                            <input
                                type="text"
                                placeholder="username@bank"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="text-center text-sm text-gray-500 my-2">OR</div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                            <div className="w-32 h-32 bg-gray-200 mb-2 rounded"></div>
                            <span className="text-xs">Scan QR to Pay</span>
                        </div>
                    </div>
                )}

                <div className="mt-8 space-y-3">
                    <button
                        onClick={handlePay}
                        disabled={processing}
                        className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <Loader className="animate-spin" size={20} /> Processing...
                            </>
                        ) : (
                            `Pay ₹${amount.toFixed(2)}`
                        )}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={processing}
                        className="w-full text-gray-500 hover:text-gray-800 py-2 font-medium transition-colors"
                    >
                        Cancel Transaction
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentMock;
