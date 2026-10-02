import { model, Schema, type Types } from 'mongoose';

export interface RefreshToken {
  userId: Types.ObjectId;
  /** SHA-256 of the opaque token; the raw token is never stored. */
  tokenHash: string;
  /** All tokens rotated from the same login share a family, so reuse can revoke the whole chain. */
  family: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  replacedByHash?: string;
  userAgent?: string;
  ip?: string;
}

const refreshTokenSchema = new Schema<RefreshToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    family: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    replacedByHash: String,
    userAgent: String,
    ip: String,
  },
  { timestamps: true },
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<RefreshToken>('RefreshToken', refreshTokenSchema);
