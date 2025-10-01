import {useState, useEffect, useCallback} from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

const SneakerDetails = ({sneakerId}) => {
    const [sneaker, setSneaker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isDetailsOpen, setIsDetailsOpen] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (sneakerId) {
            fetchSneakerDetails();
        }
    }, [sneakerId]);

    const fetchSneakerDetails = useCallback(() => {
        setLoading(true);
        setError(null);

        fetch(`${API_URL}/api/sneakers/${sneakerId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setSneaker(data);
                setSelectedImage(0);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching sneaker details:", error);
                setError("Failed to load sneaker details. Please try again later.");
                setLoading(false);
            });
    }, [sneakerId]);

    const handleImageSelect = useCallback((index) => {
        setSelectedImage(index);
    }, []);

    const toggleDetails = useCallback(() => {
        setIsDetailsOpen(!isDetailsOpen);
    }, [isDetailsOpen]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
                <LoadingSpinner/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-red-500 dark:text-red-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                    <button
                        className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
                        onClick={fetchSneakerDetails}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (!sneaker) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-12 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sneaker not found</h3>
                    <p className="text-gray-600 dark:text-gray-400">The requested sneaker could not be found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Image Gallery */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                        <img
                            src={sneaker.images?.[selectedImage]}
                            alt={sneaker.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Thumbnail Images */}
                    {sneaker.images && sneaker.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {sneaker.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleImageSelect(index)}
                                    className={`flex-shrink-0 aspect-square w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                        selectedImage === index
                                            ? "border-gray-900 dark:border-gray-300 shadow-md"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${sneaker.name} view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="space-y-6 lg:pt-8">
                    {/* Basic Info */}
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">{sneaker.name}</h1>
                        <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 mb-6">{sneaker.manufacturer?.name}</p>
                        <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            ${sneaker.price}
                        </div>
                    </div>

                    {/* Available Sizes */}
                    {sneaker.sizes && sneaker.sizes.length > 0 && (
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                Select Size
                            </h3>
                            <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
                                {sneaker.sizes.map((size, index) => (
                                    <button
                                        key={index}
                                        className="px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:border-gray-900 dark:hover:border-gray-300 transition-colors"
                                    >
                                        {typeof size === 'object' ? size.size || size.id : size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button className="flex-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-4 px-8 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                            Add to Cart
                        </button>
                        <button className="px-6 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-full font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Product Details Accordion */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
                        <button
                            onClick={toggleDetails}
                            className="w-full flex justify-between items-center group"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Details</h3>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-6 w-6 text-blue-600 dark:text-blue-400 transition-transform duration-300 ${
                                    isDetailsOpen ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                isDetailsOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="space-y-3">
                                {sneaker.manufacturer && (
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600 dark:text-gray-400">Brand</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {sneaker.manufacturer?.name}
                                        </span>
                                    </div>
                                )}
                                {sneaker.purpose && (
                                    <div className="flex justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                                        <span className="text-gray-600 dark:text-gray-400">Purpose</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {sneaker.purpose}
                                        </span>
                                    </div>
                                )}
                                {sneaker.color && (
                                    <div className="flex justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                                        <span className="text-gray-600 dark:text-gray-400">Color</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {sneaker.color}
                                        </span>
                                    </div>
                                )}
                                {sneaker.gender && (
                                    <div className="flex justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                                        <span className="text-gray-600 dark:text-gray-400">Gender</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {sneaker.gender}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SneakerDetails;