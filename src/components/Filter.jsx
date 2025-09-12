import {useEffect, useState, useCallback} from "react";

const Filter = ({
                    onFilterChange,
                    onSearchChange,
                    onFilterResults,
                    initialFilters = {},
                    initialSearchQuery = ""
                }) => {
    // States for all filter options
    const [manufacturersList, setManufacturers] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [purposes, setPurposes] = useState([]);
    const [genders, setGenders] = useState([]);
    const [expandedSection, setExpandedSection] = useState(null);
    const [activeFilters, setActiveFilters] = useState(initialFilters);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileFiltersVisible, setIsMobileFiltersVisible] = useState(false);
    const [filtersLoading, setFiltersLoading] = useState({
        manufacturers: true,
        sizes: true,
        colors: true,
        purposes: true,
        genders: true
    });

    // Price ranges for e-commerce convention
    const priceRanges = [
        {min: 0, max: 50, label: "Under $50"},
        {min: 50, max: 100, label: "$50 - $100"},
        {min: 100, max: 150, label: "$100 - $150"},
        {min: 150, max: 200, label: "$150 - $200"},
        {min: 200, max: null, label: "$200+"}
    ];

    // Fetch all filter options from backend
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const endpoints = [
                    "manufacturers",
                    "sizes",
                    "colors",
                    "purposes",
                    "genders"
                ];

                // Set all to loading
                setFiltersLoading({
                    manufacturers: true,
                    sizes: true,
                    colors: true,
                    purposes: true,
                    genders: true
                });

                // Fetch each endpoint independently to handle individual failures
                const fetchEndpoint = async (endpoint, index) => {
                    try {
                        const response = await fetch(`http://localhost:8080/api/${endpoint}`);
                        const data = await response.json();

                        // Update loading state for this endpoint
                        setFiltersLoading(prev => ({
                            ...prev,
                            [endpoint]: false
                        }));

                        // Return data for this endpoint
                        return data;
                    } catch (error) {
                        console.error(`Error fetching ${endpoint}:`, error);

                        // Update loading state even on error
                        setFiltersLoading(prev => ({
                            ...prev,
                            [endpoint]: false
                        }));

                        return [];
                    }
                };

                // Fetch each endpoint
                const manufacturersData = await fetchEndpoint("manufacturers");
                const sizesData = await fetchEndpoint("sizes");
                const colorsData = await fetchEndpoint("colors");
                const purposesData = await fetchEndpoint("purposes");
                const gendersData = await fetchEndpoint("genders");

                // Set state with fetched data
                setManufacturers(manufacturersData);
                setSizes(sizesData);
                setColors(colorsData);
                setPurposes(purposesData);
                setGenders(gendersData);

                // Log the data for debugging
                console.log("Manufacturers:", manufacturersData);
                console.log("Sizes:", sizesData);
                console.log("Colors:", colorsData);
                console.log("Purposes:", purposesData);
                console.log("Genders:", gendersData);

            } catch (error) {
                console.error("Error fetching filter options:", error);

                // Reset all loading states on error
                setFiltersLoading({
                    manufacturers: false,
                    sizes: false,
                    colors: false,
                    purposes: false,
                    genders: false
                });
            }
        };

        fetchFilterOptions();
    }, []);

    // Apply filters
    const applyFilters = useCallback(() => {
        // Only send request if we have active filters or search query
        setIsLoading(true);

        if (Object.keys(activeFilters).length > 0 || searchQuery) {
            const filterData = {...activeFilters};

            // Add search query if present
            if (searchQuery) {
                filterData.search = searchQuery;
            }

            console.log("Sending filter data to backend:", filterData); // Add this for debugging

            // Send POST request to filter endpoint
            fetch("http://localhost:8080/api/sneakers/filter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filterData),
            })
                .then((response) => response.json())
                .then((data) => {
                    // Send filtered results to parent component
                    onFilterResults(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error filtering sneakers:", error);
                    setIsLoading(false);
                });
        } else {
            // No filters, fetch all sneakers
            fetch("http://localhost:8080/api/sneakers")
                .then((response) => response.json())
                .then((data) => {
                    onFilterResults(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching all sneakers:", error);
                    setIsLoading(false);
                });
        }
    }, [activeFilters, searchQuery, onFilterResults]);

    // Apply filters whenever activeFilters or searchQuery changes, with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            applyFilters();
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [activeFilters, searchQuery, applyFilters]);

    // Safely process manufacturers data
    const manufacturers = Array.isArray(manufacturersList) && manufacturersList.length > 0
        ? ["All", ...new Set(manufacturersList.map(m => m.name || m))]
        : ["All"];

    // Toggle section expansion
    const toggleSection = (section) => {
        if (expandedSection === section) {
            setExpandedSection(null);
        } else {
            setExpandedSection(section);
        }
    };

    useEffect(() => {
        if (!isMobileFiltersVisible) {
            setExpandedSection(null);
        }
    }, [isMobileFiltersVisible]);

    // Handle filter selection
    const handleFilterSelect = (type, value) => {
        const newFilters = {...activeFilters};

        if (type === "manufacturer" && value === "All") {
            delete newFilters.manufacturer;
        } else if (type === "manufacturer") {
            newFilters.manufacturer = value;
        } else if (type === "price") {
            newFilters.price = value;
        } else {
            // For multi-select filters (size, color, purpose, gender)
            // Make sure we're using the actual value, not an object
            const actualValue = typeof value === 'object' ? value.value || value.id || value : value;

            if (!newFilters[type]) {
                newFilters[type] = [actualValue];
            } else if (newFilters[type].includes(actualValue)) {
                newFilters[type] = newFilters[type].filter(item => item !== actualValue);
                if (newFilters[type].length === 0) {
                    delete newFilters[type];
                }
            } else {
                newFilters[type] = [...newFilters[type], actualValue];
            }
        }

        console.log("New filters:", newFilters); // Add this for debugging
        setActiveFilters(newFilters);
        onFilterChange(newFilters);
    };

    // Handle search input changes
    const handleSearchInputChange = (value) => {
        setSearchQuery(value);
        onSearchChange(value);
    };

    // Check if a filter value is selected
    const isFilterSelected = (type, value) => {
        // Ensure we're using the correct value for comparison
        const actualValue = typeof value === 'object' ? value.value || value.id || value : value;

        if (type === "manufacturer") {
            return activeFilters.manufacturer === actualValue || (actualValue === "All" && !activeFilters.manufacturer);
        } else if (type === "price") {
            return activeFilters.price &&
                activeFilters.price.min === value.min &&
                activeFilters.price.max === value.max;
        } else {
            return activeFilters[type] && activeFilters[type].includes(actualValue);
        }
    };

    // Helper function to safely get value and label from filter item
    const getFilterItemProps = (item, valueKey = 'value', labelKey = 'label') => {
        if (typeof item === 'string' || typeof item === 'number') {
            return {value: item, label: item};
        } else if (item && typeof item === 'object') {
            const value = item[valueKey] !== undefined ? item[valueKey] : item.id || item.name || '';
            const label = item[labelKey] !== undefined ? item[labelKey] : item.name || item.id || value;
            return {value, label};
        }
        return {value: '', label: ''};
    };

    // Render the filter section content
    const renderFilterContent = (type, items, valueKey, labelKey) => {
        if (filtersLoading[type]) {
            return (
                <div className="mt-3 text-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-sm text-gray-500">Loading...</span>
                </div>
            );
        }

        if (!Array.isArray(items) || items.length === 0) {
            return (
                <div className="mt-3 text-sm text-gray-500">
                    No options available
                </div>
            );
        }

        return (
            <div className="mt-3 flex flex-wrap gap-2" id={`${type}-options`}>
                {items.map((item) => {
                    const {value, label} = getFilterItemProps(item, valueKey, labelKey);
                    if (!value) return null;

                    // Ensure we're using the correct value for comparison
                    const actualValue = typeof value === 'object' ? value.value || value.id || value : value;

                    return (
                        <button
                            key={actualValue}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                isFilterSelected(type, actualValue)
                                    ? "bg-white text-blue-500"
                                    : "bg-blue-500 text-gray-100 hover:bg-gray-300"
                            }`}
                            onClick={() => handleFilterSelect(type, actualValue)}
                            aria-pressed={isFilterSelected(type, actualValue)}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-col mb-8">
                {/* Search bar */}
                <div className="relative w-full mb-6">
                    <input
                        type="text"
                        placeholder="Search sneakers..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all duration-200 hover:shadow-md"
                        value={searchQuery}
                        onChange={(e) => handleSearchInputChange(e.target.value)}
                        aria-label="Search sneakers"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                {/* Loading indicator */}
                {isLoading && (
                    <div className="text-center mb-4">
                        <div
                            className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-sm text-gray-500">Updating results...</span>
                    </div>
                )}

                {/* Mobile filter button - only visible on mobile */}
                <div className="md:hidden mb-4">
                    <button
                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-700"
                        onClick={() => setIsMobileFiltersVisible(!isMobileFiltersVisible)}
                        aria-expanded={isMobileFiltersVisible}
                        aria-controls="mobile-filters"
                    >
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
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                        {/* ... button content ... */}
                        {isMobileFiltersVisible ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>

                {/* Filters container - Fixed to show on mobile when mobile-filters is toggled */}
                <div
                    id="mobile-filters"
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mobile-filters-transition
                    ${isMobileFiltersVisible ?
                        "mobile-filters-enter-active" :
                        "mobile-filters-enter"
                    }
                    md:!max-h-[none] md:!opacity-100 /* Force reset on desktop */`}

                    style={{
                        transitionProperty: 'max-height, opacity',
                        overflow: 'hidden'
                    }}
                >
                    {/* Manufacturer filter */}
                    <div
                        className="border rounded-lg shadow-sm p-4 bg-transparent transition-all duration-300 hover:shadow-md">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection("manufacturers")}
                            aria-expanded={expandedSection === "manufacturers"}
                            aria-controls="manufacturer-options"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    toggleSection("manufacturers");
                                    e.preventDefault();
                                }
                            }}
                        >
                            <h3 className="font-medium text-white-100">Manufacturer</h3>
                            <span className="text-blue-600 text-lg transition-transform duration-300 transform"
                                  style={{transform: expandedSection === "manufacturers" ? 'rotate(180deg)' : 'rotate(0deg)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </span>
                        </div>

                        <div
                            className="overflow-hidden transition-all duration-500 ease-linear"
                            style={{
                                maxHeight: expandedSection === "manufacturers" ? '500px' : '0',
                                opacity: expandedSection === "manufacturers" ? 1 : 0
                            }}
                        >
                            {expandedSection === "manufacturers" && renderFilterContent("manufacturers", manufacturers)}
                        </div>
                    </div>

                    {/* Size filter */}
                    <div
                        className="border rounded-lg shadow-sm p-4 bg-transparent transition-all duration-300 hover:shadow-md">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection("sizes")}
                            aria-expanded={expandedSection === "sizes"}
                            aria-controls="size-options"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    toggleSection("sizes");
                                    e.preventDefault();
                                }
                            }}
                        >
                            <h3 className="font-medium text-white-100">Size</h3>
                            <span className="text-blue-600 text-lg transition-transform duration-300 transform"
                                  style={{transform: expandedSection === "sizes" ? 'rotate(180deg)' : 'rotate(0deg)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </span>
                        </div>

                        <div
                            className="overflow-hidden transition-all duration-500 ease-linear"
                            style={{
                                maxHeight: expandedSection === "sizes" ? '500px' : '0',
                                opacity: expandedSection === "sizes" ? 1 : 0
                            }}
                        >
                            {expandedSection === "sizes" && renderFilterContent("sizes", sizes, "value", "label")}
                        </div>
                    </div>

                    {/* Color filter */}
                    <div
                        className="border rounded-lg shadow-sm p-4 bg-transparent transition-all duration-300 hover:shadow-md">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection("colors")}
                            aria-expanded={expandedSection === "colors"}
                            aria-controls="color-options"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    toggleSection("colors");
                                    e.preventDefault();
                                }
                            }}
                        >
                            <h3 className="font-medium text-white-100">Color</h3>
                            <span className="text-blue-600 text-lg transition-transform duration-300 transform"
                                  style={{transform: expandedSection === "colors" ? 'rotate(180deg)' : 'rotate(0deg)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </span>
                        </div>

                        <div
                            className="overflow-hidden transition-all duration-500 ease-linear"
                            style={{
                                maxHeight: expandedSection === "colors" ? '500px' : '0',
                                opacity: expandedSection === "colors" ? 1 : 0
                            }}
                        >
                            {expandedSection === "colors" && renderFilterContent("colors", colors, "value", "label")}
                        </div>
                    </div>

                    {/* Purpose filter */}
                    <div
                        className="border rounded-lg shadow-sm p-4 bg-transparent transition-all duration-300 hover:shadow-md">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection("purposes")}
                            aria-expanded={expandedSection === "purposes"}
                            aria-controls="purpose-options"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    toggleSection("purposes");
                                    e.preventDefault();
                                }
                            }}
                        >
                            <h3 className="font-medium text-white-100">Purpose</h3>
                            <span className="text-blue-600 text-lg transition-transform duration-300 transform"
                                  style={{transform: expandedSection === "purposes" ? 'rotate(180deg)' : 'rotate(0deg)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </span>
                        </div>

                        <div
                            className="overflow-hidden transition-all duration-500 ease-linear"
                            style={{
                                maxHeight: expandedSection === "purposes" ? '500px' : '0',
                                opacity: expandedSection === "purposes" ? 1 : 0
                            }}
                        >
                            {expandedSection === "purposes" && renderFilterContent("purposes", purposes, "value", "label")}
                        </div>
                    </div>

                    {/* Gender filter */}
                    <div
                        className="border rounded-lg shadow-sm p-4 bg-transparent transition-all duration-300 hover:shadow-md">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection("genders")}
                            aria-expanded={expandedSection === "genders"}
                            aria-controls="gender-options"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    toggleSection("genders");
                                    e.preventDefault();
                                }
                            }}
                        >
                            <h3 className="font-medium text-white-100">Gender</h3>
                            <span className="text-blue-600 text-lg transition-transform duration-300 transform"
                                  style={{transform: expandedSection === "genders" ? 'rotate(180deg)' : 'rotate(0deg)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </span>
                        </div>

                        <div
                            className="overflow-hidden transition-all duration-500 ease-linear"
                            style={{
                                maxHeight: expandedSection === "genders" ? '500px' : '0',
                                opacity: expandedSection === "genders" ? 1 : 0
                            }}
                        >
                            {expandedSection === "genders" && renderFilterContent("genders", genders, "value", "label")}
                        </div>
                    </div>

                    {/* Price filter */}
                    <div
                        className="border rounded-lg shadow-sm p-4 bg-transparent transition-all duration-300 hover:shadow-md">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection("price")}
                            aria-expanded={expandedSection === "price"}
                            aria-controls="price-options"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    toggleSection("price");
                                    e.preventDefault();
                                }
                            }}
                        >
                            <h3 className="font-medium text-white-100">Price</h3>
                            <span className="text-blue-600 text-lg transition-transform duration-300 transform"
                                  style={{transform: expandedSection === "price" ? 'rotate(180deg)' : 'rotate(0deg)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </span>
                        </div>

                        <div
                            className="overflow-hidden transition-all duration-500 ease-linear"
                            style={{
                                maxHeight: expandedSection === "price" ? '500px' : '0',
                                opacity: expandedSection === "price" ? 1 : 0
                            }}
                        >
                            {expandedSection === "price" && (
                                <div className="mt-3 flex flex-col gap-2" id="price-options">
                                    {priceRanges.map((range, index) => (
                                        <button
                                            key={index}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 text-left ${
                                                isFilterSelected("price", range)
                                                    ? "bg-white text-blue-500"
                                                    : "bg-gray-200 text-gray-100 hover:bg-gray-300"
                                            }`}
                                            onClick={() => handleFilterSelect("price", range)}
                                            aria-pressed={isFilterSelected("price", range)}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Active filters display */}
                {Object.keys(activeFilters).length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2 items-center p-3 rounded-lg" aria-live="polite">
                        <span className="text-sm font-medium text-gray-700">Active filters:</span>
                        {Object.entries(activeFilters).map(([type, value]) => {
                            if (type === "price") {
                                return (
                                    <button
                                        key={`${type}-${value.label}`}
                                        className="px-3 py-1 bg-indigo-100 text-blue-800 rounded-full text-sm flex items-center gap-1 transition-all duration-200 hover:bg-indigo-200"
                                        onClick={() => {
                                            const newFilters = {...activeFilters};
                                            delete newFilters.price;
                                            setActiveFilters(newFilters);
                                            onFilterChange(newFilters);
                                        }}
                                        aria-label={`Remove price filter: ${value.label}`}
                                    >
                                        {value.label}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                );
                            } else if (Array.isArray(value)) {
                                return value.map(item => {
                                    // Find label for item using the helper function
                                    let label = item;
                                    const filterArrays = {
                                        "size": sizes,
                                        "color": colors,
                                        "purpose": purposes,
                                        "gender": genders
                                    };

                                    if (filterArrays[type]) {
                                        const filterArray = filterArrays[type];
                                        if (Array.isArray(filterArray)) {
                                            const foundItem = filterArray.find(i => {
                                                const {value} = getFilterItemProps(i, type === "size" ? "size" : "value");
                                                return value === item;
                                            });

                                            if (foundItem) {
                                                const {label: itemLabel} = getFilterItemProps(
                                                    foundItem,
                                                    type === "size" ? "size" : "value",
                                                    type === "size" ? "size" : "label"
                                                );
                                                label = itemLabel;
                                            }
                                        }
                                    }

                                    return (
                                        <button
                                            key={`${type}-${item}`}
                                            className="px-3 py-1 bg-indigo-100 text-blue-800 rounded-full text-sm flex items-center gap-1 transition-all duration-200 hover:bg-indigo-200"
                                            onClick={() => handleFilterSelect(type, item)}
                                            aria-label={`Remove ${type} filter: ${label}`}
                                        >
                                            {`${type}: ${label}`}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                                 aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    );
                                });
                            } else {
                                return (
                                    <button
                                        key={`${type}-${value}`}
                                        className="px-3 py-1 bg-indigo-100 text-blue-800 rounded-full text-sm flex items-center gap-1 transition-all duration-200 hover:bg-indigo-200"
                                        onClick={() => {
                                            const newFilters = {...activeFilters};
                                            delete newFilters[type];
                                            setActiveFilters(newFilters);
                                            onFilterChange(newFilters);
                                        }}
                                        aria-label={`Remove ${type} filter: ${value}`}
                                    >
                                        {`${type}: ${value}`}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                );
                            }
                        })}
                        <button
                            className="px-3 py-1 text-blue-600 underline text-sm transition-colors duration-200 hover:text-blue-800"
                            onClick={() => {
                                setActiveFilters({});
                                onFilterChange({});
                            }}
                            aria-label="Clear all filters"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Filter;