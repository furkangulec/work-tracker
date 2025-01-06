import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { User } from '@/types/user';
import { signJwt } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('work-tracker');
    const users = db.collection<User>('users');
    
    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const now = new Date();
    const user: User = {
      email,
      firstName,
      lastName,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };

    const result = await users.insertOne(user);

    // Create JWT token
    const token = signJwt({
      id: result.insertedId.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Return success with token in cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 