import React from 'react';
import {Heart} from 'lucide-react';
import {useNavigate} from "react-router-dom";

const SneakerCard = ({sneaker}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/sneaker/${sneaker.id}`);
    };

    return (
        <div onClick={handleCardClick}
             className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl group relative flex flex-col h-full cursor-pointer">
            {/* Wishlist Icon */}
            <div className="absolute top-3 right-3 z-10">
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-700 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm">
                    <Heart
                        className="text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        size={18}
                        strokeWidth={2}
                    />
                </button>
            </div>

            {/* Sneaker Image */}
            <div className="w-full aspect-square bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                <img
                    src={sneaker.imageUrl}
                    alt={sneaker.name}
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
            </div>

            {/* Sneaker Details */}
            <div className="p-4 bg-white dark:bg-gray-800 mt-auto space-y-1">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    {sneaker.manufacturer}
                </span>

                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">
                    {sneaker.name}
                </h3>

                <div className="pt-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${sneaker.price.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SneakerCard;