import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [expandedSections, setExpandedSections] = useState({
        quickLinks: false,
        categories: false,
        newsletter: false
    });

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            // Auto-expand all sections when switching to desktop
            if (!mobile) {
                setExpandedSections({
                    quickLinks: true,
                    categories: true,
                    newsletter: true
                });
            } else {
                // Collapse all sections when switching to mobile
                setExpandedSections({
                    quickLinks: false,
                    categories: false,
                    newsletter: false
                });
            }
        };

        // Set initial state based on current window size
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSection = (section) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle newsletter subscription here
        alert(`Thank you for subscribing with ${email}!`);
        setEmail("");
    };

    return (
        <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg mt-auto">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Mobile Layout - Only shown on small screens */}
                <div className="md:hidden">
                    {/* Logo & About Section */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <h2 className="text-xl font-bold tracking-wider">Sneaker Shop</h2>
                        </div>
                        <p className="text-blue-200 mb-4">Premium sneakers for every style and occasion. Find your perfect pair today.</p>
                        <div className="flex space-x-4">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links - Collapsible on Mobile */}
                    <div className="border-t border-blue-500 pt-4">
                        <div
                            className="flex justify-between items-center cursor-pointer mb-4"
                            onClick={() => toggleSection('quickLinks')}
                        >
                            <h3 className="text-lg font-semibold">Quick Links</h3>
                            <button
                                className="p-1 rounded-full hover:bg-blue-600 transition-colors focus:outline-none"
                                aria-label={expandedSections.quickLinks ? "Collapse quick links" : "Expand quick links"}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 transition-transform duration-300 ${expandedSections.quickLinks ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                !expandedSections.quickLinks ? 'max-h-0 opacity-0' : 'max-h-60 opacity-100'
                            }`}
                        >
                            <ul className="space-y-2 mb-4">
                                <li><Link to="/" className="text-blue-200 hover:text-white hover:underline transition-colors">Home</Link></li>
                                <li><Link to="/shop" className="text-blue-200 hover:text-white hover:underline transition-colors">Shop All</Link></li>
                                <li><Link to="/new-arrivals" className="text-blue-200 hover:text-white hover:underline transition-colors">New Arrivals</Link></li>
                                <li><Link to="/sale" className="text-blue-200 hover:text-white hover:underline transition-colors">Sale</Link></li>
                                <li><Link to="/about" className="text-blue-200 hover:text-white hover:underline transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="text-blue-200 hover:text-white hover:underline transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Categories - Collapsible on Mobile */}
                    <div className="border-t border-blue-500 pt-4">
                        <div
                            className="flex justify-between items-center cursor-pointer mb-4"
                            onClick={() => toggleSection('categories')}
                        >
                            <h3 className="text-lg font-semibold">Categories</h3>
                            <button
                                className="p-1 rounded-full hover:bg-blue-600 transition-colors focus:outline-none"
                                aria-label={expandedSections.categories ? "Collapse categories" : "Expand categories"}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 transition-transform duration-300 ${expandedSections.categories ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                !expandedSections.categories ? 'max-h-0 opacity-0' : 'max-h-60 opacity-100'
                            }`}
                        >
                            <ul className="space-y-2 mb-4">
                                <li><Link to="/category/running" className="text-blue-200 hover:text-white hover:underline transition-colors">Running</Link></li>
                                <li><Link to="/category/basketball" className="text-blue-200 hover:text-white hover:underline transition-colors">Basketball</Link></li>
                                <li><Link to="/category/lifestyle" className="text-blue-200 hover:text-white hover:underline transition-colors">Lifestyle</Link></li>
                                <li><Link to="/category/training" className="text-blue-200 hover:text-white hover:underline transition-colors">Training & Gym</Link></li>
                                <li><Link to="/category/limited" className="text-blue-200 hover:text-white hover:underline transition-colors">Limited Edition</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter - Collapsible on Mobile */}
                    <div className="border-t border-blue-500 pt-4">
                        <div
                            className="flex justify-between items-center cursor-pointer mb-4"
                            onClick={() => toggleSection('newsletter')}
                        >
                            <h3 className="text-lg font-semibold">Stay Updated</h3>
                            <button
                                className="p-1 rounded-full hover:bg-blue-600 transition-colors focus:outline-none"
                                aria-label={expandedSections.newsletter ? "Collapse newsletter" : "Expand newsletter"}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 transition-transform duration-300 ${expandedSections.newsletter ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                !expandedSections.newsletter ? 'max-h-0 opacity-0' : 'max-h-60 opacity-100'
                            }`}
                        >
                            <p className="text-blue-200 mb-4">Subscribe to get special offers, free giveaways, and new release updates.</p>
                            <form onSubmit={handleSubmit} className="flex flex-col space-y-2 mb-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    required
                                    className="px-4 py-2 rounded bg-blue-600 border border-blue-500 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-100"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-yellow-400 text-blue-200 rounded font-medium hover:bg-yellow-300 transition-colors"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout - Only shown on medium and larger screens */}
                <div className="hidden md:grid md:grid-cols-4 md:gap-8">
                    {/* Logo & About Section */}
                    <div className="col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <h2 className="text-xl font-bold tracking-wider">Sneaker Shop</h2>
                        </div>
                        <p className="text-blue-200 mb-4">Premium sneakers for every style and occasion. Find your perfect pair today.</p>
                        <div className="flex space-x-4">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold mb-4 border-b border-blue-500 pb-2">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-blue-200 hover:text-white hover:underline transition-colors">Home</Link></li>
                            <li><Link to="/shop" className="text-blue-200 hover:text-white hover:underline transition-colors">Shop All</Link></li>
                            <li><Link to="/new-arrivals" className="text-blue-200 hover:text-white hover:underline transition-colors">New Arrivals</Link></li>
                            <li><Link to="/sale" className="text-blue-200 hover:text-white hover:underline transition-colors">Sale</Link></li>
                            <li><Link to="/about" className="text-blue-200 hover:text-white hover:underline transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-blue-200 hover:text-white hover:underline transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold mb-4 border-b border-blue-500 pb-2">Categories</h3>
                        <ul className="space-y-2">
                            <li><Link to="/category/running" className="text-blue-200 hover:text-white hover:underline transition-colors">Running</Link></li>
                            <li><Link to="/category/basketball" className="text-blue-200 hover:text-white hover:underline transition-colors">Basketball</Link></li>
                            <li><Link to="/category/lifestyle" className="text-blue-200 hover:text-white hover:underline transition-colors">Lifestyle</Link></li>
                            <li><Link to="/category/training" className="text-blue-200 hover:text-white hover:underline transition-colors">Training & Gym</Link></li>
                            <li><Link to="/category/limited" className="text-blue-200 hover:text-white hover:underline transition-colors">Limited Edition</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold mb-4 border-b border-blue-500 pb-2">Stay Updated</h3>
                        <p className="text-blue-200 mb-4">Subscribe to get special offers, free giveaways, and new release updates.</p>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                required
                                className="px-4 py-2 rounded bg-blue-100 border border-blue-500 text-blue-700 placeholder-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-100"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-yellow-400 text-blue-500 rounded font-medium hover:bg-yellow-300 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-blue-700 py-4">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-blue-200 text-sm mb-2 md:mb-0">&copy; {new Date().getFullYear()} Sneaker Shop. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center md:justify-end gap-4 md:space-x-6">
                        <Link to="/privacy" className="text-sm text-blue-200 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-sm text-blue-200 hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/shipping" className="text-sm text-blue-200 hover:text-white transition-colors">Shipping Info</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;