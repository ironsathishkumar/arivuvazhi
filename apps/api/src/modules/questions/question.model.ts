import {
  DIFFICULTIES,
  LANGUAGES,
  OPTION_KEYS,
  QUESTION_SOURCE_TYPES,
  QUESTION_STATUSES,
  type Difficulty,
  type Language,
  type LocalizedText,
  type OptionKey,
  type QuestionStatus,
} from '@arivuvazhi/shared';
import { model, Schema, type HydratedDocument, type Types } from 'mongoose';
import { baseSchemaOptions, localizedTextSchema } from '../../lib/mongoose';

export interface QuestionOption {
  key: OptionKey;
  text: LocalizedText;
}

export interface ReviewEntry {
  from: QuestionStatus;
  to: QuestionStatus;
  by: Types.ObjectId;
  note?: string;
  at: Date;
}

export interface QuestionStats {
  attempts: number;
  correct: number;
  wrong: number;
  skipped: number;
  totalTimeMs: number;
}

export interface Question {
  examId: Types.ObjectId;
  subjectId: Types.ObjectId;
  topicId: Types.ObjectId;
  subTopicId?: Types.ObjectId | null;
  text: LocalizedText;
  options: QuestionOption[];
  correctOption: OptionKey;
  explanation?: LocalizedText;
  difficulty: Difficulty;
  /** Languages in which the question and every option are fully available. */
  languages: Language[];
  source: { type: (typeof QUESTION_SOURCE_TYPES)[number]; reference?: string; year?: number };
  tags: string[];
  status: QuestionStatus;
  version: number;
  reviewHistory: ReviewEntry[];
  stats: QuestionStats;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export type QuestionDocument = HydratedDocument<Question>;

const optionSchema = new Schema<QuestionOption>(
  {
    key: { type: String, enum: OPTION_KEYS, required: true },
    text: { type: localizedTextSchema, required: true },
  },
  { _id: false },
);

const reviewEntrySchema = new Schema<ReviewEntry>(
  {
    from: { type: String, enum: QUESTION_STATUSES, required: true },
    to: { type: String, enum: QUESTION_STATUSES, required: true },
    by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    note: String,
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const questionSchema = new Schema<Question>(
  {
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    subTopicId: { type: Schema.Types.ObjectId, ref: 'SubTopic', default: null },
    text: { type: localizedTextSchema, required: true },
    options: { type: [optionSchema], required: true },
    correctOption: { type: String, enum: OPTION_KEYS, required: true },
    explanation: localizedTextSchema,
    difficulty: { type: String, enum: DIFFICULTIES, default: 'medium' },
    languages: { type: [String], enum: LANGUAGES, default: [] },
    source: {
      type: new Schema(
        {
          type: { type: String, enum: QUESTION_SOURCE_TYPES, default: 'admin' },
          reference: String,
          year: Number,
        },
        { _id: false },
      ),
      default: () => ({ type: 'admin' }),
    },
    tags: { type: [String], default: [] },
    status: { type: String, enum: QUESTION_STATUSES, default: 'draft' },
    version: { type: Number, default: 1 },
    reviewHistory: { type: [reviewEntrySchema], default: [] },
    stats: {
      type: new Schema<QuestionStats>(
        {
          attempts: { type: Number, default: 0 },
          correct: { type: Number, default: 0 },
          wrong: { type: Number, default: 0 },
          skipped: { type: Number, default: 0 },
          totalTimeMs: { type: Number, default: 0 },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  baseSchemaOptions(),
);

questionSchema.index({ examId: 1, subjectId: 1, topicId: 1, status: 1 });
questionSchema.index({ examId: 1, status: 1, languages: 1, difficulty: 1 });
questionSchema.index({ tags: 1 });

export const QuestionModel = model<Question>('Question', questionSchema);
