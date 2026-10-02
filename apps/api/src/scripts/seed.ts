import { createExamSchema } from '@arivuvazhi/shared';
import { env } from '../config/env';
import { connectDatabase, disconnectDatabase } from '../db/connect';
import { logger } from '../lib/logger';
import { hashPassword } from '../modules/auth/auth.service';
import { ExamModel } from '../modules/exams/exam.model';
import { SubjectModel, TopicModel } from '../modules/exams/hierarchy.models';
import { QuestionModel } from '../modules/questions/question.model';
import { availableLanguages } from '../modules/questions/questions.service';
import { UserModel } from '../modules/users/user.model';
import { tnpscGroup4Exam, tnpscGroup4SampleQuestions, tnpscGroup4Subjects } from './seedData/tnpscGroup4';

const SEED_TAG_PREFIX = 'seed:tnpsc-g4:';

async function seedSuperAdmin() {
  const { SEED_SUPER_ADMIN_EMAIL: email, SEED_SUPER_ADMIN_PASSWORD: password } = env;
  if (!email || !password) {
    logger.warn('SEED_SUPER_ADMIN_EMAIL / SEED_SUPER_ADMIN_PASSWORD not set; skipping super admin');
    return undefined;
  }
  const existing = await UserModel.findOne({ email: email.toLowerCase() });
  if (existing) {
    logger.info(`Super admin already exists: ${existing.email}`);
    return existing;
  }
  const admin = await UserModel.create({
    name: 'Super Admin',
    email,
    role: 'super_admin',
    passwordHash: await hashPassword(password),
  });
  logger.info(`Created super admin: ${admin.email}`);
  return admin;
}

async function seedTnpscGroup4(adminId?: string) {
  const examInput = createExamSchema.parse(tnpscGroup4Exam);
  const exam = await ExamModel.findOneAndUpdate(
    { code: examInput.code },
    { $setOnInsert: { ...examInput, createdBy: adminId, updatedBy: adminId } },
    { upsert: true, returnDocument: 'after' },
  );

  const topicIds = new Map<string, { subjectId: string; topicId: string }>();
  for (const [order, s] of tnpscGroup4Subjects.entries()) {
    const subject = await SubjectModel.findOneAndUpdate(
      { examId: exam._id, code: s.code },
      { $setOnInsert: { name: s.name, sectionCode: s.sectionCode, order } },
      { upsert: true, returnDocument: 'after' },
    );
    for (const [topicOrder, t] of s.topics.entries()) {
      const topic = await TopicModel.findOneAndUpdate(
        { subjectId: subject._id, code: t.code },
        { $setOnInsert: { examId: exam._id, name: t.name, order: topicOrder } },
        { upsert: true, returnDocument: 'after' },
      );
      topicIds.set(`${s.code}/${t.code}`, { subjectId: subject.id, topicId: topic.id });
    }
  }

  let created = 0;
  for (const q of tnpscGroup4SampleQuestions) {
    const tag = `${SEED_TAG_PREFIX}${q.key}`;
    if (await QuestionModel.exists({ tags: tag })) continue;

    const ids = topicIds.get(`${q.subjectCode}/${q.topicCode}`);
    if (!ids) throw new Error(`Seed question ${q.key} references unknown topic ${q.subjectCode}/${q.topicCode}`);
    const options = q.options.map(([key, text]) => ({ key, text }));

    await QuestionModel.create({
      examId: exam._id,
      ...ids,
      text: q.text,
      options,
      correctOption: q.correctOption,
      explanation: q.explanation,
      difficulty: q.difficulty,
      languages: availableLanguages({ text: q.text, options }),
      source: { type: 'admin', reference: 'Seed sample — replace with verified content' },
      tags: [tag],
      status: 'published',
      createdBy: adminId,
      updatedBy: adminId,
    });
    created++;
  }

  logger.info(
    `TNPSC Group 4: exam ${exam.id}, ${tnpscGroup4Subjects.length} subjects, ${topicIds.size} topics, ${created} new sample questions`,
  );
}

async function main() {
  await connectDatabase();
  const admin = await seedSuperAdmin();
  await seedTnpscGroup4(admin?.id);
  await disconnectDatabase();
}

main().catch(async (err) => {
  logger.error('Seed failed', { err });
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
