import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
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

    // Get request body
    const { workId, action, technique } = await request.json();
    if (!workId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('work-tracker');
    const works = db.collection<Work>('works');

    // Get current work
    const work = await works.findOne({
      _id: new ObjectId(workId),
      userId: userData.id,
      isFinished: false
    });

    if (!work) {
      return NextResponse.json({ error: 'Work session not found' }, { status: 404 });
    }

    const currentTime = Date.now();
    let update: Partial<Work> = {};

    // Close the last session
    if (work.sessions.length > 0) {
      const lastSession = work.sessions[work.sessions.length - 1];
      if (!lastSession.endTime) {
        lastSession.endTime = currentTime;
        
        // Update total times
        const sessionDuration = currentTime - lastSession.startTime;
        if (lastSession.type === 'work') {
          work.totalWorkTime += sessionDuration;
        } else {
          work.totalBreakTime += sessionDuration;
        }
      }
    }

    switch (action) {
      case 'break':
        // Start break session
        work.sessions.push({
          startTime: currentTime,
          endTime: null,
          type: 'break'
        });
        break;

      case 'continue':
        // Start new work session
        work.sessions.push({
          startTime: currentTime,
          endTime: null,
          type: 'work'
        });
        // Update technique if provided
        if (technique) {
          update.technique = technique;
        }
        break;

      case 'finish':
        // End work
        update = {
          endTime: currentTime,
          isFinished: true
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update work in database
    await works.updateOne(
      { _id: new ObjectId(workId) },
      { 
        $set: {
          ...update,
          sessions: work.sessions,
          totalWorkTime: work.totalWorkTime,
          totalBreakTime: work.totalBreakTime
        }
      }
    );

    return NextResponse.json({
      success: true,
      work: {
        ...work,
        ...update
      }
    });
  } catch (error) {
    console.error('Update work error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 