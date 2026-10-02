import { randomUUID } from 'node:crypto';
import type { LoginInput, RegisterInput } from '@arivuvazhi/shared';
import argon2 from 'argon2';
import { env } from '../../config/env';
import { conflict, unauthorized } from '../../lib/errors';
import { logger } from '../../lib/logger';
import { UserModel, type UserDocument } from '../users/user.model';
import { RefreshTokenModel } from './refreshToken.model';
import { generateRefreshToken, hashToken, signAccessToken } from './tokens';

export interface ClientContext {
  ip?: string;
  userAgent?: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDocument;
}

/** Verified against when the email is unknown, so response time does not reveal which emails exist. */
const DUMMY_HASH_PROMISE = argon2.hash('arivuvazhi-timing-equaliser');

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

async function issueTokens(user: UserDocument, ctx: ClientContext, family = randomUUID()): Promise<AuthResult> {
  const refreshToken = generateRefreshToken();
  await RefreshTokenModel.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    family,
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
    ip: ctx.ip,
    userAgent: ctx.userAgent?.slice(0, 300),
  });
  return {
    accessToken: signAccessToken({ userId: user.id, role: user.role }),
    refreshToken,
    expiresIn: env.JWT_ACCESS_TTL_SECONDS,
    user,
  };
}

export async function register(input: RegisterInput, ctx: ClientContext): Promise<AuthResult> {
  if (await UserModel.exists({ email: input.email })) {
    throw conflict('EMAIL_TAKEN', 'An account with this email already exists');
  }
  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    role: 'student',
    preferredLanguage: input.preferredLanguage,
  });
  return issueTokens(user, ctx);
}

export async function login(input: LoginInput, ctx: ClientContext): Promise<AuthResult> {
  const user = await UserModel.findOne({ email: input.email }).select('+passwordHash');
  const valid = user
    ? await argon2.verify(user.passwordHash, input.password)
    : await argon2.verify(await DUMMY_HASH_PROMISE, input.password).then(() => false);

  if (!user || !valid || !user.isActive) {
    throw unauthorized('Email or password is incorrect', 'INVALID_CREDENTIALS');
  }
  user.lastLoginAt = new Date();
  await user.save();
  return issueTokens(user, ctx);
}

/**
 * Rotates a refresh token. Presenting an already-rotated token is treated as theft:
 * the whole token family is revoked and the user must log in again.
 */
export async function refresh(rawToken: string, ctx: ClientContext): Promise<AuthResult> {
  const tokenHash = hashToken(rawToken);
  const nextToken = generateRefreshToken();

  const current = await RefreshTokenModel.findOneAndUpdate(
    { tokenHash, revokedAt: null, expiresAt: { $gt: new Date() } },
    { $set: { revokedAt: new Date(), replacedByHash: hashToken(nextToken) } },
  );

  if (!current) {
    const stale = await RefreshTokenModel.findOne({ tokenHash });
    if (stale?.revokedAt) {
      await RefreshTokenModel.updateMany({ family: stale.family, revokedAt: null }, { $set: { revokedAt: new Date() } });
      logger.warn('Refresh token reuse detected; family revoked', { userId: String(stale.userId), family: stale.family });
      throw unauthorized('Session is no longer valid. Please log in again.', 'TOKEN_REUSED');
    }
    throw unauthorized('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
  }

  const user = await UserModel.findById(current.userId);
  if (!user || !user.isActive) throw unauthorized('Account is not active', 'ACCOUNT_INACTIVE');

  await RefreshTokenModel.create({
    userId: user._id,
    tokenHash: hashToken(nextToken),
    family: current.family,
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
    ip: ctx.ip,
    userAgent: ctx.userAgent?.slice(0, 300),
  });

  return {
    accessToken: signAccessToken({ userId: user.id, role: user.role }),
    refreshToken: nextToken,
    expiresIn: env.JWT_ACCESS_TTL_SECONDS,
    user,
  };
}

export async function logout(rawToken: string): Promise<void> {
  await RefreshTokenModel.updateOne({ tokenHash: hashToken(rawToken), revokedAt: null }, { $set: { revokedAt: new Date() } });
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await RefreshTokenModel.updateMany({ userId, revokedAt: null }, { $set: { revokedAt: new Date() } });
}
