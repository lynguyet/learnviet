import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { Lesson } from '@/app/lib/types';

export async function GET(): Promise<NextResponse<Lesson[] | { error: string }>> {
  try {
    const lessonsDirectory = path.join(process.cwd(), 'app/content/lessons');
    const files = fs.readdirSync(lessonsDirectory);
    
    const lessons: Lesson[] = files
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
          googleDocUrl: data.googleDocUrl,
          type: data.type as 'google-doc' | undefined,
        } as Lesson;
      });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}