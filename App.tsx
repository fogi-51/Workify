import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAppContext } from './contexts/AppContext';
import { ALL_TOOLS_MAP } from './constants';

const App: React.FC = () => {
  const { activeToolId } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ActiveToolComponent = ALL_TOOLS_MAP[activeToolId]?.component;

  if (!ActiveToolComponent) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl text-gray-600 dark:text-gray-400">Tool not found</p>
        </div>
      );
  }

  const fullWidthPages = ['dashboard', 'about', 'service', 'contact', 'privacy-policy', 'terms-and-conditions'];

  // Special full-width layout for the dashboard and other informational pages
  if (fullWidthPages.includes(activeToolId)) {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-grow">
                {/* These components handle their own container and padding */}
                <ActiveToolComponent />
            </main>
            <Footer />
        </div>
    );
  }

  // Standard layout for all other tools
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <ActiveToolComponent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;