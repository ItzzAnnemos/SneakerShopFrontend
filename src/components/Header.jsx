import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [menuPosition, setMenuPosition] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const menuRef = useRef(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    // Handle window resize to detect mobile/desktop view
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            // Close menu when switching to desktop
            if (!mobile && menuOpen) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [menuOpen]);

    // Handle swipe gesture
    const onTouchStart = (e) => {
        if (!menuOpen) return;
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(null);
    };

    const onTouchMove = (e) => {
        if (!menuOpen || touchStart === null) return;
        const currentPosition = e.targetTouches[0].clientX;
        setTouchEnd(currentPosition);

        // Calculate swipe distance (negative value means swiping left)
        const distance = currentPosition - touchStart;

        // Only allow swiping left to close (negative distance)
        if (distance < 0) {
            // Map touch position to menu position (0 to -100%)
            const newPosition = Math.max(-100, (distance / menuRef.current.offsetWidth) * 100);
            setMenuPosition(newPosition);
        }
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        // Calculate final swipe distance
        const distance = touchEnd - touchStart;

        // If swipe distance is greater than minimum and direction is left, close menu
        if (distance < -minSwipeDistance) {
            setMenuOpen(false);
        } else {
            // Reset menu position if swipe wasn't enough to close
            setMenuPosition(0);
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    // Reset menu position when menu is toggled
    useEffect(() => {
        setMenuPosition(0);
    }, [menuOpen]);

    // Handle clicks outside the menu to close it
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('button')) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [menuOpen]);

    return (
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <h1 className="text-2xl font-bold tracking-wider">Sneaker Shop</h1>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                    {menuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Mobile Background Overlay */}
                <div
                    className={`fixed md:hidden inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setMenuOpen(false)}
                ></div>

                {/* Navigation Menu - Mobile (Drawer) & Desktop (Horizontal) */}
                <nav
                    ref={menuRef}
                    className={`fixed md:static top-0 left-0 h-full md:h-auto w-3/4 max-w-xs md:w-auto bg-blue-600 md:bg-transparent z-20 transition-transform duration-300 ease-in-out md:translate-x-0 shadow-lg md:shadow-none md:ml-auto md:mr-22`}
                    style={{
                        transform: isMobile && !menuOpen ? 'translateX(-100%)' : 'translateX(0)',
                        marginLeft: menuPosition ? `${menuPosition}%` : '0'
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Mobile Menu Header */}
                    <div className="flex justify-between items-center p-4 border-b border-blue-500 md:hidden">
                        <span className="font-bold text-lg">Menu</span>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="p-1 rounded-full hover:bg-blue-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    {/* Menu Items */}
                    <ul className="md:flex md:items-center p-4 md:p-0 md:ml-auto">
                        <li className="mb-4 md:mb-0 md:ml-8">
                            <Link
                                to="/"
                                className="block py-2 px-4 rounded hover:bg-blue-700 md:hover:bg-blue-500 transition-colors font-medium"
                                onClick={() => setMenuOpen(false)}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="mb-4 md:mb-0 md:ml-8">
                            <Link
                                to="/shop"
                                className="block py-2 px-4 rounded hover:bg-blue-700 md:hover:bg-blue-500 transition-colors font-medium"
                                onClick={() => setMenuOpen(false)}
                            >
                                Shop
                            </Link>
                        </li>
                        <li className="mb-4 md:mb-0 md:ml-8 text-white">
                            <Link
                                to="/cart"
                                className="block py-2 px-4 rounded hover:bg-blue-700 md:hover:bg-blue-500 transition-colors font-medium relative"
                                onClick={() => setMenuOpen(false)}
                            >
                                Cart
                                <span
                                    className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                            </Link>
                        </li>
                        <li className="mb-4 md:mb-0 md:ml-8">
                            <Link
                                to="/login"
                                className="block py-2 px-4 bg-white text-blue-600 rounded shadow hover:bg-gray-100 transition-colors font-medium"
                                onClick={() => setMenuOpen(false)}
                            >
                                Login
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;