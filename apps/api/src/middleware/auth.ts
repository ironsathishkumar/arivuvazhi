import { hasPermission, type Permission } from '@arivuvazhi/shared';
import type { Request, RequestHandler } from 'express';
import { forbidden, unauthorized } from '../lib/errors';
import { verifyAccessToken } from '../modules/auth/tokens';
import { UserModel } from '../modules/users/user.model';

/**
 * Verifies the bearer token and reloads the user so that deactivation and
 * role changes take effect immediately rather than when the token expires.
 */
export const authenticate: RequestHandler = async (req, _res, next) => {
  const header = req.get('authorization');
  if (!header?.startsWith('Bearer ')) throw unauthorized();

  const claims = verifyAccessToken(header.slice('Bearer '.length).trim());
  const user = await UserModel.findById(claims.userId).select('role isActive').lean();
  if (!user || !user.isActive) throw unauthorized('Account is not active', 'ACCOUNT_INACTIVE');

  req.auth = { userId: String(user._id), role: user.role };
  next();
};

export function requirePermission(...permissions: Permission[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) throw unauthorized();
    if (!permissions.every((p) => hasPermission(req.auth!.role, p))) throw forbidden();
    next();
  };
}

export function requireAuth(req: Request): NonNullable<Request['auth']> {
  if (!req.auth) throw unauthorized();
  return req.auth;
}

export function can(req: Request, permission: Permission): boolean {
  return req.auth !== undefined && hasPermission(req.auth.role, permission);
}
