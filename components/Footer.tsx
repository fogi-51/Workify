import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const Footer: React.FC = () => {
    const { setActiveToolId, activeToolId } = useAppContext();

    const handleLinkClick = (id: string) => {
        setActiveToolId(id);
        window.scrollTo(0, 0); // Scroll to top on page change
    };
    
    const fullWidthPages = ['dashboard', 'about', 'service', 'contact', 'privacy-policy', 'terms-and-conditions'];
    const isLandingLayout = fullWidthPages.includes(activeToolId);

    const footerClasses = isLandingLayout
        ? "bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600"
        : "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700";

    const containerClasses = isLandingLayout
        ? "text-white"
        : "text-gray-500 dark:text-gray-400";

    const linkClasses = isLandingLayout
        ? "hover:text-purple-200 transition-colors"
        : "hover:text-gray-800 dark:hover:text-gray-200 transition-colors";
    
    const copyrightClasses = isLandingLayout
        ? "text-purple-200"
        : "";

    return (
        <footer className={footerClasses}>
            <div className="container mx-auto px-6 py-8">
                <div className={`flex flex-col items-center space-y-4 text-sm ${containerClasses}`}>
                    <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
                        <button onClick={() => handleLinkClick('privacy-policy')} className={linkClasses}>Privacy Policy</button>
                        <button onClick={() => handleLinkClick('terms-and-conditions')} className={linkClasses}>Terms & Conditions</button>
                        <button onClick={() => handleLinkClick('contact')} className={linkClasses}>Contact</button>
                    </nav>
                    <p className={copyrightClasses}>&copy; 2025 FOGI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;