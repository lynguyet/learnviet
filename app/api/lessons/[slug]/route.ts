import { NextResponse } from 'next/server';
import { getLessonBySlug } from '@/app/lib/mdx';

export async function GET(
  request: Request
): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const slug = url.pathname.split('/').pop();

    if (!slug) {
      return NextResponse.json({ error: 'Slug not provided' }, { status: 400 });
    }

    const lessonWithNavigation = await getLessonBySlug(slug);

    if (!lessonWithNavigation) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(lessonWithNavigation);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}