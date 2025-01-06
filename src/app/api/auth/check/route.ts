import { NextResponse } from 'next/server';
import { verifyJwt, getJwtFromCookie } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    // Get the cookie header from the request
    const cookieHeader = request.headers.get('cookie') || '';
    
    // Get token from cookie
    const token = getJwtFromCookie(cookieHeader);
    
    if (!token) {
      return NextResponse.json({ user: null });
    }

    // Verify token
    const userData = verifyJwt(token);
    
    if (!userData) {
      return NextResponse.json({ user: null });
    }

    // Return user data
    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null });
  }
} 