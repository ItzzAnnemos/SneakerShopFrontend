import {useState, useRef, useEffect} from "react";
import {Link} from "react-router-dom";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [menuPosition, setMenuPosition] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const menuRef = useRef(null);

    const minSwipeDistance = 50;

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            if (!mobile && menuOpen) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [menuOpen]);

    const onTouchStart = (e) => {
        if (!menuOpen) return;
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(null);
    };

    const onTouchMove = (e) => {
        if (!menuOpen || touchStart === null) return;
        const currentPosition = e.targetTouches[0].clientX;
        setTouchEnd(currentPosition);

        const distance = currentPosition - touchStart;

        if (distance < 0) {
            const newPosition = Math.max(-100, (distance / menuRef.current.offsetWidth) * 100);
            setMenuPosition(newPosition);
        }
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchEnd - touchStart;

        if (distance < -minSwipeDistance) {
            setMenuOpen(false);
        } else {
            setMenuPosition(0);
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    useEffect(() => {
        setMenuPosition(0);
    }, [menuOpen]);

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
        <header className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo Section */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <span className="material-symbols-outlined text-3xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        steps
                    </span>
                    <h2 className="hidden lg:inline text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Sneaker Shop</h2>
                    <h2 className="inline lg:hidden text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Shop</h2>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                    {menuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    )}
                </button>

                {/* Mobile Background Overlay */}
                <div
                    className={`fixed md:hidden inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setMenuOpen(false)}
                ></div>

                {/* Navigation Menu */}
                <nav
                    ref={menuRef}
                    className={`fixed md:static top-0 left-0 h-full md:h-auto w-3/4 max-w-xs md:w-auto bg-white dark:bg-gray-900 md:bg-transparent z-20 transition-transform duration-300 ease-in-out md:translate-x-0 shadow-lg md:shadow-none md:ml-auto`}
                    style={{
                        transform: isMobile && !menuOpen ? 'translateX(-100%)' : 'translateX(0)',
                        marginLeft: menuPosition ? `${menuPosition}%` : '0'
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Mobile Menu Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 md:hidden">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">Menu</span>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    {/* Menu Items */}
                    <ul className="md:flex md:items-center p-4 md:p-0 md:ml-auto md:space-x-2">
                        <li className="mb-4 md:mb-0">
                            <Link
                                to="/"
                                className="block py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                onClick={() => setMenuOpen(false)}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="mb-4 md:mb-0">
                            <Link
                                to="/shop"
                                className="block py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                onClick={() => setMenuOpen(false)}
                            >
                                Shop
                            </Link>
                        </li>
                        <li className="mb-4 md:mb-0">
                            <Link
                                to="/cart"
                                className="block py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative"
                                onClick={() => setMenuOpen(false)}
                            >
                                Cart
                                <span
                                    className="absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2 bg-blue-600 dark:bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                            </Link>
                        </li>
                        <li className="mb-4 md:mb-0 md:ml-2">
                            <Link
                                to="/login"
                                className="block py-3 px-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 text-center"
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