import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db');
const USERS_FILE = path.join(DB_PATH, 'users.json');

async function getUsers() {
  try {
    await fs.mkdir(DB_PATH, { recursive: true });
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveUsers(users: any[]) {
  await fs.mkdir(DB_PATH, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const users = await getUsers();
    
    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Add new user
    users.push({ email, password });
    await saveUsers(users);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 