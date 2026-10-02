import { SubjectModel } from '../../src/modules/exams/hierarchy.models';
import { api, bearer, createUser, questionPayload, seedHierarchy } from '../helpers';

async function setup() {
  const { exam, subject, topic } = await seedHierarchy();
  const ids = { examId: exam.id as string, subjectId: subject.id as string, topicId: topic.id as string };
  const cm = await createUser('content_manager');
  return { ids, cm };
}

describe('question bank', () => {
  it('creates a bilingual draft and derives available languages', async () => {
    const { ids, cm } = await setup();
    const res = await api().post('/api/v1/questions').set(bearer(cm.token)).send(questionPayload(ids)).expect(201);
    expect(res.body.data).toMatchObject({ status: 'draft', version: 1, languages: ['en', 'ta'] });
  });

  it('rejects questions whose topic is not under the given subject', async () => {
    const { ids, cm } = await setup();
    const other = await seedHierarchyOtherSubject(ids.examId);
    const res = await api()
      .post('/api/v1/questions')
      .set(bearer(cm.token))
      .send(questionPayload({ ...ids, subjectId: other }))
      .expect(400);
    expect(res.body.error.code).toBe('INVALID_HIERARCHY');
  });

  it('students cannot read or create questions through the admin API', async () => {
    const { ids } = await setup();
    const student = await createUser('student');
    await api().get('/api/v1/questions').set(bearer(student.token)).expect(403);
    await api().post('/api/v1/questions').set(bearer(student.token)).send(questionPayload(ids)).expect(403);
  });

  it('goes through review: draft → in_review → approved → published, recording history', async () => {
    const { ids, cm } = await setup();
    const created = await api().post('/api/v1/questions').set(bearer(cm.token)).send(questionPayload(ids)).expect(201);
    const id = created.body.data.id;

    for (const status of ['in_review', 'approved', 'published']) {
      await api().post(`/api/v1/questions/${id}/status`).set(bearer(cm.token)).send({ status, note: `to ${status}` }).expect(200);
    }
    const res = await api().get(`/api/v1/questions/${id}`).set(bearer(cm.token)).expect(200);
    expect(res.body.data.status).toBe('published');
    expect(res.body.data.reviewHistory.map((h: { to: string }) => h.to)).toEqual(['in_review', 'approved', 'published']);
  });

  it('blocks invalid transitions', async () => {
    const { ids, cm } = await setup();
    const created = await api().post('/api/v1/questions').set(bearer(cm.token)).send(questionPayload(ids)).expect(201);
    const res = await api()
      .post(`/api/v1/questions/${created.body.data.id}/status`)
      .set(bearer(cm.token))
      .send({ status: 'published' })
      .expect(409);
    expect(res.body.error.code).toBe('INVALID_STATUS_TRANSITION');
  });

  it('edits bump the version, re-validate merged content, and are blocked once published', async () => {
    const { ids, cm } = await setup();
    const created = await api().post('/api/v1/questions').set(bearer(cm.token)).send(questionPayload(ids)).expect(201);
    const id = created.body.data.id;

    const edited = await api()
      .patch(`/api/v1/questions/${id}`)
      .set(bearer(cm.token))
      .send({ correctOption: 'C' })
      .expect(200);
    expect(edited.body.data).toMatchObject({ correctOption: 'C', version: 2 });

    // Removing the option that is currently correct must fail validation of the merged question.
    const badOptions = [
      { key: 'A', text: { en: 'a', ta: 'அ' } },
      { key: 'B', text: { en: 'b', ta: 'ஆ' } },
    ];
    await api().patch(`/api/v1/questions/${id}`).set(bearer(cm.token)).send({ options: badOptions }).expect(400);

    // Dropping Tamil from options leaves the question English-only.
    const englishOptions = ['A', 'B', 'C', 'D'].map((key) => ({ key, text: { en: key } }));
    const enOnly = await api()
      .patch(`/api/v1/questions/${id}`)
      .set(bearer(cm.token))
      .send({ text: { en: 'English only?' }, options: englishOptions })
      .expect(200);
    expect(enOnly.body.data.languages).toEqual(['en']);

    for (const status of ['in_review', 'approved', 'published']) {
      await api().post(`/api/v1/questions/${id}/status`).set(bearer(cm.token)).send({ status }).expect(200);
    }
    const locked = await api().patch(`/api/v1/questions/${id}`).set(bearer(cm.token)).send({ difficulty: 'hard' }).expect(409);
    expect(locked.body.error.code).toBe('QUESTION_NOT_EDITABLE');
  });

  it('filters the list by status and language with pagination', async () => {
    const { ids, cm } = await setup();
    for (let i = 1; i <= 3; i++) {
      await api().post('/api/v1/questions').set(bearer(cm.token)).send(questionPayload(ids, i)).expect(201);
    }
    const res = await api()
      .get('/api/v1/questions')
      .query({ status: 'draft', language: 'ta', limit: 2 })
      .set(bearer(cm.token))
      .expect(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toMatchObject({ total: 3, totalPages: 2 });
  });
});

async function seedHierarchyOtherSubject(examId: string): Promise<string> {
  const subject = await SubjectModel.create({ examId, code: 'OTHER', name: { en: 'Other' } });
  return subject.id;
}
