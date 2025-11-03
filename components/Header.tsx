import React, { useContext } from 'react';
import { AppContext } from '../App';
import { T } from '../constants';
import { User, View } from '../types';

interface HeaderProps {
    user: User;
    setView: (view: View) => void;
    currentView: View;
}

const Header: React.FC<HeaderProps> = ({ user, setView, currentView }) => {
    const { theme, setTheme, language, setLanguage, logout } = useContext(AppContext);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    const navLinks = user.role === 'citizen'
        ? [
            { view: 'dashboard', label: T.dashboard[language] },
            { view: 'report-issue', label: T.report_issue[language] },
            { view: 'track-reports', label: T.track_reports[language] },
        ]
        : [
            { view: 'dashboard', label: T.dashboard[language] },
            { view: 'manage-issues', label: T.manage_issues[language] },
            { view: 'map-view', label: T.map_view[language] },
            { view: 'reports', label: T.generate_reports[language] },
        ];


    return (
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <i className="fas fa-landmark text-primary-600 text-2xl mr-2"></i>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                            {T.jharkhand_civic_connect[language]}
                        </h1>
                    </div>
                    
                    <nav className="hidden md:flex items-center justify-center space-x-2">
                        {navLinks.map(link => {
                            const isActive = currentView === link.view;
                            return (
                             <button
                                key={link.view}
                                onClick={() => setView(link.view as View)}
                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
                                    isActive 
                                    ? 'text-primary-600 dark:text-primary-400' 
                                    : 'text-gray-500 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'}`
                                }
                            >
                                {link.label}
                                {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary-500 rounded-full"></span>}
                            </button>
                        )})}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                            {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
                        </button>
                        <button onClick={toggleLanguage} className="text-gray-500 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold">
                            {language === 'en' ? 'हि' : 'EN'}
                        </button>
                        <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full" src={user.avatar} alt={user.name} />
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{user.name}</span>
                        </div>
                        <button onClick={logout} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600">
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;