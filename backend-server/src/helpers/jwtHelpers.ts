import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../config';
const createToken = (payload: Record<string, unknown>, secret: Secret, expireTime: any) => {
  return jwt.sign(payload, secret as Secret, { expiresIn: expireTime });
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

const toMs = (days: number, hours: number, fallbackMs: number): number => {
  if (days) return days * 24 * 60 * 60 * 1000;
  if (hours) return hours * 60 * 60 * 1000;
  return fallbackMs;
};

export const getJwtExpiryMs = (): number => {
  return toMs(config.jwt.expiry_days, config.jwt.expiry_hours, 7 * 24 * 60 * 60 * 1000); // default 7 days
};

export const generateJwtToken = (
  payload: JwtPayload,
  secretKey?: string,
  expiresInMs?: number,
): string => {
  const key = secretKey ?? config.jwt.secret;
  if (!key) throw new Error('JWT secret key not set');

  const expiry = expiresInMs ?? 15 * 60 * 1000; // default 15 mins
  const expirySeconds = Math.floor(expiry / 1000);

  return jwt.sign(payload, key, { expiresIn: expirySeconds });
};
export const getRefreshTokenExpiryMs = (): number => {
  return toMs(
    config.jwt.refresh_expiry_days,
    config.jwt.refresh_expiry_hours,
    30 * 24 * 60 * 60 * 1000,
  ); // default 30 days
};
export const generateRefreshToken = (payload: JwtPayload, expiresInMs?: number): string => {
  const secretKey = config.jwt.refresh_secret;
  if (!secretKey) throw new Error('JWT_REFRESH_SECRET not set in environment');

  const expiry = expiresInMs ?? getRefreshTokenExpiryMs();
  const expirySeconds = Math.floor(expiry / 1000);

  return jwt.sign(payload, secretKey, { expiresIn: expirySeconds });
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const secretKey = config.jwt.refresh_secret;
  if (!secretKey) throw new Error('JWT_REFRESH_SECRET not set in environment');
  return jwt.verify(token, secretKey) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
