import React, { useState, useRef, useMemo, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { ToolConfig } from '../types';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';
import { Chat } from '@google/genai';

// Declare showdown since it's loaded from a script tag
declare const showdown: any;

interface GenericAIToolProps {
  config: ToolConfig;
  title: string;
}

const GenericAITool: React.FC<GenericAIToolProps> = ({ config, title }) => {
  const { systemInstruction, inputLabel, fields = [], showChatHistory = false } = config;

  const initialFormState = useMemo(() => {
    const state: Record<string, string> = { mainInput: '' };
    fields.forEach(field => {
      state[field.id] = '';
    });
    return state;
  }, [fields]);

  const [formState, setFormState] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [streamingResult, setStreamingResult] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);

  const chatRef = useRef<Chat | null>(null);
  const stopRef = useRef<boolean>(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const markdownConverter = useMemo(() => new showdown.Converter(), []);

  useEffect(() => {
    // Scroll to the bottom of the result view as new content streams in
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [streamingResult]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };

  const handleStop = () => {
    stopRef.current = true;
    setIsLoading(false);
  };

  const handleClear = () => {
    setFormState(initialFormState);
    setStreamingResult('');
    setHistory([]);
    setError('');
    setErrors({});
    chatRef.current = null; // Start a new chat session on next generation
  };
  
  const handleCopy = () => {
      const finalContent = history.length > 0 ? history[history.length - 1].text : streamingResult;
      navigator.clipboard.writeText(finalContent);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formState.mainInput.trim()) {
      newErrors.mainInput = `${inputLabel} is required.`;
    }

    fields.forEach(field => {
      if (field.required && !formState[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateForm()) {
        return;
    }

    stopRef.current = false;
    setIsLoading(true);
    setError('');

    // Construct the full prompt from all fields
    let fullPrompt = formState.mainInput;
    fields.forEach(field => {
      if (formState[field.id]) {
        fullPrompt += `\n\n${field.label}: ${formState[field.id]}`;
      }
    });

    if (!chatRef.current) {
        chatRef.current = createChatSession(systemInstruction);
    }
    
    // Update history immediately with user prompt
    const newHistory = [...history, { role: 'user' as const, text: fullPrompt }];
    setHistory(newHistory);
    
    setStreamingResult(''); // Clear previous stream for new output

    try {
      const resultStream = await chatRef.current.sendMessageStream({ message: fullPrompt });
      let currentText = '';

      for await (const chunk of resultStream) {
        if (stopRef.current) {
            break;
        }
        currentText += chunk.text;
        setStreamingResult(currentText);
      }
      
      // Once streaming is complete, finalize the history
      if (!stopRef.current) {
          setHistory([...newHistory, { role: 'model' as const, text: currentText }]);
      }
      setStreamingResult(''); // Clear the live stream view
      
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading;

  return (
    <ToolContainer title={title}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-1/3 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{inputLabel}</label>
            <textarea
              name="mainInput"
              value={formState.mainInput}
              onChange={handleInputChange}
              placeholder="Enter your text or topic here..."
              className="w-full h-40 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.mainInput && <p className="text-red-500 text-sm mt-1">{errors.mainInput}</p>}
          </div>
          {fields.map(field => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
              <input
                type="text"
                id={field.id}
                name={field.id}
                value={formState[field.id]}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full flex justify-center items-center px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Spinner /> : 'Generate'}
            </button>
            {isLoading && (
              <button
                type="button"
                onClick={handleStop}
                className="w-full flex justify-center items-center px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Stop Generating
              </button>
            )}
          </div>
           <div className="flex gap-2">
                <button type="button" onClick={handleCopy} className="flex-grow px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Copy</button>
                <button type="button" onClick={handleClear} className="flex-grow px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Clear</button>
            </div>
        </form>

        {/* Output Area */}
        <div className="w-full md:w-2/3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Result</label>
          <div ref={resultRef} className="h-96 p-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md overflow-y-auto">
            {error && <p className="text-red-500">{error}</p>}
            
            {showChatHistory && history.map((entry, index) => (
              <div key={index} className={`mb-4 ${entry.role === 'user' ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-transparent'} p-3 rounded-lg`}>
                <p className="font-semibold capitalize text-primary-700 dark:text-primary-300">{entry.role}</p>
                <div 
                    className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap" 
                    dangerouslySetInnerHTML={{ __html: markdownConverter.makeHtml(entry.text) }} 
                />
              </div>
            ))}
            
            {streamingResult && (
               <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: markdownConverter.makeHtml(streamingResult) }} />
            )}

            {!isLoading && history.length === 0 && (
                <p className="text-gray-500">Your generated content will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </ToolContainer>
  );
};

export const createAIToolComponent = (config: ToolConfig, title: string): React.FC => {
  return function AIToolWrapper() {
    return <GenericAITool config={config} title={title} />;
  };
};