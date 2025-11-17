import React, { useState, useEffect } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

declare const PDFLib: any;

const ProtectPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isProtecting, setIsProtecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
        setPassword('');
        setConfirmPassword('');
        setIsProtecting(false);
        setError(null);
        if (resultUrl) {
            URL.revokeObjectURL(resultUrl);
        }
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

    const handleProtect = async () => {
        if (!file) {
            setError('Please select a PDF file.');
            return;
        }
        if (!password) {
            setError('Password cannot be empty.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsProtecting(true);
        setError(null);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(null);

        try {
            const { PDFDocument } = PDFLib;
            const arrayBuffer = await file.arrayBuffer();
            
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Encrypt the PDF with the user's password.
            const pdfBytes = await pdfDoc.save({
                userPassword: password,
            });

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);

        } catch (e: any) {
            console.error(e);
            setError('Failed to protect PDF. The file might be corrupted or already encrypted with restrictions.');
        } finally {
            setIsProtecting(false);
        }
    };

    const renderInitialView = () => (
        <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input type="file" id="file-upload" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden"/>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF to protect</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
        </label>
    );

    const renderSelectedFileView = () => (
        <div className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                <p>Selected file: <span className="font-semibold text-gray-800 dark:text-gray-200">{file!.name}</span></p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Set a password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm password
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <button
                onClick={handleProtect}
                disabled={isProtecting || !password || !confirmPassword}
                className="w-full flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
                {isProtecting ? <Spinner /> : 'Protect PDF'}
            </button>
        </div>
    );
    
    const renderResultView = () => (
         <div className="text-center w-full p-6 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700 space-y-6">
            <h4 className="text-2xl font-bold text-green-800 dark:text-green-200">PDF Protected Successfully!</h4>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                 <a
                    href={resultUrl!}
                    download={`protected-${file?.name || 'document'}.pdf`}
                    className="flex-grow w-full sm:w-auto flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-lg"
                >
                    Download Protected PDF
                </a>
                 <button
                    onClick={resetState}
                    className="flex-grow w-full sm:w-auto justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors shadow-lg"
                >
                    Protect Another
                </button>
            </div>
        </div>
    );

    const renderContent = () => {
        if (isProtecting) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <Spinner />
                    <p className="mt-4">Encrypting your PDF, please wait...</p>
                </div>
            );
        }
        if (resultUrl) {
            return renderResultView();
        }
        if (file) {
            return renderSelectedFileView();
        }
        return renderInitialView();
    };

    return (
        <ToolContainer title="Protect PDF">
            {error && <p className="mb-4 text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
            {renderContent()}
        </ToolContainer>
    );
};

export default ProtectPdf;