import React, { useState, useEffect, useCallback } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

// Declare globals for libraries loaded from script tags
declare const pdfjsLib: any;
declare const PDFLib: any;

// Define types for our options
type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type PageNumberFormat = '1' | 'Page 1' | '1 of n' | 'Page 1 of n';
type FontFamily = 'Helvetica' | 'Times-Roman' | 'Courier';

// A component to render a live preview of the page number style and position
const PreviewNumber: React.FC<{
    format: PageNumberFormat,
    position: Position,
    margin: number,
    totalPages: number,
    startNumber: number,
    fontSize: number,
    fontColor: string,
    fontFamily: FontFamily,
}> = ({ format, position, margin, totalPages, startNumber, fontSize, fontColor, fontFamily }) => {
    
    const pageNumber = startNumber;
    let text = '';
    switch (format) {
        case '1': text = `${pageNumber}`; break;
        case 'Page 1': text = `Page ${pageNumber}`; break;
        case '1 of n': text = `${pageNumber} of ${totalPages}`; break;
        case 'Page 1 of n': text = `Page ${pageNumber} of ${totalPages}`; break;
    }
    
    // Scale up options to match the 1.5x scaled preview image
    const scaledMargin = margin * 1.5; 
    const scaledFontSize = fontSize * 1.5;
    
    const style: React.CSSProperties = {
        position: 'absolute',
        fontSize: `${scaledFontSize}px`,
        color: fontColor,
        fontFamily: fontFamily.split('-')[0], // e.g., 'Helvetica-Bold' -> 'Helvetica'
        whiteSpace: 'nowrap',
        padding: '3px 5px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid #ccc',
        borderRadius: '3px',
        zIndex: 10,
    };

    if (position.includes('top')) style.top = `${scaledMargin}px`;
    if (position.includes('bottom')) style.bottom = `${scaledMargin}px`;
    if (position.includes('left')) style.left = `${scaledMargin}px`;
    if (position.includes('right')) style.right = `${scaledMargin}px`;
    
    if (position.includes('center')) {
        style.left = '50%';
        if (position.includes('left') || position.includes('right')) {
             style.transform = '';
        } else {
            style.transform = 'translateX(-50%)';
        }
    }
    
    return <div style={style}>{text}</div>;
};


