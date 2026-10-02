import { objectIdSchema, paginationQuerySchema } from '@arivuvazhi/shared';
import { Router } from 'express';
import { z } from 'zod';
import { pageMeta, skipFor } from '../../lib/pagination';
import { authenticate, requirePermission } from '../../middleware/auth';
import { AuditLogModel } from './auditLog.model';

const listAuditLogsQuerySchema = paginationQuerySchema.extend({
  entityType: z.string().trim().min(1).max(50).optional(),
  entityId: objectIdSchema.optional(),
  actorId: objectIdSchema.optional(),
  action: z.string().trim().min(1).max(100).optional(),
});

export const auditRouter = Router();
auditRouter.use(authenticate, requirePermission('audit:read'));

auditRouter.get('/', async (req, res) => {
  const { page, limit, ...filters } = listAuditLogsQuerySchema.parse(req.query);
  const filter = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined));
  const [logs, total] = await Promise.all([
    AuditLogModel.find(filter).sort({ createdAt: -1 }).skip(skipFor({ page, limit })).limit(limit),
    AuditLogModel.countDocuments(filter),
  ]);
  res.json({ data: logs, meta: pageMeta({ page, limit }, total) });
});
