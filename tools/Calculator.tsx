
import React, { useState } from 'react';
import ToolContainer from '../components/ToolContainer';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setDisplay('0');
      setExpression('');
    } else if (value === '=') {
      try {
        // Warning: eval can be insecure. Using it here for simplicity in a controlled environment.
        const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
        setDisplay(String(result));
        setExpression(String(result));
      } catch (error) {
        setDisplay('Error');
        setExpression('');
      }
    } else if (value === '←') {
        setExpression(prev => prev.slice(0, -1));
        setDisplay(prev => prev.slice(0, -1) || '0');
    } else {
      setExpression(prev => prev + value);
      if (display === '0' && !['+', '-', '×', '÷', '.'].includes(value)) {
          setDisplay(value);
      } else {
          setDisplay(prev => prev + value);
      }
    }
  };

  const buttons = [
    'C', '←', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  const getButtonClass = (btn: string) => {
    if (['÷', '×', '-', '+', '='].includes(btn)) {
      return 'bg-primary-500 hover:bg-primary-600 text-white';
    }
    if (['C', '←', '%'].includes(btn)) {
      return 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500';
    }
    return 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600';
  };

  return (
    <ToolContainer title="Calculator">
      <div className="max-w-xs mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="bg-gray-200 dark:bg-gray-900 rounded-md p-4 mb-4 text-right text-3xl font-mono text-gray-800 dark:text-white break-words">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {buttons.map(btn => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`text-xl font-semibold p-4 rounded-lg transition-colors ${getButtonClass(btn)} ${btn === '0' ? 'col-span-2' : ''}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </ToolContainer>
  );
};

export default Calculator;
