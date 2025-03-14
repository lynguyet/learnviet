'use client';

import { useState, useRef, useEffect } from 'react';
import { ButtonHTMLAttributes } from 'react';

// Update Button component to include 'outline' variant
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

// Define event interfaces
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Define our own recognition interface without global declarations
interface MySpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  addEventListener: (type: string, callback: EventListenerOrEventListenerObject) => void;
  removeEventListener: (type: string, callback: EventListenerOrEventListenerObject) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: (event: Event) => void;
}

// Add prop types
interface PracticeModeProps {
  word: string;
}

export default function PracticeMode({ word }: PracticeModeProps) {
  console.log('PracticeMode rendering with word:', word);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [accuracy, setAccuracy] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [browserSupport, setBrowserSupport] = useState<boolean | null>(null);
  const [wordComparison, setWordComparison] = useState<any[]>([]);
  const [markedWords, setMarkedWords] = useState<{text: string, isCorrect: boolean}[]>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  
  const recognitionRef = useRef<any>(null);

  // Check for browser support on mount
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const isSupported = !!(window.SpeechRecognition || 
                           window.webkitSpeechRecognition);
      setBrowserSupport(isSupported);
    }
  }, []);

  const startRecording = () => {
    console.log('Starting recording, resetting states');
    // Reset states
    setError(null);
    setTranscribedText('');
    setAccuracy(0);
    setShowEvaluation(false);
    setWordComparison([]);
    setMissingWords([]);
    
    try {
      if (typeof window === 'undefined') {
        throw new Error("Speech recognition only works in browser environments");
      }
      
      // Use window with appropriate type checking
      const SpeechRecognitionAPI = window.webkitSpeechRecognition || 
                                  window.SpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        throw new Error("Speech recognition not supported in this browser");
      }
      
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;
      recognition.continuous = false;
      
      recognition.onresult = (event: any) => {
        console.log('Got speech result', event);
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Transcript:', transcript);
        
        setTranscribedText(transcript);
        
        // Get the target text
        const targetText = word.vietnamese.toLowerCase();
        console.log('Target text:', targetText);
        
        // Log the words
        console.log('Spoken words:', transcript.split(/\s+/));
        console.log('Target words:', targetText.split(/\s+/));
        
        // Split into words
        const targetWords = targetText.split(/\s+/);
        const spokenWords = transcript.split(/\s+/);
        
        // Mark each spoken word as correct or incorrect
        const markedWords = spokenWords.map(word => ({
          text: word,
          isCorrect: targetWords.includes(word)
        }));
        
        // Calculate accuracy
        const correctWords = markedWords.filter(w => w.isCorrect).length;
        const calculatedAccuracy = Math.round((correctWords / targetWords.length) * 100);
        
        // Find missing words
        const missing = targetWords.filter(word => !spokenWords.includes(word));
        
        setMarkedWords(markedWords);
        console.log('Marked words set:', markedWords);
        
        setMissingWords(missing);
        console.log('Missing words set:', missing);
        setAccuracy(calculatedAccuracy);
        setShowEvaluation(true);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setError(`Error: ${event.error}`);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      
    } catch (err: any) {
      console.error('Failed to start recording:', err);
      setError(err.message || 'Failed to start recording');
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Add this new helper function above the calculateLevenshteinDistance function:
  const normalizeText = (text: string): string => {
    // Remove punctuation and normalize spaces
    return text
      .replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "")  // Remove punctuation
      .replace(/\s+/g, " ")                          // Normalize spaces
      .trim();                                       // Trim leading/trailing spaces
  };

  // Existing Levenshtein distance function remains unchanged
  const calculateLevenshteinDistance = (a: string, b: string): number => {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) {
      matrix[0][i] = i;
    }
    
    for (let j = 0; j <= b.length; j++) {
      matrix[j][0] = j;
    }
    
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + substitutionCost // substitution
        );
      }
    }
    
    return matrix[b.length][a.length];
  };

  // Add this new function for word-based accuracy
  const calculateWordAccuracy = (spoken: string, target: string): number => {
    // Normalize and split into words
    const normalizeAndSplit = (text: string) => {
      return text
        .replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "")
        .toLowerCase()
        .trim()
        .split(/\s+/);
    };
    
    const spokenWords = normalizeAndSplit(spoken);
    const targetWords = normalizeAndSplit(target);
    
    // Count matching words
    let matchCount = 0;
    for (const word of spokenWords) {
      if (targetWords.includes(word)) {
        matchCount++;
        // Remove the matched word to prevent double counting
        const index = targetWords.indexOf(word);
        targetWords.splice(index, 1);
      }
    }
    
    // Calculate accuracy based on the total number of words
    const totalUniqueWords = new Set([...normalizeAndSplit(spoken), ...normalizeAndSplit(target)]).size;
    return Math.round((matchCount / Math.max(spokenWords.length, normalizeAndSplit(target).length)) * 100);
  };

  // Add this function to identify word-level errors
  const identifyWordErrors = (spoken: string, target: string): {[key: string]: boolean} => {
    // Normalize and split into words
    const normalizeAndSplit = (text: string) => {
      return text
        .replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "")
        .toLowerCase()
        .trim()
        .split(/\s+/);
    };
    
    const spokenWords = normalizeAndSplit(spoken);
    const targetWords = normalizeAndSplit(target);
    
    // Create a copy of target words to track matches
    const remainingTargetWords = [...targetWords];
    
    // Track errors for each spoken word
    const errors: {[key: string]: boolean} = {};
    
    // Check each spoken word
    spokenWords.forEach((word, index) => {
      // Try to find this word in the remaining target words
      const targetIndex = remainingTargetWords.indexOf(word);
      
      if (targetIndex !== -1) {
        // Word found - mark as correct
        errors[word] = false;
        // Remove the matched word to prevent double matching
        remainingTargetWords.splice(targetIndex, 1);
      } else {
        // Word not found or already matched - mark as error
        errors[word] = true;
      }
    });
    
    return errors;
  };

  // Enhanced word comparison function
  const compareWords = (spoken: string, target: string) => {
    // Normalize and split into words
    const normalizeAndSplit = (text: string) => {
      return text
        .replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, "")
        .toLowerCase()
        .trim()
        .split(/\s+/);
    };
    
    const spokenWords = normalizeAndSplit(spoken);
    const targetWords = normalizeAndSplit(target);
    
    console.log('Comparing:', { spokenWords, targetWords });
    
    // Use Levenshtein distance for word sequences
    const wordMatrix = Array(targetWords.length + 1).fill(null)
      .map(() => Array(spokenWords.length + 1).fill(null));
    
    // Initialize first row and column
    for (let i = 0; i <= targetWords.length; i++) {
      wordMatrix[i][0] = i;
    }
    
    for (let j = 0; j <= spokenWords.length; j++) {
      wordMatrix[0][j] = j;
    }
    
    // Fill the matrix
    for (let i = 1; i <= targetWords.length; i++) {
      for (let j = 1; j <= spokenWords.length; j++) {
        const cost = targetWords[i - 1] === spokenWords[j - 1] ? 0 : 1;
        wordMatrix[i][j] = Math.min(
          wordMatrix[i - 1][j] + 1, // deletion
          wordMatrix[i][j - 1] + 1, // insertion
          wordMatrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    // Backtrack to find the alignment
    let i = targetWords.length;
    let j = spokenWords.length;
    const alignment = [];
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && wordMatrix[i][j] === wordMatrix[i - 1][j - 1] + (targetWords[i - 1] === spokenWords[j - 1] ? 0 : 1)) {
        // Substitution or match
        alignment.unshift({
          target: targetWords[i - 1],
          spoken: spokenWords[j - 1],
          correct: targetWords[i - 1] === spokenWords[j - 1],
          type: targetWords[i - 1] === spokenWords[j - 1] ? 'correct' : 'mispronounced'
        });
        i--;
        j--;
      } else if (j > 0 && wordMatrix[i][j] === wordMatrix[i][j - 1] + 1) {
        // Insertion (extra word in spoken)
        alignment.unshift({
          target: null,
          spoken: spokenWords[j - 1],
          correct: false,
          type: 'extra'
        });
        j--;
      } else {
        // Deletion (missing word from target)
        alignment.unshift({
          target: targetWords[i - 1],
          spoken: null,
          correct: false,
          type: 'missing'
        });
        i--;
      }
    }
    
    return alignment;
  };

  // If browser support hasn't been checked yet
  if (browserSupport === null) {
    return <div>Checking browser compatibility...</div>;
  }

  // If browser doesn't support speech recognition
  if (browserSupport === false) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Browser Not Supported</h3>
        <p className="mt-2 text-red-700">
          Your browser doesn't support speech recognition. Please try using Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-xl font-bold mb-4">Practice Mode</h3>
      
      <div className="mb-4">
        <p className="viet text-2xl font-medium">{word.vietnamese}</p>
        <p className="text-gray-600">{word.english}</p>
        <p className="text-sm text-gray-500 mt-1">Pronunciation: {word.pronunciation}</p>
      </div>
      
      {word.example && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p className="viet text-sm font-medium">Example:</p>
          <p className="viet">{word.example}</p>
        </div>
      )}
      
      <div className="flex space-x-2 mt-6">
        {!isRecording ? (
          <Button 
            onClick={startRecording}
            disabled={isRecording}
          >
            Start Recording
          </Button>
        ) : (
          <Button 
            onClick={stopRecording}
          >
            Stop Recording
          </Button>
        )}
      </div>

      {showEvaluation && (
        <div className="mt-4">
          {transcribedText ? (
            <>
              <p className="viet mt-2">
                You said: {' '}
                {markedWords.map((word, index) => (
                  <span 
                    key={index} 
                    className={!word.isCorrect ? 'text-red-500 font-medium' : ''}
                  >
                    {word.text}{' '}
                  </span>
                ))}
              </p>
              
              {missingWords.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Missing: {missingWords.join(' ')}
                </p>
              )}
              
              <p className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full ${
                  accuracy >= 80 ? 'bg-green-100 text-green-800' : 
                  accuracy >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  Score: {accuracy}%
                </span>
              </p>
              
              <p className="text-sm text-gray-800 mt-1">
                {accuracy === 100
                  ? "Perfect! Your pronunciation is excellent."
                  : accuracy >= 80
                  ? "Great job! You're almost there."
                  : accuracy >= 50
                  ? "Keep practicing! You're making progress."
                  : "Try again! Focus on pronunciation and tone."}
              </p>
            </>
          ) : (
            <p className="text-gray-500">No speech detected</p>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
