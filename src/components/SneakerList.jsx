import { useState, useEffect, useCallback } from "react";
import SneakerCard from "./SneakerCard.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import Filter from "./Filter.jsx";

const SneakerList = () => {
    const [sneakers, setSneakers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    // Initial data fetch when component mounts
    useEffect(() => {
        fetchSneakers();
    }, []);

    // Function to fetch all sneakers
    const fetchSneakers = useCallback(() => {
        setLoading(true);
        setError(null);

        fetch("http://localhost:8080/api/sneakers")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setSneakers(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching sneakers:", error);
                setError("Failed to load sneakers. Please try again later.");
                setLoading(false);
            });
    }, []);

    // Function to reset filters
    const resetFilters = useCallback(() => {
        setActiveFilters({});
        setSearchQuery("");
        fetchSneakers();
    }, [fetchSneakers]);

    // Handle filter changes
    const handleFilterChange = useCallback((newFilters) => {
        setActiveFilters(newFilters);
    }, []);

    // Handle search input changes
    const handleSearchChange = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    // Handle filtered results from Filter component
    const handleFilterResults = useCallback((filteredSneakers) => {
        setSneakers(filteredSneakers);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
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
                        onClick={fetchSneakers}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search and Filter Bar */}
            <Filter
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
                onFilterResults={handleFilterResults}
                initialFilters={activeFilters}
                initialSearchQuery={searchQuery}
            />

            {/* Results count */}
            <div className="mb-6">
                <p className="text-gray-600">
                    Showing <span className="font-medium">{sneakers.length}</span> sneakers
                </p>
            </div>

            {/* Grid Layout */}
            {sneakers.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                    {sneakers.map((sneaker) => (
                        <div
                            key={sneaker.id}
                            className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            <SneakerCard
                                sneaker={{
                                    id: sneaker.id,
                                    name: sneaker.name,
                                    manufacturer: sneaker.manufacturer.name,
                                    price: sneaker.price,
                                    imageUrl: sneaker.images?.[0] || "/placeholder.jpg"
                                }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
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
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No sneakers found</h3>
                    <p className="text-gray-600">Try changing your search or filter criteria</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={resetFilters}
                    >
                        Reset filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default SneakerList;