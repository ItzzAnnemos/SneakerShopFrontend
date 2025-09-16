import {useState, useEffect, useCallback} from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

const SneakerDetails = ({sneakerId}) => {
    const [sneaker, setSneaker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isDetailsOpen, setIsDetailsOpen] = useState(true);

    // Fetch sneaker details when component mounts or sneakerId changes
    useEffect(() => {
        if (sneakerId) {
            fetchSneakerDetails();
        }
    }, [sneakerId]);

    // Function to fetch sneaker details
    const fetchSneakerDetails = useCallback(() => {
        setLoading(true);
        setError(null);

        fetch(`${process.env.REACT_APP_API_URL}/api/sneakers/${sneakerId}`)
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
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-red-400 mb-4"
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
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Error</h3>
                    <p className="text-gray-600">{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Sneaker not found</h3>
                    <p className="text-gray-600">The requested sneaker could not be found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={sneaker.images?.[selectedImage] || "/placeholder.jpg"}
                            alt={sneaker.name}
                            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                    {/* Thumbnail Images */}
                    {sneaker.images && sneaker.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {sneaker.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleImageSelect(index)}
                                    className={`flex-shrink-0 aspect-square w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                        selectedImage === index
                                            ? "border-blue-600 shadow-lg"
                                            : "border-gray-200 hover:border-gray-300"
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
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="my-10">
                        <h1 className="text-3xl font-bold text-white mb-2">{sneaker.name}</h1>
                        <p className="text-2xl text-blue-200 mb-4">{sneaker.manufacturer?.name}</p>
                        <div
                            className="text-4xl font-bold text-blue-500"
                        >${sneaker.price}</div>
                    </div>

                    {sneaker.sizes && sneaker.sizes.length > 0 && (
                        <div>
                            <span className="text-white block mb-2">Available Sizes</span>
                            <div className="flex flex-wrap gap-2">
                                {sneaker.sizes.map((size, index) => (
                                    <span
                                        key={index}
                                        className="inline-block px-3 py-1 bg-white border border-gray-200 text-blue-500 rounded-md text-sm font-medium"
                                    >
                                                {typeof size === 'object' ? size.size || size.id : size}
                                            </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            className="w-50 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 transform hover:shadow-lg">
                            Add to Cart
                        </button>
                        <button
                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-white hover:bg-gray-50 hover:text-blue-500 transition-colors duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
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

                    {/* Specifications */}
                    <div className="space-y-4 my-10">
                        <div
                            onClick={toggleDetails}
                            className="inline-flex gap-2 items-center cursor-pointer group"
                        >
                            <h3 className="text-lg font-medium text-white">Details</h3>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 text-white transition-transform duration-300 group-hover:text-blue-500 ${
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
                        </div>
                        <div
                            className={`bg-gray-50 rounded-lg transition-all duration-500 ease-in-out overflow-hidden ${
                                isDetailsOpen
                                    ? 'opacity-100 p-4 space-y-3'
                                    : 'max-h-0 opacity-0 p-0'
                            }`}>
                            <div className={`transition-all duration-300 flex flex-col gap-2 ${
                                isDetailsOpen ? 'transform translate-y-0' : 'transform -translate-y-4'
                            }`}>
                                {sneaker.manufacturer && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Brand</span>
                                        <span
                                            className="font-medium text-blue-500">{sneaker.manufacturer?.name}</span>
                                    </div>
                                )}
                                {sneaker.purpose && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Purpose</span>
                                        <span className="font-medium text-blue-500">{sneaker.purpose}</span>
                                    </div>
                                )}
                                {sneaker.color && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Color</span>
                                        <span className="font-medium text-blue-500">{sneaker.color}</span>
                                    </div>
                                )}
                                {sneaker.gender && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Gender</span>
                                        <span className="font-medium text-blue-500">{sneaker.gender}</span>
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