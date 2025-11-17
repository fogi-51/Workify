import React, { useState } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

const PngToPdf: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).filter((file: File) =>
        file.type === 'image/png'
      );
      if (newFiles.length !== event.target.files.length) {
          setError('Only valid PNG image files are accepted. Other files were ignored.');
      } else {
          setError(null);
      }
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
    // Reset input to allow selecting the same file(s) again
    event.target.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least one PNG image file.');
      return;
    }
    
    setIsConverting(true);
    setError(null);

    try {
      const { PDFDocument } = (window as any).PDFLib;
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const image = await pdfDoc.embedPng(arrayBuffer);
        
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `png-to-pdf-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setFiles([]); // Clear files after successful conversion
    } catch (e) {
      console.error(e);
      setError('An error occurred during conversion. Please ensure all files are valid, uncorrupted PNG images.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolContainer title="PNG to PDF">
      <div className="flex flex-col items-center space-y-6">
        <label htmlFor="file-upload" className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/png"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select PNG files</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop images here</p>
          </div>
        </label>

        {files.length > 0 && (
          <div className="w-full space-y-3">
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Files to convert ({files.length}):</h4>
            <ul className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-md p-3 space-y-2 max-h-60 overflow-y-auto border dark:border-gray-700">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                  <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">{index + 1}. {file.name}</span>
                  <button onClick={() => removeFile(index)} title="Remove file" className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 text-center">Images will be added to the PDF in the order they are listed.</p>
          </div>
        )}

        {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}

        <button
          onClick={handleConvert}
          disabled={isConverting || files.length === 0}
          className="w-full flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {isConverting ? <Spinner /> : `Convert to PDF`}
        </button>
      </div>
    </ToolContainer>
  );
};

export default PngToPdf;
