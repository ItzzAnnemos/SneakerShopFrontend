import React from 'react';
import { useState, useEffect } from 'react';

const LoadingSpinner = () => {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation(prev => (prev + 5) % 360);
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-24 h-24">
                {/* Outer rotating circle */}
                <div
                    className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent"
                    style={{ transform: `rotate(${rotation}deg)` }}
                ></div>

                {/* Inner pulse effect */}
                <div className="absolute inset-2 rounded-full bg-blue-100 animate-pulse flex items-center justify-center">
                    {/* Sneaker silhouette */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-12 h-12 text-blue-600"
                        fill="currentColor"
                    >
                        <path d="M2,14.5c0,0,2-2.5,2-5s2-5,2-5l10,1c2,0,4,4,4,6s-6,8-6,8H2z" />
                        <path d="M22,15c0,0.55-0.45,1-1,1h-2c-0.55,0-1-0.45-1-1v-3c0-0.55,0.45-1,1-1h2c0.55,0,1,0.45,1,1V15z" />
                        <path d="M13,13.5c0,0-2-0.5-2-2s1-2,2-1.5s1,3,0,3.5z" />
                    </svg>
                </div>
            </div>

            {/* Loading text with gradient */}
            <div className="mt-6 relative">
        <span className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Loading Sneakers...
        </span>
                <div className="mt-2 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse-slow"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;