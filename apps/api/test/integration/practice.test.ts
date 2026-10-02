import { ExamModel } from '../../src/modules/exams/exam.model';
import { QuestionModel } from '../../src/modules/questions/question.model';
import { api, bearer, createUser, seedHierarchy, seedPublishedQuestions } from '../helpers';

async function setup(questionCount = 5) {
  const { exam, subject, topic } = await seedHierarchy();
  const ids = { examId: exam.id as string, subjectId: subject.id as string, topicId: topic.id as string };
  await seedPublishedQuestions(ids, questionCount);
  const student = await createUser('student');
  return { ids, student, exam };
}

describe('practice sessions', () => {
  it('starts a session in the chosen language without leaking answers', async () => {
    const { ids, student } = await setup();
    const res = await api()
      .post('/api/v1/practice/sessions')
      .set(bearer(student.token))
      .send({ examId: ids.examId, language: 'ta', count: 3 })
      .expect(201);

    const session = res.body.data;
    expect(session.items).toHaveLength(3);
    expect(session.rules).toEqual({ marksPerQuestion: 2, negativeMarkPerWrong: 0.5, rulesVersion: 1 });
    for (const item of session.items) {
      expect(item.text).toMatch(/^மாதிரி கேள்வி/);
      expect(item.options).toHaveLength(4);
      expect(item.correctOption).toBeUndefined();
      expect(item.explanation).toBeUndefined();
    }
  });

  it('only uses published questions available in the requested language', async () => {
    const { ids, student } = await setup(0);
    await QuestionModel.create({
      ...ids,
      text: { en: 'English only?' },
      options: [
        { key: 'A', text: { en: 'a' } },
        { key: 'B', text: { en: 'b' } },
      ],
      correctOption: 'A',
      languages: ['en'],
      status: 'published',
    });
    await api()
      .post('/api/v1/practice/sessions')
      .set(bearer(student.token))
      .send({ examId: ids.examId, language: 'ta' })
      .expect(404);
    const en = await api()
      .post('/api/v1/practice/sessions')
      .set(bearer(student.token))
      .send({ examId: ids.examId, language: 'en' })
      .expect(201);
    expect(en.body.data.items).toHaveLength(1);
  });

  it('gives immediate feedback, prevents double answers, and scores deterministically', async () => {
    const { ids, student } = await setup(4);
    const start = await api()
      .post('/api/v1/practice/sessions')
      .set(bearer(student.token))
      .send({ examId: ids.examId, topicId: ids.topicId, language: 'en', count: 4 })
      .expect(201);
    const sessionId = start.body.data.id;
    const [q1, q2, q3] = start.body.data.items.map((i: { questionId: string }) => i.questionId);
    const answer = (questionId: string, selectedOption: string | null) =>
      api()
        .post(`/api/v1/practice/sessions/${sessionId}/answers`)
        .set(bearer(student.token))
        .send({ questionId, selectedOption, timeTakenMs: 5000 });

    const correct = await answer(q1, 'B').expect(200);
    expect(correct.body.data).toMatchObject({ isCorrect: true, correctOption: 'B', explanation: 'Because B.' });

    const wrong = await answer(q2, 'A').expect(200);
    expect(wrong.body.data.isCorrect).toBe(false);

    const skipped = await answer(q3, null).expect(200);
    expect(skipped.body.data.isCorrect).toBeNull();

    const again = await answer(q1, 'C').expect(409);
    expect(again.body.error.code).toBe('ALREADY_ANSWERED');

    // 4th question left unanswered: counted as skipped. 1 correct × 2 − 1 wrong × 0.5 = 1.5
    const done = await api().post(`/api/v1/practice/sessions/${sessionId}/complete`).set(bearer(student.token)).expect(200);
    expect(done.body.data.status).toBe('completed');
    expect(done.body.data.summary).toEqual({
      total: 4,
      attempted: 2,
      correct: 1,
      wrong: 1,
      skipped: 2,
      accuracy: 50,
      score: 1.5,
      maxScore: 8,
    });

    const answered = done.body.data.items.find((i: { questionId: string }) => i.questionId === q1);
    expect(answered).toMatchObject({ answered: true, correctOption: 'B', selectedOption: 'B' });

    const late = await answer(start.body.data.items[3].questionId, 'B').expect(409);
    expect(late.body.error.code).toBe('SESSION_COMPLETED');

    const stats = await QuestionModel.findById(q1).lean();
    expect(stats?.stats).toMatchObject({ attempts: 1, correct: 1, totalTimeMs: 5000 });
  });

  it('only one of two concurrent answers for the same question succeeds', async () => {
    const { ids, student } = await setup(1);
    const start = await api()
      .post('/api/v1/practice/sessions')
      .set(bearer(student.token))
      .send({ examId: ids.examId, language: 'en', count: 1 })
      .expect(201);
    const sessionId = start.body.data.id;
    const questionId = start.body.data.items[0].questionId;

    const results = await Promise.all(
      ['A', 'B', 'C'].map((opt) =>
        api()
          .post(`/api/v1/practice/sessions/${sessionId}/answers`)
          .set(bearer(student.token))
          .send({ questionId, selectedOption: opt }),
      ),
    );
    expect(results.filter((r) => r.status === 200)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409)).toHaveLength(2);

    const stats = await QuestionModel.findById(questionId).lean();
    expect(stats?.stats.attempts).toBe(1);
  });

  it('keeps the rules snapshot when the exam rules change later', async () => {
    const { ids, student, exam } = await setup(1);
    const start = await api()
      .post('/api/v1/practice/sessions')
      .set(bearer(student.token))
      .send({ examId: ids.examId, language: 'en', count: 1 })
      .expect(201);
    await ExamModel.updateOne({ _id: exam._id }, { 'rules.marksPerQuestion': 10, rulesVersion: 2 });

    const { questionId } = start.body.data.items[0];
    await api()
      .post(`/api/v1/practice/sessions/${start.body.data.id}/answers`)
      .set(bearer(student.token))
      .send({ questionId, selectedOption: 'B' })
      .expect(200);
    const done = await api()
      .post(`/api/v1/practice/sessions/${start.body.data.id}/complete`)
      .set(bearer(student.token))
      .expect(200);
    expect(done.body.data.summary.score).toBe(2);
  });

  it('students cannot see each other’s sessions', async () => {
    const { ids, student } = await setup(1);
    const other = await createUser('student');
    const start = await api()
      .post('/api/v1/practice/sessions')
      .set(bearer(student.token))
      .send({ examId: ids.examId, language: 'en' })
      .expect(201);

    await api().get(`/api/v1/practice/sessions/${start.body.data.id}`).set(bearer(other.token)).expect(404);
    const mine = await api().get('/api/v1/practice/sessions').set(bearer(other.token)).expect(200);
    expect(mine.body.data).toHaveLength(0);
  });

  it('rejects practice on exams that are not active', async () => {
    const { ids, student, exam } = await setup(1);
    await ExamModel.updateOne({ _id: exam._id }, { status: 'draft' });
    await api()
      .post('/api/v1/practice/sessions')
      .set(bearer(student.token))
      .send({ examId: ids.examId, language: 'en' })
      .expect(404);
  });
});

describe('student profile', () => {
  it('sets target exam, date and study availability', async () => {
    const { ids, student } = await setup(0);
    const targetDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    const res = await api()
      .patch('/api/v1/students/me/profile')
      .set(bearer(student.token))
      .send({ targetExamId: ids.examId, targetDate, dailyStudyMinutes: 120, preferredLanguage: 'ta' })
      .expect(200);
    expect(res.body.data).toMatchObject({
      preferredLanguage: 'ta',
      studentProfile: { targetExamId: ids.examId, dailyStudyMinutes: 120 },
    });

    await api()
      .patch('/api/v1/students/me/profile')
      .set(bearer(student.token))
      .send({ targetDate: '2000-01-01' })
      .expect(400);
  });
});
