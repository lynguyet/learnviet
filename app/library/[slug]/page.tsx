import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { getLessonBySlug } from '../../lib/mdx';
import Navigation from '../../components/Navigation';
import { Section } from '../../components/mdx/Section';
import { Example } from '../../components/mdx/Example';
import { ExampleBlock } from '../../components/mdx/ExampleBlock';

const components = {
  Section,
  Example,
  ExampleBlock,
};

export default async function LessonPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const lesson = await getLessonBySlug(params.slug);
  
  if (!lesson) {
    notFound();
  }

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
      </main>
    </div>
  );
}

// Add metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const lesson = await getLessonBySlug(params.slug);
  
  if (!lesson) {
    return {
      title: 'Lesson Not Found',
    };
  }

  return {
    title: `${lesson.frontMatter.title} | LearnViet`,
    description: lesson.frontMatter.description,
  };
}