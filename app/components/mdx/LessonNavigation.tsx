import React from 'react';
import Link from 'next/link';

interface LessonNavigationProps {
  prevLesson?: {
    slug: string;
    title: string;
  };
  nextLesson?: {
    slug: string;
    title: string;
  };
}

export function LessonNavigation({ prevLesson, nextLesson }: LessonNavigationProps) {
  return (
    <div className="flex justify-between items-center py-8 mt-8 border-t border-gray-200">
      {prevLesson ? (
        <Link
          href={`/library/${prevLesson.slug}`}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Previous: {prevLesson.title}</span>
        </Link>
      ) : (
        <div /> {/* Empty div to maintain spacing */}
      )}

      {nextLesson && (
        <Link
          href={`/library/${nextLesson.slug}`}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span>Next: {nextLesson.title}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}