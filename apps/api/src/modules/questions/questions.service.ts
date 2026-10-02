import {
  canTransitionQuestion,
  EDITABLE_QUESTION_STATUSES,
  hasPermission,
  LANGUAGES,
  questionContentSchema,
  REVIEW_TRANSITION_TARGETS,
  type CreateQuestionInput,
  type Language,
  type QuestionStatus,
  type Role,
  type UpdateQuestionInput,
} from '@arivuvazhi/shared';
import { Types } from 'mongoose';
import { badRequest, conflict, forbidden, notFound } from '../../lib/errors';
import { SubjectModel, SubTopicModel, TopicModel } from '../exams/hierarchy.models';
import { QuestionModel, type Question, type QuestionDocument } from './question.model';

type QuestionContent = Pick<Question, 'text' | 'options'>;

/** A language counts only when the stem and every option are available in it. */
export function availableLanguages({ text, options }: QuestionContent): Language[] {
  return LANGUAGES.filter((lang) => text[lang] !== undefined && options.every((o) => o.text[lang] !== undefined));
}

async function assertHierarchy(examId: string, subjectId: string, topicId: string, subTopicId?: string | null) {
  const [subject, topic] = await Promise.all([
    SubjectModel.findOne({ _id: subjectId, examId }).select('_id'),
    TopicModel.findOne({ _id: topicId, subjectId }).select('_id'),
  ]);
  if (!subject) throw badRequest('INVALID_HIERARCHY', 'Subject does not belong to the selected exam');
  if (!topic) throw badRequest('INVALID_HIERARCHY', 'Topic does not belong to the selected subject');
  if (subTopicId && !(await SubTopicModel.exists({ _id: subTopicId, topicId }))) {
    throw badRequest('INVALID_HIERARCHY', 'Sub-topic does not belong to the selected topic');
  }
}

export async function createQuestion(input: CreateQuestionInput, userId: string): Promise<QuestionDocument> {
  await assertHierarchy(input.examId, input.subjectId, input.topicId, input.subTopicId);
  return QuestionModel.create({
    ...input,
    languages: availableLanguages(input),
    status: 'draft',
    createdBy: userId,
    updatedBy: userId,
  });
}

export async function updateQuestion(id: string, input: UpdateQuestionInput, userId: string): Promise<QuestionDocument> {
  const question = await QuestionModel.findById(id);
  if (!question) throw notFound('Question');
  if (!EDITABLE_QUESTION_STATUSES.includes(question.status)) {
    throw conflict('QUESTION_NOT_EDITABLE', `Questions in "${question.status}" status cannot be edited. Move it back to draft first.`);
  }

  const content = questionContentSchema.parse({
    text: input.text ?? question.text,
    options: input.options ?? question.options,
    correctOption: input.correctOption ?? question.correctOption,
    explanation: input.explanation ?? question.explanation ?? undefined,
    difficulty: input.difficulty ?? question.difficulty,
  });

  if (input.subTopicId !== undefined) {
    if (input.subTopicId !== null) {
      await assertHierarchy(String(question.examId), String(question.subjectId), String(question.topicId), input.subTopicId);
    }
    question.subTopicId = input.subTopicId === null ? null : new Types.ObjectId(input.subTopicId);
  }

  question.set({ ...content, languages: availableLanguages(content) });
  if (input.tags) question.tags = input.tags;
  question.version += 1;
  question.updatedBy = new Types.ObjectId(userId);
  return question.save();
}

export async function changeQuestionStatus(
  id: string,
  to: QuestionStatus,
  actor: { userId: string; role: Role },
  note?: string,
): Promise<{ question: QuestionDocument; from: QuestionStatus }> {
  const question = await QuestionModel.findById(id);
  if (!question) throw notFound('Question');

  const from = question.status;
  if (!canTransitionQuestion(from, to)) {
    throw conflict('INVALID_STATUS_TRANSITION', `Cannot move a question from "${from}" to "${to}"`);
  }
  const needed = REVIEW_TRANSITION_TARGETS.includes(to) ? 'questions:review' : 'questions:write';
  if (!hasPermission(actor.role, needed)) throw forbidden();

  if (to === 'published' && question.languages.length === 0) {
    throw badRequest('INCOMPLETE_QUESTION', 'Question must be complete in at least one language before publishing');
  }

  question.status = to;
  question.reviewHistory.push({ from, to, by: new Types.ObjectId(actor.userId), note, at: new Date() });
  question.updatedBy = new Types.ObjectId(actor.userId);
  await question.save();
  return { question, from };
}
