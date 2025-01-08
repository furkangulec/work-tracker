import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Note } from '@/app/notes/types';

// Get notes for a specific work session
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workId = searchParams.get('workId');

    if (!workId) {
      return NextResponse.json({ error: 'Work ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('work-tracker');
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
    const { workId, notes } = await request.json();

    if (!workId || !notes) {
      return NextResponse.json({ error: 'Work ID and notes are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('work-tracker');

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