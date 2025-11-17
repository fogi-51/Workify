import React from 'react';
import ToolContainer from '../components/ToolContainer';
import { useAppContext } from '../contexts/AppContext';

// This function converts a kebab-case id into a display-friendly title.
// e.g., 'merge-pdf' becomes 'Merge Pdf'. It's a placeholder solution
// to avoid circular dependencies while still providing a good UX.
const getToolNameFromId = (id: string): string => {
  if (!id) return "PDF Tool";
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PdfToolsPlaceholder: React.FC = () => {
    const { activeToolId } = useAppContext();
    const toolName = getToolNameFromId(activeToolId);

    return (
        <ToolContainer title={toolName}>
            <div className="text-center p-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">🚀 Feature Coming Soon!</h3>
                <p className="text-gray-600 dark:text-gray-300">
                    We're working hard to bring you the "{toolName}" tool. Please check back later.
                </p>
            </div>
        </ToolContainer>
    );
};

export default PdfToolsPlaceholder;
