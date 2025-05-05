import { NextResponse } from 'next/server';
import { storeResumeAnalysis } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, fileName, analysisResult } = await request.json();
    
    if (!userId || !fileName || !analysisResult) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const resumeId = await storeResumeAnalysis(userId, fileName, analysisResult);
    
    return NextResponse.json({ 
      success: true, 
      resumeId 
    });
  } catch (error) {
    console.error('Error storing analysis:', error);
    return NextResponse.json(
      { error: 'Failed to store analysis' },
      { status: 500 }
    );
  }
} 