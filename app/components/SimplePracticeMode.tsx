'use client';

import { useState, useRef, useEffect } from 'react';

interface SimplePracticeModeProps {
  word: {
    vietnamese: string;
    english: string;
  };
}

export default function SimplePracticeMode({ word }: SimplePracticeModeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [markedWords, setMarkedWords] = useState<{text: string, isCorrect: boolean}[]>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  const [accuracy, setAccuracy] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  
  // Check for browser support
  useEffect(() => {
    const isSupported = typeof window !== 'undefined' && 
                       !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    
    if (!isSupported) {
      setError('Speech recognition not supported in this browser');
    }
  }, []);
  
  const startRecording = () => {
    console.log('Starting recording');
    setError(null);
    setTranscript('');
    setMarkedWords([]);
    setMissingWords([]);
    setAccuracy(0);
    
    try {
      const SpeechRecognitionAPI = window.webkitSpeechRecognition || window.SpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        throw new Error('Speech recognition not supported');
      }
      
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;
      recognition.continuous = false;
      
      recognition.onresult = (event: any) => {
        console.log('Speech recognition result:', event);
        
        const spokenText = event.results[0][0].transcript.toLowerCase();
        console.log('Spoken text:', spokenText);
        
        setTranscript(spokenText);
        
        // Process the result
        processResult(spokenText);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
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
  
  const processResult = (spokenText: string) => {
    console.log('Processing result');
    
    // Get target text
    const targetText = word.vietnamese.toLowerCase();
    console.log('Target text:', targetText);
    
    // Split into words
    const targetWords = targetText.split(/\s+/);
    const spokenWords = spokenText.split(/\s+/);
    
    console.log('Target words:', targetWords);
    console.log('Spoken words:', spokenWords);
    
    // Mark each spoken word
    const marked = spokenWords.map(word => {
      const isCorrect = targetWords.includes(word);
      console.log(`Word "${word}" is ${isCorrect ? 'correct' : 'incorrect'}`);
      return { text: word, isCorrect };
    });
    
    // Find missing words
    const missing = targetWords.filter(word => !spokenWords.includes(word));
    console.log('Missing words:', missing);
    
    // Calculate accuracy
    const correctWords = marked.filter(w => w.isCorrect).length;
    const calculatedAccuracy = Math.round((correctWords / targetWords.length) * 100);
    console.log('Accuracy:', calculatedAccuracy);
    
    // Update state
    setMarkedWords(marked);
    console.log('Marked words set:', marked);
    
    setMissingWords(missing);
    console.log('Missing words set:', missing);
    
    setAccuracy(calculatedAccuracy);
    console.log('Accuracy set:', calculatedAccuracy);
  };
  
  // For testing - uncomment this to test with hardcoded values
  // useEffect(() => {
  //   // Simulate a speech recognition result
  //   const mockTranscript = "Tôi đến từ";
  //   setTranscript(mockTranscript);
  //   processResult(mockTranscript);
  // }, []);
  
  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>;
  }
  
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-xl font-bold mb-4">Simple Practice Mode</h3>
      
      <div className="mb-4">
        <p className="text-2xl font-medium">{word.vietnamese}</p>
        <p className="text-gray-600">{word.english}</p>
      </div>
      
      <button
        className={`px-6 py-2 rounded-full ${
          isRecording 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-green-800 hover:bg-green-900 text-white'
        }`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop recording' : 'Start recording'}
      </button>
      
      {transcript && (
        <div className="mt-4">
          <h4 className="font-bold">Results:</h4>
          
          <p className="mt-2">
            Raw transcript: <span className="font-mono">{transcript}</span>
          </p>
          
          <div className="mt-2">
            <p>You said: {' '}
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
            <p className="mt-2 text-red-500">
              Missing: {missingWords.join(' ')}
            </p>
          )}
          
          <p className="mt-2">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full">
              Score: {accuracy}%
            </span>
          </p>
        </div>
      )}
    </div>
  );
}