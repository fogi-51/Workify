import React, { useState, useRef, useCallback, useEffect } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

// Use TypeScript's `declare` keyword for libraries loaded via script tags
declare const pdfjsLib: any;
declare const PDFLib: any;

type Tool = 'cursor' | 'text' | 'image' | 'draw';
type Edit = {
    type: 'text';
    x: number;
    y: number;
    text: string;
    size: number;
    color: string;
} | {
    type: 'image';
    x: number;
    y: number;
    imageBytes: ArrayBuffer;
    renderUrl: string;
    width: number;
    height: number;
    mimeType: string;
} | {
    type: 'draw';
    path: string; // SVG path data
    color: string;
    strokeWidth: number;
};

const EditPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<Tool>('cursor');
    
    const [edits, setEdits] = useState<Record<number, Edit[]>>({});
    
    // Tool specific settings
    const [textColor, setTextColor] = useState('#000000');
    const [textSize, setTextSize] = useState(20);
    const [drawColor, setDrawColor] = useState('#ff0000');
    const [drawSize, setDrawSize] = useState(5);

    const pdfDocRef = useRef<any>(null); // For pdf-lib
    const pageDimensionsRef = useRef<{width: number, height: number}[]>([]);

    const cleanupImageUrls = useCallback(() => {
        // Fix: Replaced `Object.values` with a loop over `Object.keys` to resolve
        // a type inference issue where `Object.values(edits)` was incorrectly inferred as `unknown` and not iterable.
        for (const key of Object.keys(edits)) {
            const pageEdits = edits[Number(key)];
            for (const edit of pageEdits) {
                if (edit.type === 'image' && edit.renderUrl) {
                    URL.revokeObjectURL(edit.renderUrl);
                }
            }
        }
    }, [edits]);

    const resetState = useCallback(() => {
        cleanupImageUrls();
        setFile(null);
        setPages([]);
        setIsProcessing(false);
        setProcessingMessage('');
        setError(null);
        setActiveTool('cursor');
        setEdits({});
        pdfDocRef.current = null;
        pageDimensionsRef.current = [];
    }, [cleanupImageUrls]);

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            cleanupImageUrls();
        };
    }, [cleanupImageUrls]);


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
            
            pdfDocRef.current = await PDFLib.PDFDocument.load(arrayBuffer);
            
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
            setError('Failed to load or render PDF. The file might be corrupted or protected.');
            resetState();
        } finally {
            setIsProcessing(false);
            setProcessingMessage('');
        }
    };
    
    const addEdit = (pageIndex: number, edit: Edit) => {
        setEdits(prev => {
            const newEditsForPage = [...(prev[pageIndex] || []), edit];
            return { ...prev, [pageIndex]: newEditsForPage };
        });
    };

    const handleCanvasClick = async (pageIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (activeTool === 'text') {
            const text = prompt('Enter text:', 'Hello World');
            if (text) {
                addEdit(pageIndex, { type: 'text', x, y, text, size: textSize, color: textColor });
            }
        } else if (activeTool === 'image') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/png, image/jpeg';
            input.onchange = async (event) => {
                const imgFile = (event.target as HTMLInputElement).files?.[0];
                if (imgFile) {
                    const imageBytes = await imgFile.arrayBuffer();
                    const renderUrl = URL.createObjectURL(imgFile);
                    const tempImage = new Image();
                    tempImage.src = renderUrl;
                    tempImage.onload = () => {
                        const aspectRatio = tempImage.width / tempImage.height;
                        const width = 150; // Default width
                        const height = width / aspectRatio;
                        addEdit(pageIndex, { type: 'image', x, y, imageBytes, renderUrl, width, height, mimeType: imgFile.type });
                    }
                }
            };
            input.click();
        }
    };
    
    const handleSave = async () => {
        if (!pdfDocRef.current || !file) return;
        setIsProcessing(true);
        setProcessingMessage('Applying edits and saving PDF...');
        try {
            const pdfDoc = pdfDocRef.current;
            const pdfPages = pdfDoc.getPages();
            const { rgb, StandardFonts } = PDFLib;

            for (const pageIndexStr in edits) {
                const pageIndex = parseInt(pageIndexStr, 10);
                const page = pdfPages[pageIndex];
                const pageEdits = edits[pageIndex];
                const pageDims = pageDimensionsRef.current[pageIndex];

                for (const edit of pageEdits) {
                    const pdfX = (x: number) => (x / pageDims.width) * page.getWidth();
                    const pdfY = (y: number) => page.getHeight() - ((y / pageDims.height) * page.getHeight());

                    if (edit.type === 'text') {
                        page.drawText(edit.text, {
                            x: pdfX(edit.x),
                            y: pdfY(edit.y),
                            size: edit.size,
                            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                            color: rgb(parseInt(edit.color.slice(1, 3), 16) / 255, parseInt(edit.color.slice(3, 5), 16) / 255, parseInt(edit.color.slice(5, 7), 16) / 255),
                        });
                    } else if (edit.type === 'image') {
                        const image = await (edit.mimeType.includes('jpeg') || edit.mimeType.includes('jpg')
                            ? pdfDoc.embedJpg(edit.imageBytes)
                            : pdfDoc.embedPng(edit.imageBytes)
                        );
                        if (image) {
                            page.drawImage(image, {
                                x: pdfX(edit.x),
                                y: pdfY(edit.y) - edit.height * (page.getHeight()/pageDims.height) ,
                                width: edit.width * (page.getWidth()/pageDims.width),
                                height: edit.height * (page.getHeight()/pageDims.height),
                            });
                        }
                    } else if (edit.type === 'draw') {
                         page.drawSvgPath(edit.path, {
                           y: page.getHeight(),
                           borderColor: rgb(parseInt(edit.color.slice(1,3),16)/255, parseInt(edit.color.slice(3,5),16)/255, parseInt(edit.color.slice(5,7),16)/255),
                           borderWidth: edit.strokeWidth,
                           scale: page.getWidth() / pageDims.width,
                         });
                    }
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `edited-${file?.name || 'document'}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            setError('An error occurred while saving the PDF.');
        } finally {
            setIsProcessing(false);
            setProcessingMessage('');
        }
    };
    
    const Toolbar = () => (
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-md sticky top-4 z-20 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                {['cursor', 'text', 'image', 'draw'].map((tool) => (
                    <button key={tool} onClick={() => setActiveTool(tool as Tool)} className={`px-3 py-2 text-sm rounded-md ${activeTool === tool ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                        {tool.charAt(0).toUpperCase() + tool.slice(1)}
                    </button>
                ))}
            </div>
            {activeTool === 'text' && (
                <div className="flex items-center gap-2">
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 cursor-pointer"/>
                    <input type="number" value={textSize} onChange={e => setTextSize(parseInt(e.target.value))} className="w-16 p-1 rounded bg-white dark:bg-gray-700"/>
                </div>
            )}
             {activeTool === 'draw' && (
                <div className="flex items-center gap-2">
                    <input type="color" value={drawColor} onChange={e => setDrawColor(e.target.value)} className="w-8 h-8 cursor-pointer"/>
                    <input type="range" min="1" max="50" value={drawSize} onChange={e => setDrawSize(parseInt(e.target.value))} className="w-24"/>
                </div>
            )}
             <div className="flex-grow"></div>
             <button onClick={handleSave} disabled={isProcessing || Object.keys(edits).length === 0} className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                Save & Download
            </button>
            <button onClick={resetState} className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">Start Over</button>
        </div>
    );
    
    const EditOverlay = ({ pageIndex }: { pageIndex: number }) => {
        const pageEdits = edits[pageIndex] || [];
        const { width, height } = pageDimensionsRef.current[pageIndex];

        return (
            <div className="absolute top-0 left-0" style={{ width, height, pointerEvents: 'none' }}>
                {pageEdits.map((edit, idx) => {
                    if (edit.type === 'text') {
                        return <div key={idx} style={{ position: 'absolute', left: edit.x, top: edit.y, fontSize: edit.size, color: edit.color, whiteSpace: 'pre', transform: 'translate(-2px, -1em)' }}>{edit.text}</div>;
                    }
                    if (edit.type === 'image') {
                        return <img key={idx} src={edit.renderUrl} style={{ position: 'absolute', left: edit.x, top: edit.y, width: edit.width, height: edit.height }} alt="user content" />;
                    }
                    if (edit.type === 'draw') {
                        return <svg key={idx} width={width} height={height} className="absolute top-0 left-0"><path d={edit.path} fill="none" stroke={edit.color} strokeWidth={edit.strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></svg>;
                    }
                    return null;
                })}
            </div>
        );
    };

    const DrawCanvas = ({ pageIndex }: { pageIndex: number }) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const isDrawing = useRef(false);
        const pathData = useRef('');

        const startDrawing = (e: React.MouseEvent) => {
            if (activeTool !== 'draw' || !canvasRef.current) return;
            isDrawing.current = true;
            const { offsetX, offsetY } = e.nativeEvent;
            pathData.current = `M ${offsetX} ${offsetY}`;
        };

        const draw = (e: React.MouseEvent) => {
            if (!isDrawing.current || !canvasRef.current) return;
            const { offsetX, offsetY } = e.nativeEvent;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.lineTo(offsetX, offsetY);
                ctx.stroke();
            }
            pathData.current += ` L ${offsetX} ${offsetY}`;
        };

        const stopDrawing = () => {
            if (!isDrawing.current || !canvasRef.current) return;
            isDrawing.current = false;
            addEdit(pageIndex, { type: 'draw', path: pathData.current, color: drawColor, strokeWidth: drawSize });
            pathData.current = '';
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
            }
        };

        useEffect(() => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = drawColor;
                ctx.lineWidth = drawSize;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }
        }, [drawColor, drawSize]);

        return <canvas ref={canvasRef} width={pageDimensionsRef.current[pageIndex]?.width} height={pageDimensionsRef.current[pageIndex]?.height} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} className="absolute top-0 left-0" style={{ zIndex: activeTool === 'draw' ? 10 : -1 }}/>
    };

    if (!file) {
        return (
            <ToolContainer title="Edit PDF">
                {error && (
                     <div className="mb-4 w-full text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        <span>{error}</span>
                    </div>
                )}
                <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="file" id="file-upload" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden"/>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 S.a. 0003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF to edit</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
                </label>
            </ToolContainer>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            <ToolContainer title={`Editing: ${file.name}`}>
                 <div className="relative">
                    {isProcessing && (
                        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 flex flex-col justify-center items-center z-30 rounded-lg">
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
                    <Toolbar />
                    <div className="mt-4 space-y-4 bg-gray-200 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-[75vh]">
                        {pages.map((pageUrl, index) => (
                            <div key={index} onMouseDown={(e) => handleCanvasClick(index, e)} className="relative mx-auto shadow-lg" style={{ width: pageDimensionsRef.current[index]?.width, height: pageDimensionsRef.current[index]?.height, cursor: activeTool === 'cursor' ? 'default' : 'crosshair' }}>
                                <img src={pageUrl} alt={`Page ${index + 1}`} className="w-full h-full" />
                                <EditOverlay pageIndex={index} />
                                <DrawCanvas pageIndex={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </ToolContainer>
        </div>
    );
};

export default EditPdf;