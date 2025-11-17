import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ALL_TOOLS_MAP, TOOLS, categoryConfig } from '../constants';
import { Tool, ToolCategory } from '../types';

interface ToolFoldersProps {
  onCategorySelect: (category: ToolCategory) => void;
}

const ToolFolders: React.FC<ToolFoldersProps> = ({ onCategorySelect }) => {
    const { setActiveToolId } = useAppContext();
    
    const groupedTools = React.useMemo(() => {
        return TOOLS.reduce<Record<string, Tool[]>>((acc, tool) => {
            const category = tool.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(tool);
            return acc;
        }, {});
    }, []);
    
    // Ensure a consistent and logical order for categories on the dashboard.
    const categoryOrder = [
        ToolCategory.AIWritingAids,
        ToolCategory.DocumentEditing,
        ToolCategory.DataConversion,
        ToolCategory.CreativeTools,
        ToolCategory.Utilities,
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-6">
        {categoryOrder.map((category) => {
            const tools = groupedTools[category];
            const config = categoryConfig[category];
            if (!tools || !config) return null;
            
            const handleCategoryClick = () => {
                onCategorySelect(category);
            };

            return (
                <button 
                    key={category} 
                    onClick={handleCategoryClick}
                    className="flex flex-col rounded-2xl shadow-lg text-white overflow-hidden group text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:-translate-y-2 transition-transform duration-300"
                >
                    {/* Decorative Shapes */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 transform rotate-45 z-0 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -bottom-4 -left-3 w-10 h-10 bg-white/10 transform rotate-45 z-0 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Main Content */}
                    <div className={`p-6 flex-grow ${config.color} flex flex-col justify-between relative z-10 group-hover:shadow-inner-lg transition-shadow`}>
                        <div className="flex justify-between items-start">
                           <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                {/* FIX: Type error resolved by updating icon type definitions. */}
                                {React.cloneElement(config.icon, { className: "h-6 w-6 text-white" })}
                            </div>
                            <div className="px-3 py-1 text-sm rounded-full bg-black/20">
                                {tools.length}+ tools
                            </div>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold">{category}</h3>
                            <p className="opacity-80 mt-1">{config.subtitle}</p>
                        </div>
                        <div className="self-end mt-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </button>
            );
        })}
      </div>
    );
};

export default ToolFolders;