'use client';
import { useState, useEffect } from 'react';
import { WordEntry } from '@/app/lib/types';
import { ButtonHTMLAttributes } from 'react';

// Add the shared Button component
function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
}) {
  return (
    <button
      className={`${className} ${
        variant === 'primary' 
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : variant === 'outline'
          ? 'border border-blue-500 text-blue-500 hover:bg-blue-50'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      } px-4 py-2 rounded`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function QuizMode() {
  const [currentWord, setCurrentWord] = useState<WordEntry | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [words, setWords] = useState<WordEntry[]>([]);

  // Add useEffect to fetch words from API
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('/api/words');
        const data = await response.json();
        setWords(data);
      } catch (err) {
        console.error('Error fetching words:', err);
      }
    };

    fetchWords();
  }, []);

  const getRandomWord = () => {
    if (words.length === 0) return;
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);
    setShowAnswer(false);
  };

  return (
    <div className="mt-8 p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="viet text-xl font-bold mb-4">Practice Quiz</h2>
      
      {!currentWord ? (
        <Button
          onClick={getRandomWord}
          variant="primary"
        >
          Start Quiz
        </Button>
      ) : (
        <div className="space-y-4">
          <p className="viet text-2xl font-bold">{currentWord.vietnamese}</p>
          
          {!showAnswer ? (
            <Button
              onClick={() => setShowAnswer(true)}
              variant="primary"
              className="bg-green-500 hover:bg-green-600"
            >
              Show Answer
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-lg">English: {currentWord.english}</p>
              <p>Pronunciation: {currentWord.pronunciation}</p>
              {currentWord.example && (
                <p className="viet text-gray-600">Example: {currentWord.example}</p>
              )}
              <Button
                onClick={getRandomWord}
                variant="primary"
              >
                Next Word
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}