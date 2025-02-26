'use client';

interface PronunciationProps {
  word: string;
  ipa: string;
  audio?: string;
  examples?: {
    vietnamese: string;
    english: string;
  }[];
}

export function Pronunciation({ word, ipa, audio, examples }: PronunciationProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 my-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{word}</h3>
          <p className="text-gray-600 font-mono">/{ipa}/</p>
        </div>
        {audio && (
          <button
            onClick={() => new Audio(audio).play()}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
              />
            </svg>
          </button>
        )}
      </div>

      {examples && examples.length > 0 && (
        <div className="mt-4 space-y-2">
          {examples.map((example, index) => (
            <div key={index} className="text-sm">
              <p className="text-gray-900">{example.vietnamese}</p>
              <p className="text-gray-600">{example.english}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}