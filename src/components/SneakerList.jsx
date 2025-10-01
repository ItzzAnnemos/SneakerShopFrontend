import {useState, useEffect, useCallback} from "react";
import SneakerCard from "./SneakerCard.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import Filter from "./Filter.jsx";

const SneakerList = () => {
    const [sneakers, setSneakers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [pendingFilters, setPendingFilters] = useState({});
    const [pendingSearchQuery, setPendingSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true
    });
    const API_URL = import.meta.env.VITE_API_URL;

    const buildQueryParams = useCallback((filters = {}, search = "", page = 0, size = 20) => {
        const params = new URLSearchParams();

        params.append('page', page.toString());
        params.append('size', size.toString());

        if (search) {
            params.append('name', search);
        }

        if (filters.manufacturer && Array.isArray(filters.manufacturer) && filters.manufacturer.length > 0) {
            params.append('manufacturerIds', filters.manufacturer.join(','));
        }

        if (filters.genders && Array.isArray(filters.genders) && filters.genders.length > 0) {
            params.append('genders', filters.genders.toString().toUpperCase());
        }

        if (filters.purposes && Array.isArray(filters.purposes) && filters.purposes.length > 0) {
            params.append('purposes', filters.purposes.toString().toUpperCase());
        }

        if (filters.colors && Array.isArray(filters.colors) && filters.colors.length > 0) {
            params.append('colors', filters.colors.toString().toUpperCase());
        }

        if (filters.sizes && Array.isArray(filters.sizes) && filters.sizes.length > 0) {
            filters.sizes.forEach(size => {
                params.append('sizes', size);
            });
        }

        if (filters.price) {
            if (filters.price.minPrice !== undefined && filters.price.minPrice !== null) {
                params.append('minPrice', filters.price.minPrice.toString());
            }
            if (filters.price.maxPrice !== undefined && filters.price.maxPrice !== null) {
                params.append('maxPrice', filters.price.maxPrice.toString());
            }
        }

        return params.toString();
    }, []);

    const fetchSneakers = useCallback((filters = {}, search = "", page = 0) => {
        setLoading(true);
        setError(null);

        const queryString = buildQueryParams(filters, search, page, pagination.size);

        fetch(`${API_URL}/api/sneakers?${queryString}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setSneakers(data.content || []);
                setPagination({
                    page: data.number || 0,
                    size: data.size || 20,
                    totalElements: data.totalElements || 0,
                    totalPages: data.totalPages || 0,
                    first: data.first !== undefined ? data.first : true,
                    last: data.last !== undefined ? data.last : true
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching sneakers:", error);
                setError("Failed to load sneakers. Please try again later.");
                setLoading(false);
            });
    }, [API_URL, buildQueryParams, pagination.size]);

    useEffect(() => {
        fetchSneakers();
    }, []);

    const applyFilters = useCallback(() => {
        setActiveFilters(pendingFilters);
        setSearchQuery(pendingSearchQuery);
        fetchSneakers(pendingFilters, pendingSearchQuery, 0);
        setIsSidebarOpen(false);
    }, [fetchSneakers, pendingFilters, pendingSearchQuery]);

    const resetFilters = useCallback(() => {
        setActiveFilters({});
        setSearchQuery("");
        setPendingFilters({});
        setPendingSearchQuery("");
        fetchSneakers({}, "", 0);
    }, [fetchSneakers]);

    const handlePendingFilterChange = useCallback((newFilters) => {
        setPendingFilters(newFilters);
    }, []);

    const handlePendingSearchChange = useCallback((query) => {
        setPendingSearchQuery(query);
    }, []);

    const handlePageChange = useCallback((newPage) => {
        fetchSneakers(activeFilters, searchQuery, newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [fetchSneakers, activeFilters, searchQuery]);

    if (loading && sneakers.length === 0) {
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
                        className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                        onClick={fetchSneakers}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="flex items-center gap-2 text-gray-900 dark:text-white font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex">
                {/* Left Sidebar - Filters */}
                <aside className={`
                    fixed lg:sticky top-0 left-0 h-screen overflow-y-auto
                    w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
                    z-50 lg:z-0 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <Filter
                        onPendingFilterChange={handlePendingFilterChange}
                        onPendingSearchChange={handlePendingSearchChange}
                        activeFilters={activeFilters}
                        pendingFilters={pendingFilters}
                        searchQuery={searchQuery}
                        pendingSearchQuery={pendingSearchQuery}
                        onApplyFilters={applyFilters}
                        onResetFilters={resetFilters}
                        isLoading={loading}
                    />
                </aside>

                {/* Right Content Area - Products */}
                <main className="flex-1 p-4 lg:p-8">
                    {/* Header with results count */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                All Sneakers
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {pagination.totalElements} {pagination.totalElements === 1 ? 'Result' : 'Results'}
                            </p>
                        </div>
                        {loading && (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-gray-100"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Updating...</span>
                            </div>
                        )}
                    </div>

                    {/* Products Grid */}
                    {sneakers.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {sneakers.map((sneaker) => (
                                    <div
                                        key={sneaker.id}
                                        className="transform transition-all duration-300"
                                    >
                                        <SneakerCard
                                            sneaker={{
                                                id: sneaker.id,
                                                name: sneaker.name,
                                                manufacturer: sneaker.manufacturer.name,
                                                price: sneaker.price,
                                                imageUrl: sneaker.image
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center items-center mt-12 gap-2">
                                    <button
                                        className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed font-medium text-sm"
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.first || loading}
                                    >
                                        Previous
                                    </button>

                                    <div className="flex gap-2">
                                        {Array.from({length: Math.min(5, pagination.totalPages)}, (_, i) => {
                                            let pageNum;
                                            if (pagination.totalPages <= 5) {
                                                pageNum = i;
                                            } else if (pagination.page < 3) {
                                                pageNum = i;
                                            } else if (pagination.page >= pagination.totalPages - 2) {
                                                pageNum = pagination.totalPages - 5 + i;
                                            } else {
                                                pageNum = pagination.page - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`w-10 h-10 rounded-full transition-colors font-medium text-sm ${
                                                        pageNum === pagination.page
                                                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                                                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                    }`}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    disabled={loading}
                                                >
                                                    {pageNum + 1}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed font-medium text-sm"
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.last || loading}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-12 text-center">
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
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No sneakers found</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or search</p>
                            <button
                                className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                                onClick={resetFilters}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SneakerList;