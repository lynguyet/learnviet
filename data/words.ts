import { WordEntry } from '../types';
import { getWords } from '../lib/sheets';

// Fallback data in case the sheet fetch fails
export const fallbackWords: WordEntry[] = [
  {
    title: "Greetings",
    vietnamese: "xin chào",
    english: "hello",
    grade: "A1"
  },
  {
    title: "Greetings",
    vietnamese: "cảm ơn",
    english: "thank you",
    grade: "A1"
  },
  {
    title: "Greetings",
    vietnamese: "tạm biệt",
    english: "goodbye",
    grade: "A1"
  },
  {
    title: "Greetings",
    vietnamese: "chúc ngủ ngon",
    english: "good night",
    grade: "A1"
  },
  
  // Numbers
  {
    title: "Numbers",
    vietnamese: "một",
    english: "one",
    grade: "A1"
  },
  {
    title: "Numbers",
    vietnamese: "hai",
    english: "two",
    grade: "A1"
  },
  {
    title: "Numbers",
    vietnamese: "ba",
    english: "three",
    grade: "A1"
  },
  
  // Food & Drinks
  {
    title: "Food & Drinks",
    vietnamese: "phở",
    english: "pho (Vietnamese noodle soup)",
    grade: "A1"
  },
  {
    title: "Food & Drinks",
    vietnamese: "cà phê",
    english: "coffee",
    grade: "A1"
  },
  
  // Common Phrases
  {
    title: "Common Phrases",
    vietnamese: "không có chi",
    english: "you're welcome",
    grade: "A1"
  },
  {
    title: "Common Phrases",
    vietnamese: "xin lỗi",
    english: "sorry/excuse me",
    grade: "A1"
  }
];

export async function getWordsData(): Promise<WordEntry[]> {
  try {
    const words = await getWords();
    return words.length > 0 ? words : fallbackWords;
  } catch (error) {
    console.error('Error fetching words:', error);
    return fallbackWords;
  }
}