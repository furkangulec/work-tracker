import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Work } from '@/types/work';
import { verifyJwt, getJwtFromCookie } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    // Get and verify token
    const cookieHeader = request.headers.get('cookie') || '';
    const token = getJwtFromCookie(cookieHeader);
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = verifyJwt(token);
    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('work-tracker');
    const works = db.collection<Work>('works');

    // Check if there's an unfinished work
    const existingWork = await works.findOne({
      userId: userData.id,
      isFinished: false
    });

    if (existingWork) {
      return NextResponse.json({ error: 'There is already an active work session' }, { status: 400 });
    }

    // Create new work
    const currentTime = Date.now();
    const newWork = {
      userId: userData.id,
      startTime: currentTime,
      endTime: null,
      isFinished: false,
      sessions: [{
        startTime: currentTime,
        endTime: null,
        type: 'work' as const
      }],
      totalWorkTime: 0,
      totalBreakTime: 0
    };

    const result = await works.insertOne(newWork);

    return NextResponse.json({
      success: true,
      workId: result.insertedId,
      work: newWork
    });
  } catch (error) {
    console.error('Start work error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 