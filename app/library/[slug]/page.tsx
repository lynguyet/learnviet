import { MDXRemote } from 'next-mdx-remote/rsc';
import { getLessonBySlug } from '@/app/lib/mdx';
import Navigation from '../../components/Navigation';
import { LessonNavigation } from '../../components/LessonNavigation';
import { Section } from '../../components/mdx/Section';
import { Example } from '../../components/mdx/Example';
import { ExampleBlock } from '../../components/mdx/ExampleBlock';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { LessonWithNavigation } from '@/app/lib/types';

const components = {
  Section,
  Example,
  ExampleBlock,
};

export default async function LessonPage({ params }: any) {
  const { slug } = params;
  
  const lessonWithNavigation = await getLessonBySlug(slug) as LessonWithNavigation | null;

  if (!lessonWithNavigation) {
    notFound();
  }

  const { lesson, prevLesson, nextLesson } = lessonWithNavigation;

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Lesson Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="mb-4">
            <p className="text-sm text-gray-600">{lesson.frontMatter.grade}</p>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            {lesson.frontMatter.title}
          </h1>
          
          <p className="text-gray-600">
            {lesson.frontMatter.description}
          </p>

          {lesson.frontMatter.tags && (
            <div className="flex gap-2 mt-4">
              {lesson.frontMatter.tags.map((tag: string) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Lesson Content */}
        <article className="prose prose-lg max-w-3xl mx-auto">
          <MDXRemote 
            source={lesson.content} 
            components={components}
          />
        </article>

        {/* Add Lesson Navigation */}
        <div className="max-w-3xl mx-auto">
          <LessonNavigation 
            prevLesson={prevLesson}
            nextLesson={nextLesson}
          />
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = params;
  const lessonWithNavigation = await getLessonBySlug(slug) as LessonWithNavigation | null;
  
  if (!lessonWithNavigation) {
    return {
      title: 'Lesson Not Found',
    };
  }

  const { lesson } = lessonWithNavigation;

  return {
    title: `${lesson.frontMatter.title} | LearnViet`,
    description: lesson.frontMatter.description,
  };
}