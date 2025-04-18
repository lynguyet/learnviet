'use client'

import { useState, useRef } from 'react';
import { ButtonHTMLAttributes } from 'react';

// Types from api/evaluate/route.ts
interface EvaluationSuccess {
  success: true;
  score: number;
  feedback: string;
  details: {
    text: string;
    audioReceived: boolean;
    audioSize: number;
  };
}

interface EvaluationError {
  error: string;
  details?: string;
}

type EvaluationResponse = EvaluationSuccess | EvaluationError;

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

interface AudioRecorderProps {
  text: string;
  onRecordingComplete: (data: EvaluationResponse) => void;
}

export default function AudioRecorder({ text, onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append('text', text);

          try {
            setStatus('Processing...');
            const response = await fetch('/api/evaluate', {
              method: 'POST',
              body: formData
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onRecordingComplete(data);
            setStatus('Complete!');
          } catch (error) {
            console.error('Error:', error);
            setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        };

        mediaRecorder.current.start();
        setIsRecording(true);
        setStatus('Recording...');
      } catch (error) {
        console.error('Error:', error);
        setStatus('Could not access microphone');
      }
    } else {
      mediaRecorder.current?.stop();
      setIsRecording(false);
      setStatus('Processing...');
    }
  };

  return (
    <div className="mt-6">
      <Button 
        onClick={handleRecording}
        className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-700 hover:bg-green-800'}`}
      >
        {isRecording ? 'Stop recording' : 'Start recording'}
      </Button>
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  );
}