import { createExamSchema, EXAM_STATUSES, idParamSchema, updateExamSchema } from '@arivuvazhi/shared';
import { Router, type Request } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { notFound } from '../../lib/errors';
import { authenticate, can, requireAuth, requirePermission } from '../../middleware/auth';
import { recordAudit } from '../audit/audit';
import { ExamModel } from './exam.model';
import { SubjectModel, SubTopicModel, TopicModel } from './hierarchy.models';

const listExamsQuerySchema = z.object({ status: z.enum(EXAM_STATUSES).optional() });

/** Students only ever see active exams and active hierarchy nodes. */
function visibilityFilter(req: Request): Record<string, unknown> {
  return can(req, 'exams:write') ? {} : { status: 'active' };
}

async function findVisibleExam(req: Request, id: string) {
  const exam = await ExamModel.findOne({ _id: id, ...visibilityFilter(req) });
  if (!exam) throw notFound('Exam');
  return exam;
}

export const examsRouter = Router();
examsRouter.use(authenticate, requirePermission('exams:read'));

examsRouter.get('/', async (req, res) => {
  const { status } = listExamsQuerySchema.parse(req.query);
  const filter = { ...(status ? { status } : {}), ...visibilityFilter(req) };
  res.json({ data: await ExamModel.find(filter).sort({ code: 1 }) });
});

examsRouter.get('/:id', async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  res.json({ data: await findVisibleExam(req, id) });
});

examsRouter.get('/:id/tree', async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const exam = await findVisibleExam(req, id);
  const nodeFilter = can(req, 'exams:write') ? { examId: exam._id } : { examId: exam._id, isActive: true };
  const sort = { order: 1, code: 1 } as const;

  const [subjects, topics, subTopics] = await Promise.all([
    SubjectModel.find(nodeFilter).sort(sort),
    TopicModel.find(nodeFilter).sort(sort),
    SubTopicModel.find(nodeFilter).sort(sort),
  ]);

  const tree = subjects.map((subject) => ({
    ...subject.toJSON(),
    topics: topics
      .filter((t) => t.subjectId.equals(subject._id))
      .map((topic) => ({
        ...topic.toJSON(),
        subTopics: subTopics.filter((st) => st.topicId.equals(topic._id)).map((st) => st.toJSON()),
      })),
  }));

  res.json({ data: { exam, subjects: tree } });
});

examsRouter.post('/', requirePermission('exams:write'), async (req, res) => {
  const { userId } = requireAuth(req);
  const input = createExamSchema.parse(req.body);
  const exam = await ExamModel.create({ ...input, createdBy: userId, updatedBy: userId });
  await recordAudit(req, { action: 'exam.create', entityType: 'Exam', entityId: exam._id, meta: { code: exam.code } });
  res.status(201).json({ data: exam });
});

examsRouter.patch('/:id', requirePermission('exams:write'), async (req, res) => {
  const { userId } = requireAuth(req);
  const { id } = idParamSchema.parse(req.params);
  const input = updateExamSchema.parse(req.body);

  const exam = await ExamModel.findById(id);
  if (!exam) throw notFound('Exam');

  if (input.name) exam.name = input.name;
  if (input.description) exam.description = input.description;
  if (input.languages) exam.languages = input.languages;
  if (input.status) exam.status = input.status;
  if (input.rules) {
    exam.set('rules', input.rules);
    exam.rulesVersion += 1;
  }
  exam.updatedBy = new Types.ObjectId(userId);
  await exam.save();

  await recordAudit(req, {
    action: 'exam.update',
    entityType: 'Exam',
    entityId: exam._id,
    meta: { fields: Object.keys(input), rulesVersion: exam.rulesVersion },
  });
  res.json({ data: exam });
});
