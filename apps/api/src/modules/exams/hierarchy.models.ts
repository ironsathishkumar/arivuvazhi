import type { LocalizedText } from '@arivuvazhi/shared';
import { model, Schema, type Types } from 'mongoose';
import { baseSchemaOptions, localizedTextSchema } from '../../lib/mongoose';

interface HierarchyNode {
  code: string;
  name: LocalizedText;
  order: number;
  isActive: boolean;
}

export interface Subject extends HierarchyNode {
  examId: Types.ObjectId;
  /** Exam section (e.g. PART_A) this subject is counted under. */
  sectionCode?: string;
}

export interface Topic extends HierarchyNode {
  examId: Types.ObjectId;
  subjectId: Types.ObjectId;
}

export interface SubTopic extends HierarchyNode {
  examId: Types.ObjectId;
  subjectId: Types.ObjectId;
  topicId: Types.ObjectId;
}

const nodeFields = {
  code: { type: String, required: true, uppercase: true, trim: true },
  name: { type: localizedTextSchema, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
};

const subjectSchema = new Schema<Subject>(
  {
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    sectionCode: String,
    ...nodeFields,
  },
  baseSchemaOptions(),
);
subjectSchema.index({ examId: 1, code: 1 }, { unique: true });

const topicSchema = new Schema<Topic>(
  {
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    ...nodeFields,
  },
  baseSchemaOptions(),
);
topicSchema.index({ subjectId: 1, code: 1 }, { unique: true });

const subTopicSchema = new Schema<SubTopic>(
  {
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    ...nodeFields,
  },
  baseSchemaOptions(),
);
subTopicSchema.index({ topicId: 1, code: 1 }, { unique: true });

export const SubjectModel = model<Subject>('Subject', subjectSchema);
export const TopicModel = model<Topic>('Topic', topicSchema);
export const SubTopicModel = model<SubTopic>('SubTopic', subTopicSchema);
