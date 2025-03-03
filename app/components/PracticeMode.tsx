'use client';

import { useState, useRef } from 'react';
import { ButtonHTMLAttributes } from 'react';

// Add Button component inline
function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
}) {
  return (
    <button
      className={`${className} ${
        variant === 'primary' 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-200 text-gray-800'
      } px-4 py-2 rounded`}
      {...props}
    >
      {children}
    </button>
  );
}

// Add proper type declarations
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start(): void;
  stop(): void;
}

interface PracticeModeProps {
  text: string;
  onRecordingComplete: (data: any) => void;
}

export default function PracticeMode({ text, onRecordingComplete }: PracticeModeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [accuracy, setAccuracy] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const calculateAccuracy = (transcribed: string, target: string): number => {
    if (!transcribed) {
      console.log('No transcription detected');
      return 0;
    }

    // Clean and normalize the strings
    const cleanString = (str: string) => {
      return str
        .toLowerCase()
        .trim()
        // Remove punctuation
        .replace(/[.,!?]/g, '')
        // Normalize whitespace
        .replace(/\s+/g, ' ');
    };

    // Split both strings into arrays of words and normalize them
    const targetWords = cleanString(target).split(' ');
    const transcribedWords = cleanString(transcribed).split(' ');

    console.log('Comparing:', {
      targetWords,
      transcribedWords
    });

    // Count matching words
    let matchingWords = 0;
    for (const word of transcribedWords) {
      if (targetWords.includes(word)) {
        matchingWords++;
        console.log('Matched word:', word);
      }
    }

    // Calculate accuracy based on target word count
    const accuracy = Math.round((matchingWords / targetWords.length) * 100);
    
    console.log('Accuracy calculation:', {
      matchingWords,
      totalWords: targetWords.length,
      accuracy
    });

    return accuracy;
  };

  const startRecording = () => {
    console.log('Starting recording, resetting states');
    // Reset states
    setError(null);
    setTranscribedText('');
    setAccuracy(0);
    setShowEvaluation(false);
    setHasSpoken(false);
    
    try {
      const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;
      recognition.continuous = false;
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech detected:', transcript);
        if (transcript.trim()) {
          setHasSpoken(true);
          setTranscribedText(transcript);
          const accuracyScore = calculateAccuracy(transcript, text);
          console.log('Calculated accuracy:', accuracyScore);
          setAccuracy(accuracyScore);
          setShowEvaluation(true);
        }
      };
      
      recognition.onend = () => {
        console.log('Recognition ended');
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError('Failed to start recording');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      console.log('Manual stop triggered');
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  return (
    <div>
      {!isRecording ? (
        <Button 
          onClick={startRecording}
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

      {showEvaluation && (
        <div className="mt-4">
          {transcribedText ? (
            <>
              <p className="viet mt-2">Transcribed: {transcribedText}</p>
              <p className="mt-2">Accuracy: {accuracy}%</p>
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
