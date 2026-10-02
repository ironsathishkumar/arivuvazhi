import { createHash, randomBytes } from 'node:crypto';
import type { Role } from '@arivuvazhi/shared';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { unauthorized } from '../../lib/errors';

const ISSUER = 'arivuvazhi';
const AUDIENCE = 'arivuvazhi-api';

export interface AccessTokenClaims {
  userId: string;
  role: Role;
}

export function signAccessToken({ userId, role }: AccessTokenClaims): string {
  return jwt.sign({ role }, env.JWT_ACCESS_SECRET, {
    algorithm: 'HS256',
    subject: userId,
    issuer: ISSUER,
    audience: AUDIENCE,
    expiresIn: env.JWT_ACCESS_TTL_SECONDS,
  });
}

export function verifyAccessToken(token: string): AccessTokenClaims {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      algorithms: ['HS256'],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (typeof payload === 'string' || !payload.sub) throw new Error('Malformed token');
    return { userId: payload.sub, role: payload.role as Role };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw unauthorized('Access token expired', 'TOKEN_EXPIRED');
    throw unauthorized('Invalid access token', 'INVALID_TOKEN');
  }
}

export function generateRefreshToken(): string {
  return randomBytes(48).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
