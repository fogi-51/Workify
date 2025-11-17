import React, { useState } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';
import { generateText } from '../services/geminiService';

// Declare global variables for libraries loaded via script tags
declare const pdfjsLib: any;
declare const PptxGenJS: any;

const PdfToPowerpoint: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const resetState = () => {
        setFile(null);
        setIsConverting(false);
        setError(null);
        setProgressMessage('');
        setSuccess(false);
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
    
    const handleConvert = async () => {
        if (!file) return;

        setIsConverting(true);
        setError(null);
        setSuccess(false);

        try {
            const pptx = new PptxGenJS();
            pptx.layout = 'LAYOUT_16x9'; // Standard presentation layout

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;

            for (let i = 1; i <= numPages; i++) {
                setProgressMessage(`Processing page ${i} of ${numPages}...`);

                const page = await pdf.getPage(i);
                
                // 1. Render page as a high-quality image
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const context = canvas.getContext('2d');
                if (!context) throw new Error('Could not get canvas context.');
                
                await page.render({ canvasContext: context, viewport }).promise;
                const pageImageBase64 = canvas.toDataURL('image/jpeg', 0.9);
                canvas.remove();

                // 2. Extract text for AI summary
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');

                let slideTitle = `Page ${i}`;
                let slideContent: string[] = [];
                
                // 3. Summarize with AI (if there's text)
                if (pageText.trim().length > 20) { // Only call AI if there's meaningful text
                    setProgressMessage(`AI is summarizing page ${i}...`);
                    const prompt = `Your task is to act as a presentation assistant. I will provide you with the text content of a single page from a PDF document. Your job is to summarize this text into a concise slide title and a few key bullet points. The output must be in a clean JSON format. The JSON object should have two properties: a "title" (string) and "content" (an array of strings, where each string is a bullet point). If the page contains very little text or no meaningful content to summarize (e.g., it's just an image or a diagram), return a title like "Visual Content from Page ${i}" and an empty content array. Do not add any extra text or explanations or code fences (like \`\`\`json) outside of the JSON structure. Here is the text:\n\n---\n${pageText}\n---`;

                    const jsonResponse = await generateText(prompt);
                    
                    try {
                        // The response might be wrapped in markdown, so we need to clean it
                        const cleanedResponse = jsonResponse.replace(/^```json\n?/, '').replace(/```$/, '');
                        const parsed = JSON.parse(cleanedResponse);
                        slideTitle = parsed.title || `Page ${i}`;
                        slideContent = parsed.content || [];
                    } catch (e) {
                        console.error("Failed to parse AI response for page " + i, jsonResponse);
                        slideTitle = `Summary for Page ${i}`;
                        slideContent = [jsonResponse.substring(0, 500)];
                    }
                } else {
                     slideTitle = `Page ${i} - Visual Content`;
                     slideContent = [];
                }

                // 4. Create slide
                setProgressMessage(`Creating slide ${i}...`);
                const slide = pptx.addSlide();
                
                slide.addImage({ data: pageImageBase64, x: 0, y: 0, w: '100%', h: '100%' });
                slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: 'FFFFFF', transparency: 15 } });
                
                slide.addText(slideTitle, {
                    x: 0.5, y: 0.25, w: '90%', h: 1,
                    fontSize: 28, bold: true, color: '000000',
                    align: 'center',
                    shadow: { type: 'outer', color: 'FFFFFF', blur: 3, offset: 2, angle: 45, opacity: 0.8 }
                });

                if (slideContent.length > 0) {
                     slide.addText(slideContent.map(item => ({ text: item, options: { breakLine: true } })), {
                        x: 0.75, y: 1.5, w: '85%', h: '70%',
                        fontSize: 16, color: '000000',
                        bullet: true, valign: 'top',
                     });
                }
            }

            setProgressMessage('Finalizing presentation...');
            await pptx.writeFile({ fileName: `${file.name.replace(/\.pdf$/i, '')}.pptx` });
            setSuccess(true);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unexpected error occurred during conversion.');
        } finally {
            setIsConverting(false);
            setProgressMessage('');
        }
    };
    
    const renderContent = () => {
        if (isConverting) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">{progressMessage}</p>
                    <p className="text-sm text-gray-500">(This can take a few minutes for large documents)</p>
                </div>
            );
        }

        if (success) {
            return (
                 <div className="text-center w-full p-6 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700 space-y-6">
                    <h4 className="text-2xl font-bold text-green-800 dark:text-green-200">Conversion Complete!</h4>
                    <p className="text-gray-600 dark:text-gray-300">Your PowerPoint download should have started automatically.</p>
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
                        Convert to PowerPoint
                    </button>
                </div>
            );
        }
        
        return (
             <div className="flex flex-col items-center space-y-6">
                <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="file" id="file-upload" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden"/>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a PDF file</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop file here</p>
                </label>
            </div>
        );
    };

    return (
        <ToolContainer title="PDF to PowerPoint">
            {error && <p className="mb-4 text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
            {renderContent()}
        </ToolContainer>
    );
};

export default PdfToPowerpoint;