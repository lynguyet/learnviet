'use client';

import { useState, useEffect, useRef } from 'react';
import Navigation from '../components/Navigation';
import { WordEntry } from '@/app/lib/types';

// Declare the SpeechRecognition type for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function PracticePage() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  
  // Speech recognition states
  const [isRecording, setIsRecording] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [results, setResults] = useState<{[key: string]: {score: number, transcript: string}}>({});
  
  // Reference to the speech recognition object
  const recognitionRef = useRef<any>(null);
  
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
    
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'vi-VN'; // Set language to Vietnamese
        
        recognitionRef.current.onresult = (event: any) => {
          const currentTranscript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setTranscript(currentTranscript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
        };
      } else {
        setError('Speech recognition is not supported in your browser');
      }
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  // Function to toggle recording
  const toggleRecording = (wordId: string, vietnamese: string) => {
    if (isRecording === wordId) {
      // Stop recording
      recognitionRef.current.stop();
      setIsRecording(null);
      
      // Compare transcript with original text
      const similarity = calculateSimilarity(transcript, vietnamese);
      
      // Store results
      setResults(prev => ({
        ...prev,
        [wordId]: {
          score: similarity,
          transcript: transcript
        }
      }));
      
      // Reset transcript
      setTranscript('');
    } else {
      // Start recording
      setTranscript('');
      recognitionRef.current.start();
      setIsRecording(wordId);
    }
  };
  
  // Function to calculate similarity between two texts (0-100%)
  const calculateSimilarity = (text1: string, text2: string): number => {
    // Remove punctuation and normalize whitespace
    const normalize = (text: string) => {
      return text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };
    
    const normalizedText1 = normalize(text1);
    const normalizedText2 = normalize(text2);
    
    // Simple exact match
    if (normalizedText1 === normalizedText2) return 100;
    
    // Calculate Levenshtein distance for more nuanced comparison
    const distance = levenshteinDistance(normalizedText1, normalizedText2);
    const maxLength = Math.max(normalizedText1.length, normalizedText2.length);
    
    if (maxLength === 0) return 100;
    
    // Convert distance to similarity percentage
    const similarity = Math.max(0, 100 - (distance / maxLength * 100));
    return Math.round(similarity);
  };
  
  // Levenshtein distance calculation
  const levenshteinDistance = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    const matrix = [];
    
    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    return matrix[b.length][a.length];
  };
  
  // Filter words based on selected grade
  const filteredWords = Array.isArray(words) 
    ? words.filter(word => selectedGrade === 'All' || word.grade === selectedGrade)
    : [];
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Practice reading</h1>
          <div className="text-center py-10">Loading practice materials...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Practice reading</h1>
          <div className="text-center py-10 text-red-500">{error}</div>
        </div>
      </div>
    );
  }
  
  // Get unique grades from words
  const grades = ['All', ...new Set(words.map(word => word.grade).filter(Boolean))];
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Practice reading</h1>
        <p className="mb-6">Start recording and our system will analyze your reading skill</p>
        
        {/* Grade filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {grades.map(grade => (
            <button
              key={grade}
              className={`rounded-full py-2 px-4 ${
                selectedGrade === grade 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white border'
              }`}
              onClick={() => setSelectedGrade(grade)}
            >
              {grade}
            </button>
          ))}
        </div>
        
        {/* Practice cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredWords.map(word => (
            <div key={word.id} className="border rounded p-4">
              <div className="flex gap-2 mb-2">
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                  {word.grade || '1st grade'}
                </span>
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                  Greetings
                </span>
              </div>
              
              <h3 className="text-lg viet mb-1">{word.vietnamese}</h3>
              <div className="mb-4">
                <div>English: {word.english}</div>
                {word.pronunciation && <div>{word.pronunciation}</div>}
              </div>
              
              {/* Display transcript during recording */}
              {isRecording === word.id && (
                <div className="mb-4 p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Recording...</p>
                  <p>{transcript || "Listening..."}</p>
                </div>
              )}
              
              {/* Display results after recording */}
              {results[word.id] && !isRecording && (
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Score:</span> 
                    <span 
                      className={`px-2 py-1 rounded ${
                        results[word.id].score > 80 
                          ? 'bg-green-100 text-green-800' 
                          : results[word.id].score > 50 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {results[word.id].score}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    You said: "{results[word.id].transcript}"
                  </p>
                </div>
              )}
              
              <button 
                className={`px-4 py-2 rounded transition ${
                  isRecording === word.id
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
                onClick={() => toggleRecording(word.id, word.vietnamese)}
              >
                {isRecording === word.id ? 'Stop recording' : 'Start recording'}
              </button>
            </div>
          ))}
        </div>
        
        {filteredWords.length === 0 && (
          <div className="text-center py-10">
            <p>No practice materials found for the selected criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}