import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

// First, install required dependencies
// npm install gray-matter next-mdx-remote

// Mark this file as server-side only
export const runtime = 'nodejs';

const lessonsDirectory = join(process.cwd(), 'app/content/lessons');

export async function getLessonBySlug(slug: string) {
  if (!slug) {
    console.error('No slug provided to getLessonBySlug');
    return null;
  }

  try {
    console.log('Fetching lesson for slug:', slug);
    const response = await fetch(`http://localhost:3000/api/lessons/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch lesson:', response.status);
      const errorData = await response.json();
      console.error('Error details:', errorData);
      return null;
    }

    const data = await response.json();
    console.log('Lesson data received:', data);
    return data;
  } catch (error) {
    console.error('Error in getLessonBySlug:', error);
    return null;
  }
}

type Lesson = {
  slug: string;
  title: string;
  description: string;
  grade: string;
  tags: string[];
};

export async function getAllLessons(): Promise<Lesson[]> {
  return []; // We'll implement this later
}