import { studentProfileSchema } from '@arivuvazhi/shared';
import { Router } from 'express';
import { Types } from 'mongoose';
import { badRequest, notFound } from '../../lib/errors';
import { authenticate, requireAuth, requirePermission } from '../../middleware/auth';
import { ExamModel } from '../exams/exam.model';
import { UserModel } from '../users/user.model';

export const studentsRouter = Router();
studentsRouter.use(authenticate, requirePermission('practice:use'));

studentsRouter.patch('/me/profile', async (req, res) => {
  const { userId } = requireAuth(req);
  const input = studentProfileSchema.parse(req.body);

  if (input.targetExamId && !(await ExamModel.exists({ _id: input.targetExamId, status: 'active' }))) {
    throw badRequest('EXAM_NOT_AVAILABLE', 'The selected exam is not available');
  }
  if (input.targetDate && input.targetDate.getTime() < Date.now()) {
    throw badRequest('INVALID_TARGET_DATE', 'Target date must be in the future');
  }

  const user = await UserModel.findById(userId);
  if (!user) throw notFound('User');

  const profile = user.studentProfile ?? {};
  if (input.targetExamId) profile.targetExamId = new Types.ObjectId(input.targetExamId);
  if (input.targetDate) profile.targetDate = input.targetDate;
  if (input.dailyStudyMinutes !== undefined) profile.dailyStudyMinutes = input.dailyStudyMinutes;
  user.studentProfile = profile;
  if (input.preferredLanguage) user.preferredLanguage = input.preferredLanguage;
  await user.save();

  res.json({ data: user });
});
