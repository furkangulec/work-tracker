import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyJwt } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = await verifyJwt(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Get work session by ID
    const work = await db.collection('works').findOne({
      _id: new ObjectId(params.id),
      userId: decoded.id
    });

    if (!work) {
      return NextResponse.json(
        { success: false, error: 'Work session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, work });
  } catch (error) {
    console.error('Error in GET /api/work/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 