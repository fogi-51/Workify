
import React, { useState, useRef } from 'react';
import ToolContainer from '../components/ToolContainer';
import { generateImage, editImage } from '../services/geminiService';
import Spinner from '../components/Spinner';

const AIImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string; } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
        setError('Please enter a prompt to generate an image.');
        return;
    }
    setIsLoading(true);
    setImageUrl('');
    setError('');

    let result;
    if (uploadedImage) {
      // Call editImage service if an image is uploaded
      const base64Data = uploadedImage.data.split(',')[1];
      result = await editImage(base64Data, uploadedImage.mimeType, prompt);
    } else {
      // Call generateImage service otherwise
      result = await generateImage(prompt);
    }
    
    if (result.startsWith('data:image')) {
      setImageUrl(result);
    } else {
      setError(result);
    }
    setIsLoading(false);
  };
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    if (error) {
        setError('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage({
          data: reader.result as string,
          mimeType: file.type,
        });
        setImageUrl(''); // Clear any previously generated image
        setError('');
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please upload a valid JPG or PNG image.');
    }
    // Reset file input value to allow re-uploading the same file
    if (event.target) {
        event.target.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
  };
  
  const placeholderText = uploadedImage 
    ? "e.g., Add a birthday hat to the cat"
    : "e.g., A cute cat wearing a wizard hat";
  
  const generateButtonText = uploadedImage ? 'Edit Image' : 'Generate';

  return (
    <ToolContainer title="AI Image Generator">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              className="flex-grow p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={placeholderText}
              value={prompt}
              onChange={handlePromptChange}
            />
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png"
              className="hidden"
            />
            {/* Custom upload button */}
            <button
                onClick={triggerFileUpload}
                disabled={isLoading}
                className="w-full sm:w-40 flex justify-center items-center px-4 py-2 text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/50 rounded-md hover:bg-primary-200 dark:hover:bg-primary-900 transition-colors"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Upload Image
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full sm:w-32 flex justify-center items-center px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Spinner /> : generateButtonText}
            </button>
        </div>
        
        <div className="mt-6">
            <div className="flex justify-center items-center h-96 bg-gray-100 dark:bg-gray-700 rounded-md relative">
                {isLoading && <div className="flex flex-col items-center"><Spinner /><p className="mt-2 text-sm text-gray-500">AI is thinking...</p></div>}
                {error && <p className="text-red-500 p-4 text-center">{error}</p>}
                
                {/* Display generated image */}
                {imageUrl && !isLoading && (
                    <img src={imageUrl} alt={prompt} className="max-h-full max-w-full object-contain rounded-md" />
                )}

                {/* Display uploaded image preview if no generated image */}
                {uploadedImage && !imageUrl && !isLoading && !error && (
                     <div className="relative h-full w-full flex justify-center items-center">
                        <img src={uploadedImage.data} alt="Uploaded preview" className="max-h-full max-w-full object-contain rounded-md" />
                        <button 
                            onClick={removeUploadedImage} 
                            className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                            title="Remove uploaded image"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Placeholder */}
                {!isLoading && !imageUrl && !uploadedImage && !error && (
                    <p className="text-gray-500">Your generated image will appear here.</p>
                )}
            </div>

            {imageUrl && !isLoading && !uploadedImage && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleGenerate}
                        className="flex items-center justify-center px-6 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/50 rounded-md hover:bg-primary-200 dark:hover:bg-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        Generate Variations
                    </button>
                </div>
            )}
        </div>
      </div>
    </ToolContainer>
  );
};

export default AIImageGenerator;
