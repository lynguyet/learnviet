import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// This function handles GET requests to /api/words
export async function GET(): Promise<NextResponse<{ words: WordEntry[] } | { error: string }>> {
  try {
    // Check if Google credentials are properly configured
    const credentials = {
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      sheetId: process.env.GOOGLE_SHEET_ID
    };

    // If credentials are missing, return mock data
    if (!credentials.email || !credentials.privateKey || !credentials.sheetId) {
      console.warn('Google credentials not found, returning mock data');
      return NextResponse.json({
        words: [
          {
            id: 'mock1',
            vietnamese: 'xin chào',
            english: 'hello',
            pronunciation: 'sin chow',
            grade: 'A1',
            example: 'Xin chào, bạn khỏe không?'
          },
          {
            id: 'mock2',
            vietnamese: 'cảm ơn',
            english: 'thank you',
            pronunciation: 'gahm uhn',
            grade: 'A1',
            example: 'Cảm ơn bạn rất nhiều!'
          },
          // Add a few more mock words
        ]
      });
    }

    // Existing Google Sheets code
    const auth = new google.auth.JWT(
      credentials.email,
      undefined,
      credentials.privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: credentials.sheetId,
      range: 'Words!A2:G', // Adjust based on your sheet structure
    });

    const rows = response.data.values || [];
    
    // Map the spreadsheet rows to your word objects
    const words = rows.map((row, index) => ({
      id: index.toString(),
      vietnamese: row[0] || '',
      english: row[1] || '',
      pronunciation: row[2] || '',
      grade: row[3] || '',
      partOfSpeech: row[4] || '',
      example: row[5] || '',
      title: row[0] || '', // Use Vietnamese as title if needed
    }));

    return NextResponse.json({ words });
    
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return mock data on error
    return NextResponse.json({
      words: [
        {
          id: 'error1',
          vietnamese: 'xin chào',
          english: 'hello',
          pronunciation: 'sin chow',
          grade: 'A1',
          example: 'Xin chào, bạn khỏe không?'
        },
        {
          id: 'error2',
          vietnamese: 'cảm ơn',
          english: 'thank you',
          pronunciation: 'gahm uhn',
          grade: 'A1',
          example: 'Cảm ơn bạn rất nhiều!'
        },
      ],
      error: 'Error fetching data from Google Sheets'
    });
  }
}