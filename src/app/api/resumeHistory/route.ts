import { NextResponse } from 'next/server';
import { getResumeHistory } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('resumeId');
    
    if (!resumeId) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      );
    }

    const history = await getResumeHistory(parseInt(resumeId));
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching resume history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume history' },
      { status: 500 }
    );
  }
} 