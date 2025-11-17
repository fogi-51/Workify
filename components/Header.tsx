import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ALL_TOOLS_MAP } from '../constants';
import { Theme } from '../types';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { theme, toggleTheme, activeToolId, setActiveToolId } = useAppContext();
  const activeTool = ALL_TOOLS_MAP[activeToolId];
  const isDashboard = activeToolId === 'dashboard';

  const handleScrollLink = (targetId: string) => {
      // If we are not on the dashboard, go there first, then scroll.
      if (activeToolId !== 'dashboard') {
          setActiveToolId('dashboard');
          // A timeout allows React to re-render the dashboard component before we try to scroll
          setTimeout(() => {
              document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      } else {
          // If we are already on the dashboard, just scroll.
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }
  };


  return (
    <header className={`flex items-center justify-between h-16 px-6 ${isDashboard ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700/50' : 'bg-white dark:bg-gray-800 border-b dark:border-gray-700'}`}>
      <div className="flex items-center">
        {isDashboard ? (
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 cursor-pointer" onClick={() => setActiveToolId('dashboard')}>
            Workify
          </h1>
        ) : (
          <>
            <button className="text-gray-500 focus:outline-none md:hidden" onClick={() => setSidebarOpen(true)}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white ml-4 md:ml-0">{activeTool?.name}</h2>
          </>
        )}
      </div>
      <div className="flex items-center gap-8">
        {(isDashboard || activeToolId === 'about' || activeToolId === 'service' || activeToolId === 'contact') && (
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6 text-sm font-medium">
              <li><button onClick={() => setActiveToolId('dashboard')} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Home</button></li>
              <li><button onClick={() => setActiveToolId('about')} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">About</button></li>
              <li><button onClick={() => setActiveToolId('service')} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Service</button></li>
              <li><button onClick={() => setActiveToolId('contact')} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Contact</button></li>
            </ul>
          </nav>
        )}
        <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors">
            {theme === Theme.Light ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )}
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;