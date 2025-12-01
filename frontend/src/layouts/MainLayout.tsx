import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                    &copy; {new Date().getFullYear()} TurfBook. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
