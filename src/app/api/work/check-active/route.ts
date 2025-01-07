import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyJwt, getJwtFromCookie } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    // Get and verify token
    const cookieHeader = request.headers.get('cookie') || '';
    const token = getJwtFromCookie(cookieHeader);
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userData = verifyJwt(token);
    if (!userData) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('work-tracker');

    // Check for active work sessions
    const activeWork = await db.collection('works').findOne({
      userId: userData.id,
      isFinished: false
    });

    return NextResponse.json({
      success: true,
      hasActiveSession: !!activeWork,
      activeWork: activeWork ? {
        workId: activeWork._id,
        sessions: activeWork.sessions,
        totalWorkTime: activeWork.totalWorkTime,
        totalBreakTime: activeWork.totalBreakTime,
        isFinished: activeWork.isFinished
      } : null
    });
  } catch (error) {
    console.error('Failed to check active work session:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 