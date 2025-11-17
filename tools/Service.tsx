import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TOOLS, categoryConfig } from '../constants';
import { ToolCategory } from '../types';

const Service: React.FC = () => {
    const { setActiveToolId } = useAppContext();

    const categoryOrder = [
        ToolCategory.AIWritingAids,
        ToolCategory.DocumentEditing,
        ToolCategory.DataConversion,
        ToolCategory.CreativeTools,
        ToolCategory.Utilities,
    ];

    return (
        <div className="animate-fade-in font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <section className="text-center mb-24">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
                        A Tool for Every Task
                    </h1>
                    <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                        Workify offers a comprehensive suite of AI-powered and utility tools designed to streamline your workflow. Explore our services and discover how we can help you work smarter.
                    </p>
                </section>

                <section className="space-y-20">
                    {categoryOrder.map((category, index) => {
                        const config = categoryConfig[category];
                        const categoryTools = TOOLS.filter(tool => tool.category === category).slice(0, 6); // Get first 6 tools for grid
                        const colorName = config.color.split('-')[1];

                        return (
                            <div key={category} className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="md:w-1/2">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${config.color} mb-6 shadow-lg`}>
                                        {React.cloneElement(config.icon, { className: 'h-8 w-8 text-white' })}
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{category}</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{config.subtitle}. We provide a robust set of tools to handle all your needs in this area.</p>
                                    <ul className="space-y-2">
                                        {categoryTools.slice(0, 5).map(tool => ( // show 5 in list
                                            <li key={tool.id} className="flex items-center text-gray-700 dark:text-gray-300">
                                                <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span>{tool.name}</span>
                                            </li>
                                        ))}
                                         <li className="flex items-center text-gray-500 dark:text-gray-400">
                                             <svg className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                             </svg>
                                            <span>And many more...</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="md:w-1/2 w-full">
                                    <div className={`relative p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-${colorName}-500 to-${colorName}-600`}>
                                        <div className="grid grid-cols-3 gap-4">
                                            {categoryTools.map(tool => (
                                                 <div key={tool.id} className="p-3 bg-white/20 rounded-lg flex flex-col items-center justify-center text-center text-white backdrop-blur-sm aspect-square" title={tool.name}>
                                                    {React.cloneElement(tool.icon, { className: 'h-6 w-6 mb-2 flex-shrink-0' })}
                                                    <span className="text-xs font-medium leading-tight">{tool.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>
                
                {/* Final CTA Section */}
                <section className="text-center mt-24">
                     <div className="relative rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 p-12 shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 animate-glow"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl font-extrabold text-white">Ready to Get Started?</h2>
                            <p className="mt-4 text-lg text-primary-200 max-w-2xl mx-auto">Jump back to the dashboard and start using these powerful tools right away. No sign-up required.</p>
                            <button 
                                onClick={() => setActiveToolId('dashboard')}
                                className="mt-8 px-10 py-4 bg-white text-primary-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 ease-in-out"
                            >
                                Explore All Tools
                            </button>
                        </div>
                     </div>
                </section>
            </div>
        </div>
    );
};

export default Service;
