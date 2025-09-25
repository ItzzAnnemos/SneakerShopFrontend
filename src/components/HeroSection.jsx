import React from 'react'

const HeroSection = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row p-6 md:p-8 md:items-center">
                    <div className="md:w-1/2 text-white space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold">Latest Sneaker Collection</h1>
                        <p className="text-indigo-100">Find your perfect pair from our extensive catalog of premium
                            sneakers.</p>
                    </div>
                    <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-white rounded-full opacity-20 blur-xl"></div>
                            <img
                                src="https://www.pngplay.com/wp-content/uploads/9/Air-Jordan-PNG-Background.png"
                                alt="Featured Sneakers"
                                className="relative transform rotate-12 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;