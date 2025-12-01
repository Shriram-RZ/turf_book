import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const setRole = (role: string) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        console.log("Submitting form:", formData);

        try {
            await AuthService.register(
                formData.name,
                formData.email,
                formData.password,
                formData.phone,
                formData.role
            );

            // Registration successful, redirect to login
            navigate('/login');
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(JSON.stringify(err.message || err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Create Account</h2>
            <p className="text-gray-400 text-center mb-6 text-sm">Join the community and start booking</p>

            {error && (
                <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded-lg mb-6 flex items-center text-sm">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            <div className="flex bg-gray-900 p-1 rounded-lg mb-6 border border-gray-700">
                {['USER', 'OWNER'].map((role) => (
                    <button
                        key={role}
                        type="button"
                        onClick={() => setRole(role)}
                        className={clsx(
                            "flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2",
                            formData.role === role
                                ? "bg-emerald-600 text-white shadow-lg"
                                : "text-gray-400 hover:text-white"
                        )}
                    >
                        {role === 'USER' ? 'Player' : 'Turf Owner'}
                        {formData.role === role && <CheckCircle size={14} />}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-500" size={18} />
                    <Input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        className="pl-10"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                    <Input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
                    <Input
                        name="phone"
                        type="tel"
                        placeholder="Phone Number"
                        className="pl-10"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
                    Sign In
                </Link>
            </div>
        </div>
    );
};

export default Register;
