import { Lesson } from './types';

// First, install required dependencies
// npm install gray-matter next-mdx-remote

// Mark this file as server-side only
export const runtime = 'nodejs';

type LessonWithNavigation = {
  lesson: Lesson;  // Updated from 'any' to 'Lesson'
  prevLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
};

export async function getAllLessons(): Promise<Lesson[]> {
  try {
    const response = await fetch('/api/lessons');
    if (!response.ok) {
      throw new Error('Failed to fetch lessons');
    }
    const data: Lesson[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lessons:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

export async function getLessonBySlug(slug: string): Promise<LessonWithNavigation | null> {
  if (!slug) {
    console.error('No slug provided to getLessonBySlug');
    return null;
  }

  try {
    // Get all lessons to determine prev/next
    const allLessons = await getAllLessons();
    const currentIndex = allLessons.findIndex(lesson => lesson.slug === slug);

    if (currentIndex === -1) {
      console.error('Lesson not found:', slug);
      return null;
    }

    // Get the current lesson
    const response = await fetch(`/api/lessons/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch lesson:', response.status);
      return null;
    }

    const lesson = await response.json();

    // Determine prev/next lessons
    const prevLesson = currentIndex > 0 
      ? {
          slug: allLessons[currentIndex - 1].slug,
          title: allLessons[currentIndex - 1].title
        }
      : null;

    const nextLesson = currentIndex < allLessons.length - 1
      ? {
          slug: allLessons[currentIndex + 1].slug,
          title: allLessons[currentIndex + 1].title
        }
      : null;

    return {
      lesson,
      prevLesson,
      nextLesson
    };
  } catch (error) {
    console.error('Error in getLessonBySlug:', error);
    return null;
  }
}