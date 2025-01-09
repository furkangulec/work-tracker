import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Note } from '@/app/notes/types';
import { verifyJwt, getJwtFromCookie } from '@/lib/jwt';

// Get notes for a specific work session
export async function GET(request: Request) {
  try {
    // Get and verify token
    const cookieHeader = request.headers.get('cookie') || '';
    const token = getJwtFromCookie(cookieHeader);
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = verifyJwt(token);
    if (!userData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workId = searchParams.get('workId');

    if (!workId) {
      return NextResponse.json({ error: 'Work ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('work-tracker');

    // First verify that the work belongs to the user
    const work = await db.collection('works').findOne({
      _id: new ObjectId(workId),
      userId: userData.id
    });

    if (!work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }

    // Then get the notes
    const notes = await db.collection('notes').find({ workId: new ObjectId(workId) }).toArray();

    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Save notes for a work session
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
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { workId, notes } = await request.json();

    if (!workId || !notes) {
      return NextResponse.json({ error: 'Work ID and notes are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('work-tracker');

    // First verify that the work belongs to the user
    const work = await db.collection('works').findOne({
      _id: new ObjectId(workId),
      userId: userData.id
    });

    if (!work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    }

    // Delete existing notes for this work session
    await db.collection('notes').deleteMany({ workId: new ObjectId(workId) });

    // Insert new notes with workId
    const notesWithWorkId = notes.map((note: Note) => ({
      ...note,
      workId: new ObjectId(workId),
      updatedAt: new Date()
    }));

    await db.collection('notes').insertMany(notesWithWorkId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving notes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 