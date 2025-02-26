'use client';
import { useState } from 'react';
import { words, Word } from '@/data/words';

export default function QuizMode() {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);
    setShowAnswer(false);
  };

  return (
    <div className="mt-8 p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="viet text-xl font-bold mb-4">Practice Quiz</h2>
      
      {!currentWord ? (
        <button
          onClick={getRandomWord}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Start Quiz
        </button>
      ) : (
        <div className="space-y-4">
          <p className="viet text-2xl font-bold">{currentWord.vietnamese}</p>
          
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              Show Answer
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-lg">English: {currentWord.english}</p>
              <p>Pronunciation: {currentWord.pronunciation}</p>
              {currentWord.example && (
                <p className="viet text-gray-600">Example: {currentWord.example}</p>
              )}
              <button
                onClick={getRandomWord}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Next Word
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}