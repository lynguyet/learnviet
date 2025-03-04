// Word-related types
export interface WordEntry {
  id: string;
  vietnamese: string;
  english: string;
  grade: string;
  pronunciation: string;
  example?: string;
  partOfSpeech?: string;
  examples?: string[];
  title?: string;
}

// Lesson-related types
export interface FrontMatter {
  title: string;
  description: string;
  grade: string;
  tags?: string[];
}

export interface Lesson {
  slug: string;
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

// Evaluation-related types
export interface EvaluationSuccess {
  success: true;
  score: number;
  feedback: string;
  details: {
    text: string;
    audioReceived: boolean;
    audioSize: number;
  };
}

export interface EvaluationError {
  error: string;
  details?: string;
}

export type EvaluationResponse = EvaluationSuccess | EvaluationError;
