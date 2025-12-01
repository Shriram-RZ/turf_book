import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const Home = () => {
    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative h-[500px] rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Turf Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                        Book Your Game,<br />
                        <span className="text-emerald-500">Own The Turf.</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl">
                        Discover and book the best sports venues in your city. Instant confirmation, split payments, and seamless experiences.
                    </p>

                    <div className="bg-white p-2 rounded-xl shadow-xl max-w-2xl flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center px-4 bg-gray-100 rounded-lg h-12">
                            <MapPin className="text-gray-500 mr-2" size={20} />
                            <input
                                type="text"
                                placeholder="Location"
                                className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-500"
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4 bg-gray-100 rounded-lg h-12">
                            <Calendar className="text-gray-500 mr-2" size={20} />
                            <input
                                type="date"
                                className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-500"
                            />
                        </div>
                        <Link to="/turfs">
                            <Button size="lg" className="h-12 px-8">
                                Search
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section>
                <h2 className="text-3xl font-bold text-white mb-8">Browse by Sport</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Football', 'Cricket', 'Badminton', 'Basketball'].map((sport) => (
                        <div key={sport} className="group relative h-40 rounded-xl overflow-hidden cursor-pointer">
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
                            <img
                                src={`https://source.unsplash.com/featured/?${sport.toLowerCase()}`}
                                alt={sport}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 z-20 flex items-center justify-center">
                                <h3 className="text-2xl font-bold text-white">{sport}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-emerald-900/30 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-900/50">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-4">Are you a Turf Owner?</h2>
                    <p className="text-gray-400 text-lg mb-6 max-w-xl">
                        List your venue on TurfBook and reach thousands of players. Manage bookings, track revenue, and grow your business.
                    </p>
                    <Link to="/register">
                        <Button variant="secondary" size="lg">
                            List Your Turf <ArrowRight className="ml-2" size={20} />
                        </Button>
                    </Link>
                </div>
                <div className="w-full md:w-1/3">
                    {/* Placeholder for an illustration or image */}
                    <div className="aspect-video bg-emerald-800/20 rounded-xl flex items-center justify-center border border-emerald-700/30">
                        <span className="text-emerald-500/50 font-bold text-xl">Partner Dashboard UI</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
