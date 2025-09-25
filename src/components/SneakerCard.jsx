import React from 'react';
import {Heart, ShoppingCart} from 'lucide-react';
import {useNavigate} from "react-router-dom";

const SneakerCard = ({sneaker}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/sneaker/${sneaker.id}`);
    };

    return (<div onClick={handleCardClick}
                 className="bg-white border border-gray-100 shadow-md rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl group relative flex flex-col h-full">
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
                src={sneaker.imageUrl}
                alt={sneaker.name}
                className="w-full h-auto object-contain transform group-hover:scale-110 transition-transform duration-300 ease-in-out"
            />
        </div>

        {/* Sneaker Details */}
        <div className="px-3 md:py-2 bg-white mt-auto">
            <span className="text-xs md:text-sm text-gray-500 font-medium">
                {sneaker.manufacturer}
            </span>

            <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
                {sneaker.name}
            </h3>

            <h3 className="text-xl md:text-2xl my-2 font-bold text-blue-600 whitespace-nowrap">
                ${sneaker.price.toFixed(2)}
            </h3>
        </div>
    </div>);
};

export default SneakerCard;