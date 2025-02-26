'use client';

import { useState } from 'react';

interface FlashCardProps {
  front: string;
  back: string;
  hint?: string;
}

export function FlashCard({ front, back, hint }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="my-4 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`
        relative w-full h-48 transition-transform duration-500
        ${isFlipped ? 'rotate-y-180' : ''}
      `}>
        {/* Front */}
        <div className={`
          absolute w-full h-full bg-white rounded-lg shadow-md p-6
          flex items-center justify-center text-center
          ${isFlipped ? 'opacity-0' : 'opacity-100'}
          transition-opacity duration-500
        `}>
          <div>
            <p className="text-xl font-medium">{front}</p>
            {hint && <p className="text-sm text-gray-500 mt-2">Hint: {hint}</p>}
          </div>
        </div>

        {/* Back */}
        <div className={`
          absolute w-full h-full bg-blue-50 rounded-lg shadow-md p-6
          flex items-center justify-center text-center
          ${isFlipped ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-500
          rotate-y-180
        `}>
          <p className="text-xl font-medium">{back}</p>
        </div>
      </div>
    </div>
  );
}