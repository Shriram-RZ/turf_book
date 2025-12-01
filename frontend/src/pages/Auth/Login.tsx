import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/useAuthStore';
import { AuthService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await AuthService.login(email, password);

            console.log('Login response:', response.data);

            // Backend returns { token, id, name, email, role }
            // Store the entire response including the token
            const userData = {
                ...response.data,
                token: response.data.token || response.data.accessToken // Handle both possible field names
            };

            console.log('User data to store:', userData);
            login(userData);

            // Redirect based on role
            const role = response.data.role;
            console.log('Role from backend:', role);

            if (role === 'ADMIN') {
                console.log('Redirecting to /admin');
                navigate('/admin');
            } else if (role === 'OWNER') {
                console.log('Redirecting to /owner');
                navigate('/owner');
            } else {
                console.log('Redirecting to /dashboard');
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>

            {error && (
                <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded-lg mb-6 flex items-center text-sm">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                    <Input
                        type="email"
                        placeholder="Email Address"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                    <Input
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-sm text-emerald-500 hover:text-emerald-400">
                        Forgot Password?
                    </Link>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Sign In
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-emerald-500 hover:text-emerald-400 font-medium">
                    Create Account
                </Link>
            </div>
        </div>
    );
};

export default Login;
