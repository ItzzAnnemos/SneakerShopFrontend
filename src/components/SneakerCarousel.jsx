import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SneakerCarousel = () => {
    const [sneakers, setSneakers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchSneakers();
    }, []);

    const fetchSneakers = useCallback(() => {
        setLoading(true);
        fetch(`${API_URL}/api/sneakers?page=0&size=10`)
            .then((response) => response.json())
            .then((data) => {
                setSneakers(data.content || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching sneakers:", error);
                setLoading(false);
            });
    }, [API_URL]);

    // Auto-rotate carousel
    useEffect(() => {
        if (sneakers.length === 0 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sneakers.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [sneakers.length, isPaused]);

    const handlePrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + sneakers.length) % sneakers.length);
    }, [sneakers.length]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % sneakers.length);
    }, [sneakers.length]);

    const handleDotClick = useCallback((index) => {
        setCurrentIndex(index);
    }, []);

    const handleSneakerClick = useCallback((sneakerId) => {
        navigate(`/sneaker/${sneakerId}`);
    }, [navigate]);

    if (loading) {
        return (
            <div className="w-full h-[500px] md:h-[600px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl md:rounded-3xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (sneakers.length === 0) {
        return null;
    }

    const currentSneaker = sneakers[currentIndex];
    const prevIndex = (currentIndex - 1 + sneakers.length) % sneakers.length;
    const nextIndex = (currentIndex + 1) % sneakers.length;

    return (
        <div
            className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            {/* Side Sneakers (Preview) - Hidden on mobile */}
            <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-64 opacity-30 blur-sm transition-all duration-700 pointer-events-none">
                <img
                    src={sneakers[prevIndex]?.image}
                    alt={sneakers[prevIndex]?.name}
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/4 h-64 opacity-30 blur-sm transition-all duration-700 pointer-events-none">
                <img
                    src={sneakers[nextIndex]?.image}
                    alt={sneakers[nextIndex]?.name}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Main Content */}
            <div className="relative h-full flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-16 py-8 md:py-0">
                {/* Sneaker Image - Top on mobile, Left on desktop */}
                <div className="flex-1 flex items-center justify-center w-full lg:w-auto">
                    <div
                        className="relative w-full max-w-sm lg:max-w-xl cursor-pointer group"
                        onClick={() => handleSneakerClick(currentSneaker.id)}
                    >
                        <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500"></div>
                        <img
                            key={currentIndex}
                            src={currentSneaker.image}
                            alt={currentSneaker.name}
                            className="relative w-full h-auto object-contain transform transition-all duration-700 animate-[fadeInScale_0.7s_ease-out] group-hover:scale-110"
                        />
                    </div>
                </div>

                {/* Sneaker Details - Bottom on mobile, Right on desktop */}
                <div className="flex-1 text-white space-y-3 md:space-y-6 w-full lg:max-w-lg">
                    <div className="space-y-2 text-center lg:text-left">
                        <span className="inline-block px-3 md:px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm font-semibold text-white/90 border border-white/20">
                            {currentSneaker.manufacturer?.name}
                        </span>
                        <h2
                            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight animate-[fadeInUp_0.7s_ease-out] cursor-pointer hover:text-gray-300 transition-colors px-2 lg:px-0"
                            onClick={() => handleSneakerClick(currentSneaker.id)}
                        >
                            {currentSneaker.name}
                        </h2>
                    </div>

                    <div className="flex items-baseline gap-2 md:gap-4 justify-center lg:justify-start animate-[fadeInUp_0.7s_ease-out_0.1s_both]">
                        <span className="text-3xl md:text-4xl lg:text-5xl font-bold">${currentSneaker.price}</span>
                        <span className="text-gray-400 text-sm md:text-lg">USD</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-[fadeInUp_0.7s_ease-out_0.2s_both] px-2 lg:px-0">
                        <button
                            onClick={() => handleSneakerClick(currentSneaker.id)}
                            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-full font-semibold text-base md:text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                        >
                            View Details
                        </button>
                        <button className="w-full sm:w-auto px-6 py-3 md:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full font-semibold text-base md:text-lg hover:bg-white/20 transition-all duration-300">
                            Add to Cart
                        </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex gap-2 pt-2 md:pt-4 justify-center lg:justify-start">
                        {sneakers.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? 'w-8 md:w-12 bg-white'
                                        : 'w-1.5 md:w-2 bg-white/30 hover:bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={handlePrevious}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group z-10"
            >
                <ChevronLeft className="text-white group-hover:scale-110 transition-transform" size={20} />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group z-10"
            >
                <ChevronRight className="text-white group-hover:scale-110 transition-transform" size={20} />
            </button>

            {/* Auto-play indicator - Hidden on small mobile */}
            {!isPaused && (
                <div className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-600 dark:text-blue-400 text-xs md:text-sm border border-white/20">
                    Auto-playing • Hover to pause
                </div>
            )}

            <style jsx>{`
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default SneakerCarousel;