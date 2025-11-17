import React, { useState } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';
import { generateText } from '../services/geminiService';

declare const html2pdf: any;

const MsOutlookToPdf: React.FC = () => {
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
        // Loosely check for .msg extension as mime type isn't standard
        if (selectedFile && selectedFile.name.toLowerCase().endsWith('.msg')) {
            setFile(selectedFile);
        } else {
            setError('Please select a valid Outlook Mail Message (.msg) file.');
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
            // This will produce a garbled string for a binary file, which we'll send to the AI
            const rawText = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);

            const prompt = `The following text is a raw string extracted from a .msg Outlook email file. It contains a lot of binary noise and control characters. Your task is to intelligently parse this raw data to find and extract key email information: sender (From), recipient(s) (To, Cc), subject, date, and the main email body.
            Format the extracted information into a clean, well-structured HTML document. Use simple HTML tags like <h2> for the subject, <p> for the body, and a simple div or table for the header information (From, To, Date).
            If you cannot find any meaningful email content, respond with the exact string "ERROR: PARSING_FAILED". Do not add any extra text or explanations outside the generated HTML or the error message.

            Raw Text:
            ---
            ${rawText.substring(0, 8000)}
            ---`; // Limit size to avoid hitting token limits

            const htmlContent = await generateText(prompt);

            if (htmlContent.trim().toUpperCase() === "ERROR: PARSING_FAILED") {
                throw new Error("AI could not parse the .msg file. It may be corrupt or in an unsupported format.");
            }

            const element = document.createElement('div');
            element.innerHTML = `<div style="padding: 1.5cm; font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5;">${htmlContent}</div>`;
            
            const options = {
                margin:       [0.5, 0.5, 0.5, 0.5], // in inches
                filename:     `${file.name.replace(/\.msg?$/i, '')}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().from(element).set(options).save();
            
            setSuccess(true);

        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to convert document. The file might be corrupt or in an unsupported format.");
        } finally {
            setIsConverting(false);
        }
    };

    const renderContent = () => {
        if (isConverting) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">AI is parsing and converting your email...</p>
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
                    <input type="file" id="file-upload" accept=".msg" onChange={handleFileChange} className="hidden"/>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select an Outlook (.msg) file</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
                </label>
            </div>
        );
    };

    return (
        <ToolContainer title="MS Outlook to PDF">
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                <p><strong>Note:</strong> This tool uses AI to parse the content from a <strong>.msg</strong> file and convert it into a PDF. Results may vary depending on the email's complexity and formatting.</p>
            </div>
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

export default MsOutlookToPdf;