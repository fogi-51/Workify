// Fix: Corrected the import statement. `aistudio` is a global and should not be imported.
// Combined multiple `react` imports into one.
import React, { useState, useEffect, useRef } from 'react';
import ToolContainer from '../components/ToolContainer';
import { generateVideo } from '../services/geminiService';
import Spinner from '../components/Spinner';

// Reassuring messages for the user during the wait
const LOADING_MESSAGES = [
    "Contacting the video muse...",
    "Rendering pixels into motion...",
    "This can take a few minutes, please wait...",
    "Assembling the final cut...",
    "Polishing the frames...",
    "Almost there, finalizing the video...",
];

const AIVideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
    const [videoUrl, setVideoUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
    const [isKeySelected, setIsKeySelected] = useState(false);
    
    const messageIntervalRef = useRef<number | null>(null);

    // Check for API key on component mount
    useEffect(() => {
        const checkApiKey = async () => {
            if (await window.aistudio.hasSelectedApiKey()) {
                setIsKeySelected(true);
            }
        };
        checkApiKey();
    }, []);

    // Cleanup object URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);

    const handleSelectKey = async () => {
        await window.aistudio.openSelectKey();
        // Optimistically assume the user selected a key. 
        // The actual check will happen on the API call.
        setIsKeySelected(true);
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt to generate a video.");
            return;
        }
        if (!isKeySelected) return;

        setIsLoading(true);
        setVideoUrl('');
        setError('');
        setLoadingMessage(LOADING_MESSAGES[0]);

        // Cycle through loading messages
        let messageIndex = 1;
        messageIntervalRef.current = window.setInterval(() => {
            setLoadingMessage(LOADING_MESSAGES[messageIndex % LOADING_MESSAGES.length]);
            messageIndex++;
        }, 5000);

        try {
            const videoUri = await generateVideo(prompt, { aspectRatio, resolution });
            
            // The URI needs the API key to be fetched
            const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch video data. Status: ${response.status}`);
            }
            const videoBlob = await response.blob();
            const objectUrl = URL.createObjectURL(videoBlob);
            setVideoUrl(objectUrl);

        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
            // If the error is due to a missing/invalid key, prompt the user to select one again.
            if (err.message && err.message.includes("Please select a valid project")) {
                setIsKeySelected(false);
            }
        } finally {
            setIsLoading(false);
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        }
    };

    if (!isKeySelected) {
        return (
            <ToolContainer title="AI Video Generator - Project Selection">
                <div className="text-center p-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <h4 className="text-xl font-semibold mb-4">Project Required for Video Generation</h4>
                    <p className="mb-6 text-gray-600 dark:text-gray-300">
                        The AI Video Generator uses advanced models that require a Google Cloud project with billing enabled. Please select a project to continue.
                    </p>
                    <button
                        onClick={handleSelectKey}
                        className="px-6 py-3 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors text-lg font-medium"
                    >
                        Select Project
                    </button>
                    <p className="mt-4 text-sm text-gray-500">
                        For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">billing documentation</a>.
                    </p>
                </div>
            </ToolContainer>
        );
    }

    return (
        <ToolContainer title="AI Video Generator">
            <div className="space-y-6">
                {/* Prompt Input */}
                <textarea
                    className="w-full h-28 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., A majestic lion waking up at sunrise in the savanna"
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        if(error) setError('');
                    }}
                />

                {/* Configuration Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aspect Ratio</label>
                        <div className="flex gap-2">
                            <button onClick={() => setAspectRatio('16:9')} className={`px-4 py-2 rounded-md w-full ${aspectRatio === '16:9' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>16:9 (Landscape)</button>
                            <button onClick={() => setAspectRatio('9:16')} className={`px-4 py-2 rounded-md w-full ${aspectRatio === '9:16' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>9:16 (Portrait)</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resolution</label>
                        <div className="flex gap-2">
                            <button onClick={() => setResolution('720p')} className={`px-4 py-2 rounded-md w-full ${resolution === '720p' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>720p</button>
                            <button onClick={() => setResolution('1080p')} className={`px-4 py-2 rounded-md w-full ${resolution === '1080p' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>1080p</button>
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center px-4 py-3 text-lg text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Spinner /> : 'Generate Video'}
                </button>

                {/* Result Display */}
                <div className="mt-6 flex flex-col justify-center items-center min-h-96 bg-gray-100 dark:bg-gray-700 rounded-md p-4">
                    {isLoading && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-300">{loadingMessage}</p>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {videoUrl && !isLoading && (
                        <div className="w-full max-w-2xl text-center">
                            <video src={videoUrl} controls autoPlay loop className="w-full rounded-md shadow-lg" />
                            <a
                                href={videoUrl}
                                download={`${prompt.slice(0, 20).replace(/\s/g, '_')}.mp4`}
                                className="mt-4 inline-block px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Download Video
                            </a>
                        </div>
                    )}
                    {!isLoading && !videoUrl && !error && (
                        <p className="text-gray-500">Your generated video will appear here.</p>
                    )}
                </div>
            </div>
        </ToolContainer>
    );
};

export default AIVideoGenerator;