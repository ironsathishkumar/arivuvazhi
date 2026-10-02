import { idParamSchema, listPracticeSessionsQuerySchema, startPracticeSchema, submitPracticeAnswerSchema } from '@arivuvazhi/shared';
import { Router } from 'express';
import { pageMeta, skipFor } from '../../lib/pagination';
import { authenticate, requireAuth, requirePermission } from '../../middleware/auth';
import { PracticeSessionModel } from './practiceSession.model';
import * as practiceService from './practice.service';

export const practiceRouter = Router();
practiceRouter.use(authenticate, requirePermission('practice:use'));

practiceRouter.get('/sessions', async (req, res) => {
  const { userId } = requireAuth(req);
  const query = listPracticeSessionsQuerySchema.parse(req.query);
  const filter = { userId, ...(query.status ? { status: query.status } : {}) };
  const [sessions, total] = await Promise.all([
    PracticeSessionModel.find(filter).select('-items').sort({ createdAt: -1 }).skip(skipFor(query)).limit(query.limit),
    PracticeSessionModel.countDocuments(filter),
  ]);
  res.json({ data: sessions, meta: pageMeta(query, total) });
});

practiceRouter.post('/sessions', async (req, res) => {
  const { userId } = requireAuth(req);
  const session = await practiceService.startSession(userId, startPracticeSchema.parse(req.body));
  res.status(201).json({ data: await practiceService.toSessionView(session) });
});

practiceRouter.get('/sessions/:id', async (req, res) => {
  const { userId } = requireAuth(req);
  const { id } = idParamSchema.parse(req.params);
  const session = await practiceService.getOwnSession(userId, id);
  res.json({ data: await practiceService.toSessionView(session) });
});

practiceRouter.post('/sessions/:id/answers', async (req, res) => {
  const { userId } = requireAuth(req);
  const { id } = idParamSchema.parse(req.params);
  const result = await practiceService.submitAnswer(userId, id, submitPracticeAnswerSchema.parse(req.body));
  res.json({ data: result });
});

practiceRouter.post('/sessions/:id/complete', async (req, res) => {
  const { userId } = requireAuth(req);
  const { id } = idParamSchema.parse(req.params);
  const session = await practiceService.completeSession(userId, id);
  res.json({ data: await practiceService.toSessionView(session) });
});
