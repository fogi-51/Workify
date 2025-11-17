import React, { useState, useEffect } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';
import { editImage } from '../services/geminiService';

declare const pdfjsLib: any;
declare const PDFLib: any;

const PdfWatermarkRemover: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState('');
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    // Clean up object URL
    useEffect(() => {
        return () => {
            if (resultUrl) {
                URL.revokeObjectURL(resultUrl);
            }
        };
    }, [resultUrl]);

    const resetState = () => {
        setFile(null);
        setIsProcessing(false);
        setError(null);
        setProgressMessage('');
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(null);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        resetState();
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            setError('Please select a valid PDF file.');
        }
        event.target.value = ''; // Allow re-selecting
    };

    const dataUrlToBase64 = (dataUrl: string) => {
        return dataUrl.split(',')[1];
    };
    
    const handleRemoveWatermark = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);
        setResultUrl(null);
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            const cleanedImageUrls: string[] = [];
            
            for (let i = 1; i <= numPages; i++) {
                setProgressMessage(`Processing page ${i} of ${numPages}... (Rendering)`);
                const page = await pdf.getPage(i);
                const scale = 2.0; // Higher scale for better quality
                const viewport = page.getViewport({ scale });
                
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const context = canvas.getContext('2d');
                if (!context) throw new Error('Could not get canvas context.');

                await page.render({ canvasContext: context, viewport }).promise;
                const imageUrl = canvas.toDataURL('image/jpeg', 0.95);
                canvas.remove();

                setProgressMessage(`Processing page ${i} of ${numPages}... (AI Cleaning)`);
                const base64Data = dataUrlToBase64(imageUrl);
                const prompt = "Please remove any and all watermarks (text or image) from this document page. The watermark might be faint or prominent. Return only the cleaned page content without the watermark.";
                const cleanedImageUrl = await editImage(base64Data, 'image/jpeg', prompt);

                if (cleanedImageUrl.startsWith('data:image')) {
                    cleanedImageUrls.push(cleanedImageUrl);
                } else {
                    throw new Error(`AI failed to clean page ${i}. Response: ${cleanedImageUrl}`);
                }
            }
            
            setProgressMessage('Assembling final PDF...');
            const { PDFDocument } = PDFLib;
            const newPdfDoc = await PDFDocument.create();

            for (const imageUrl of cleanedImageUrls) {
                const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
                const image = await newPdfDoc.embedJpg(imageBytes);
                
                const page = newPdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }

            const newPdfBytes = await newPdfDoc.save();
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unexpected error occurred. The AI may be unable to process this document.');
        } finally {
            setIsProcessing(false);
            setProgressMessage('');
        }
    };

    const renderContent = () => {
        if (isProcessing) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">{progressMessage}</p>
                    <p className="text-sm text-gray-500">(This can take several minutes for multi-page documents)</p>
                </div>
            );
        }
        
        if (resultUrl) {
            return (
                 <div className="text-center w-full p-6 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700 space-y-6">
                    <h4 className="text-2xl font-bold text-green-800 dark:text-green-200">Watermark Removal Complete!</h4>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                         <a
                            href={resultUrl}
                            download={`watermark-removed-${file?.name || 'document'}.pdf`}
                            className="flex-grow w-full sm:w-auto flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-lg"
                        >
                            Download Cleaned PDF
                        </a>
                         <button
                            onClick={resetState}
                            className="flex-grow w-full sm:w-auto justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors shadow-lg"
                        >
                            Process Another
                        </button>
                    </div>
                </div>
            );
        }

        if (file) {
            return (
                <div className="text-center w-full p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                    <p className="mb-4 text-lg">Selected file: <span className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</span></p>
                    <button
                        onClick={handleRemoveWatermark}
                        className="w-full max-w-sm flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Remove Watermark
                    </button>
                </div>
            );
        }
        
        return (
            <div className="flex flex-col items-center space-y-6">
                <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="file" id="file-upload" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden"/>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 11.414V14a1 1 0 102 0v-2.586l.293.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
                    </svg>
                    <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF file</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
                </label>
            </div>
        );
    };

    return (
        <ToolContainer title="PDF Watermark Remover">
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                <p><strong>Note:</strong> This tool uses AI to identify and remove watermarks from each page. Results depend on the document's complexity and the watermark's visibility. This process may take several minutes.</p>
            </div>
            {error && <p className="mb-4 text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
            {renderContent()}
        </ToolContainer>
    );
};

export default PdfWatermarkRemover;
