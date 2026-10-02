import {
  createStaffUserSchema,
  idParamSchema,
  paginationQuerySchema,
  PRIVILEGED_ROLES,
  ROLES,
  updateUserSchema,
} from '@arivuvazhi/shared';
import { Router } from 'express';
import { z } from 'zod';
import { badRequest, conflict, forbidden, notFound } from '../../lib/errors';
import { pageMeta, skipFor } from '../../lib/pagination';
import { authenticate, requireAuth, requirePermission } from '../../middleware/auth';
import { recordAudit } from '../audit/audit';
import { hashPassword, revokeAllSessions } from '../auth/auth.service';
import { UserModel } from './user.model';

const listUsersQuerySchema = paginationQuerySchema.extend({
  role: z.enum(ROLES).optional(),
  search: z.string().trim().min(1).max(100).optional(),
});

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const usersRouter = Router();
usersRouter.use(authenticate, requirePermission('users:manage'));

usersRouter.get('/', async (req, res) => {
  const query = listUsersQuerySchema.parse(req.query);
  const filter: Record<string, unknown> = {};
  if (query.role) filter.role = query.role;
  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ name: pattern }, { email: pattern }];
  }
  const [users, total] = await Promise.all([
    UserModel.find(filter).sort({ createdAt: -1 }).skip(skipFor(query)).limit(query.limit),
    UserModel.countDocuments(filter),
  ]);
  res.json({ data: users, meta: pageMeta(query, total) });
});

usersRouter.post('/', async (req, res) => {
  const auth = requireAuth(req);
  const input = createStaffUserSchema.parse(req.body);
  if (PRIVILEGED_ROLES.includes(input.role) && auth.role !== 'super_admin') {
    throw forbidden('Only a super admin can create admin accounts');
  }
  if (await UserModel.exists({ email: input.email })) {
    throw conflict('EMAIL_TAKEN', 'An account with this email already exists');
  }
  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    role: input.role,
    passwordHash: await hashPassword(input.password),
  });
  await recordAudit(req, { action: 'user.create', entityType: 'User', entityId: user._id, meta: { role: input.role } });
  res.status(201).json({ data: user });
});

usersRouter.patch('/:id', async (req, res) => {
  const auth = requireAuth(req);
  const { id } = idParamSchema.parse(req.params);
  const input = updateUserSchema.parse(req.body);

  if (id === auth.userId) throw badRequest('SELF_MODIFICATION', 'You cannot change your own role or status');

  const user = await UserModel.findById(id);
  if (!user) throw notFound('User');

  const touchesPrivileged = PRIVILEGED_ROLES.includes(user.role) || (input.role && PRIVILEGED_ROLES.includes(input.role));
  if (touchesPrivileged && auth.role !== 'super_admin') {
    throw forbidden('Only a super admin can change admin accounts');
  }

  const before = { role: user.role, isActive: user.isActive };
  if (input.role !== undefined) user.role = input.role;
  if (input.isActive !== undefined) user.isActive = input.isActive;
  await user.save();

  if (input.isActive === false) await revokeAllSessions(id);
  await recordAudit(req, { action: 'user.update', entityType: 'User', entityId: user._id, meta: { before, after: input } });
  res.json({ data: user });
});
