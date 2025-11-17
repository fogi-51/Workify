import React, { useState } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';
import { generateText } from '../services/geminiService';

declare const pdfjsLib: any;

const PdfToExcel: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [convertedCsv, setConvertedCsv] = useState<string | null>(null);

    const resetState = () => {
        setFile(null);
        setIsConverting(false);
        setError(null);
        setConvertedCsv(null);
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
        setConvertedCsv(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += `--- Page ${i} ---\n${pageText}\n\n`;
            }
            
            if (!fullText.trim()) {
                throw new Error("Could not extract any text from the PDF. It might be an image-only PDF.");
            }

            const prompt = `Analyze the following text extracted from a PDF document and identify any tables. Convert each identified table into a CSV (Comma-Separated Values) format. Ensure that commas within a cell are handled correctly, for instance by enclosing the cell content in double quotes. Each table should be clearly separated. If there are multiple tables, you can add a header like "--- TABLE 1 ---" before each CSV block. If no tables are found, respond with the exact message: "NO_TABLES_FOUND". Do not add any extra explanations or introductory text, only the CSV data or the 'NO_TABLES_FOUND' message.\n\n---START OF EXTRACTED TEXT---\n\n${fullText}\n\n---END OF EXTRACTED TEXT---`;
            
            const csvResult = await generateText(prompt);

            if (csvResult.trim().toUpperCase() === "NO_TABLES_FOUND") {
                throw new Error("No tabular data was found in the PDF document by the AI.");
            }
            
            setConvertedCsv(csvResult);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Failed to convert PDF. The file might be corrupted, protected, or contain no selectable text.');
        } finally {
            setIsConverting(false);
        }
    };

    const handleDownload = () => {
        if (!convertedCsv || !file) return;
        
        const blob = new Blob([convertedCsv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace(/\.pdf$/i, '')}.csv`;
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
                <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF to convert to Excel (CSV)</p>
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
                {isConverting ? <Spinner /> : 'Convert to Excel (CSV)'}
            </button>
        </div>
    );

    const renderResultView = () => {
        if (!convertedCsv) return null;
        return (
            <div className="w-full space-y-6">
                 <div className="text-center p-6 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700 space-y-4">
                    <h4 className="text-2xl font-bold text-green-800 dark:text-green-200">Conversion Successful!</h4>
                    <p className="text-gray-600 dark:text-gray-300">Your CSV file, ready for Excel, has been generated.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <button
                            onClick={handleDownload}
                            className="flex-grow w-full sm:w-auto flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-lg"
                        >
                            Download CSV File
                        </button>
                        <button
                            onClick={resetState}
                            className="flex-grow w-full sm:w-auto justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors shadow-lg"
                        >
                            Convert Another
                        </button>
                    </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                    <h5 className="font-semibold mb-2">Preview of CSV Data:</h5>
                    <textarea
                        readOnly
                        value={convertedCsv}
                        className="w-full h-48 p-2 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md font-mono text-sm"
                    />
                </div>
            </div>
        );
    }

    const renderContent = () => {
        if (isConverting) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">AI is analyzing your PDF for tables...</p>
                    <p className="text-sm text-gray-500">(This can take a moment for large documents)</p>
                </div>
            );
        }
        
        if (convertedCsv) {
            return renderResultView();
        }
        
        if (file) {
            return renderSelectedFileView();
        }
        
        return renderInitialView();
    };

    return (
        <ToolContainer title="PDF to Excel (via CSV)">
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                <p><strong>Note:</strong> This tool uses AI to extract tables from your PDF and converts them into a CSV (Comma-Separated Values) file, which can be opened directly in Microsoft Excel, Google Sheets, or any spreadsheet software.</p>
            </div>
            {error && <p className="mb-4 text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
            {renderContent()}
        </ToolContainer>
    );
};

export default PdfToExcel;
