import { NextResponse } from 'next/server';
import { storeResumeAnalysis, checkResumeExists } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, fileName, analysisResult } = await request.json();
    
    if (!userId || !fileName || !analysisResult) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if resume already exists
    const existingResumeId = await checkResumeExists(userId, fileName);
    
    if (existingResumeId) {
      // If resume exists, just return the existing ID and analysis result
      return NextResponse.json({ 
        success: true, 
        resumeId: existingResumeId,
        isDuplicate: true,
        analysisResult 
      });
    }

    // If resume doesn't exist, store it
    const resumeId = await storeResumeAnalysis(userId, fileName, analysisResult);
    
    return NextResponse.json({ 
      success: true, 
      resumeId,
      isDuplicate: false,
      analysisResult 
    });
  } catch (error) {
    console.error('Error storing analysis:', error);
    return NextResponse.json(
      { error: 'Failed to store analysis' },
      { status: 500 }
    );
  }
} 