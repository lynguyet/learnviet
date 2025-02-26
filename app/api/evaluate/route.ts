import { NextResponse } from 'next/server';

// Set response size limit
export const maxDuration = 10; // seconds
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio') as Blob;
    const text = formData.get('text') as string;

    // Log the received data
    console.log('Received text to evaluate:', text);
    console.log('Received audio file size:', audio?.size);

    if (!audio || !text) {
      return NextResponse.json(
        { error: 'Missing audio or text' },
        { status: 400 }
      );
    }

    // Mock evaluation response
    return NextResponse.json({
      success: true,
      score: 0.85,
      feedback: "Good pronunciation!",
      details: {
        text: text,
        audioReceived: true,
        audioSize: audio.size
      }
    });

  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to evaluate audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}