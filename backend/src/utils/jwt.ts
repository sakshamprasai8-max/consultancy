import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET || 'dev-access-jwt-secret-min-32-chars';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-jwt-secret-min-32-chars';

export interface TokenPayload {
  userId: string;
  role: string;
  email: string;
}

export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
  });
};

export const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
};
