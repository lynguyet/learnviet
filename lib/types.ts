export interface WordEntry {
  title: string;
  vietnamese: string;
  english: string;
  grade: string;
}

export interface Word {
  id: number;
  vietnamese: string;
  english: string;
  pronunciation: string;
  example?: string;
}
