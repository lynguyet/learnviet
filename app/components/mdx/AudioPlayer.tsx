'use client';

import { useState, useRef } from 'react';

interface AudioPlayerProps {
  src: string;
  label?: string;
}

export function AudioPlayer({ src, label }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center space-x-3 my-2">
      <button
        onClick={togglePlay}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
      >
        {isPlaying ? (
          <span className="material-icons">pause</span>
        ) : (
          <span className="material-icons">play_arrow</span>
        )}
      </button>
      {label && <span className="text-gray-600">{label}</span>}
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}