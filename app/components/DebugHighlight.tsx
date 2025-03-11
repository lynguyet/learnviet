'use client';

import { useState } from 'react';

export default function DebugHighlight() {
  const [text, setText] = useState('');
  
  // Sample target text
  const targetText = "Tôi đến từ Việt Nam";
  const targetWords = targetText.split(' ');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  
  // Process the input text
  const inputWords = text.split(' ').filter(word => word.trim() !== '');
  const markedWords = inputWords.map(word => ({
    text: word,
    isCorrect: targetWords.includes(word)
  }));
  
  // Calculate missing words
  const missingWords = targetWords.filter(word => !inputWords.includes(word));
  
  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-2">Debug Highlighting</h3>
      
      <p className="mb-2">Target: {targetText}</p>
      
      <input
        type="text"
        value={text}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        placeholder="Type some words..."
      />
      
      <div className="mb-2">
        <strong>Highlighted Result:</strong>
        <p>
          {markedWords.map((word, index) => (
            <span 
              key={index} 
              style={{ 
                color: word.isCorrect ? 'black' : 'red',
                fontWeight: word.isCorrect ? 'normal' : 'bold',
                marginRight: '4px'
              }}
            >
              {word.text}
            </span>
          ))}
        </p>
      </div>
      
      {missingWords.length > 0 && (
        <div>
          <strong>Missing Words:</strong>
          <p style={{ color: 'red' }}>
            {missingWords.join(' ')}
          </p>
        </div>
      )}
    </div>
  );
}