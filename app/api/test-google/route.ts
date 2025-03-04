import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const credentials = {
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Don't log the actual key, just check if it exists
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      sheetId: process.env.GOOGLE_SHEET_ID
    };
    
    return NextResponse.json({
      status: 'ok',
      credentials: {
        email: credentials.email ? `${credentials.email.substring(0, 3)}...` : null,
        hasPrivateKey: credentials.hasPrivateKey,
        sheetId: credentials.sheetId ? `${credentials.sheetId.substring(0, 5)}...` : null,
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    });
  }
}
