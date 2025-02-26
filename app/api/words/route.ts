import { getSheetData } from '../../../lib/sheets';
import { NextResponse } from 'next/server';

// This function handles GET requests to /api/words
export async function GET() {
  try {
    const words = await getSheetData();
    return NextResponse.json(words);
  } catch (error) {
    console.error('Error in words API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch words' },
      { status: 500 }
    );
  }
}