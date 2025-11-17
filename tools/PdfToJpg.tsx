import React, { useState, useRef } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

declare const pdfjsLib: any;

const PdfToJpg: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const downloadLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const resetState = () => {
    setFile(null);
    setIsConverting(false);
    setError(null);
    setImageUrls([]);
    downloadLinksRef.current = [];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetState();
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      setError('Please select a valid PDF file.');
    }
     // Reset input value to allow re-selecting the same file
    event.target.value = '';
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setError(null);
    setImageUrls([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const urls: string[] = [];
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        // Use a higher scale for better quality output images
        const scale = 2.0;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Could not get canvas context for rendering.');
        }

        await page.render({ canvasContext: context, viewport }).promise;
        // Use a high quality setting for the JPG output
        const imageUrl = canvas.toDataURL('image/jpeg', 0.95);
        urls.push(imageUrl);
      }
      
      setImageUrls(urls);
    } catch (e) {
      console.error(e);
      setError('Failed to convert PDF. The file might be corrupted or protected.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadAll = () => {
    downloadLinksRef.current.forEach((link, index) => {
      if (link) {
        // A small delay between clicks can help browsers handle multiple download prompts
        setTimeout(() => {
          link.click();
        }, index * 200);
      }
    });
  };

  const renderContent = () => {
    if (isConverting) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Converting pages to JPG, please wait...</p>
        </div>
      );
    }

    if (imageUrls.length > 0) {
      return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                 <button
                    onClick={handleDownloadAll}
                    className="w-full sm:w-auto flex-grow justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-lg"
                >
                    Download All as JPGs
                </button>
                 <button
                    onClick={resetState}
                    className="w-full sm:w-auto justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors shadow-lg"
                >
                    Start Over
                </button>
            </div>
          
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group border dark:border-gray-700 rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800">
                <img src={url} alt={`Page ${index + 1}`} className="w-full h-auto object-contain" />
                <a
                  href={url}
                  download={`${file?.name.replace(/\.pdf$/i, '') || 'page'}-${index + 1}.jpg`}
                  // FIX: The ref callback should not return a value. Changed to a block statement.
                  ref={el => { downloadLinksRef.current[index] = el; }}
                  className="absolute bottom-2 right-2 flex items-center justify-center p-2 bg-primary-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
                  title={`Download Page ${index + 1}`}
                  aria-label={`Download Page ${index + 1}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
        <div className="flex flex-col items-center space-y-6">
            {!file ? (
                 <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="file" id="file-upload" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden"/>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF file</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
                </label>
            ) : (
                <div className="text-center w-full p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                    <p className="mb-4 text-lg">Selected file: <span className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</span></p>
                    <button
                        onClick={handleConvert}
                        disabled={isConverting}
                        className="w-full max-w-sm flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Convert to JPG
                    </button>
                </div>
            )}
        </div>
    )

  };

  return (
    <ToolContainer title="PDF to JPG">
        {error && (
            <div className="mb-4 w-full text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                <span>{error}</span>
            </div>
        )}
        {renderContent()}
    </ToolContainer>
  );
};

export default PdfToJpg;