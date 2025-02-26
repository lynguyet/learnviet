'use client';

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
  return React.createElement(
    'div',
    { className: 'flex justify-between items-center py-8 mt-8 border-t border-gray-200' },
    prevLesson ? (
      React.createElement(
        Link,
        {
          href: `/library/${prevLesson.slug}`,
          className: 'flex items-center text-blue-600 hover:text-blue-800'
        },
        'Previous: ',
        prevLesson.title
      )
    ) : (
      React.createElement('div', null)
    ),
    nextLesson && (
      React.createElement(
        Link,
        {
          href: `/library/${nextLesson.slug}`,
          className: 'flex items-center text-blue-600 hover:text-blue-800'
        },
        'Next: ',
        nextLesson.title
      )
    )
  );
}