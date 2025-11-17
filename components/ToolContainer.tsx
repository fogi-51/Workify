
import React from 'react';

interface ToolContainerProps {
  title: string;
  children: React.ReactNode;
}

const ToolContainer: React.FC<ToolContainerProps> = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{title}</h3>
      <div>
        {children}
      </div>
    </div>
  );
};

export default ToolContainer;
