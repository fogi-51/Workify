import React, { useState } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

declare const JSZip: any;
declare const html2pdf: any;

const PowerpointToPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState('');
    const [success, setSuccess] = useState(false);

    const resetState = () => {
        setFile(null);
        setIsConverting(false);
        setError(null);
        setProgress('');
        setSuccess(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        resetState();
        const selectedFile = event.target.files?.[0];
        if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || selectedFile.name.toLowerCase().endsWith('.pptx'))) {
            setFile(selectedFile);
        } else {
            setError('Please select a valid PowerPoint (.pptx) file.');
        }
        event.target.value = ''; // Allow re-selecting the same file
    };

    const EMU_TO_PX = 1 / 9525;

    const handleConvert = async () => {
        if (!file) return;

        setIsConverting(true);
        setError(null);
        setSuccess(false);
        setProgress('Loading presentation file...');

        try {
            const zip = await JSZip.loadAsync(await file.arrayBuffer());
            
            const presentationXmlStr = await zip.file('ppt/presentation.xml').async('string');
            const presParser = new DOMParser();
            const presDoc = presParser.parseFromString(presentationXmlStr, 'application/xml');
            
            const slideSizeNode = presDoc.querySelector('p\\:sldSz');
            if (!slideSizeNode) throw new Error('Could not determine presentation size.');
            
            const presWidthEMU = parseInt(slideSizeNode.getAttribute('cx') || '0', 10);
            const presHeightEMU = parseInt(slideSizeNode.getAttribute('cy') || '0', 10);
            const presWidthPx = presWidthEMU * EMU_TO_PX;
            const presHeightPx = presHeightEMU * EMU_TO_PX;

            const slideIdNodes = presDoc.querySelectorAll('p\\:sldIdLst > p\\:sldId');
            if (slideIdNodes.length === 0) throw new Error('No slides found in the presentation.');

            const presRelsXmlStr = await zip.file('ppt/_rels/presentation.xml.rels').async('string');
            const presRelsParser = new DOMParser();
            const presRelsDoc = presRelsParser.parseFromString(presRelsXmlStr, 'application/xml');
            const rels = new Map<string, string>();
            presRelsDoc.querySelectorAll('Relationship').forEach(rel => {
                rels.set(rel.getAttribute('Id') || '', rel.getAttribute('Target') || '');
            });

            const allSlidesHtmlContainer = document.createElement('div');

            for (let i = 0; i < slideIdNodes.length; i++) {
                const rId = slideIdNodes[i].getAttribute('r:id');
                if (!rId) continue;
                
                setProgress(`Processing slide ${i + 1} of ${slideIdNodes.length}...`);

                const slidePath = `ppt/${rels.get(rId)}`;
                const slideXmlStr = await zip.file(slidePath).async('string');
                const slideParser = new DOMParser();
                const slideDoc = slideParser.parseFromString(slideXmlStr, 'application/xml');
                
                const slideRelsPath = `ppt/slides/_rels/${slidePath.split('/').pop()}.rels`;
                const slideRels = new Map<string, string>();
                try {
                    const slideRelsXmlStr = await zip.file(slideRelsPath).async('string');
                    const slideRelsParser = new DOMParser();
                    const slideRelsDoc = slideRelsParser.parseFromString(slideRelsXmlStr, 'application/xml');
                     slideRelsDoc.querySelectorAll('Relationship').forEach(rel => {
                        slideRels.set(rel.getAttribute('Id') || '', rel.getAttribute('Target') || '');
                    });
                } catch(e) {
                    console.warn(`Could not find or parse rels for slide ${i+1}. This is normal if the slide has no images.`);
                }
                
                const slideContainer = document.createElement('div');
                slideContainer.style.width = `${presWidthPx}px`;
                slideContainer.style.height = `${presHeightPx}px`;
                slideContainer.style.position = 'relative';
                slideContainer.style.overflow = 'hidden';
                slideContainer.style.backgroundColor = 'white';

                const shapes = slideDoc.querySelectorAll('p\\:sp, p\\:pic');
                for (const shape of Array.from(shapes)) {
                    const xfrmNode = shape.querySelector('p\\:spPr > a\\:xfrm, p\\:picPr > a\\:xfrm');
                    if (!xfrmNode) continue;
                    
                    const off = xfrmNode.querySelector('a\\:off');
                    const ext = xfrmNode.querySelector('a\\:ext');
                    if (!off || !ext) continue;

                    const x = parseInt(off.getAttribute('x') || '0', 10) * EMU_TO_PX;
                    const y = parseInt(off.getAttribute('y') || '0', 10) * EMU_TO_PX;
                    const w = parseInt(ext.getAttribute('cx') || '0', 10) * EMU_TO_PX;
                    const h = parseInt(ext.getAttribute('cy') || '0', 10) * EMU_TO_PX;

                    const blipNode = shape.querySelector('p\\:blipFill a\\:blip');
                    if (blipNode) {
                        const embedId = blipNode.getAttribute('r:embed');
                        const imgTarget = slideRels.get(embedId || '');
                        if (imgTarget) {
                            const imgPath = imgTarget.startsWith('../') ? `ppt/${imgTarget.substring(3)}` : `ppt/slides/${imgTarget}`;
                            const imgFile = zip.file(imgPath);
                            if (imgFile) {
                                const base64 = await imgFile.async('base64');
                                const mimeType = imgPath.toLowerCase().endsWith('png') ? 'image/png' : 'image/jpeg';
                                const imgEl = document.createElement('img');
                                imgEl.src = `data:${mimeType};base64,${base64}`;
                                imgEl.style.position = 'absolute';
                                imgEl.style.left = `${x}px`;
                                imgEl.style.top = `${y}px`;
                                imgEl.style.width = `${w}px`;
                                imgEl.style.height = `${h}px`;
                                slideContainer.appendChild(imgEl);
                            }
                        }
                    }

                    const textBody = shape.querySelector('p\\:txBody');
                    if (textBody) {
                        const text = Array.from(textBody.querySelectorAll('a\\:t')).map(t => t.textContent).join('\n');
                        if (text.trim()) {
                            const textEl = document.createElement('div');
                            textEl.style.position = 'absolute';
                            textEl.style.left = `${x}px`;
                            textEl.style.top = `${y}px`;
                            textEl.style.width = `${w}px`;
                            textEl.style.height = `${h}px`;
                            textEl.style.fontSize = '16px'; // Note: This is a simplified default font size.
                            textEl.style.wordWrap = 'break-word';
                            textEl.style.whiteSpace = 'pre-wrap';
                            textEl.innerText = text;
                            slideContainer.appendChild(textEl);
                        }
                    }
                }
                allSlidesHtmlContainer.appendChild(slideContainer);
            }
            
            setProgress('Generating PDF...');
            const opt = {
                margin: 0,
                filename: `${file.name.replace(/\.pptx?$/, '')}.pdf`,
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'px', format: [presWidthPx, presHeightPx], orientation: presWidthPx > presHeightPx ? 'landscape' : 'portrait' }
            };
            
            await html2pdf().from(allSlidesHtmlContainer).set(opt).save();
            setSuccess(true);

        } catch (err: any) {
            console.error(err);
            setError(`Failed to convert presentation. Error: ${err.message}. The file may be corrupt or use unsupported features.`);
        } finally {
            setIsConverting(false);
            setProgress('');
        }
    };
    
    const renderContent = () => {
        if (isConverting) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">{progress || 'Converting your presentation...'}</p>
                    <p className="text-sm text-gray-500">(This may take a moment for large files)</p>
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
                    <input type="file" id="file-upload" accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={handleFileChange} className="hidden"/>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PowerPoint (.pptx) file</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
                </label>
            </div>
        );
    };

    return (
        <ToolContainer title="PowerPoint to PDF">
            {error && (
                <div className="mb-4 w-full max-w-lg mx-auto text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    <span>{error}</span>
                </div>
            )}
             <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                <p><strong>Note:</strong> This tool performs a client-side conversion. Complex formatting, animations, and some shapes may not be perfectly preserved. Best for presentations with standard text and images.</p>
            </div>
            {renderContent()}
        </ToolContainer>
    );
};

export default PowerpointToPdf;