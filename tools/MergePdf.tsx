import React, { useState } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

const MergePdf: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setError(null);
      setSuccessMessage(null);
    }
    event.target.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least two PDF files to merge.');
      return;
    }
    
    setIsMerging(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { PDFDocument } = (window as any).PDFLib;
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page: any) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedPdfBytes = await mergedPdf.save();
      
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccessMessage('PDFs merged successfully! Your download has started.');
      setTimeout(() => {
        setFiles([]);
        setSuccessMessage(null);
      }, 4000);

    } catch (e) {
      console.error(e);
      setError('An error occurred. Please ensure all selected files are valid, uncorrupted PDFs.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <ToolContainer title="Merge PDF">
      <div className="flex flex-col items-center space-y-6 relative">
        {isMerging && (
            <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 flex flex-col justify-center items-center z-20 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Merging your PDFs...</p>
            </div>
        )}
        {error && (
            <div className="w-full text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                <span>{error}</span>
            </div>
        )}
        {successMessage && (
            <div className="w-full text-center text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 p-3 rounded-md border border-green-200 dark:border-green-800 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>{successMessage}</span>
            </div>
        )}

        <label htmlFor="file-upload" className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select PDF files to add</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop files here</p>
          </div>
        </label>

        {files.length > 0 && (
          <div className="w-full space-y-3">
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Files to merge ({files.length}):</h4>
            <ul className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-md p-3 space-y-2 max-h-60 overflow-y-auto border dark:border-gray-700">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                  <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">{index + 1}. {file.name}</span>
                  <button onClick={() => removeFile(index)} title="Remove file" className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 text-center">The files will be merged in the order they are listed above.</p>
          </div>
        )}

        <button
          onClick={handleMerge}
          disabled={isMerging || files.length < 2}
          className="w-full flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {`Merge ${files.length > 1 ? files.length + ' PDFs' : 'PDFs'}`}
        </button>
      </div>
    </ToolContainer>
  );
};

export default MergePdf;