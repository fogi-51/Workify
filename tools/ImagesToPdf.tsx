

import React, { useState, useEffect, useCallback } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

declare const PDFLib: any;

interface ImageFile {
    file: File;
    previewUrl: string;
}

const ImagesToPdf: React.FC = () => {
    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // PDF options
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4');
    const [imageFit, setImageFit] = useState<'fit' | 'stretch'>('fit');
    
    // Drag state
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const cleanupUrls = useCallback(() => {
        imageFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
    }, [imageFiles]);

    useEffect(() => {
        return () => {
            cleanupUrls();
        };
    }, [cleanupUrls]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).filter((file: File) =>
                ['image/jpeg', 'image/png'].includes(file.type)
            );

            if (newFiles.length !== event.target.files.length) {
                setError('Some files were not valid image types (JPG, PNG) and were ignored.');
            } else {
                setError(null);
            }
            
            const newImageFiles: ImageFile[] = newFiles.map((file: File) => ({
                file,
                previewUrl: URL.createObjectURL(file)
            }));
            
            setImageFiles(prevFiles => [...prevFiles, ...newImageFiles]);
        }
        event.target.value = '';
    };

    const removeFile = (indexToRemove: number) => {
        const fileToRemove = imageFiles[indexToRemove];
        URL.revokeObjectURL(fileToRemove.previewUrl);
        setImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        
        const newFiles = [...imageFiles];
        const [draggedItem] = newFiles.splice(draggedIndex, 1);
        newFiles.splice(index, 0, draggedItem);

        setImageFiles(newFiles);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleConvert = async () => {
        if (imageFiles.length === 0) {
            setError('Please select at least one image file.');
            return;
        }

        setIsConverting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const { PDFDocument, PageSizes } = PDFLib;
            const pdfDoc = await PDFDocument.create();
            
            const selectedPageSize = pageSize === 'A4' ? PageSizes.A4 : PageSizes.Letter;

            for (const imageFile of imageFiles) {
                const arrayBuffer = await imageFile.file.arrayBuffer();
                let image;
                if (imageFile.file.type === 'image/jpeg') {
                    image = await pdfDoc.embedJpg(arrayBuffer);
                } else {
                    image = await pdfDoc.embedPng(arrayBuffer);
                }
                
                const pageDims = orientation === 'portrait' ? [selectedPageSize[0], selectedPageSize[1]] : [selectedPageSize[1], selectedPageSize[0]];
                const page = pdfDoc.addPage(pageDims);

                let imageDims = { width: image.width, height: image.height };
                if (imageFit === 'fit') {
                    const scale = Math.min(page.getWidth() / image.width, page.getHeight() / image.height);
                    imageDims = { width: image.width * scale, height: image.height * scale };
                } else { // stretch
                    imageDims = { width: page.getWidth(), height: page.getHeight() };
                }
                
                page.drawImage(image, {
                    x: (page.getWidth() - imageDims.width) / 2,
                    y: (page.getHeight() - imageDims.height) / 2,
                    width: imageDims.width,
                    height: imageDims.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `images-to-pdf-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccessMessage('Successfully converted images to PDF! Your download has started.');
            setTimeout(() => {
                cleanupUrls();
                setImageFiles([]);
                setSuccessMessage(null);
            }, 4000);
            
        } catch (e) {
            console.error(e);
            setError('An error occurred during conversion. Please ensure all files are valid images.');
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <ToolContainer title="Images to PDF">
            <div className="space-y-6 relative">
                 {isConverting && (
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 flex flex-col justify-center items-center z-20 rounded-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Converting to PDF...</p>
                    </div>
                )}
                {error && (
                    <div className="w-full text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        <span>{error}</span>
                    </div>
                )}
                 {successMessage && (
                    <div className="w-full text-center text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 p-3 rounded-md border border-green-200 dark:border-green-800 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* File Input */}
                <label htmlFor="file-upload" className="w-full flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="file" id="file-upload" multiple accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select JPG or PNG files</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop images here</p>
                </label>

                {/* File List */}
                {imageFiles.length > 0 && (
                    <div className="w-full space-y-3">
                        <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Files to convert ({imageFiles.length}):</h4>
                        <p className="text-sm text-gray-500">Drag and drop images to reorder them.</p>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {imageFiles.map((imgFile, index) => (
                                <li
                                    key={`${imgFile.file.name}-${index}`}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`relative group p-2 border rounded-lg cursor-grab transition-all ${draggedIndex === index ? 'opacity-50 scale-105' : 'opacity-100'}`}
                                >
                                    <img src={imgFile.previewUrl} alt={imgFile.file.name} className="w-full h-24 object-cover rounded" />
                                    <p className="text-xs mt-2 truncate">{imgFile.file.name}</p>
                                    <button onClick={() => removeFile(index)} title="Remove file" className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* Options */}
                 {imageFiles.length > 0 && (
                     <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
                        <h4 className="font-semibold text-lg mb-4">PDF Options</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div>
                                <label className="block text-sm font-medium mb-1">Page Orientation</label>
                                <select value={orientation} onChange={e => setOrientation(e.target.value as any)} className="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500">
                                    <option value="portrait">Portrait</option>
                                    <option value="landscape">Landscape</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Page Size</label>
                                 <select value={pageSize} onChange={e => setPageSize(e.target.value as any)} className="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500">
                                    <option value="A4">A4</option>
                                    <option value="Letter">Letter</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1">Image Fit</label>
                                <select value={imageFit} onChange={e => setImageFit(e.target.value as any)} className="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500">
                                    <option value="fit">Fit (keep aspect ratio)</option>
                                    <option value="stretch">Stretch to fill page</option>
                                </select>
                            </div>
                        </div>
                    </div>
                 )}
                
                {/* Convert Button */}
                <button
                    onClick={handleConvert}
                    disabled={isConverting || imageFiles.length === 0}
                    className="w-full flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    {isConverting ? <Spinner /> : `Convert to PDF`}
                </button>
            </div>
        </ToolContainer>
    );
};

export default ImagesToPdf;