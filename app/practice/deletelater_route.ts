import { NextResponse } from 'next/server'
import { getSheetData } from '../../lib/sheets'

export async function GET() {
  try {
    const words = await getSheetData()
    return NextResponse.json(words)
  } catch (error) {
    console.error('Error in practice route:', error)
    return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500 })
  }
}