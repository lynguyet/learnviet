import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Log the slug we receive
    console.log('Received slug:', params.slug);

    const lessonPath = path.join(process.cwd(), 'app/content/lessons', `${params.slug}.mdx`);
    console.log('Looking for lesson at:', lessonPath);

    // Check if file exists
    if (!fs.existsSync(lessonPath)) {
      console.log('File not found:', lessonPath);
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Read and parse the file
    const fileContents = fs.readFileSync(lessonPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Return the lesson data
    return NextResponse.json({
      slug: params.slug,
      frontMatter: data,
      content: content
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Failed to load lesson',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}