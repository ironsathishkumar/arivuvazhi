import {
  createSubjectSchema,
  createSubTopicSchema,
  createTopicSchema,
  idParamSchema,
  objectIdSchema,
  updateHierarchyNodeSchema,
} from '@arivuvazhi/shared';
import { Router } from 'express';
import type { Model, Types } from 'mongoose';
import { z } from 'zod';
import { notFound } from '../../lib/errors';
import { authenticate, can, requirePermission } from '../../middleware/auth';
import { recordAudit } from '../audit/audit';
import { ExamModel } from './exam.model';
import { SubjectModel, SubTopicModel, TopicModel } from './hierarchy.models';

type ParentKey = 'examId' | 'subjectId' | 'topicId';
type Ancestors = Partial<Record<ParentKey, Types.ObjectId>>;

interface HierarchyRouteConfig<TInput extends Record<string, unknown>> {
  entity: string;
  // Each node type has its own document interface; the router only relies on the shared node fields.
  model: Model<any>;
  parentKey: ParentKey;
  createSchema: z.ZodType<TInput>;
  /** Loads the parent and returns every ancestor id to denormalise onto the new node. */
  resolveAncestors(parentId: string): Promise<Ancestors>;
}

function hierarchyRouter<TInput extends Record<string, unknown>>(config: HierarchyRouteConfig<TInput>): Router {
  const router = Router();
  const listQuerySchema = z.object({ [config.parentKey]: objectIdSchema });
  router.use(authenticate, requirePermission('exams:read'));

  router.get('/', async (req, res) => {
    const query = listQuerySchema.parse(req.query) as Record<string, string>;
    const filter: Record<string, unknown> = { [config.parentKey]: query[config.parentKey] };
    if (!can(req, 'exams:write')) filter.isActive = true;
    res.json({ data: await config.model.find(filter).sort({ order: 1, code: 1 }) });
  });

  router.post('/', requirePermission('exams:write'), async (req, res) => {
    const input = config.createSchema.parse(req.body);
    const ancestors = await config.resolveAncestors(String(input[config.parentKey]));
    const node = await config.model.create({ ...input, ...ancestors });
    await recordAudit(req, { action: `${config.entity.toLowerCase()}.create`, entityType: config.entity, entityId: node._id });
    res.status(201).json({ data: node });
  });

  router.patch('/:id', requirePermission('exams:write'), async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    const input = updateHierarchyNodeSchema.parse(req.body);
    const node = await config.model.findByIdAndUpdate(id, { $set: input }, { returnDocument: 'after', runValidators: true });
    if (!node) throw notFound(config.entity);
    await recordAudit(req, {
      action: `${config.entity.toLowerCase()}.update`,
      entityType: config.entity,
      entityId: node._id,
      meta: { fields: Object.keys(input) },
    });
    res.json({ data: node });
  });

  return router;
}

export const subjectsRouter = hierarchyRouter({
  entity: 'Subject',
  model: SubjectModel,
  parentKey: 'examId',
  createSchema: createSubjectSchema,
  async resolveAncestors(examId) {
    const exam = await ExamModel.findById(examId).select('_id');
    if (!exam) throw notFound('Exam');
    return { examId: exam._id };
  },
});

export const topicsRouter = hierarchyRouter({
  entity: 'Topic',
  model: TopicModel,
  parentKey: 'subjectId',
  createSchema: createTopicSchema,
  async resolveAncestors(subjectId) {
    const subject = await SubjectModel.findById(subjectId).select('examId');
    if (!subject) throw notFound('Subject');
    return { examId: subject.examId, subjectId: subject._id };
  },
});

export const subTopicsRouter = hierarchyRouter({
  entity: 'SubTopic',
  model: SubTopicModel,
  parentKey: 'topicId',
  createSchema: createSubTopicSchema,
  async resolveAncestors(topicId) {
    const topic = await TopicModel.findById(topicId).select('examId subjectId');
    if (!topic) throw notFound('Topic');
    return { examId: topic.examId, subjectId: topic.subjectId, topicId: topic._id };
  },
});
