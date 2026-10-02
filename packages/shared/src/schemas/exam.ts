import { z } from 'zod';
import { codeSchema, languageSchema, localizedTextSchema, objectIdSchema } from './common';

export const EXAM_STATUSES = ['draft', 'active', 'archived'] as const;
export type ExamStatus = (typeof EXAM_STATUSES)[number];

export const examSectionSchema = z.object({
  code: codeSchema,
  name: localizedTextSchema,
  questionCount: z.number().int().min(1),
  marks: z.number().min(0),
  /** Minimum percentage in this section to be considered for evaluation (e.g. qualifying papers). */
  minimumQualifyingPercent: z.number().min(0).max(100).optional(),
});

export const examRulesSchema = z
  .object({
    durationMinutes: z.number().int().min(1).max(600),
    totalQuestions: z.number().int().min(1),
    totalMarks: z.number().min(1),
    marksPerQuestion: z.number().min(0),
    negativeMarkPerWrong: z.number().min(0).default(0),
    sections: z.array(examSectionSchema).default([]),
    effectiveFrom: z.coerce.date().optional(),
  })
  .refine((r) => r.sections.length === 0 || r.sections.reduce((n, s) => n + s.questionCount, 0) === r.totalQuestions, {
    message: 'Section question counts must add up to totalQuestions',
    path: ['sections'],
  });
export type ExamRules = z.infer<typeof examRulesSchema>;

export const createExamSchema = z.object({
  code: codeSchema,
  name: localizedTextSchema,
  description: localizedTextSchema.optional(),
  languages: z.array(languageSchema).min(1).default(['en', 'ta']),
  rules: examRulesSchema,
  status: z.enum(EXAM_STATUSES).default('draft'),
});
export type CreateExamInput = z.infer<typeof createExamSchema>;

export const updateExamSchema = z
  .object({
    name: localizedTextSchema.optional(),
    description: localizedTextSchema.optional(),
    languages: z.array(languageSchema).min(1).optional(),
    rules: examRulesSchema.optional(),
    status: z.enum(EXAM_STATUSES).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });
export type UpdateExamInput = z.infer<typeof updateExamSchema>;

const hierarchyNodeBase = {
  code: codeSchema,
  name: localizedTextSchema,
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
};

export const createSubjectSchema = z.object({
  examId: objectIdSchema,
  sectionCode: codeSchema.optional(),
  ...hierarchyNodeBase,
});
export const createTopicSchema = z.object({ subjectId: objectIdSchema, ...hierarchyNodeBase });
export const createSubTopicSchema = z.object({ topicId: objectIdSchema, ...hierarchyNodeBase });

export const updateHierarchyNodeSchema = z
  .object({
    name: localizedTextSchema.optional(),
    order: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
    sectionCode: codeSchema.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });
