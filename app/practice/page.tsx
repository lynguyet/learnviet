'use client';

import { useState, useEffect, useRef } from 'react';
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
  
  // Add this to your existing state declarations
  const [expandedTranslations, setExpandedTranslations] = useState<{[key: string]: boolean}>({});
  
  useEffect(() => {
    async function fetchWords() {
      try {
        console.log("Fetching words from API...");
        const response = await fetch('/api/words');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch words: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API response:", data);
        
        // Handle both possible data formats
        let wordsArray;
        if (Array.isArray(data)) {
          wordsArray = data;
        } else if (data.words && Array.isArray(data.words)) {
          wordsArray = data.words;
        } else {
          console.error('Unexpected data format:', data);
          wordsArray = [];
        }
        
        console.log("Processed words array:", wordsArray);
        setWords(wordsArray);
      } catch (err) {
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
  
  // Add a toggle function
  const toggleTranslation = (wordId: string) => {
    setExpandedTranslations(prev => ({
      ...prev,
      [wordId]: !prev[wordId]
    }));
  };
  
  // Add this to your useEffect
  useEffect(() => {
    // Initialize some cards as expanded (e.g., the first card)
    if (words.length > 0) {
      setExpandedTranslations({
        [words[0].id]: true  // First card expanded
      });
    }
  }, [words]);
  
  // Update this function to better highlight missing words and errors
  const highlightErrors = (original: string, transcript: string): JSX.Element => {
    // Normalize both strings
    const normalizeText = (text: string) => {
      return text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .trim();
    };
    
    const originalNormalized = normalizeText(original);
    const transcriptNormalized = normalizeText(transcript);
    
    const originalWords = originalNormalized.split(' ');
    const transcriptWords = transcriptNormalized.split(' ');
    
    // If the transcript is shorter than the original, we need to show what's missing
    if (transcriptWords.length < originalWords.length) {
      // Show what was said, then indicate missing words
      return (
        <>
          {transcriptWords.map((word, index) => {
            // Check if the word is misspelled
            if (normalizeText(word) !== normalizeText(originalWords[index])) {
              return (
                <span key={index}>
                  {index > 0 ? ' ' : ''}
                  <span className="text-red-600">{word}</span>
                  <span className="text-black">
                    ({originalWords[index]})
                  </span>
                </span>
              );
            }
            return <span key={index}>{index > 0 ? ' ' : ''}{word}</span>;
          })}
          <span className="text-black italic">
            {' '}(missing: {originalWords.slice(transcriptWords.length).join(' ')})
          </span>
        </>
      );
    }
    
    // If transcript has all words but some are wrong or has extra words
    return (
      <>
        {transcriptWords.map((word, index) => {
          // If we're beyond the original text length
          if (index >= originalWords.length) {
            return (
              <span key={index}>
                {' '}
                <span className="text--600">{word}</span>
                <span className="text-black">(extra)</span>
              </span>
            );
          }
          
          // If the word matches
          if (normalizeText(word) === normalizeText(originalWords[index])) {
            return <span key={index}>{index > 0 ? ' ' : ''}{word}</span>;
          }
          
          // Word doesn't match - highlight it
          return (
            <span key={index}>
              {index > 0 ? ' ' : ''}
              <span className="text-red-600">{word}</span>
              <span className="text-black">
                ({originalWords[index]})
              </span>
            </span>
          );
        })}
      </>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen">
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
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Practice reading</h1>
          <div className="text-center py-10 text-red-600">{error}</div>
        </div>
      </div>
    );
  }
  
  // Get unique grades from words
  const grades = ['All', ...new Set(words.map(word => word.grade).filter(Boolean))];
  
  return (
    <div className="min-h-screen">
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
                  ? 'bg-primary text-white' 
                  : 'bg-white border'
              }`}
              onClick={() => setSelectedGrade(grade)}
            >
              {grade}
            </button>
          ))}
        </div>
        
        {/* Practice cards - Updated design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map(word => (
            <div 
              key={word.id} 
              className="border rounded-lg p-6 bg-white shadow-md"
            >
              <div className="flex gap-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                  {word.grade || '1st grade'}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                  {word.title || 'Greetings'}
                </span>
              </div>
              
              <h4 className="text-2xl viet mb-4">{word.vietnamese}</h4>
              
              {/* Collapsible English translation - Simplified */}
              <div className="mb-4">
                <button 
                  onClick={() => toggleTranslation(word.id)}
                  className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
                  aria-expanded={expandedTranslations[word.id]}
                >
                  <span className="text-lg">English</span>
                  <svg 
                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${expandedTranslations[word.id] ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedTranslations[word.id] 
                      ? 'max-h-20 opacity-100 mt-2' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-gray-700">
                    {word.english}
                    {word.pronunciation && (
                      <div className="text-black mt-1">{word.pronunciation}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Display results after recording */}
              {results[word.id] && !isRecording && (
                <div className="mb-4">
                  <div className="mb-2">
                    <span className="font-bold">Score: </span>
                    <span 
                      className={`px-3 py-1 rounded-full ${
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
                  <p className="text-gray-700">
                    You said: {highlightErrors(word.vietnamese, results[word.id].transcript)}
                  </p>
                </div>
              )}
              
              {/* Recording UI */}
              {isRecording === word.id && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Recording...</p>
                  <p>{transcript || "Listening..."}</p>
                </div>
              )}
              
              <button 
                className={`w-full px-4 py-3 rounded-full transition text-center ${
                  isRecording === word.id
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-primary text-white hover:bg-gray-800'
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
        
        <div className="bg-gray-100 p-4 mb-4 rounded">
          <h3 className="font-bold">Debug Info:</h3>
          <p>Words loaded: {words.length}</p>
          <p>Data source: {Array.isArray(words) ? 'Direct array' : words.source || 'Unknown'}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
          <details>
            <summary>First 2 words data</summary>
            <pre className="text-xs mt-2">
              {JSON.stringify(words.slice(0, 2), null, 2)}
            </pre>
          </details>
        </div>
      </main>
    </div>
  );
}