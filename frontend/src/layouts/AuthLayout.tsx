import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="mb-8 text-center">
                <Link to="/" className="text-4xl font-extrabold text-emerald-500 tracking-tight">
                    TurfBook
                </Link>
                <p className="text-gray-400 mt-2">Book your game, own the turf.</p>
            </div>
            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
