import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { WordEntry } from '@/lib/types';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_SHEET_ID) {
  throw new Error('Google credentials not properly configured');
}

const jwt = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

async function getSheetData(): Promise<WordEntry[]> {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, jwt);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    return rows.map((row: GoogleSpreadsheetRow, index: number) => ({
      id: `${index + 1}`,
      title: row.get('Title') || '',
      vietnamese: row.get('Vietnamese') || '',
      english: row.get('English') || '',
      grade: row.get('Grade') || '',
    }));
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}

export { getSheetData };