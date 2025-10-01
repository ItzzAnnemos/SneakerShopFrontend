import React from 'react';

const HeroSection = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="flex flex-col md:flex-row p-8 md:p-12 lg:p-16 md:items-center gap-8">
                        <div className="md:w-1/2 space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                                Step Into Style
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                Discover our curated collection of premium sneakers. From classic designs to limited editions, find the perfect pair for your lifestyle.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <button className="px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    Shop Collection
                                </button>
                                <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                    New Arrivals
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white">500+</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Styles</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white">50+</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Brands</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/2 flex justify-center">
                            <div className="relative w-full max-w-lg">
                                <div className="absolute -inset-4 bg-blue-500 dark:bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                                <img
                                    src="https://www.pngplay.com/wp-content/uploads/9/Air-Jordan-PNG-Background.png"
                                    alt="Featured Sneakers"
                                    className="relative transform rotate-12 hover:rotate-0 transition-transform duration-700 ease-out max-w-md w-full drop-shadow-2xl"
                                />

                                <div className="absolute top-4 right-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    NEW
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;