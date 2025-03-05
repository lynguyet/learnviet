import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// This function handles GET requests to /api/words
export async function GET(): Promise<NextResponse> {
  console.log("API route called");
  
  try {
    // Use API key authentication instead of service account
    const apiKey = process.env.GOOGLE_API_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    console.log("Using API key authentication");
    console.log("Sheet ID:", sheetId?.substring(0, 5) + "...");
    
    if (!apiKey || !sheetId) {
      console.log("Missing API key or Sheet ID");
      return NextResponse.json({
        words: [
          { id: 'mock1', vietnamese: 'xin chào', english: 'hello', grade: 'A1' },
          { id: 'mock2', vietnamese: 'cảm ơn', english: 'thank you', grade: 'A1' }
        ],
        source: 'mock',
        reason: 'Missing API key or Sheet ID'
      });
    }
    
    console.log("Initializing sheets client with API key");
    const sheets = google.sheets({ 
      version: 'v4', 
      auth: apiKey
    });
    
    console.log("Fetching sheet data");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A1:D'
    });
    
    const rows = response.data.values || [];
    console.log(`Found ${rows.length} rows of data`);
    
    if (rows.length <= 1) {
      console.log("No data found in sheet");
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