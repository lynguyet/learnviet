import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    hasGoogleApiKey: !!process.env.GOOGLE_API_KEY,
    googleApiKeyFirstChars: process.env.GOOGLE_API_KEY ? 
      process.env.GOOGLE_API_KEY.substring(0, 3) + '...' : 'not set',
    
    hasGoogleSheetId: !!process.env.GOOGLE_SHEET_ID,
    googleSheetIdFirstChars: process.env.GOOGLE_SHEET_ID ? 
      process.env.GOOGLE_SHEET_ID.substring(0, 3) + '...' : 'not set',
    
    // Check other environment variables too
    hasServiceAccountEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
    
    // Check actual env var names that exist (safely)
    envVarNames: Object.keys(process.env)
      .filter(key => key.includes('GOOGLE'))
      .map(key => key)
  };
  
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    environmentVariables: envVars
  });
}
