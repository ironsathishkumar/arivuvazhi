import { z } from 'zod';
import { languageSchema, languagesOf, localizedTextSchema, objectIdSchema, paginationQuerySchema } from './common';

export const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E'] as const;
export type OptionKey = (typeof OPTION_KEYS)[number];
export const optionKeySchema = z.enum(OPTION_KEYS);

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const QUESTION_SOURCE_TYPES = ['admin', 'previous_year', 'study_material', 'ai_generated'] as const;

export const QUESTION_STATUSES = ['draft', 'in_review', 'rejected', 'approved', 'published', 'archived'] as const;
export type QuestionStatus = (typeof QUESTION_STATUSES)[number];

export const QUESTION_STATUS_TRANSITIONS: Record<QuestionStatus, readonly QuestionStatus[]> = {
  draft: ['in_review', 'archived'],
  in_review: ['approved', 'rejected', 'draft'],
  rejected: ['draft', 'archived'],
  approved: ['published', 'draft'],
  published: ['archived'],
  archived: ['draft'],
};

/** Transitions that represent a review decision and need the questions:review permission. */
export const REVIEW_TRANSITION_TARGETS: readonly QuestionStatus[] = ['approved', 'rejected', 'published'];

export const EDITABLE_QUESTION_STATUSES: readonly QuestionStatus[] = ['draft', 'in_review', 'rejected'];

export function canTransitionQuestion(from: QuestionStatus, to: QuestionStatus): boolean {
  return QUESTION_STATUS_TRANSITIONS[from].includes(to);
}

const questionOptionSchema = z.object({
  key: optionKeySchema,
  text: localizedTextSchema,
});

const questionContentShape = {
  text: localizedTextSchema,
  options: z.array(questionOptionSchema).min(2).max(5),
  correctOption: optionKeySchema,
  explanation: localizedTextSchema.optional(),
  difficulty: z.enum(DIFFICULTIES).default('medium'),
};

type QuestionContent = {
  text: z.infer<typeof localizedTextSchema>;
  options: z.infer<typeof questionOptionSchema>[];
  correctOption: OptionKey;
  explanation?: z.infer<typeof localizedTextSchema>;
};

function checkQuestionContent(q: Partial<QuestionContent>, ctx: z.RefinementCtx): void {
  if (!q.options) return;
  const keys = q.options.map((o) => o.key);
  if (new Set(keys).size !== keys.length) {
    ctx.addIssue({ code: 'custom', path: ['options'], message: 'Option keys must be unique' });
  }
  if (q.correctOption && !keys.includes(q.correctOption)) {
    ctx.addIssue({ code: 'custom', path: ['correctOption'], message: 'correctOption must match one of the option keys' });
  }
  if (q.text) {
    const required = languagesOf(q.text);
    q.options.forEach((o, i) => {
      for (const lang of required) {
        if (o.text[lang] === undefined) {
          ctx.addIssue({ code: 'custom', path: ['options', i, 'text', lang], message: `Option is missing ${lang} text` });
        }
      }
    });
  }
}

/** Validates a complete question body; used to re-check content after a partial update is merged. */
export const questionContentSchema = z.object(questionContentShape).superRefine(checkQuestionContent);

export const createQuestionSchema = z
  .object({
    examId: objectIdSchema,
    subjectId: objectIdSchema,
    topicId: objectIdSchema,
    subTopicId: objectIdSchema.optional(),
    ...questionContentShape,
    source: z
      .object({
        type: z.enum(QUESTION_SOURCE_TYPES).default('admin'),
        reference: z.string().trim().max(500).optional(),
        year: z.number().int().min(1950).max(2100).optional(),
      })
      .default({ type: 'admin' }),
    tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  })
  .superRefine(checkQuestionContent);
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

export const updateQuestionSchema = z
  .object({
    subTopicId: objectIdSchema.nullable().optional(),
    text: questionContentShape.text.optional(),
    options: questionContentShape.options.optional(),
    correctOption: questionContentShape.correctOption.optional(),
    explanation: questionContentShape.explanation,
    difficulty: z.enum(DIFFICULTIES).optional(),
    tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' })
  .superRefine(checkQuestionContent);
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

export const changeQuestionStatusSchema = z.object({
  status: z.enum(QUESTION_STATUSES),
  note: z.string().trim().max(1000).optional(),
});

export const listQuestionsQuerySchema = paginationQuerySchema.extend({
  examId: objectIdSchema.optional(),
  subjectId: objectIdSchema.optional(),
  topicId: objectIdSchema.optional(),
  status: z.enum(QUESTION_STATUSES).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  language: languageSchema.optional(),
});
