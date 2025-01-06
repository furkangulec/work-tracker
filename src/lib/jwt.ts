import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface UserJwtPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function signJwt(payload: UserJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwt(token: string): UserJwtPayload | null {
  try {
    console.log('Verifying token:', token);
    const decoded = jwt.verify(token, JWT_SECRET) as UserJwtPayload;
    console.log('Decoded token:', decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function getJwtFromCookie(cookies: string): string | null {
  const match = cookies.match(/token=([^;]+)/);
  return match ? match[1] : null;
} 