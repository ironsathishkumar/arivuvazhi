import {
  changeQuestionStatusSchema,
  createQuestionSchema,
  idParamSchema,
  listQuestionsQuerySchema,
  updateQuestionSchema,
} from '@arivuvazhi/shared';
import { Router } from 'express';
import { notFound } from '../../lib/errors';
import { pageMeta, skipFor } from '../../lib/pagination';
import { authenticate, requireAuth, requirePermission } from '../../middleware/auth';
import { recordAudit } from '../audit/audit';
import { QuestionModel } from './question.model';
import * as questionsService from './questions.service';

export const questionsRouter = Router();
questionsRouter.use(authenticate, requirePermission('questions:read'));

questionsRouter.get('/', async (req, res) => {
  const query = listQuestionsQuerySchema.parse(req.query);
  const filter: Record<string, unknown> = {};
  if (query.examId) filter.examId = query.examId;
  if (query.subjectId) filter.subjectId = query.subjectId;
  if (query.topicId) filter.topicId = query.topicId;
  if (query.status) filter.status = query.status;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.language) filter.languages = query.language;

  const [questions, total] = await Promise.all([
    QuestionModel.find(filter).select('-reviewHistory').sort({ updatedAt: -1 }).skip(skipFor(query)).limit(query.limit),
    QuestionModel.countDocuments(filter),
  ]);
  res.json({ data: questions, meta: pageMeta(query, total) });
});

questionsRouter.get('/:id', async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const question = await QuestionModel.findById(id);
  if (!question) throw notFound('Question');
  res.json({ data: question });
});

questionsRouter.post('/', requirePermission('questions:write'), async (req, res) => {
  const { userId } = requireAuth(req);
  const question = await questionsService.createQuestion(createQuestionSchema.parse(req.body), userId);
  await recordAudit(req, { action: 'question.create', entityType: 'Question', entityId: question._id });
  res.status(201).json({ data: question });
});

questionsRouter.patch('/:id', requirePermission('questions:write'), async (req, res) => {
  const { userId } = requireAuth(req);
  const { id } = idParamSchema.parse(req.params);
  const input = updateQuestionSchema.parse(req.body);
  const question = await questionsService.updateQuestion(id, input, userId);
  await recordAudit(req, {
    action: 'question.update',
    entityType: 'Question',
    entityId: question._id,
    meta: { fields: Object.keys(input), version: question.version },
  });
  res.json({ data: question });
});

/** Permission depends on the target status (review decisions vs. authoring), so it is checked in the service. */
questionsRouter.post('/:id/status', async (req, res) => {
  const auth = requireAuth(req);
  const { id } = idParamSchema.parse(req.params);
  const { status, note } = changeQuestionStatusSchema.parse(req.body);
  const { question, from } = await questionsService.changeQuestionStatus(id, status, auth, note);
  await recordAudit(req, {
    action: 'question.status_change',
    entityType: 'Question',
    entityId: question._id,
    meta: { from, to: status, note },
  });
  res.json({ data: question });
});
