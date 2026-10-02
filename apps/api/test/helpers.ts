import type { Role } from '@arivuvazhi/shared';
import request from 'supertest';
import { createApp } from '../src/app';
import { hashPassword } from '../src/modules/auth/auth.service';
import { ExamModel } from '../src/modules/exams/exam.model';
import { SubjectModel, TopicModel } from '../src/modules/exams/hierarchy.models';
import { QuestionModel } from '../src/modules/questions/question.model';
import { UserModel } from '../src/modules/users/user.model';

export const app = createApp();
export const api = () => request(app);

export const PASSWORD = 'Password@123';

let counter = 0;

export async function createUser(role: Role = 'student') {
  counter += 1;
  const email = `${role}${counter}@test.local`;
  const user = await UserModel.create({
    name: `${role} ${counter}`,
    email,
    role,
    passwordHash: await hashPassword(PASSWORD),
  });
  const res = await api().post('/api/v1/auth/login').send({ email, password: PASSWORD }).expect(200);
  return { user, token: res.body.data.accessToken as string, refreshToken: res.body.data.refreshToken as string };
}

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

export async function seedHierarchy() {
  const exam = await ExamModel.create({
    code: 'TEST_EXAM',
    name: { en: 'Test Exam', ta: 'சோதனைத் தேர்வு' },
    status: 'active',
    rules: { durationMinutes: 60, totalQuestions: 10, totalMarks: 20, marksPerQuestion: 2, negativeMarkPerWrong: 0.5 },
  });
  const subject = await SubjectModel.create({ examId: exam._id, code: 'SCIENCE', name: { en: 'Science', ta: 'அறிவியல்' } });
  const topic = await TopicModel.create({
    examId: exam._id,
    subjectId: subject._id,
    code: 'PHYSICS',
    name: { en: 'Physics', ta: 'இயற்பியல்' },
  });
  return { exam, subject, topic };
}

export function questionPayload(ids: { examId: string; subjectId: string; topicId: string }, n = 1) {
  return {
    ...ids,
    text: { en: `Sample question ${n}?`, ta: `மாதிரி கேள்வி ${n}?` },
    options: (['A', 'B', 'C', 'D'] as const).map((key) => ({ key, text: { en: `Option ${key}`, ta: `விடை ${key}` } })),
    correctOption: 'B',
    explanation: { en: 'Because B.', ta: 'B என்பதால்.' },
    difficulty: 'easy',
  };
}

export async function seedPublishedQuestions(ids: { examId: string; subjectId: string; topicId: string }, count: number) {
  return QuestionModel.insertMany(
    Array.from({ length: count }, (_, i) => ({
      ...questionPayload(ids, i + 1),
      languages: ['en', 'ta'],
      status: 'published',
    })),
  );
}
