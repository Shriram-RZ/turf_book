import { useEffect, useState } from 'react';
import { useAuthStore } from '../../context/useAuthStore';
import { Button } from '../../components/ui/Button';

const AuthDebug = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [localStorageData, setLocalStorageData] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setLocalStorageData(JSON.parse(userStr));
            } catch (e) {
                setLocalStorageData({ error: 'Failed to parse', raw: userStr });
            }
        }
    }, [user]);

    const testAPI = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/owner/turfs', {
                headers: {
                    'Authorization': `Bearer ${localStorageData?.token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('API Response Status:', response.status);
            const data = await response.json();
            console.log('API Response Data:', data);
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>

            <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="font-bold mb-2">Auth Store State:</h2>
                    <pre className="text-xs bg-gray-900 p-2 rounded overflow-auto">
                        {JSON.stringify({ user, isAuthenticated }, null, 2)}
                    </pre>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="font-bold mb-2">LocalStorage 'user' Data:</h2>
                    <pre className="text-xs bg-gray-900 p-2 rounded overflow-auto">
                        {JSON.stringify(localStorageData, null, 2)}
                    </pre>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="font-bold mb-2">Token Check:</h2>
                    <p className="text-sm">
                        Has Token: {localStorageData?.token ? '✅ Yes' : '❌ No'}
                    </p>
                    {localStorageData?.token && (
                        <p className="text-xs mt-2 break-all">
                            Token: {localStorageData.token.substring(0, 50)}...
                        </p>
                    )}
                </div>

                <Button onClick={testAPI}>Test API Call</Button>
            </div>
        </div>
    );
};

export default AuthDebug;
