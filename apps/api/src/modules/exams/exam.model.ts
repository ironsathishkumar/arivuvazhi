import { EXAM_STATUSES, LANGUAGES, type ExamStatus, type Language, type LocalizedText } from '@arivuvazhi/shared';
import { model, Schema, type HydratedDocument, type Types } from 'mongoose';
import { baseSchemaOptions, localizedTextSchema } from '../../lib/mongoose';

export interface ExamSection {
  code: string;
  name: LocalizedText;
  questionCount: number;
  marks: number;
  minimumQualifyingPercent?: number;
}

export interface ExamRules {
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  marksPerQuestion: number;
  negativeMarkPerWrong: number;
  sections: ExamSection[];
  effectiveFrom?: Date;
}

export interface Exam {
  code: string;
  name: LocalizedText;
  description?: LocalizedText;
  languages: Language[];
  rules: ExamRules;
  /** Incremented whenever `rules` change, so attempts can record which rules they were scored under. */
  rulesVersion: number;
  status: ExamStatus;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export type ExamDocument = HydratedDocument<Exam>;

const sectionSchema = new Schema<ExamSection>(
  {
    code: { type: String, required: true },
    name: { type: localizedTextSchema, required: true },
    questionCount: { type: Number, required: true },
    marks: { type: Number, required: true },
    minimumQualifyingPercent: Number,
  },
  { _id: false },
);

const rulesSchema = new Schema<ExamRules>(
  {
    durationMinutes: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    marksPerQuestion: { type: Number, required: true },
    negativeMarkPerWrong: { type: Number, default: 0 },
    sections: { type: [sectionSchema], default: [] },
    effectiveFrom: Date,
  },
  { _id: false },
);

const examSchema = new Schema<Exam>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: localizedTextSchema, required: true },
    description: localizedTextSchema,
    languages: { type: [String], enum: LANGUAGES, default: ['en', 'ta'] },
    rules: { type: rulesSchema, required: true },
    rulesVersion: { type: Number, default: 1 },
    status: { type: String, enum: EXAM_STATUSES, default: 'draft', index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  baseSchemaOptions(),
);

export const ExamModel = model<Exam>('Exam', examSchema);
