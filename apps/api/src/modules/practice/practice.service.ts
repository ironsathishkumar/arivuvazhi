import type { Language, LocalizedText, StartPracticeInput, SubmitPracticeAnswerInput } from '@arivuvazhi/shared';
import { Types } from 'mongoose';
import { badRequest, conflict, notFound } from '../../lib/errors';
import { ExamModel } from '../exams/exam.model';
import { SubjectModel, TopicModel } from '../exams/hierarchy.models';
import { QuestionModel, type Question } from '../questions/question.model';
import { scoreAnswers } from '../scoring/scoring';
import { PracticeSessionModel, type PracticeItem, type PracticeSessionDocument } from './practiceSession.model';

type QuestionForView = Pick<Question, 'text' | 'options' | 'correctOption' | 'explanation' | 'difficulty'> & {
  _id: Types.ObjectId;
};

function pick(text: LocalizedText | undefined, language: Language): string | undefined {
  if (!text) return undefined;
  return text[language] ?? text.en ?? text.ta;
}

/** Builds the student-facing item. The correct answer is only revealed once the item is answered. */
function toItemView(item: PracticeItem, index: number, question: QuestionForView | undefined, language: Language) {
  const answered = item.answeredAt !== null;
  return {
    order: index + 1,
    questionId: String(item.questionId),
    text: question ? pick(question.text, language) : undefined,
    options: question?.options.map((o) => ({ key: o.key, text: pick(o.text, language) })) ?? [],
    difficulty: question?.difficulty,
    answered,
    selectedOption: item.selectedOption,
    isCorrect: item.isCorrect,
    timeTakenMs: item.timeTakenMs,
    ...(answered && question
      ? { correctOption: question.correctOption, explanation: pick(question.explanation, language) ?? null }
      : {}),
  };
}

export async function toSessionView(session: PracticeSessionDocument) {
  const questions = await QuestionModel.find({ _id: { $in: session.items.map((i) => i.questionId) } })
    .select('text options correctOption explanation difficulty')
    .lean<QuestionForView[]>();
  const byId = new Map(questions.map((q) => [String(q._id), q]));

  return {
    id: session.id,
    examId: String(session.examId),
    subjectId: session.subjectId ? String(session.subjectId) : null,
    topicId: session.topicId ? String(session.topicId) : null,
    language: session.language,
    status: session.status,
    rules: session.rules,
    createdAt: session.createdAt,
    completedAt: session.completedAt ?? null,
    summary: session.summary ?? null,
    items: session.items.map((item, i) => toItemView(item, i, byId.get(String(item.questionId)), session.language)),
  };
}

export async function startSession(userId: string, input: StartPracticeInput): Promise<PracticeSessionDocument> {
  const exam = await ExamModel.findOne({ _id: input.examId, status: 'active' });
  if (!exam) throw notFound('Exam');

  if (input.subjectId && !(await SubjectModel.exists({ _id: input.subjectId, examId: exam._id, isActive: true }))) {
    throw badRequest('INVALID_HIERARCHY', 'Subject does not belong to the selected exam');
  }
  if (input.topicId) {
    const topicFilter = { _id: input.topicId, examId: exam._id, isActive: true, ...(input.subjectId ? { subjectId: input.subjectId } : {}) };
    if (!(await TopicModel.exists(topicFilter))) {
      throw badRequest('INVALID_HIERARCHY', 'Topic does not belong to the selected exam/subject');
    }
  }

  const match: Record<string, unknown> = { examId: exam._id, status: 'published', languages: input.language };
  if (input.subjectId) match.subjectId = new Types.ObjectId(input.subjectId);
  if (input.topicId) match.topicId = new Types.ObjectId(input.topicId);
  if (input.difficulty) match.difficulty = input.difficulty;

  const picked = await QuestionModel.aggregate<{ _id: Types.ObjectId }>([
    { $match: match },
    { $sample: { size: input.count } },
    { $project: { _id: 1 } },
  ]);
  if (picked.length === 0) {
    throw notFound('Published questions for this selection');
  }

  return PracticeSessionModel.create({
    userId,
    examId: exam._id,
    subjectId: input.subjectId,
    topicId: input.topicId,
    difficulty: input.difficulty,
    language: input.language,
    rules: {
      marksPerQuestion: exam.rules.marksPerQuestion,
      negativeMarkPerWrong: exam.rules.negativeMarkPerWrong,
      rulesVersion: exam.rulesVersion,
    },
    items: picked.map((q) => ({ questionId: q._id })),
  });
}

export async function getOwnSession(userId: string, sessionId: string): Promise<PracticeSessionDocument> {
  const session = await PracticeSessionModel.findOne({ _id: sessionId, userId });
  if (!session) throw notFound('Practice session');
  return session;
}

export async function submitAnswer(userId: string, sessionId: string, input: SubmitPracticeAnswerInput) {
  const session = await getOwnSession(userId, sessionId);
  if (session.status !== 'in_progress') throw conflict('SESSION_COMPLETED', 'This practice session is already completed');

  const item = session.items.find((i) => String(i.questionId) === input.questionId);
  if (!item) throw badRequest('QUESTION_NOT_IN_SESSION', 'This question is not part of the session');
  if (item.answeredAt) throw conflict('ALREADY_ANSWERED', 'This question has already been answered');

  const question = await QuestionModel.findById(input.questionId).select('correctOption explanation').lean();
  if (!question) throw notFound('Question');

  const isCorrect = input.selectedOption === null ? null : input.selectedOption === question.correctOption;
  const questionObjectId = new Types.ObjectId(input.questionId);

  // Guarded update: concurrent submissions for the same item cannot both succeed.
  const result = await PracticeSessionModel.updateOne(
    { _id: session._id, status: 'in_progress', items: { $elemMatch: { questionId: questionObjectId, answeredAt: null } } },
    {
      $set: {
        'items.$.selectedOption': input.selectedOption,
        'items.$.isCorrect': isCorrect,
        'items.$.answeredAt': new Date(),
        'items.$.timeTakenMs': input.timeTakenMs,
      },
    },
  );
  if (result.modifiedCount === 0) throw conflict('ALREADY_ANSWERED', 'This question has already been answered');

  await QuestionModel.updateOne(
    { _id: questionObjectId },
    {
      $inc: {
        'stats.attempts': 1,
        'stats.correct': isCorrect === true ? 1 : 0,
        'stats.wrong': isCorrect === false ? 1 : 0,
        'stats.skipped': isCorrect === null ? 1 : 0,
        'stats.totalTimeMs': input.timeTakenMs,
      },
    },
  );

  return {
    questionId: input.questionId,
    selectedOption: input.selectedOption,
    isCorrect,
    correctOption: question.correctOption,
    explanation: pick(question.explanation, session.language) ?? null,
  };
}

export async function completeSession(userId: string, sessionId: string): Promise<PracticeSessionDocument> {
  const session = await getOwnSession(userId, sessionId);
  if (session.status === 'completed') return session;

  const summary = scoreAnswers(
    session.rules,
    session.items.map((i) => i.isCorrect),
  );
  const completed = await PracticeSessionModel.findOneAndUpdate(
    { _id: session._id, status: 'in_progress' },
    { $set: { status: 'completed', completedAt: new Date(), summary } },
    { returnDocument: 'after' },
  );
  return completed ?? getOwnSession(userId, sessionId);
}
