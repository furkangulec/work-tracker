import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Work } from '@/types/work';
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
    const works = db.collection<Work>('works');

    // Get all work sessions for the user, sorted by start time in descending order
    const userWorks = await works
      .find({ userId: userData.id })
      .sort({ startTime: -1 })
      .toArray();

    return NextResponse.json({ success: true, works: userWorks });
  } catch (error) {
    console.error('Failed to fetch work list:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 