import React, { useState, useRef, useCallback, useEffect } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

// Declare globals for libraries loaded from script tags
declare const pdfjsLib: any;
declare const PDFLib: any;

// Signature types
type Signature = {
    id: string;
    dataUrl: string;
};

type PlacedSignature = {
    id: string;
    signatureId: string;
    pageIndex: number;
    x: number; // canvas coordinates
    y: number; // canvas coordinates
    width: number;
    height: number;
};

// Helper function to check if a canvas is blank
function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
  return !canvas.getContext('2d')!
    .getImageData(0, 0, canvas.width, canvas.height).data
    .some(channel => channel !== 0);
}

// Main Component
const EsignPdf: React.FC = () => {
    // State management
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<string[]>([]);
    const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [signatures, setSignatures] = useState<Signature[]>([]);
    const [activeSignature, setActiveSignature] = useState<Signature | null>(null);
    const [placedSignatures, setPlacedSignatures] = useState<PlacedSignature[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const pdfDocRef = useRef<any>(null); // For pdf-lib document

    // Reset all state
    const resetState = useCallback(() => {
        setFile(null);
        setPages([]);
        setPageDimensions([]);
        setIsProcessing(false);
        setError(null);
        setSignatures([]);
        setActiveSignature(null);
        setPlacedSignatures([]);
        setIsModalOpen(false);
        pdfDocRef.current = null;
        setSuccessMessage(null);
    }, []);

    // Handle PDF file upload
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile || selectedFile.type !== 'application/pdf') {
            setError('Please select a valid PDF file.');
            return;
        }
        resetState();
        setFile(selectedFile);
        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            pdfDocRef.current = await PDFLib.PDFDocument.load(arrayBuffer);
            
            const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const pageUrls: string[] = [];
            const dimensions: { width: number; height: number }[] = [];

            for (let i = 1; i <= pdfJsDoc.numPages; i++) {
                const page = await pdfJsDoc.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                dimensions.push({ width: viewport.width, height: viewport.height });
                
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
            setPageDimensions(dimensions);
        } catch (e) {
            console.error(e);
            setError('Failed to load PDF. It might be corrupted or protected.');
            resetState();
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Handle placing a signature on a page
    const handlePageClick = (pageIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
        if (!activeSignature) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const sigWidth = 150; // default signature width
        const sigHeight = 75; // default signature height

        setPlacedSignatures(prev => [
            ...prev,
            {
                id: `placed-${Date.now()}`,
                signatureId: activeSignature.id,
                pageIndex,
                x: x - sigWidth / 2, // center the signature on the click
                y: y - sigHeight / 2,
                width: sigWidth,
                height: sigHeight,
            },
        ]);
        setActiveSignature(null); // De-select after placing
    };

    const handleSave = async () => {
        if (!pdfDocRef.current || !file) return;
        setIsProcessing(true);
        setSuccessMessage(null);
        setError(null);

        try {
            const { PDFDocument } = PDFLib;
            // Reload original document to avoid modifying the same object multiple times
            const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
            const pdfPages = pdfDoc.getPages();

            for (const placed of placedSignatures) {
                const signature = signatures.find(s => s.id === placed.signatureId);
                if (!signature) continue;

                const page = pdfPages[placed.pageIndex];
                const originalPageDims = page.getSize();
                const renderedPageDims = pageDimensions[placed.pageIndex];
                
                // Convert signature dataURL to bytes
                const signatureBytes = await fetch(signature.dataUrl).then(res => res.arrayBuffer());
                const signatureImage = await pdfDoc.embedPng(signatureBytes);

                // Scale coordinates and dimensions from rendered canvas to original PDF page
                const scaleX = originalPageDims.width / renderedPageDims.width;
                const scaleY = originalPageDims.height / renderedPageDims.height;

                const pdfX = placed.x * scaleX;
                const pdfY = originalPageDims.height - (placed.y * scaleY) - (placed.height * scaleY); // PDF origin is bottom-left
                const pdfWidth = placed.width * scaleX;
                const pdfHeight = placed.height * scaleY;
                
                page.drawImage(signatureImage, {
                    x: pdfX,
                    y: pdfY,
                    width: pdfWidth,
                    height: pdfHeight,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `signed-${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            
            setSuccessMessage('Successfully signed and downloaded your PDF!');
            setTimeout(() => setSuccessMessage(null), 4000);
            
        } catch(e) {
            console.error(e);
            setError("An error occurred while saving the signed PDF.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    // JSX for file selection view
    if (!file) {
        return (
            <ToolContainer title="eSign PDF">
                <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="file" id="file-upload" accept=".pdf" onChange={handleFileChange} className="hidden"/>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF to sign</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
                </label>
                {error && (
                    <div className="w-full max-w-lg mx-auto text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2 mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        <span>{error}</span>
                    </div>
                )}
                {isProcessing && <div className="text-center mt-4"><Spinner /></div>}
            </ToolContainer>
        );
    }

    // JSX for the main editor view
    return (
        <div className="w-full max-w-7xl mx-auto">
             <ToolContainer title={`Signing: ${file.name}`}>
                {error && (
                    <div className="w-full text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        <span>{error}</span>
                    </div>
                )}
                {successMessage && (
                    <div className="w-full text-center text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 p-3 rounded-md border border-green-200 dark:border-green-800 flex items-center justify-center gap-2 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <span>{successMessage}</span>
                    </div>
                )}
                {isProcessing && !pages.length ? (
                    <div className="flex flex-col items-center justify-center h-96"><Spinner /><p className="mt-4">Loading your document...</p></div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Editor Sidebar */}
                        <div className="w-full md:w-64 flex-shrink-0 space-y-4">
                           <h3 className="text-lg font-semibold border-b pb-2 dark:border-gray-700">Signatures</h3>
                           <button onClick={() => setIsModalOpen(true)} className="w-full px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700">Add Signature</button>
                           <div className="space-y-2">
                               {signatures.map(sig => (
                                   <div key={sig.id} onClick={() => setActiveSignature(sig)} className={`p-2 border rounded-md cursor-pointer bg-white dark:bg-gray-700 ${activeSignature?.id === sig.id ? 'border-primary-500 ring-2 ring-primary-500' : 'dark:border-gray-600'}`}>
                                       <img src={sig.dataUrl} alt="signature" className="h-16 mx-auto object-contain" />
                                   </div>
                               ))}
                           </div>
                           <hr className="dark:border-gray-600"/>
                           <button onClick={handleSave} disabled={isProcessing || placedSignatures.length === 0} className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">Save & Download</button>
                           <button onClick={resetState} className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Start Over</button>
                        </div>

                        {/* PDF Viewer */}
                        <div className="flex-grow bg-gray-200 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-[80vh]">
                            {activeSignature && <p className="sticky top-0 z-10 text-center bg-primary-100 dark:bg-primary-900/80 p-2 rounded-md font-semibold text-primary-800 dark:text-primary-200 animate-pulse">Click on the document to place your signature.</p>}
                            <div className="space-y-4">
                                {pages.map((pageUrl, index) => (
                                    <div key={index} onClick={(e) => handlePageClick(index, e)} className="relative mx-auto shadow-lg" style={{ width: pageDimensions[index]?.width, height: pageDimensions[index]?.height, cursor: activeSignature ? 'copy' : 'default' }}>
                                        <img src={pageUrl} alt={`Page ${index + 1}`} className="w-full h-full" />
                                        {placedSignatures.filter(ps => ps.pageIndex === index).map(ps => {
                                            const sig = signatures.find(s => s.id === ps.signatureId);
                                            return sig ? <img key={ps.id} src={sig.dataUrl} alt="placed signature" style={{ position: 'absolute', left: ps.x, top: ps.y, width: ps.width, height: ps.height, pointerEvents: 'none' }}/> : null;
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </ToolContainer>
            {isModalOpen && <SignatureModal onClose={() => setIsModalOpen(false)} onSignatureCreated={(sig) => setSignatures(prev => [...prev, sig])}/>}
        </div>
    );
};

// Sub-component: SignatureModal
const SignatureModal = ({ onClose, onSignatureCreated }: { onClose: () => void, onSignatureCreated: (sig: Signature) => void }) => {
    const [activeTab, setActiveTab] = useState<'type' | 'draw'>('type');
    const [typedText, setTypedText] = useState('');
    const [font, setFont] = useState('Caveat');
    const [modalError, setModalError] = useState('');
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);

    useEffect(() => {
        const canvas = drawCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
            }
        }
    }, [activeTab]);

    const handleCreateTyped = () => {
        if (!typedText.trim()) {
            setModalError('Please type your name to create a signature.');
            return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.font = `60px ${font}`;
            ctx.fillText(typedText, 20, 90);
            onSignatureCreated({ id: `sig-${Date.now()}`, dataUrl: canvas.toDataURL() });
            onClose();
        }
    };
    
    // Drawing handlers
    const startDrawing = (e: React.MouseEvent) => {
        setModalError('');
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        isDrawing.current = true;
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing.current) return;
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => { isDrawing.current = false; };
    const clearCanvas = () => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleCreateDrawn = () => {
        const canvas = drawCanvasRef.current;
        if (canvas) {
            if (isCanvasBlank(canvas)) {
                setModalError('Please draw your signature before creating.');
                return;
            }
            onSignatureCreated({ id: `sig-${Date.now()}`, dataUrl: canvas.toDataURL() });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Create Signature</h3>
                <div className="flex border-b mb-4 dark:border-gray-700">
                    <button onClick={() => setActiveTab('type')} className={`px-4 py-2 ${activeTab === 'type' ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}>Type</button>
                    <button onClick={() => setActiveTab('draw')} className={`px-4 py-2 ${activeTab === 'draw' ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}>Draw</button>
                </div>

                {activeTab === 'type' && (
                    <div className="space-y-4">
                        <input type="text" placeholder="Your Name" value={typedText} onChange={e => { setTypedText(e.target.value); setModalError(''); }} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                        <select value={font} onChange={e => setFont(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                            <option value="Caveat" style={{fontFamily: 'Caveat'}}>Caveat</option>
                            <option value="Dancing Script" style={{fontFamily: 'Dancing Script'}}>Dancing Script</option>
                            <option value="Cedarville Cursive" style={{fontFamily: 'Cedarville Cursive'}}>Cedarville Cursive</option>
                        </select>
                        <div className="p-4 border rounded min-h-[100px] flex items-center justify-center dark:border-gray-600">
                            <p className="text-4xl" style={{ fontFamily: font }}>{typedText || 'Signature Preview'}</p>
                        </div>
                        {modalError && <p className="text-red-500 text-sm -mt-2 text-center">{modalError}</p>}
                        <button onClick={handleCreateTyped} className="w-full px-4 py-2 text-white bg-primary-600 rounded-md disabled:bg-primary-300">Create</button>
                    </div>
                )}

                {activeTab === 'draw' && (
                    <div className="space-y-4">
                        <canvas ref={drawCanvasRef} width="450" height="200" className="border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 w-full cursor-crosshair" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}></canvas>
                         {modalError && <p className="text-red-500 text-sm -mt-2 text-center">{modalError}</p>}
                        <div className="flex gap-4">
                            <button onClick={clearCanvas} className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Clear</button>
                            <button onClick={handleCreateDrawn} className="w-full px-4 py-2 text-white bg-primary-600 rounded-md">Create</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EsignPdf;