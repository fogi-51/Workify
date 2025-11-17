import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TOOLS, categoryConfig } from '../constants';
import { ToolCategory } from '../types';

interface ToolCategoryViewProps {
  category: ToolCategory;
  onBack: () => void;
}

const ToolCategoryView: React.FC<ToolCategoryViewProps> = ({ category, onBack }) => {
  const { setActiveToolId } = useAppContext();
  const toolsForCategory = TOOLS.filter(tool => tool.category === category);
  const config = categoryConfig[category];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Categories
        </button>
        <div className={`ml-4 w-10 h-10 rounded-lg ${config.color} flex items-center justify-center shadow-md`}>
            {/* FIX: Type error resolved by updating icon type definitions. */}
            {React.cloneElement(config.icon, { className: "h-5 w-5 text-white" })}
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 ml-4">{category}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {toolsForCategory.map(tool => (
          <button 
            key={tool.id} 
            onClick={() => setActiveToolId(tool.id)}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${config.color} mb-4`}>
              {/* FIX: Type error resolved by updating icon type definitions. */}
              {React.cloneElement(tool.icon, { className: `h-6 w-6 text-white` })}
            </div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{tool.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 h-10 overflow-hidden">{tool.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolCategoryView;