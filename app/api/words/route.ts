import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Local fallback data
const localVocabulary = [
  {
    id: 'word_1',
    title: 'Greeting',
    vietnamese: 'Xin chào',
    english: 'Hello',
    grade: '1st grade',
    pronunciation: 'sin chow'
  },
  {
    id: 'word_2',
    title: 'Greeting',
    vietnamese: 'Tạm biệt',
    english: 'Goodbye',
    grade: '1st grade',
    pronunciation: 'tam bee-yet'
  },
  {
    id: 'word_3',
    title: 'Greeting',
    vietnamese: 'Tôi đến từ Việt Nam.',
    english: 'I\'m from Vietnam',
    grade: '1st grade',
    pronunciation: 'toy den too vee-yet nam'
  },
  {
    id: 'word_4',
    title: 'Greeting',
    vietnamese: 'Bạn có khỏe không? Lâu rồi không gặp!',
    english: 'How are you? Long time no see.',
    grade: '1st grade',
    pronunciation: 'ban co kwe khong? lao zoy khong gap!'
  },
  {
    id: 'word_5',
    title: 'Conversation',
    vietnamese: 'Cảm ơn bạn rất nhiều',
    english: 'Thank you very much',
    grade: '1st grade',
    pronunciation: 'kam un ban zet nyew'
  },
  {
    id: 'word_6',
    title: 'Conversation',
    vietnamese: 'Không có gì',
    english: 'You\'re welcome',
    grade: '1st grade',
    pronunciation: 'khong ko zi'
  },
  {
    id: 'word_7',
    title: 'Weather',
    vietnamese: 'Trời nắng đẹp quá! Chúng ta đi chơi đi!',
    english: 'The weather is beautiful! Let\'s go out!',
    grade: '2nd grade',
    pronunciation: 'choy nang dep qua! chung ta di choy di!'
  },
  {
    id: 'word_8',
    title: 'Weather',
    vietnamese: 'Trời mưa to quá!',
    english: 'It\'s raining heavily!',
    grade: '2nd grade',
    pronunciation: 'choy mua to qua!'
  }
];

// This function handles GET requests to /api/words
export async function GET(): Promise<NextResponse> {
  console.log("API route called");
  
  try {
    // Get environment variables with explicit logging
    const apiKey = process.env.GOOGLE_API_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    // Debug what's actually being received
    console.log("API Key exists:", !!apiKey);
    console.log("API Key type:", typeof apiKey);
    console.log("API Key first chars:", apiKey ? apiKey.substring(0, 3) + '...' : 'undefined');
    
    console.log("Sheet ID exists:", !!sheetId);
    console.log("Sheet ID type:", typeof sheetId);
    console.log("Sheet ID first chars:", sheetId ? sheetId.substring(0, 3) + '...' : 'undefined');
    
    // Explicitly check for undefined, null, or empty string
    if (!apiKey || apiKey.trim() === '' || !sheetId || sheetId.trim() === '') {
      console.log("Using local data because API key or Sheet ID is missing or empty");
      return NextResponse.json({
        words: localVocabulary,
        source: 'local_data',
        count: localVocabulary.length,
        debug: {
          apiKeyExists: !!apiKey,
          apiKeyEmpty: apiKey === '',
          sheetIdExists: !!sheetId,
          sheetIdEmpty: sheetId === ''
        }
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
      range: 'Sheet1!A1:D'  // Try specifying the sheet name explicitly
    });
    
    const rows = response.data.values || [];
    console.log(`Found ${rows.length} rows of data`);
    
    if (rows.length <= 1) {
      console.log("No data found in sheet");
      return NextResponse.json({
        words: localVocabulary,
        source: 'local_data_fallback',
        count: localVocabulary.length,
        message: 'No data found in sheet, using local data'
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
    // In case of an error, fall back to local data
    return NextResponse.json({
      words: localVocabulary,
      source: 'local_data_error_fallback',
      error: error.message,
      stack: error.stack
    });
  }
}