const AddNumbersToPdf: React.FC = () => {
    // File and processing state
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Numbering options
    const [position, setPosition] = useState<Position>('bottom-center');
    const [pageNumberFormat, setPageNumberFormat] = useState<PageNumberFormat>('1');
    const [pagesToNumber, setPagesToNumber] = useState('all');
    const [startNumber, setStartNumber] = useState(1);
    const [fontSize, setFontSize] = useState(12);
    const [fontColor, setFontColor] = useState('#000000');
    const [fontFamily, setFontFamily] = useState<FontFamily>('Helvetica');
    const [margin, setMargin] = useState(36); // in points (pt), 0.5 inch

    const cleanup = useCallback(() => {
        if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    }, [pdfPreviewUrl]);

    useEffect(() => {
        return () => cleanup();
    }, [cleanup]);

    const resetState = () => {
        cleanup();
        setPdfFile(null);
        setPdfPreviewUrl(null);
        setTotalPages(0);
        setIsProcessing(false);
        setProcessingMessage('');
        setError(null);
        setSuccessMessage(null);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        resetState();
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
            setIsProcessing(true);
            setProcessingMessage('Loading PDF preview...');
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                setTotalPages(pdfJsDoc.numPages);
                
                const page = await pdfJsDoc.getPage(1);
                const viewport = page.getViewport({ scale: 1.5 });

                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const context = canvas.getContext('2d');
                if (context) {
                    await page.render({ canvasContext: context, viewport }).promise;
                    setPdfPreviewUrl(canvas.toDataURL());
                }
            } catch (e) {
                console.error(e);
                setError('Failed to load PDF preview. The file might be corrupted or protected.');
                resetState();
            } finally {
                setIsProcessing(false);
                setProcessingMessage('');
            }
        } else {
            setError('Please select a valid PDF file.');
        }
        event.target.value = '';
    };

    const parsePageRange = (rangeStr: string, max: number): number[] | null => {
        const trimmedStr = rangeStr.trim().toLowerCase();
        if (trimmedStr === 'all') {
            return Array.from({ length: max }, (_, i) => i);
        }
        if (!trimmedStr) {
            setError('Page range cannot be empty.');
            return null;
        }

        const pages = new Set<number>();
        try {
            const parts = trimmedStr.split(',');
            for (const part of parts) {
                const trimmedPart = part.trim();
                if (trimmedPart.includes('-')) {
                    const [startStr, endStr] = trimmedPart.split('-');
                    const start = parseInt(startStr, 10);
                    const end = parseInt(endStr, 10);
                    if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > max) throw new Error(`Invalid range: "${trimmedPart}"`);
                    for (let i = start; i <= end; i++) pages.add(i - 1); // 0-indexed
                } else {
                    const pageNum = parseInt(trimmedPart, 10);
                    if (isNaN(pageNum) || pageNum < 1 || pageNum > max) throw new Error(`Invalid page number: "${trimmedPart}"`);
                    pages.add(pageNum - 1); // 0-indexed
                }
            }
            setError(null);
            return Array.from(pages).sort((a, b) => a - b);
        } catch (err: any) {
            setError(err.message || `Invalid page range format. Use numbers, commas, and hyphens (e.g., "1-3, 5, 8-10").`);
            return null;
        }
    };

    const handleAddNumbers = async () => {
        if (!pdfFile) return;

        const pagesToProcess = parsePageRange(pagesToNumber, totalPages);
        if (!pagesToProcess) return;

        setIsProcessing(true);
        setProcessingMessage('Adding page numbers...');
        setError(null);

        try {
            const { PDFDocument, StandardFonts, rgb } = PDFLib;
            const existingPdfBytes = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            
            const fontMap = {
                'Helvetica': StandardFonts.Helvetica,
                'Times-Roman': StandardFonts.TimesRoman,
                'Courier': StandardFonts.Courier,
            };
            const embeddedFont = await pdfDoc.embedFont(fontMap[fontFamily]);
            
            const colorRgb = {
                r: parseInt(fontColor.slice(1, 3), 16) / 255,
                g: parseInt(fontColor.slice(3, 5), 16) / 255,
                b: parseInt(fontColor.slice(5, 7), 16) / 255,
            };

            const pdfPages = pdfDoc.getPages();

            pagesToProcess.forEach((pageIndex, i) => {
                const page = pdfPages[pageIndex];
                const { width, height } = page.getSize();
                const pageNumber = startNumber + i;
                
                let text = '';
                switch (pageNumberFormat) {
                    case '1': text = `${pageNumber}`; break;
                    case 'Page 1': text = `Page ${pageNumber}`; break;
                    case '1 of n': text = `${pageNumber} of ${totalPages}`; break;
                    case 'Page 1 of n': text = `Page ${pageNumber} of ${totalPages}`; break;
                }
                
                const textWidth = embeddedFont.widthOfTextAtSize(text, fontSize);
                const textHeight = embeddedFont.heightAtSize(fontSize);
                
                let x = 0, y = 0;
                if (position.includes('left')) x = margin;
                if (position.includes('center')) x = (width - textWidth) / 2;
                if (position.includes('right')) x = width - textWidth - margin;
                if (position.includes('top')) y = height - textHeight - (margin / 2); // Adjust for baseline
                if (position.includes('bottom')) y = margin;
                
                page.drawText(text, { x, y, size: fontSize, font: embeddedFont, color: rgb(colorRgb.r, colorRgb.g, colorRgb.b) });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `numbered-${pdfFile.name}`;
            a.click();
            URL.revokeObjectURL(url);
            
            setSuccessMessage('Successfully added page numbers! Your download has started.');
            setTimeout(() => {
                resetState();
            }, 4000);

        } catch (e) {
            console.error(e);
            setError('An error occurred while adding page numbers.');
        } finally {
            setIsProcessing(false);
            setProcessingMessage('');
        }
    };
    
    const renderFileSelect = () => (
         <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input type="file" id="file-upload" accept=".pdf" onChange={handleFileChange} className="hidden"/>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF to add page numbers</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
        </label>
    );

    const renderEditor = () => (
        <div className="relative">
             {isProcessing && (
                <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 flex flex-col justify-center items-center z-20 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">{processingMessage}</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Preview Panel */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Preview (Page 1)</h4>
                    <div className="relative w-full h-[30rem] bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden flex justify-center items-center p-2 shadow-inner">
                        {pdfPreviewUrl ? (
                            <>
                                <img src={pdfPreviewUrl} alt="PDF Preview" className="max-w-full max-h-full object-contain" />
                                <PreviewNumber {...{ format: pageNumberFormat, position, margin, totalPages, startNumber, fontSize, fontColor, fontFamily }} />
                            </>
                        ) : <Spinner />}
                    </div>
                </div>
                {/* Options Panel */}
                <div className="space-y-4">
                     <h4 className="font-semibold text-lg">Numbering Options</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                             <label className="text-sm font-medium">Position</label>
                             <select value={position} onChange={e => setPosition(e.target.value as Position)} className="w-full mt-1 p-2 bg-white dark:bg-gray-700 border rounded">
                                <option value="top-left">Top Left</option>
                                <option value="top-center">Top Center</option>
                                <option value="top-right">Top Right</option>
                                <option value="bottom-left">Bottom Left</option>
                                <option value="bottom-center">Bottom Center</option>
                                <option value="bottom-right">Bottom Right</option>
                             </select>
                         </div>
                          <div>
                             <label className="text-sm font-medium">Format</label>
                             <select value={pageNumberFormat} onChange={e => setPageNumberFormat(e.target.value as PageNumberFormat)} className="w-full mt-1 p-2 bg-white dark:bg-gray-700 border rounded">
                                <option value="1">1</option>
                                <option value="Page 1">Page 1</option>
                                <option value="1 of n">1 of {totalPages}</option>
                                <option value="Page 1 of n">Page 1 of {totalPages}</option>
                             </select>
                         </div>
                          <div>
                             <label className="text-sm font-medium">Pages to number</label>
                             <input type="text" value={pagesToNumber} onChange={e => setPagesToNumber(e.target.value)} placeholder="all" className="w-full mt-1 p-2 bg-white dark:bg-gray-700 border rounded"/>
                         </div>
                          <div>
                             <label className="text-sm font-medium">Start number</label>
                             <input type="number" value={startNumber} min="1" onChange={e => setStartNumber(Number(e.target.value))} className="w-full mt-1 p-2 bg-white dark:bg-gray-700 border rounded"/>
                         </div>
                         <div>
                             <label className="text-sm font-medium">Font</label>
                             <select value={fontFamily} onChange={e => setFontFamily(e.target.value as FontFamily)} className="w-full mt-1 p-2 bg-white dark:bg-gray-700 border rounded">
                                <option value="Helvetica">Helvetica</option>
                                <option value="Times-Roman">Times New Roman</option>
                                <option value="Courier">Courier</option>
                             </select>
                         </div>
                          <div>
                             <label className="text-sm font-medium">Font size</label>
                             <input type="number" value={fontSize} min="6" onChange={e => setFontSize(Number(e.target.value))} className="w-full mt-1 p-2 bg-white dark:bg-gray-700 border rounded"/>
                         </div>
                          <div className="col-span-1 sm:col-span-2">
                             <label className="text-sm font-medium">Color</label>
                             <input type="color" value={fontColor} onChange={e => setFontColor(e.target.value)} className="w-full h-10 mt-1 p-1 bg-white dark:bg-gray-700 border rounded"/>
                         </div>
                           <div className="col-span-1 sm:col-span-2">
                             <label className="text-sm font-medium">Margin from edge ({margin} pt)</label>
                             <input type="range" min="18" max="144" step="6" value={margin} onChange={e => setMargin(Number(e.target.value))} className="w-full mt-1"/>
                         </div>
                     </div>
                     
                    <div className="flex gap-4 pt-4">
                        <button onClick={handleAddNumbers} disabled={isProcessing} className="w-full flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 transition-colors shadow-lg">
                            Add Page Numbers
                        </button>
                         <button onClick={resetState} className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                            Start Over
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <ToolContainer title="Add Page Numbers to PDF">
            {error && (
                <div className="mb-4 w-full text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    <span>{error}</span>
                </div>
            )}
            {successMessage && (
                 <div className="mb-4 w-full text-center text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 p-3 rounded-md border border-green-200 dark:border-green-800 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <span>{successMessage}</span>
                </div>
            )}
            
            {!pdfFile ? renderFileSelect() : renderEditor()}
        </ToolContainer>
    );
};

export default AddNumbersToPdf;