
import React, { useState, useMemo } from 'react';
import ToolContainer from '../components/ToolContainer';

const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://react.dev');
  
  const qrCodeUrl = useMemo(() => {
    if (!text) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;
  }, [text]);

  return (
    <ToolContainer title="QR Code Generator">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-grow w-full">
            <label htmlFor="qr-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL or Text
            </label>
            <input
                id="qr-text"
                type="text"
                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter URL or text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
        <div className="w-full md:w-auto flex flex-col items-center">
            <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-center items-center p-2">
                {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="Generated QR Code" className="rounded-md"/>
                ) : (
                    <p className="text-gray-500 text-center">Enter text to generate a QR code</p>
                )}
            </div>
            {qrCodeUrl && (
                <a 
                    href={qrCodeUrl} 
                    download={`qrcode-${Date.now()}.png`}
                    className="mt-4 px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
                >
                    Download
                </a>
            )}
        </div>
      </div>
    </ToolContainer>
  );
};

export default QRCodeGenerator;
