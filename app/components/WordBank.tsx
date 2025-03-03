'use client';

import { useState, useEffect } from 'react';
import { WordEntry } from '@/lib/types';
import PracticeMode from './PracticeMode';
import Button from '@/app/components/Button';

export default function WordBank() {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        console.log('Fetching words...');  // Debug log
        const response = await fetch('/api/words');
        const data = await response.json();
        console.log('Received words:', data);  // Debug log
        setWords(data);
      } catch (err) {
        console.error('Error fetching words:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch words');
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  console.log('Current state:', { words, loading, selectedGrade });  // Debug log

  const filteredWords = words.filter(word => 
    !selectedGrade || word.grade.includes(selectedGrade)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>Error: {error}</p>
        <Button 
          variant="secondary" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Grade filters */}
      <div className="mb-8">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={!selectedGrade ? 'primary' : 'outline'}
            onClick={() => setSelectedGrade(null)}
            
          >
            All Grades
          </Button>
          <Button
            variant={selectedGrade === '1st' ? 'primary' : 'outline'}
            onClick={() => setSelectedGrade('1st')}
            
          >
            1st Grade
          </Button>
          <Button
            variant={selectedGrade === '2nd' ? 'primary' : 'outline'}
            onClick={() => setSelectedGrade('2nd')}
          >
            2nd Grade
          </Button>
        </div>
      </div>

      {/* Results count */}
      

      {/* Word cards grid */}
      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map((word) => (
            <div key={`${word.id}-${word.vietnamese}`} className="p-6 bg-white rounded-lg shadow-sm border border-white">
              <div className="flex gap-2 mb-4">
                <span key={`${word.id}-${word.grade}`} className="text-sm px-3 py-1 bg-lime-green rounded-full">
                  {word.grade}
                </span>
                <span className="text-sm px-3 py-1 bg-lime-green rounded-full">
                  {word.title}
                </span>
              </div>
              
              <h2 className="viet text-xl font-bold mb-2">
                {word.vietnamese}
              </h2>
              <p className="text-gray-600 mb-4">
                {word.english}
              </p>
              
              <PracticeMode word={word.vietnamese} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No words found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}