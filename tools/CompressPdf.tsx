import React, { useState, useEffect } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

declare const pdfjsLib: any;
declare const PDFLib: any;

const CompressPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; originalSize: number; newSize: number } | null>(null);

  // Clean up object URL when component unmounts or result changes
  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  const resetState = () => {
    setFile(null);
    setIsCompressing(false);
    setError(null);
    setResult(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetState();
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      setError('Please select a valid PDF file.');
    }
    event.target.value = ''; // Allow re-selecting the same file
  };
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsCompressing(true);
    setError(null);
    setResult(null);

    try {
      const originalArrayBuffer = await file.arrayBuffer();
      
      // Load the PDF with pdf.js to render pages
      const pdfJsDoc = await pdfjsLib.getDocument({ data: originalArrayBuffer }).promise;
      
      // Create a new PDF with pdf-lib
      const { PDFDocument } = PDFLib;
      const newPdfDoc = await PDFDocument.create();

      const numPages = pdfJsDoc.numPages;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error("Could not create canvas context.");

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 }); // Use scale 1.0, quality reduction will handle size
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        
        // Convert canvas to a lower quality JPEG
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 is a good balance
        const imageBytes = await fetch(imageDataUrl).then(res => res.arrayBuffer());
        
        // Embed the JPEG into the new PDF
        const jpgImage = await newPdfDoc.embedJpg(imageBytes);
        
        // Add a page with the same dimensions as the image
        const newPage = newPdfDoc.addPage([jpgImage.width, jpgImage.height]);
        newPage.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: jpgImage.width,
          height: jpgImage.height,
        });
      }
      
      canvas.remove(); // Clean up canvas element
      
      const newPdfBytes = await newPdfDoc.save();
      const newSize = newPdfBytes.length;
      const originalSize = file.size;

      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setResult({ url, originalSize, newSize });

    } catch (e) {
      console.error(e);
      setError('Failed to compress PDF. The file might be corrupted, protected, or too complex.');
    } finally {
      setIsCompressing(false);
    }
  };

  const renderInitialView = () => (
     <div className="flex flex-col items-center space-y-6">
        <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input type="file" id="file-upload" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden"/>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF to compress</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
        </label>
    </div>
  );
  
  const renderSelectedFileView = () => (
    <div className="text-center w-full p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
        <p className="mb-4 text-lg">Selected file: <span className="font-semibold text-gray-800 dark:text-gray-200">{file!.name}</span></p>
        <p className="mb-6 text-md text-gray-600 dark:text-gray-300">Size: {formatBytes(file!.size)}</p>
        <button
            onClick={handleCompress}
            disabled={isCompressing}
            className="w-full max-w-sm flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
        >
            Compress PDF
        </button>
    </div>
  );

  const renderResultView = () => {
      if (!result) return null;
      const reduction = result.originalSize > 0 ? Math.round(((result.originalSize - result.newSize) / result.originalSize) * 100) : 0;
      return (
        <div className="text-center w-full p-6 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700 space-y-6">
            <h4 className="text-2xl font-bold text-green-800 dark:text-green-200">Compression Complete!</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Original Size</p>
                    <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{formatBytes(result.originalSize)}</p>
                </div>
                 <div>
                    <p className="text-gray-500 dark:text-gray-400">New Size</p>
                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">{formatBytes(result.newSize)}</p>
                </div>
                 <div>
                    <p className="text-gray-500 dark:text-gray-400">Reduction</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{reduction}%</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                 <a
                    href={result.url}
                    download={`compressed-${file?.name || 'document'}.pdf`}
                    className="flex-grow w-full sm:w-auto flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-lg"
                >
                    Download Compressed PDF
                </a>
                 <button
                    onClick={resetState}
                    className="flex-grow w-full sm:w-auto justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors shadow-lg"
                >
                    Compress Another
                </button>
            </div>
        </div>
      );
  }

  return (
    <ToolContainer title="Compress PDF">
        <div className="relative">
             {isCompressing && (
                <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 flex flex-col justify-center items-center z-20 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Compressing your PDF, please wait...</p>
                    <p className="text-sm text-gray-500">(This may take a moment for large files)</p>
                </div>
            )}
            
            {error && (
                <div className="mb-4 w-full text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    <span>{error}</span>
                </div>
            )}

            {result ? renderResultView() : (file ? renderSelectedFileView() : renderInitialView())}
        </div>
    </ToolContainer>
  );
};

export default CompressPdf;