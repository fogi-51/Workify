import React, { useState, useEffect } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

declare const pdfjsLib: any;
declare const PDFLib: any;
declare const JSZip: any;

const SplitPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false); // For initial PDF processing
    const [isSplitting, setIsSplitting] = useState(false); // For the split operation
    const [error, setError] = useState<string | null>(null);
    const [pagePreviews, setPagePreviews] = useState<string[]>([]);
    const [totalPages, setTotalPages] = useState(0);

    const [splitMode, setSplitMode] = useState<'range' | 'extract'>('range');
    const [range, setRange] = useState('');

    useEffect(() => {
        // Cleanup object URLs for previews
        return () => {
            pagePreviews.forEach(URL.revokeObjectURL);
        };
    }, [pagePreviews]);

    const resetState = () => {
        setFile(null);
        setIsLoading(false);
        setIsSplitting(false);
        setError(null);
        setPagePreviews([]);
        setTotalPages(0);
        setSplitMode('range');
        setRange('');
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        resetState();
        const selectedFile = event.target.files?.[0];
        if (!selectedFile || selectedFile.type !== 'application/pdf') {
            setError('Please select a valid PDF file.');
            return;
        }
        
        setFile(selectedFile);
        setIsLoading(true);

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            setTotalPages(pdfJsDoc.numPages);
            const urls: string[] = [];

            // Generate low-res previews for speed
            for (let i = 1; i <= pdfJsDoc.numPages; i++) {
                const page = await pdfJsDoc.getPage(i);
                const viewport = page.getViewport({ scale: 0.5 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const context = canvas.getContext('2d');
                if (context) {
                    await page.render({ canvasContext: context, viewport }).promise;
                    urls.push(canvas.toDataURL());
                }
            }
            setPagePreviews(urls);
        } catch (e) {
            console.error(e);
            setError('Failed to load PDF. It might be corrupted or password-protected.');
            resetState();
        } finally {
            setIsLoading(false);
        }
    };

    const parseAndValidateRange = (rangeStr: string, max: number): number[] | null => {
        const pages = new Set<number>();
        if (!rangeStr.trim()) {
            setError('Page range cannot be empty.');
            return null;
        }

        try {
            const parts = rangeStr.split(',');
            for (const part of parts) {
                const trimmedPart = part.trim();
                if (trimmedPart.includes('-')) {
                    const [startStr, endStr] = trimmedPart.split('-');
                    const start = parseInt(startStr, 10);
                    const end = parseInt(endStr, 10);
                    if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > max) {
                        throw new Error(`Invalid range: "${trimmedPart}"`);
                    }
                    for (let i = start; i <= end; i++) {
                        pages.add(i - 1); // 0-indexed
                    }
                } else {
                    const pageNum = parseInt(trimmedPart, 10);
                    if (isNaN(pageNum) || pageNum < 1 || pageNum > max) {
                        throw new Error(`Invalid page number: "${trimmedPart}"`);
                    }
                    pages.add(pageNum - 1); // 0-indexed
                }
            }
            setError(null);
            return Array.from(pages).sort((a, b) => a - b);
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    };

    const handleSplit = async () => {
        if (!file) return;

        setIsSplitting(true);
        setError(null);

        try {
            const { PDFDocument } = PDFLib;
            const existingPdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            if (splitMode === 'range') {
                const pageIndices = parseAndValidateRange(range, totalPages);
                if (!pageIndices) {
                    setIsSplitting(false);
                    return;
                }
                const newPdfDoc = await PDFDocument.create();
                const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
                copiedPages.forEach(page => newPdfDoc.addPage(page));

                const pdfBytes = await newPdfDoc.save();
                downloadBlob(pdfBytes, `split-${file.name}`, 'application/pdf');

            } else if (splitMode === 'extract') {
                const zip = new JSZip();
                for (let i = 0; i < totalPages; i++) {
                    const newPdfDoc = await PDFDocument.create();
                    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
                    newPdfDoc.addPage(copiedPage);
                    const pdfBytes = await newPdfDoc.save();
                    zip.file(`${file.name.replace(/\.pdf$/i, '')}-page-${i + 1}.pdf`, pdfBytes);
                }
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                downloadBlob(zipBlob, `${file.name.replace(/\.pdf$/i, '')}-pages.zip`, 'application/zip');
            }

        } catch (e) {
            console.error(e);
            setError('An error occurred while splitting the PDF.');
        } finally {
            setIsSplitting(false);
        }
    };

    const downloadBlob = (data: Uint8Array | Blob, fileName: string, mimeType: string) => {
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const renderFileSelect = () => (
        <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input type="file" id="file-upload" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden"/>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF to split</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
        </label>
    );

    const renderSplitOptions = () => (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 space-y-4">
                    <h4 className="text-lg font-semibold">Split Options</h4>
                    <div className="flex flex-col gap-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                       <button onClick={() => setSplitMode('range')} className={`p-3 rounded-md text-left transition-colors ${splitMode === 'range' ? 'bg-primary-600 text-white shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                           <p className="font-semibold">Split by range</p>
                           <p className="text-sm opacity-90">Create one PDF from selected page ranges.</p>
                       </button>
                        <button onClick={() => setSplitMode('extract')} className={`p-3 rounded-md text-left transition-colors ${splitMode === 'extract' ? 'bg-primary-600 text-white shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                           <p className="font-semibold">Extract all pages</p>
                           <p className="text-sm opacity-90">Create a separate PDF for every page.</p>
                       </button>
                    </div>

                     {splitMode === 'range' && (
                        <div>
                            <label htmlFor="range-input" className="block text-sm font-medium mb-1">Pages to extract</label>
                            <input
                                id="range-input"
                                type="text"
                                value={range}
                                onChange={(e) => setRange(e.target.value)}
                                placeholder="e.g., 1-3, 5, 8-10"
                                className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                             <p className="text-xs text-gray-500 mt-1">Use commas to separate page numbers or ranges.</p>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleSplit}
                            disabled={isSplitting}
                            className="w-full flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400 transition-colors shadow-lg"
                        >
                            {isSplitting ? <Spinner /> : 'Split PDF'}
                        </button>
                        <button onClick={resetState} className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                            Start Over
                        </button>
                    </div>

                </div>
                <div className="md:w-1/2">
                    <h4 className="text-lg font-semibold mb-2">Page Preview ({totalPages} pages)</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 bg-gray-100 dark:bg-gray-900 rounded-lg max-h-96 overflow-y-auto">
                        {pagePreviews.map((url, index) => (
                            <div key={index} className="relative border dark:border-gray-700 rounded overflow-hidden">
                                <img src={url} alt={`Page ${index + 1}`} className="w-full h-auto"/>
                                <div className="absolute bottom-0 right-0 px-1.5 py-0.5 text-xs bg-black bg-opacity-60 text-white rounded-tl-md">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <ToolContainer title="Split PDF">
            {error && <p className="mb-4 text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
            
            {isLoading && (
                 <div className="flex flex-col items-center justify-center h-64">
                    <Spinner />
                    <p className="mt-4">Processing your PDF...</p>
                </div>
            )}

            {!file && !isLoading && renderFileSelect()}
            {file && !isLoading && renderSplitOptions()}

        </ToolContainer>
    );
};

export default SplitPdf;
