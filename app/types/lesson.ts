export interface FrontMatter {
  title: string;
  description: string;
  grade: string;
  tags?: string[];
}

export interface Lesson {
  content: string;
  frontMatter: FrontMatter;
}

export interface NavigationLesson {
  slug: string;
  title: string;
}

export interface LessonWithNavigation {
  lesson: Lesson;
  prevLesson: NavigationLesson | null;
  nextLesson: NavigationLesson | null;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface PageProps {
  params: { slug: string };
}
