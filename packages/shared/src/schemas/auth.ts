import { z } from 'zod';
import { ROLES } from '../constants/roles';
import { languageSchema, objectIdSchema } from './common';

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters').max(128);
const emailSchema = z.email().trim().toLowerCase().max(254);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  password: passwordSchema,
  preferredLanguage: languageSchema.default('en'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(20).max(200),
});

export const createStaffUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(ROLES),
});
export type CreateStaffUserInput = z.infer<typeof createStaffUserSchema>;

export const updateUserSchema = z
  .object({
    role: z.enum(ROLES).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });

export const studentProfileSchema = z
  .object({
    targetExamId: objectIdSchema.optional(),
    targetDate: z.coerce.date().optional(),
    dailyStudyMinutes: z.number().int().min(10).max(960).optional(),
    preferredLanguage: languageSchema.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });
export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
