import { model, Schema, type Types } from 'mongoose';
import { baseSchemaOptions } from '../../lib/mongoose';

export interface AuditLog {
  actorId?: Types.ObjectId;
  action: string;
  entityType: string;
  entityId?: Types.ObjectId;
  requestId?: string;
  ip?: string;
  meta?: Record<string, unknown>;
}

const auditLogSchema = new Schema<AuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId },
    requestId: String,
    ip: String,
    meta: Schema.Types.Mixed,
  },
  baseSchemaOptions(),
);

auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLogModel = model<AuditLog>('AuditLog', auditLogSchema);
