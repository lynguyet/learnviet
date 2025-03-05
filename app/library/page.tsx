'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Add Google Docs icon component
function GoogleDocsIcon() {
  return (
    <svg 
      className="w-5 h-5" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M14.5,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V7.5L14.5,2M16.5,8V3.5L19,6H16.5V8M6,20V4H14V8H18V20H6M8,14H16V16H8V14M8,10H16V12H8V10M8,18H13V20H8V18Z" />
    </svg>
  );
}

export default function LibraryPage() {
  const [lessons, setLessons] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/lessons', {
          cache: 'no-store'
        });
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const filteredLessons = selectedGrade
    ? lessons.filter(lesson => lesson.grade === selectedGrade)
    : lessons;

  // Separate lessons by type
  const interactiveLessons = filteredLessons.filter(
    lesson => !lesson.type || lesson.type !== 'google-doc'
  );
  
  const googleDocLessons = filteredLessons.filter(
    lesson => lesson.type === 'google-doc'
  );

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Lesson Library</h1>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent mb-4"></div>
              <p className="text-gray-600">Loading lessons...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Grade Filters */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setSelectedGrade(null)}
                className={`px-4 py-2 rounded-full border ${
                  selectedGrade === null
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedGrade('1st grade')}
                className={`px-4 py-2 rounded-full border ${
                  selectedGrade === '1st grade'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                1st grade
              </button>
              <button
                onClick={() => setSelectedGrade('2nd grade')}
                className={`px-4 py-2 rounded-full border ${
                  selectedGrade === '2nd grade'
                    ? 'bg-primary text-white'
                    : 'bg-white text-secondary hover:bg-gray-50'
                }`}
              >
                2nd grade
              </button>
            </div>

            {/* Interactive Lessons Section */}
            {interactiveLessons.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-6">
                  Interactive Lessons
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                  {interactiveLessons.map((lesson) => (
                    <div 
                      key={lesson.slug} 
                      className="bg-white rounded-lg shadow-lg p-6 flex flex-col"
                    >
                      <div className="mb-4">
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {lesson.grade}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
                      <p className="text-gray-600 mb-4">{lesson.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lesson.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="text-sm lime-green text-black px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto">
                        <Link
                          href={`/library/${lesson.slug}`}
                          className="inline-block w-full text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                        >
                          View Interactive Lesson
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Google Doc Lessons Section */}
            {googleDocLessons.length > 0 && (
              <>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {googleDocLessons.map((lesson) => (
                    <div 
                      key={lesson.slug} 
                      className="bg-white rounded-lg shadow-lg p-6 flex flex-col"
                    >
                      <div className="mb-4">
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {lesson.grade}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
                      <p className="text-gray-600 mb-4">{lesson.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lesson.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="text-sm bg-lime-green text-black px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto">
                        <a
                          href={lesson.googleDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-secondary transition-colors"
                        >
                          <GoogleDocsIcon />
                          <span>Open in Google Docs</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Show message if no lessons found */}
            {filteredLessons.length === 0 && (
              <p className="text-gray-600 text-center py-8">
                No lessons found for the selected grade.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}