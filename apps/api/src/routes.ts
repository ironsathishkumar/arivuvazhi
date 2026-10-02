import { Router } from 'express';
import { isDatabaseConnected } from './db/connect';
import { auditRouter } from './modules/audit/audit.routes';
import { authRouter } from './modules/auth/auth.routes';
import { examsRouter } from './modules/exams/exams.routes';
import { subjectsRouter, subTopicsRouter, topicsRouter } from './modules/exams/hierarchy.routes';
import { practiceRouter } from './modules/practice/practice.routes';
import { questionsRouter } from './modules/questions/questions.routes';
import { studentsRouter } from './modules/students/students.routes';
import { usersRouter } from './modules/users/users.routes';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  const database = isDatabaseConnected();
  res.status(database ? 200 : 503).json({ data: { status: database ? 'ok' : 'degraded', database } });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/students', studentsRouter);
apiRouter.use('/exams', examsRouter);
apiRouter.use('/subjects', subjectsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/sub-topics', subTopicsRouter);
apiRouter.use('/questions', questionsRouter);
apiRouter.use('/practice', practiceRouter);
apiRouter.use('/audit-logs', auditRouter);
