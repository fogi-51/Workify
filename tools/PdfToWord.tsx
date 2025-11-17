import React, { useState, useEffect } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';
import { generateText } from '../services/geminiService';

declare const pdfjsLib: any;

const PdfToWord: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [convertedText, setConvertedText] = useState<string | null>(null);
    
    useEffect(() => {
        // No object URLs to clean up, but keeping for good practice.
        return () => {};
    }, []);

    const resetState = () => {
        setFile(null);
        setIsConverting(false);
        setError(null);
        setConvertedText(null);
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
    
    const handleConvert = async () => {
        if (!file) return;

        setIsConverting(true);
        setError(null);
        setConvertedText(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n\n';
            }
            
            if (!fullText.trim()) {
                throw new Error("Could not extract any text from the PDF. It might be an image-only PDF.");
            }

            const prompt = `Reformat the following text, which was extracted from a PDF, into a clean, well-structured document suitable for Microsoft Word. Preserve the original meaning, paragraphs, headings, and lists. Do not add any new content or summaries. Just format the existing text.\n\n---START OF EXTRACTED TEXT---\n\n${fullText}\n\n---END OF EXTRACTED TEXT---`;
            
            const formattedText = await generateText(prompt);
            setConvertedText(formattedText);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Failed to convert PDF. The file might be corrupted, protected, or contain no selectable text.');
        } finally {
            setIsConverting(false);
        }
    };

    const handleDownload = () => {
        if (!convertedText || !file) return;
        
        const blob = new Blob([convertedText], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace(/\.pdf$/i, '')}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const renderInitialView = () => (
        <div className="flex flex-col items-center space-y-6">
            <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input type="file" id="file-upload" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden"/>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF to convert to Word</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
            </label>
        </div>
    );

    const renderSelectedFileView = () => (
        <div className="text-center w-full p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
            <p className="mb-4 text-lg">Selected file: <span className="font-semibold text-gray-800 dark:text-gray-200">{file!.name}</span></p>
            <button
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full max-w-sm flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
                {isConverting ? <Spinner /> : 'Convert to Word'}
            </button>
        </div>
    );

    const renderResultView = () => {
        if (!convertedText) return null;
        return (
            <div className="text-center w-full p-6 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700 space-y-6">
                <h4 className="text-2xl font-bold text-green-800 dark:text-green-200">Conversion Successful!</h4>
                <p className="text-gray-600 dark:text-gray-300">Your document is ready for download.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button
                        onClick={handleDownload}
                        className="flex-grow w-full sm:w-auto flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-lg"
                    >
                        Download Word Document
                    </button>
                    <button
                        onClick={resetState}
                        className="flex-grow w-full sm:w-auto justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors shadow-lg"
                    >
                        Convert Another
                    </button>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        if (isConverting) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Extracting text & formatting...</p>
                    <p className="text-sm text-gray-500">(This may take a moment for large documents)</p>
                </div>
            );
        }
        
        if (convertedText) {
            return renderResultView();
        }
        
        if (file) {
            return renderSelectedFileView();
        }
        
        return renderInitialView();
    };

    return (
        <ToolContainer title="PDF to Word">
            {error && <p className="mb-4 text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
            {renderContent()}
        </ToolContainer>
    );
};

export default PdfToWord;
