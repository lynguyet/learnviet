'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation'
import WordBank from '../components/WordBank'

export default function PracticePage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // You can add more state if needed
  // const [practiceData, setPracticeData] = useState(null);
  
  useEffect(() => {
    // You could fetch additional data here if needed
    // async function fetchPracticeData() {
    //   const response = await fetch('/api/practice-data');
    //   const data = await response.json();
    //   setPracticeData(data);
    // }
    // fetchPracticeData();
    
    setIsLoading(false);
  }, []);
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Practice Your Vietnamese</h1>
        
        {isLoading ? (
          <div className="text-center py-10">Loading practice content...</div>
        ) : (
          <>
            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-lg text-center mb-4">
                Select words from the list below to practice your pronunciation.
              </p>
              <p className="text-sm text-center text-gray-600">
                Click on a word, then use the speech recognition tool to practice saying it.
                You'll receive feedback on your pronunciation accuracy.
              </p>
            </div>
            
            {/* This component will fetch and display words from your Google Sheet */}
            <WordBank />
          </>
        )}
      </main>
    </div>
  );
}