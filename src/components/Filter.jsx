import {useEffect, useState, useCallback} from "react";

const Filter = ({
                    onPendingFilterChange,
                    onPendingSearchChange,
                    pendingFilters = {},
                    pendingSearchQuery = "",
                    onApplyFilters,
                    onResetFilters,
                    isLoading = false
                }) => {
    const [manufacturersList, setManufacturers] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [purposes, setPurposes] = useState([]);
    const [genders, setGenders] = useState([]);
    const [expandedSections, setExpandedSections] = useState({
        manufacturer: true,
        size: false,
        color: false,
        purpose: false,
        gender: false,
        price: false
    });
    const [filtersLoading, setFiltersLoading] = useState({
        manufacturers: true,
        sizes: true,
        colors: true,
        purposes: true,
        genders: true
    });

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                setFiltersLoading({
                    manufacturers: true,
                    sizes: true,
                    colors: true,
                    purposes: true,
                    genders: true
                });

                const fetchEndpoint = async (endpoint) => {
                    try {
                        const response = await fetch(`${API_URL}/api/${endpoint}`);
                        const data = await response.json();

                        setFiltersLoading(prev => ({
                            ...prev,
                            [endpoint]: false
                        }));

                        return data;
                    } catch (error) {
                        console.error(`Error fetching ${endpoint}:`, error);

                        setFiltersLoading(prev => ({
                            ...prev,
                            [endpoint]: false
                        }));

                        return [];
                    }
                };

                const [manufacturersData, sizesData, colorsData, purposesData, gendersData] = await Promise.all([
                    fetchEndpoint("manufacturers"),
                    fetchEndpoint("sizes"),
                    fetchEndpoint("colors"),
                    fetchEndpoint("purposes"),
                    fetchEndpoint("genders")
                ]);

                setManufacturers(manufacturersData);
                setSizes(sizesData);
                setColors(colorsData);
                setPurposes(purposesData);
                setGenders(gendersData);
            } catch (error) {
                console.error("Error fetching filter options:", error);

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
    }, [API_URL]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleFilterSelect = (type, value) => {
        const newFilters = {...pendingFilters};

        if (type === "manufacturer") {
            const manufacturer = manufacturersList.find(m => (m.name || m) === value);
            const actualValue = manufacturer?.id || value;

            if (!newFilters.manufacturer) {
                newFilters.manufacturer = [actualValue];
            } else if (newFilters.manufacturer.includes(actualValue)) {
                newFilters.manufacturer = newFilters.manufacturer.filter(item => item !== actualValue);
                if (newFilters.manufacturer.length === 0) {
                    delete newFilters.manufacturer;
                }
            } else {
                newFilters.manufacturer = [...newFilters.manufacturer, actualValue];
            }
        } else if (type === "price") {
            newFilters.price = value;
        } else {
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

        onPendingFilterChange(newFilters);
    };

    const priceRanges = [
        {minPrice: 0, maxPrice: 50, label: "Under $50"},
        {minPrice: 50, maxPrice: 100, label: "$50 - $100"},
        {minPrice: 100, maxPrice: 150, label: "$100 - $150"},
        {minPrice: 150, maxPrice: 200, label: "$150 - $200"},
        {minPrice: 200, maxPrice: null, label: "$200+"}
    ];

    const handleSearchInputChange = useCallback((value) => {
        onPendingSearchChange(value);
    }, [onPendingSearchChange]);

    const isFilterSelected = (type, value) => {
        const actualValue = typeof value === 'object' ? value.value || value.id || value : value;

        if (type === "manufacturer") {
            const manufacturer = manufacturersList.find(m => (m.name || m) === value);
            const checkValue = manufacturer?.id || value;
            return pendingFilters.manufacturer && pendingFilters.manufacturer.includes(checkValue);
        } else if (type === "price") {
            return pendingFilters.price &&
                pendingFilters.price.minPrice === value.minPrice &&
                pendingFilters.price.maxPrice === value.maxPrice;
        } else {
            return pendingFilters[type] && pendingFilters[type].includes(actualValue);
        }
    };

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

    const renderFilterSection = (title, type, items, valueKey, labelKey) => {
        const isExpanded = expandedSections[type];
        const isLoadingData = filtersLoading[type];

        return (
            <div className="border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => toggleSection(type)}
                    className="w-full py-4 px-6 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <span className="font-medium text-gray-900 dark:text-white">{title}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>

                <div
                    className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}
                >
                    <div className="px-6 pb-4 overflow-y-auto max-h-80">
                        {isLoadingData ? (
                            <div className="flex items-center justify-center py-4">
                                <div
                                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-gray-100"></div>
                            </div>
                        ) : !Array.isArray(items) || items.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 py-2">No options available</p>
                        ) : type === "price" ? (
                            <div className="space-y-2">
                                {priceRanges.map((range, index) => (
                                    <label key={index} className="flex items-center cursor-pointer group py-1">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={isFilterSelected("price", range) || false}
                                                onChange={() => handleFilterSelect("price", range)}
                                                className="sr-only peer"
                                            />
                                            <div
                                                className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100 peer-checked:border-gray-900 dark:peer-checked:border-gray-100 transition-all duration-200 flex items-center justify-center group-hover:border-gray-400 dark:group-hover:border-gray-500">
                                                <svg
                                                    className="w-3 h-3 text-white dark:text-gray-900 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path fillRule="evenodd"
                                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <span
                                            className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                                            {range.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {items.map((item, index) => {
                                    if (type === "manufacturer") {
                                        return (

                                            <label key={item.id || index}
                                                   className="flex items-center cursor-pointer group py-1">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={isFilterSelected(type + 's', item.id) || false}
                                                        onChange={() => handleFilterSelect(type + 's', item.id)}
                                                        className="sr-only peer"
                                                    />
                                                    <div
                                                        className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100 peer-checked:border-gray-900 dark:peer-checked:border-gray-100 transition-all duration-200 flex items-center justify-center group-hover:border-gray-400 dark:group-hover:border-gray-500">
                                                        <svg
                                                            className="w-3 h-3 text-white dark:text-gray-900 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path fillRule="evenodd"
                                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <span
                                                    className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                                                    {item.name || item}
                                                </span>
                                            </label>
                                        );
                                    } else {
                                        const {value, label} = getFilterItemProps(item, valueKey, labelKey);
                                        if (!value) return null;

                                        const actualValue = typeof value === 'object' ? value.value || value.id || value : value;

                                        return (
                                            <label key={actualValue || index}
                                                   className="flex items-center cursor-pointer group py-1">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={isFilterSelected(type + 's', actualValue) || false}
                                                        onChange={() => handleFilterSelect(type + 's', actualValue)}
                                                        className="sr-only peer"
                                                    />
                                                    <div
                                                        className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100 peer-checked:border-gray-900 dark:peer-checked:border-gray-100 transition-all duration-200 flex items-center justify-center group-hover:border-gray-400 dark:group-hover:border-gray-500">
                                                        <svg
                                                            className="w-3 h-3 text-white dark:text-gray-900 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path fillRule="evenodd"
                                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <span
                                                    className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                                                    {label}
                                                </span>
                                            </label>
                                        );
                                    }
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col">
            {/* Search */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={pendingSearchQuery}
                        onChange={(e) => handleSearchInputChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent outline-none"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </div>
            </div>

            {/* Filter sections */}
            <div className="flex-1 overflow-y-auto">
                {renderFilterSection("Brand", "manufacturer", manufacturersList)}
                {renderFilterSection("Size", "size", sizes, "value", "label")}
                {renderFilterSection("Color", "color", colors, "value", "label")}
                {renderFilterSection("Purpose", "purpose", purposes, "value", "label")}
                {renderFilterSection("Gender", "gender", genders, "value", "label")}
                {renderFilterSection("Price", "price", priceRanges)}
            </div>

            {/* Action buttons */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
                <button
                    onClick={onApplyFilters}
                    disabled={isLoading}
                    className="w-full py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Loading...' : 'Apply Filters'}
                </button>
                <button
                    onClick={onResetFilters}
                    disabled={isLoading}
                    className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default Filter;