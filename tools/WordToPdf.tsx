import React, { useState } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

// Declare global variables for libraries loaded via script tags
declare const mammoth: any;
declare const html2pdf: any;

const WordToPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const resetState = () => {
        setFile(null);
        setIsConverting(false);
        setError(null);
        setSuccess(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        resetState();
        const selectedFile = event.target.files?.[0];
        if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || selectedFile.name.endsWith('.docx'))) {
            setFile(selectedFile);
        } else {
            setError('Please select a valid Word (.docx) file.');
        }
        event.target.value = ''; // Allow re-selecting the same file
    };

    const handleConvert = async () => {
        if (!file) return;

        setIsConverting(true);
        setError(null);
        setSuccess(false);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const htmlContent = result.value;

            const element = document.createElement('div');
            // Basic A4 page styling
            element.innerHTML = `<div style="padding: 2cm; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">${htmlContent}</div>`;
            
            const options = {
                margin:       [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right in inches
                filename:     `${file.name.replace(/\.docx?$/i, '')}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().from(element).set(options).save();
            
            setSuccess(true);

        } catch (e) {
            console.error(e);
            setError("Failed to convert document. The file might be corrupt or use unsupported features.");
        } finally {
            setIsConverting(false);
        }
    };

    const renderContent = () => {
        if (isConverting) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Converting your document...</p>
                    <p className="text-sm text-gray-500">(This may take a moment)</p>
                </div>
            );
        }

        if (success) {
            return (
                 <div className="text-center w-full p-6 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700 space-y-6">
                    <h4 className="text-2xl font-bold text-green-800 dark:text-green-200">Conversion Complete!</h4>
                    <p className="text-gray-600 dark:text-gray-300">Your PDF download should have started automatically.</p>
                    <button
                        onClick={resetState}
                        className="w-full max-w-sm flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors shadow-lg"
                    >
                        Convert Another File
                    </button>
                </div>
            );
        }

        if (file) {
            return (
                <div className="text-center w-full p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                    <p className="mb-4 text-lg">Selected file: <span className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</span></p>
                    <button
                        onClick={handleConvert}
                        className="w-full max-w-sm flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Convert to PDF
                    </button>
                </div>
            );
        }
        
        return (
             <div className="flex flex-col items-center space-y-6">
                <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="file" id="file-upload" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} className="hidden"/>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a Word (.docx) file</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
                </label>
            </div>
        );
    };

    return (
        <ToolContainer title="Word to PDF">
            {error && (
                <div className="mb-4 w-full max-w-lg mx-auto text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    <span>{error}</span>
                </div>
            )}
            {renderContent()}
        </ToolContainer>
    );
};

export default WordToPdf;