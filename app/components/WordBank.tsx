'use client';

import { useState, useEffect } from 'react';
import { WordEntry } from '@/app/lib/types';
import PracticeMode from './PracticeMode';
import { ButtonHTMLAttributes } from 'react';

// Inline Button component
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

export default function WordBank() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    async function fetchWords() {
      try {
        const response = await fetch('/api/words');
        if (!response.ok) {
          throw new Error(`Failed to fetch words: ${response.status}`);
        }
        const data = await response.json();
        
        // Handle both possible data formats
        const wordsArray = Array.isArray(data) ? data : (data.words || []);
        
        // Ensure we have a valid array of words
        if (!Array.isArray(wordsArray)) {
          console.error('Expected array of words but got:', wordsArray);
          setWords([]);
        } else {
          setWords(wordsArray);
        }
      } catch (err: any) {
        console.error('Error fetching words:', err);
        setError(err.message || 'Failed to load words');
        setWords([]); // Ensure words is always an array
      } finally {
        setLoading(false);
      }
    }
    
    fetchWords();
  }, []);
  
  // Defensive filter - ensure words is an array before filtering
  const filteredWords = Array.isArray(words) ? words.filter(word => 
    (!selectedGrade || (word.grade && word.grade.includes(selectedGrade))) &&
    (searchTerm === '' || 
     (word.vietnamese && word.vietnamese.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (word.english && word.english.toLowerCase().includes(searchTerm.toLowerCase())))
  ) : [];

  if (loading) {
    return <div className="text-center py-10">Loading words...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  if (filteredWords.length === 0) {
    return (
      <div className="p-4">
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search words..."
            className="p-2 border rounded flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            className="p-2 border rounded"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
          </select>
        </div>
        
        <div className="text-center py-10">
          <p>No words found matching your criteria. Try adjusting your filters.</p>
          <Button 
            onClick={() => {
              setSelectedGrade('');
              setSearchTerm('');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search words..."
          className="p-2 border rounded flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className="p-2 border rounded"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="">All Levels</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-4">Word List ({filteredWords.length} words)</h2>
          <div className="border rounded max-h-[70vh] overflow-y-auto">
            {filteredWords.map((word) => (
              <div 
                key={word.id}
                className={`p-3 border-b cursor-pointer transition hover:bg-gray-50 ${
                  selectedWord?.id === word.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedWord(word)}
              >
                <p className="viet font-medium">{word.vietnamese}</p>
                <p className="text-sm text-gray-600">{word.english}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {word.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:pl-4">
          {selectedWord ? (
            <PracticeMode word={selectedWord} />
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p>Select a word from the list to practice pronunciation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}