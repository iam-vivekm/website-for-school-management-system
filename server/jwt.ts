import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  schoolId?: string;
  iat?: number;
  exp?: number;
}

export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: (user.email as string) || '',
    role: (user.role as string) || 'student',
    schoolId: user.schoolId || undefined,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function generateRefreshToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: (user.email as string) || '',
    role: (user.role as string) || 'student',
    schoolId: user.schoolId || undefined,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d', // Refresh tokens last longer
  });
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}
