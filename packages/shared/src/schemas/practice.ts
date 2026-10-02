import { z } from 'zod';
import { languageSchema, objectIdSchema, paginationQuerySchema } from './common';
import { DIFFICULTIES, optionKeySchema } from './question';

export const PRACTICE_SESSION_STATUSES = ['in_progress', 'completed'] as const;
export type PracticeSessionStatus = (typeof PRACTICE_SESSION_STATUSES)[number];

export const startPracticeSchema = z.object({
  examId: objectIdSchema,
  subjectId: objectIdSchema.optional(),
  topicId: objectIdSchema.optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  language: languageSchema,
  count: z.number().int().min(1).max(50).default(10),
});
export type StartPracticeInput = z.infer<typeof startPracticeSchema>;

export const submitPracticeAnswerSchema = z.object({
  questionId: objectIdSchema,
  /** null means the student skipped the question. */
  selectedOption: optionKeySchema.nullable(),
  timeTakenMs: z.number().int().min(0).max(3 * 60 * 60 * 1000).default(0),
});
export type SubmitPracticeAnswerInput = z.infer<typeof submitPracticeAnswerSchema>;

export const listPracticeSessionsQuerySchema = paginationQuerySchema.extend({
  status: z.enum(PRACTICE_SESSION_STATUSES).optional(),
});
