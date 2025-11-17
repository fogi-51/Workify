import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TOOLS } from '../constants';
import { Tool, ToolCategory } from '../types';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const highlightMatch = (text: string, highlight: string): React.ReactNode => {
    if (!highlight.trim()) {
      return text;
    }
    // Escape special regex characters in the highlight string
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);
  
    return (
      <>
        {parts.map((part, i) =>
          // Parts at odd indices are the matches
          i % 2 === 1 ? (
            <span key={i} className="bg-yellow-300 dark:bg-yellow-600 text-black dark:text-black rounded-sm px-0.5">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { activeToolId, setActiveToolId } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchTerm) return TOOLS;
    return TOOLS.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const groupedTools = useMemo(() => {
    // FIX: By providing a typed initial value to reduce, we ensure `groupedTools` has the correct type.
    // This resolves an issue where the `tools` variable was of type `unknown`, causing a crash on `.map`.
    return filteredTools.reduce<Record<string, Tool[]>>((acc, tool) => {
      const category = tool.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
    }, {});
  }, [filteredTools]);

  const handleToolClick = (id: string) => {
    setActiveToolId(id);
    if(window.innerWidth < 768) { // md breakpoint
        setSidebarOpen(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}>
        <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 cursor-pointer" onClick={() => handleToolClick('dashboard')}>Workify</h1>
        </div>
        <div className="p-4">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm leading-tight text-gray-700 dark:text-gray-200 border rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
        </div>
        <nav className="flex-1 overflow-y-auto pb-4">
          {Object.keys(groupedTools).length === 0 && searchTerm && (
              <p className="px-4 text-sm text-gray-500 dark:text-gray-400">No tools found for "{searchTerm}".</p>
          )}
          {Object.keys(groupedTools).map(category => (
            <div key={category} className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{category}</h3>
              <ul className="mt-2 space-y-1">
                {groupedTools[category].map(tool => (
                  <li key={tool.id}>
                    <button
                      onClick={() => handleToolClick(tool.id)}
                      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 text-left ${
                        activeToolId === tool.id
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-3 flex-shrink-0">{tool.icon}</span>
                      <span>{highlightMatch(tool.name, searchTerm)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;