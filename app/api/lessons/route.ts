import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// Update the lessons type
interface Lesson {
  slug: string;
  title: string;
  description: string;
  grade: string;
  tags: string[];
  googleDocUrl?: string; // Optional Google Doc URL
  type?: 'google-doc';
}

export async function GET() {
  try {
    const lessonsDirectory = path.join(process.cwd(), 'app/content/lessons');
    const files = fs.readdirSync(lessonsDirectory);
    
    const lessons = files
      .filter(file => file.endsWith('.mdx'))
      .map((file) => {
        const slug = file.replace(/\.mdx$/, '');
        const fullPath = path.join(lessonsDirectory, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title,
          description: data.description,
          grade: data.grade,
          tags: data.tags || [],
          googleDocUrl: data.googleDocUrl || null,
          type: data.type || null,
        };
      });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}