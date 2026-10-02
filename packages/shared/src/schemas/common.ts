import { z } from 'zod';

export const LANGUAGES = ['en', 'ta'] as const;
export type Language = (typeof LANGUAGES)[number];
export const languageSchema = z.enum(LANGUAGES);

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const codeSchema = z
  .string()
  .trim()
  .min(2)
  .max(40)
  .regex(/^[A-Z0-9_]+$/, 'Use UPPER_SNAKE_CASE');

/** Text that may exist in English, Tamil, or both. At least one language is required. */
export const localizedTextSchema = z
  .object({
    en: z.string().trim().min(1).max(5000).optional(),
    ta: z.string().trim().min(1).max(5000).optional(),
  })
  .refine((v) => v.en !== undefined || v.ta !== undefined, { message: 'Provide text in at least one language' });
export type LocalizedText = z.infer<typeof localizedTextSchema>;

export function languagesOf(text: LocalizedText): Language[] {
  return LANGUAGES.filter((lang) => text[lang] !== undefined);
}

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamSchema = z.object({ id: objectIdSchema });
