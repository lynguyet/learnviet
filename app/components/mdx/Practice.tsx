'use client';

import { useState } from 'react';

interface PracticeProps {
  question: string;
  answer: string;
  hint?: string;
}

export function Practice({ question, answer, hint }: PracticeProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
      <p className="text-lg font-medium mb-3">{question}</p>
      
      {hint && (
        <p className="text-sm text-gray-500 mb-3">
          Hint: {hint}
        </p>
      )}

      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        {showAnswer ? 'Hide Answer' : 'Show Answer'}
      </button>

      {showAnswer && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-gray-700">{answer}</p>
        </div>
      )}
    </div>
  );
}