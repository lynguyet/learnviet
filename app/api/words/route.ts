import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// This function handles GET requests to /api/words
export async function GET(): Promise<NextResponse<{ words: WordEntry[] } | { error: string }>> {
  console.log("API route called");
  
  try {
    // Get credentials
    const credentials = {
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      sheetId: process.env.GOOGLE_SHEET_ID
    };

    // Check credentials status
    console.log("Credentials check:", {
      hasEmail: !!credentials.email,
      hasPrivateKey: !!credentials.privateKey,
      hasSheetId: !!credentials.sheetId
    });

    if (!credentials.email || !credentials.privateKey || !credentials.sheetId) {
      console.error("Missing required Google credentials");
      return NextResponse.json({
        words: [
          { id: 'mock1', vietnamese: 'xin chào', english: 'hello', grade: 'A1' },
          { id: 'mock2', vietnamese: 'cảm ơn', english: 'thank you', grade: 'A1' }
        ],
        source: 'mock',
        reason: 'Missing credentials'
      });
    }

    // Set up Google Sheets API
    try {
      console.log("Creating JWT auth client...");
      const auth = new google.auth.JWT(
        credentials.email,
        undefined,
        credentials.privateKey,
        ['https://www.googleapis.com/auth/spreadsheets.readonly']
      );

      console.log("Initializing sheets client...");
      const sheets = google.sheets({ version: 'v4', auth });
      
      // List all sheets in the spreadsheet
      console.log(`Accessing spreadsheet ${credentials.sheetId}...`);
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: credentials.sheetId
      });
      
      console.log("Available sheets:", spreadsheet.data.sheets?.map(s => s.properties?.title));
      
      // Use the first sheet
      const sheet = spreadsheet.data.sheets?.[0];
      
      if (!sheet || !sheet.properties?.title) {
        throw new Error("Could not find any valid sheet");
      }
      
      const sheetName = sheet.properties.title;
      console.log(`Using sheet: ${sheetName}`);
      
      // Get the values from the sheet (including headers in row 1)
      console.log(`Fetching data from ${sheetName}!A1:D`);
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: credentials.sheetId,
        range: `${sheetName}!A1:D`
      });

      const rows = response.data.values || [];
      console.log(`Found ${rows.length} rows of data (including header)`);
      
      if (rows.length <= 1) {
        console.log("No data found in sheet (only headers)");
        return NextResponse.json({
          words: [],
          source: 'google_sheets',
          count: 0,
          message: 'No data found in sheet'
        });
      }
      
      // Skip header row and map the data
      const words = rows.slice(1).map((row, index) => ({
        id: `word_${index}`,
        title: row[0] || '',      // Column A: Title
        vietnamese: row[1] || '', // Column B: Vietnamese
        english: row[2] || '',    // Column C: English
        grade: row[3] || '',      // Column D: Grade
        // Add placeholder for pronunciation for compatibility with UI
        pronunciation: '' 
      }));

      console.log(`Successfully processed ${words.length} words`);
      return NextResponse.json({
        words,
        source: 'google_sheets',
        count: words.length
      });
      
    } catch (googleError) {
      console.error("Google Sheets API error:", googleError);
      
      // Return detailed error for debugging
      return NextResponse.json({
        words: [
          { id: 'error1', vietnamese: 'xin chào', english: 'hello', grade: 'A1' },
          { id: 'error2', vietnamese: 'cảm ơn', english: 'thank you', grade: 'A1' }
        ],
        source: 'google_error',
        error: googleError.message,
        stack: googleError.stack
      });
    }
    
  } catch (error) {
    console.error("General error in API route:", error);
    
    return NextResponse.json({
      words: [
        { id: 'error1', vietnamese: 'xin chào', english: 'hello', grade: 'A1' },
        { id: 'error2', vietnamese: 'cảm ơn', english: 'thank you', grade: 'A1' }
      ],
      source: 'general_error',
      error: error.message
    });
  }
}