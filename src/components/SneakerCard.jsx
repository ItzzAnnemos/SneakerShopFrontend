import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

const SneakerCard = ({ sneaker }) => {
    return (
        <div className="bg-white border border-gray-100 shadow-md rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl group relative flex flex-col h-full">
            {/* Wishlist Icon */}
            <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <button className="bg-white/60 backdrop-blur-sm rounded-full p-2 hover:bg-white/80 transition-colors">
                    <Heart
                        className="text-gray-500 group-hover:text-red-500 transition-colors"
                        size={20}
                        strokeWidth={1.5}
                    />
                </button>
            </div>

            {/* Sneaker Image */}
            <div className="w-full flex-grow flex items-end justify-center">
                <img
                    src={sneaker.imageUrl || "/api/placeholder/400/400"}
                    alt={sneaker.name}
                    className="w-full h-auto object-contain transform group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
            </div>

            {/* Sneaker Details */}
            <div className="p-5 bg-white mt-auto">
                <div className="flex flex-col-reverse md:flex-row justify-between items-center">
                    <div className="gap-1">
                        <h3 className="text-l font-bold text-gray-900 mb-1 leading-tight">
                            {sneaker.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {sneaker.manufacturer}
                        </p>
                    </div>
                    <span className="text-2xl font-bold text-blue-700">
                        ${sneaker.price.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SneakerCard;