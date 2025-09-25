import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken, JWTPayload } from './jwt';
import { User } from '@shared/schema';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      currentUser?: User;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }

    // Get user from database to ensure they still exist and are active
    const user = storage.getUser(payload.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.currentUser = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}

export function authenticateRefreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Get user from database
    const user = storage.getUser(payload.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.currentUser = user;
    next();
  } catch (error) {
    console.error('Refresh token authentication error:', error);
    res.status(401).json({ message: 'Refresh token authentication failed' });
  }
}

export function setAuthCookies(res: Response, user: User) {
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  // Set HttpOnly cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  return authenticateToken(req, res, next);
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.accessToken;

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const user = storage.getUser(payload.userId);
        if (user) {
          req.user = user;
          req.currentUser = user;
        }
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
}
