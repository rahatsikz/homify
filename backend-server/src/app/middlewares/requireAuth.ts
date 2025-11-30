import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import config from '../../config';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session?.userId) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : (req.headers['x-access-token'] as string);

  if (!token) {
    // No session and no token → unauthorized
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret as string);
    if (typeof decoded !== 'object' || !(decoded as any).id) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token payload');
    }
    (req as any).user = decoded;
    return next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(419, 'Session expired. Please log in again.'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new ApiError(498, 'Invalid token. Access forbidden.'));
    }
    // Fallback for any other verification error
    return next(new ApiError(httpStatus.UNAUTHORIZED, err.message || 'Authentication error'));
  }
}
