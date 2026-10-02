import {
  DIFFICULTIES,
  LANGUAGES,
  OPTION_KEYS,
  PRACTICE_SESSION_STATUSES,
  type Difficulty,
  type Language,
  type OptionKey,
  type PracticeSessionStatus,
} from '@arivuvazhi/shared';
import { model, Schema, type HydratedDocument, type Types } from 'mongoose';
import { baseSchemaOptions } from '../../lib/mongoose';
import type { ScoreSummary } from '../scoring/scoring';

export interface PracticeItem {
  questionId: Types.ObjectId;
  selectedOption: OptionKey | null;
  /** null until answered; also null when the student skipped. */
  isCorrect: boolean | null;
  answeredAt: Date | null;
  timeTakenMs: number;
}

export interface PracticeSession {
  userId: Types.ObjectId;
  examId: Types.ObjectId;
  subjectId?: Types.ObjectId;
  topicId?: Types.ObjectId;
  difficulty?: Difficulty;
  language: Language;
  /** Snapshot of the exam rules at session start so later rule edits do not change past scores. */
  rules: { marksPerQuestion: number; negativeMarkPerWrong: number; rulesVersion: number };
  items: PracticeItem[];
  status: PracticeSessionStatus;
  completedAt?: Date;
  summary?: ScoreSummary;
  createdAt: Date;
  updatedAt: Date;
}

export type PracticeSessionDocument = HydratedDocument<PracticeSession>;

const itemSchema = new Schema<PracticeItem>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedOption: { type: String, enum: [...OPTION_KEYS, null], default: null },
    isCorrect: { type: Boolean, default: null },
    answeredAt: { type: Date, default: null },
    timeTakenMs: { type: Number, default: 0 },
  },
  { _id: false },
);

const practiceSessionSchema = new Schema<PracticeSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic' },
    difficulty: { type: String, enum: DIFFICULTIES },
    language: { type: String, enum: LANGUAGES, required: true },
    rules: {
      type: new Schema(
        {
          marksPerQuestion: { type: Number, required: true },
          negativeMarkPerWrong: { type: Number, required: true },
          rulesVersion: { type: Number, required: true },
        },
        { _id: false },
      ),
      required: true,
    },
    items: { type: [itemSchema], required: true },
    status: { type: String, enum: PRACTICE_SESSION_STATUSES, default: 'in_progress' },
    completedAt: Date,
    summary: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions(),
);

practiceSessionSchema.index({ userId: 1, createdAt: -1 });

export const PracticeSessionModel = model<PracticeSession>('PracticeSession', practiceSessionSchema);
