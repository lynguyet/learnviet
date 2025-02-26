'use client'

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";

interface AudioRecorderProps {
  text: string;
  onRecordingComplete: (data: any) => void;
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
            const response = await fetch('http://localhost:5000/evaluate-pronunciation', {
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