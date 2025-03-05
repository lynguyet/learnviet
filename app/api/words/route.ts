import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// This function handles GET requests to /api/words
export async function GET(): Promise<NextResponse<{ words: WordEntry[] } | { error: string }>> {
  console.log("API route called");
  
  try {
    // Use API key authentication instead of service account
    const apiKey = process.env.GOOGLE_API_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    if (!apiKey || !sheetId) {
      return NextResponse.json({
        words: [
          { id: 'mock1', vietnamese: 'xin chào', english: 'hello', grade: 'A1' },
          { id: 'mock2', vietnamese: 'cảm ơn', english: 'thank you', grade: 'A1' }
        ],
        source: 'mock',
        reason: 'Missing API key or Sheet ID'
      });
    }
    
    const sheets = google.sheets({ 
      version: 'v4', 
      auth: apiKey
    });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A1:D'
    });
    
    const rows = response.data.values || [];
    
    if (rows.length <= 1) {
      return NextResponse.json({
        words: [],
        source: 'google_sheets',
        count: 0,
        message: 'No data found in sheet'
      });
    }
    
    const words = rows.slice(1).map((row, index) => ({
      id: `word_${index}`,
      title: row[0] || '',      // Column A: Title
      vietnamese: row[1] || '', // Column B: Vietnamese
      english: row[2] || '',    // Column C: English
      grade: row[3] || '',      // Column D: Grade
      pronunciation: '' 
    }));
    
    return NextResponse.json({
      words,
      source: 'google_sheets',
      count: words.length
    });
    
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({
      words: [
        { id: 'error1', vietnamese: 'API Error', english: error.message, grade: 'Error' }
      ],
      source: 'error',
      error: error.message
    });
  }
}