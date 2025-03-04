import React from 'react';
import Link from 'next/link';

interface LessonNavigationProps {
  prevLesson?: {
    slug: string;
    title: string;
  } | null;
  nextLesson?: {
    slug: string;
    title: string;
  } | null;
}

export function LessonNavigation({ prevLesson, nextLesson }: LessonNavigationProps) {
  return (
    <div className="flex justify-between items-center py-8 mt-8 border-t border-gray-200">
      {prevLesson ? (
        <Link
          href={`/library/${prevLesson.slug}`}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span className="mr-2">←</span>
          <span>{prevLesson.title}</span>
        </Link>
      ) : (
        <div></div>
      )}

      {nextLesson ? (
        <Link
          href={`/library/${nextLesson.slug}`}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span>{nextLesson.title}</span>
          <span className="ml-2">→</span>
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
}