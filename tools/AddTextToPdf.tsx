import React, { useState, useRef, useCallback } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

// Declare global variables for libraries loaded via script tags
declare const pdfjsLib: any;
declare const PDFLib: any;

// Define the structure for a text edit
type TextEdit = {
    type: 'text';
    x: number;
    y: number;
    text: string;
    size: number;
    color: string;
    font: string; // Font name
};

const AVAILABLE_FONTS = [
    'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique', 'Helvetica-BoldOblique',
    'Times-Roman', 'Times-Bold', 'Times-Italic', 'Times-BoldItalic',
    'Courier', 'Courier-Bold', 'Courier-Oblique', 'Courier-BoldOblique'
];


const AddTextToPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    // Edits are stored per page index
    const [edits, setEdits] = useState<Record<number, TextEdit[]>>({});
    
    // Tool settings
    const [textColor, setTextColor] = useState('#000000');
    const [textSize, setTextSize] = useState(16);
    const [font, setFont] = useState('Helvetica');

    const pdfDocRef = useRef<any>(null); // For pdf-lib document
    const pageDimensionsRef = useRef<{width: number, height: number}[]>([]);

    const resetState = useCallback(() => {
        setFile(null);
        setPages([]);
        setIsProcessing(false);
        setProcessingMessage('');
        setError(null);
        setSuccessMessage(null);
        setEdits({});
        pdfDocRef.current = null;
        pageDimensionsRef.current = [];
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile || selectedFile.type !== 'application/pdf') {
            setError('Please select a valid PDF file.');
            return;
        }
        resetState();
        setFile(selectedFile);
        setIsProcessing(true);
        setProcessingMessage('Loading your document...');
        setError(null);

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            
            // Load with pdf-lib for later editing
            pdfDocRef.current = await PDFLib.PDFDocument.load(arrayBuffer);
            
            // Load with pdf.js for rendering previews
            const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdfJsDoc.numPages;
            const pageUrls: string[] = [];
            pageDimensionsRef.current = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdfJsDoc.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                pageDimensionsRef.current.push({ width: viewport.width, height: viewport.height });
                
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const context = canvas.getContext('2d');
                
                if (context) {
                    await page.render({ canvasContext: context, viewport }).promise;
                    pageUrls.push(canvas.toDataURL());
                }
            }
            setPages(pageUrls);
        } catch (e) {
            console.error(e);
            setError('Failed to load PDF. It might be corrupted or password-protected.');
            resetState();
        } finally {
            setIsProcessing(false);
            setProcessingMessage('');
        }
    };
    
    const addEdit = (pageIndex: number, edit: TextEdit) => {
        setEdits(prev => {
            const newEditsForPage = [...(prev[pageIndex] || []), edit];
            return { ...prev, [pageIndex]: newEditsForPage };
        });
    };

    const handlePageClick = (pageIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const text = prompt('Enter text to add:', '');
        if (text) {
            addEdit(pageIndex, { type: 'text', x, y, text, size: textSize, color: textColor, font });
        }
    };
    
    const handleSave = async () => {
        if (!pdfDocRef.current || !file) return;
        setIsProcessing(true);
        setProcessingMessage('Applying text and saving PDF...');
        try {
            // We need to re-load the document from the original buffer to start fresh
            const freshPdfDoc = await PDFLib.PDFDocument.load(await file.arrayBuffer());
            pdfDocRef.current = freshPdfDoc;

            const pdfPages = freshPdfDoc.getPages();
            const { rgb, StandardFonts } = PDFLib;

            // Embed fonts
            const embeddedFonts: Record<string, any> = {};
            for (const fontName of AVAILABLE_FONTS) {
                // @ts-ignore
                embeddedFonts[fontName] = await freshPdfDoc.embedFont(StandardFonts[fontName]);
            }

            for (const pageIndexStr in edits) {
                const pageIndex = parseInt(pageIndexStr, 10);
                const page = pdfPages[pageIndex];
                const pageEdits = edits[pageIndex];
                const pageDims = pageDimensionsRef.current[pageIndex];

                for (const edit of pageEdits) {
                    // Function to convert canvas coordinates to PDF coordinates
                    const pdfX = (coordX: number) => (coordX / pageDims.width) * page.getWidth();
                    const pdfY = (coordY: number) => page.getHeight() - ((coordY / pageDims.height) * page.getHeight());
                    const pdfSize = edit.size * (page.getWidth() / pageDims.width);

                    page.drawText(edit.text, {
                        x: pdfX(edit.x),
                        y: pdfY(edit.y) - pdfSize, // Adjust for text baseline
                        size: pdfSize, 
                        font: embeddedFonts[edit.font],
                        color: rgb(
                            parseInt(edit.color.slice(1, 3), 16) / 255,
                            parseInt(edit.color.slice(3, 5), 16) / 255,
                            parseInt(edit.color.slice(5, 7), 16) / 255
                        ),
                    });
                }
            }

            const pdfBytes = await freshPdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `text-added-${file?.name || 'document'}.pdf`;
            a.click();
            URL.revokeObjectURL(url);

            setSuccessMessage('Successfully saved! Your download has started.');
             setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);

        } catch (e) {
            console.error(e);
            setError('An error occurred while saving the PDF.');
        } finally {
            setIsProcessing(false);
            setProcessingMessage('');
        }
    };
    
    // A simple toolbar for text properties
    const Toolbar = () => (
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-md sticky top-4 z-20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="text-color" className="text-sm font-medium">Color:</label>
                    <input id="text-color" type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 cursor-pointer rounded border-gray-300 dark:border-gray-600"/>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="text-size" className="text-sm font-medium">Size:</label>
                    <input id="text-size" type="number" value={textSize} min="1" max="200" onChange={e => setTextSize(parseInt(e.target.value))} className="w-20 p-1 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                </div>
                 <div className="flex items-center gap-2">
                    <label htmlFor="font-family" className="text-sm font-medium">Font:</label>
                    <select id="font-family" value={font} onChange={e => setFont(e.target.value)} className="p-1 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                        {AVAILABLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
            </div>
             <div className="flex items-center gap-2">
                 <button onClick={handleSave} disabled={isProcessing || Object.keys(edits).length === 0} className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                    Save & Download
                </button>
                <button onClick={resetState} className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">Start Over</button>
            </div>
        </div>
    );
    
    // Renders the text edits on top of the page previews
    const EditOverlay = ({ pageIndex }: { pageIndex: number }) => {
        const pageEdits = edits[pageIndex] || [];
        const { width, height } = pageDimensionsRef.current[pageIndex];

        return (
            <div className="absolute top-0 left-0" style={{ width, height, pointerEvents: 'none' }}>
                {pageEdits.map((edit, idx) => (
                    <div key={idx} style={{
                        position: 'absolute',
                        left: edit.x,
                        top: edit.y,
                        fontSize: edit.size,
                        color: edit.color,
                        fontFamily: edit.font.split('-')[0], // e.g., Helvetica-Bold -> Helvetica
                        fontWeight: edit.font.includes('Bold') ? 'bold' : 'normal',
                        fontStyle: edit.font.includes('Oblique') || edit.font.includes('Italic') ? 'italic' : 'normal',
                        whiteSpace: 'pre',
                        transform: `translateY(-${edit.size * 0.9}px)`, // Adjust vertical alignment for baseline
                    }}>
                        {edit.text}
                    </div>
                ))}
            </div>
        );
    };

    if (!file) {
        return (
            <ToolContainer title="Add Text To PDF">
                {error && (
                    <div className="mb-4 w-full text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        <span>{error}</span>
                    </div>
                )}
                <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="file" id="file-upload" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden"/>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF to add text to</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
                </label>
            </ToolContainer>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            <ToolContainer title={`Adding text to: ${file.name}`}>
                <div className="relative">
                    {isProcessing && (
                        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 flex flex-col justify-center items-center z-20 rounded-lg">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">{processingMessage}</p>
                        </div>
                    )}
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
                    <Toolbar />
                    <div className="mt-4 space-y-4 bg-gray-200 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-[75vh]">
                        <p className="text-center text-gray-600 dark:text-gray-300 font-semibold">Click on a page to add text.</p>
                        {pages.map((pageUrl, index) => (
                            <div key={index} onClick={(e) => handlePageClick(index, e)} className="relative mx-auto shadow-lg" style={{ width: pageDimensionsRef.current[index]?.width, height: pageDimensionsRef.current[index]?.height, cursor: 'text' }}>
                                <img src={pageUrl} alt={`Page ${index + 1}`} className="w-full h-full" />
                                <EditOverlay pageIndex={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </ToolContainer>
        </div>
    );
};

export default AddTextToPdf;