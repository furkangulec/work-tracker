import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyJwt, getJwtFromCookie } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get work session by ID
    const work = await db.collection('works').findOne({
      _id: new ObjectId(params.id),
      userId: userData.id
    });

    if (!work) {
      return NextResponse.json(
        { success: false, error: 'Work session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, work });
  } catch (error) {
    console.error('Failed to fetch work details:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 