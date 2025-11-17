
import React, { useState, useMemo } from 'react';
import ToolContainer from '../components/ToolContainer';

const WordCounter: React.FC = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return { words: 0, characters: 0, sentences: 0 };
    }

    const words = trimmedText.split(/\s+/).filter(Boolean).length;
    const characters = text.length;
    const sentences = (trimmedText.match(/[.!?]+(?!\s|$)|\n+/g) || []).length;

    return { words, characters, sentences };
  }, [text]);

  return (
    <ToolContainer title="Word & Character Counter">
      <div className="space-y-4">
        <textarea
          className="w-full h-80 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Start typing or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.words}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Words</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.characters}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Characters</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.sentences}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sentences</p>
          </div>
        </div>
      </div>
    </ToolContainer>
  );
};

export default WordCounter;
