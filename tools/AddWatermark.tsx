import React, { useState, useEffect, useCallback } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

// Declare globals for libraries loaded via script tags
declare const pdfjsLib: any;
declare const PDFLib: any;

type WatermarkType = 'text' | 'image';
type Position = 'center' | 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'tile';

interface ImageFile {
    file: File;
    previewUrl: string;
}

const AddWatermark: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);
    const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number } | null>(null);
    
    const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
    const [watermarkImage, setWatermarkImage] = useState<ImageFile | null>(null);
    
    // Options
    const [opacity, setOpacity] = useState(0.3);
    const [color, setColor] = useState('#ff0000');
    const [fontSize, setFontSize] = useState(48);
    const [rotation, setRotation] = useState(-45);
    const [position, setPosition] = useState<Position>('center');
    const [imageScale, setImageScale] = useState(0.5);

    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const cleanup = useCallback(() => {
        if (pdfPreview) URL.revokeObjectURL(pdfPreview);
        if (watermarkImage) URL.revokeObjectURL(watermarkImage.previewUrl);
    }, [pdfPreview, watermarkImage]);

    useEffect(() => {
        return () => cleanup();
    }, [cleanup]);

    const resetState = () => {
        cleanup();
        setPdfFile(null);
        setPdfPreview(null);
        setPageDimensions(null);
        setWatermarkType('text');
        setWatermarkText('CONFIDENTIAL');
        setWatermarkImage(null);
        setOpacity(0.3);
        setColor('#ff0000');
        setFontSize(48);
        setRotation(-45);
        setPosition('center');
        setImageScale(0.5);
        setIsProcessing(false);
        setProcessingMessage('');
        setError(null);
        setSuccessMessage(null);
    };

    const handlePdfFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        resetState();
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
            setIsProcessing(true);
            setProcessingMessage('Loading PDF preview...');
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const page = await pdfJsDoc.getPage(1);
                const viewport = page.getViewport({ scale: 1.0 }); // Use 1.0 for true dimensions
                
                setPageDimensions({ width: viewport.width, height: viewport.height });

                // Render a higher-res preview
                const previewViewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                canvas.width = previewViewport.width;
                canvas.height = previewViewport.height;
                const context = canvas.getContext('2d');
                if (context) {
                    await page.render({ canvasContext: context, viewport: previewViewport }).promise;
                    setPdfPreview(canvas.toDataURL());
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

    const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && ['image/png', 'image/jpeg'].includes(file.type)) {
            if (watermarkImage) URL.revokeObjectURL(watermarkImage.previewUrl);
            setWatermarkImage({ file, previewUrl: URL.createObjectURL(file) });
        } else {
            setError('Please select a valid PNG or JPG image.');
        }
        event.target.value = '';
    };

    const handleAddWatermark = async () => {
        if (!pdfFile) return;
        if (watermarkType === 'text' && !watermarkText) {
            setError('Watermark text cannot be empty.');
            return;
        }
        if (watermarkType === 'image' && !watermarkImage) {
            setError('Please select a watermark image.');
            return;
        }

        setIsProcessing(true);
        setProcessingMessage('Adding watermark to all pages...');
        setError(null);

        try {
            const { PDFDocument, StandardFonts, degrees, rgb } = PDFLib;
            const existingPdfBytes = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            
            let watermarkAsset: any = null;
            let assetDims = { width: 0, height: 0 };

            if (watermarkType === 'image' && watermarkImage) {
                const imgBytes = await watermarkImage.file.arrayBuffer();
                watermarkAsset = watermarkImage.file.type === 'image/png'
                    ? await pdfDoc.embedPng(imgBytes)
                    : await pdfDoc.embedJpg(imgBytes);
            }

            const colorRgb = {
                r: parseInt(color.slice(1, 3), 16) / 255,
                g: parseInt(color.slice(3, 5), 16) / 255,
                b: parseInt(color.slice(5, 7), 16) / 255,
            };

            const pages = pdfDoc.getPages();
            for (const page of pages) {
                const { width: pageW, height: pageH } = page.getSize();
                
                if (watermarkType === 'text') {
                    assetDims = {
                        width: font.widthOfTextAtSize(watermarkText, fontSize),
                        height: font.heightAtSize(fontSize)
                    };
                } else if (watermarkAsset) {
                    assetDims = { width: watermarkAsset.width * imageScale, height: watermarkAsset.height * imageScale };
                }
                
                const positions = getPositions(pageW, pageH, assetDims.width, assetDims.height, position, rotation);

                for (const pos of positions) {
                     if (watermarkType === 'text') {
                        page.drawText(watermarkText, { ...pos, size: fontSize, font, color: rgb(colorRgb.r, colorRgb.g, colorRgb.b), opacity, rotate: degrees(rotation) });
                    } else if (watermarkAsset) {
                        page.drawImage(watermarkAsset, { ...pos, width: assetDims.width, height: assetDims.height, opacity, rotate: degrees(rotation) });
                    }
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `watermarked-${pdfFile.name}`;
            a.click();
            URL.revokeObjectURL(url);
            
            setSuccessMessage('Watermark added successfully! Your download has started.');
             setTimeout(() => {
                setSuccessMessage(null);
            }, 4000);

        } catch (e) {
            console.error(e);
            setError('An error occurred while adding the watermark.');
        } finally {
            setIsProcessing(false);
            setProcessingMessage('');
        }
    };
    
    const getPositions = (pageW: number, pageH: number, assetW: number, assetH: number, pos: Position, angle: number): { x: number; y: number }[] => {
        const rad = (angle * Math.PI) / 180;
        const absCos = Math.abs(Math.cos(rad));
        const absSin = Math.abs(Math.sin(rad));
        const boxW = assetW * absCos + assetH * absSin;
        const boxH = assetW * absSin + assetH * absCos;
        const margin = 20;

        const positionsMap: Record<Position, { x: number; y: number }> = {
            'center': { x: (pageW - boxW) / 2, y: (pageH - boxH) / 2 },
            'top-left': { x: margin, y: pageH - boxH - margin },
            'top-center': { x: (pageW - boxW) / 2, y: pageH - boxH - margin },
            'top-right': { x: pageW - boxW - margin, y: pageH - boxH - margin },
            'middle-left': { x: margin, y: (pageH - boxH) / 2 },
            'middle-right': { x: pageW - boxW - margin, y: (pageH - boxH) / 2 },
            'bottom-left': { x: margin, y: margin },
            'bottom-center': { x: (pageW - boxW) / 2, y: margin },
            'bottom-right': { x: pageW - boxW - margin, y: margin },
            'tile': { x: 0, y: 0 }
        };
        
        if (pos !== 'tile') return [positionsMap[pos]];

        const allPositions: { x: number; y: number }[] = [];
        const spacing = 100;
        for (let y = -boxH; y < pageH + boxH; y += boxH + spacing) {
            for (let x = -boxW; x < pageW + boxW; x += boxW + spacing) {
                allPositions.push({ x, y });
            }
        }
        return allPositions;
    };

    const renderFileSelect = () => (
         <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input type="file" id="file-upload" accept=".pdf" onChange={handlePdfFileChange} className="hidden"/>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF to watermark</p>
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
                    <h4 className="font-semibold text-lg">Preview</h4>
                    <div className="relative w-full h-96 bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden flex justify-center items-center p-2 shadow-inner">
                        {pdfPreview ? (
                            <img src={pdfPreview} alt="PDF Preview" className="max-w-full max-h-full object-contain" />
                        ) : <p className="text-gray-500">Loading preview...</p>}
                    </div>
                </div>
                {/* Options Panel */}
                <div className="space-y-4">
                    <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
                        <button onClick={() => setWatermarkType('text')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${watermarkType === 'text' ? 'bg-primary-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Text</button>
                        <button onClick={() => setWatermarkType('image')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${watermarkType === 'image' ? 'bg-primary-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Image</button>
                    </div>

                    {watermarkType === 'text' ? (
                        <div className="space-y-3 p-3 border dark:border-gray-700 rounded-lg">
                            <div><label className="text-sm font-medium">Text</label><input type="text" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} className="w-full mt-1 p-2 bg-white dark:bg-gray-700 border rounded"/></div>
                            <div><label className="text-sm font-medium">Font Size</label><input type="number" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full mt-1 p-2 bg-white dark:bg-gray-700 border rounded"/></div>
                            <div><label className="text-sm font-medium">Color</label><input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 mt-1 p-1 bg-white dark:bg-gray-700 border rounded"/></div>
                        </div>
                    ) : (
                         <div className="space-y-3 p-3 border dark:border-gray-700 rounded-lg">
                            <div><label className="text-sm font-medium">Image File</label><input type="file" accept="image/png, image/jpeg" onChange={handleImageFileChange} className="w-full mt-1 p-2 text-sm bg-white dark:bg-gray-700 border rounded file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/></div>
                            {watermarkImage && <img src={watermarkImage.previewUrl} alt="Watermark preview" className="max-w-xs h-20 object-contain rounded border p-1 mx-auto"/>}
                             <div><label className="text-sm font-medium">Scale ({Math.round(imageScale*100)}%)</label><input type="range" min="0.1" max="2" step="0.1" value={imageScale} onChange={e => setImageScale(Number(e.target.value))} className="w-full mt-1"/></div>
                        </div>
                    )}
                    
                    <div className="space-y-3 p-3 border dark:border-gray-700 rounded-lg">
                        <h5 className="font-semibold">General Options</h5>
                        <div><label className="text-sm font-medium">Opacity ({Math.round(opacity*100)}%)</label><input type="range" min="0.1" max="1" step="0.05" value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full mt-1"/></div>
                        <div><label className="text-sm font-medium">Rotation ({rotation}°)</label><input type="range" min="-180" max="180" value={rotation} onChange={e => setRotation(Number(e.target.value))} className="w-full mt-1"/></div>
                        <div>
                            <label className="text-sm font-medium">Position</label>
                            <select value={position} onChange={e => setPosition(e.target.value as Position)} className="w-full mt-1 p-2 bg-white dark:bg-gray-700 border rounded">
                                <option value="center">Center</option><option value="tile">Tile</option><option value="top-left">Top Left</option><option value="top-center">Top Center</option><option value="top-right">Top Right</option><option value="middle-left">Middle Left</option><option value="middle-right">Middle Right</option><option value="bottom-left">Bottom Left</option><option value="bottom-center">Bottom Center</option><option value="bottom-right">Bottom Right</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button onClick={handleAddWatermark} disabled={isProcessing} className="w-full flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 transition-colors shadow-lg">
                            Add Watermark & Download
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
        <ToolContainer title="Add Watermark to PDF">
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

export default AddWatermark;