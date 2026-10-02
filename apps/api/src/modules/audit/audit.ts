import type { Request } from 'express';
import type { Types } from 'mongoose';
import { AuditLogModel } from './auditLog.model';

export interface AuditEntry {
  action: string;
  entityType: string;
  entityId?: Types.ObjectId | string;
  meta?: Record<string, unknown>;
}

export async function recordAudit(req: Request, entry: AuditEntry): Promise<void> {
  await AuditLogModel.create({
    ...entry,
    actorId: req.auth?.userId,
    requestId: req.requestId,
    ip: req.ip,
  });
}
