import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Work } from '@/types/work';
import { verifyJwt, getJwtFromCookie } from '@/lib/jwt';
import { ObjectId } from 'mongodb';

type WorkQuery = {
  userId: string;
  startTime?: {
    $gte?: number;
    $lte?: number;
  };
};

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

    // Get date filters from URL
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('work-tracker');
    const works = db.collection<Work>('works');
    const notes = db.collection('notes');

    // Build query
    const query: WorkQuery = { userId: userData.id };
    
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) {
        query.startTime.$gte = new Date(startDate).getTime();
      }
      if (endDate) {
        query.startTime.$lte = new Date(endDate).getTime();
      }
    }

    // Get filtered work sessions for the user
    const userWorks = await works.find(query).sort({ startTime: -1 }).toArray();

    // Check for notes for each work
    const worksWithNotes = await Promise.all(
      userWorks.map(async (work) => {
        const hasNotes = await notes.countDocuments({ workId: new ObjectId(work._id) }, { limit: 1 });
        return {
          ...work,
          hasNotes: hasNotes > 0
        };
      })
    );

    return NextResponse.json({ success: true, works: worksWithNotes });
  } catch (error) {
    console.error('Failed to fetch work list:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 