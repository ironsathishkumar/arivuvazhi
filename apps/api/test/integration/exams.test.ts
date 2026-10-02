import { api, bearer, createUser, seedHierarchy } from '../helpers';

const examBody = {
  code: 'TNPSC_GROUP_4',
  name: { en: 'TNPSC Group 4', ta: 'டிஎன்பிஎஸ்சி குரூப் 4' },
  rules: {
    durationMinutes: 180,
    totalQuestions: 200,
    totalMarks: 300,
    marksPerQuestion: 1.5,
    sections: [
      { code: 'PART_A', name: { en: 'Part A' }, questionCount: 100, marks: 150, minimumQualifyingPercent: 40 },
      { code: 'PART_B', name: { en: 'Part B' }, questionCount: 100, marks: 150 },
    ],
  },
};

describe('exams and hierarchy', () => {
  it('content managers create exams; students cannot', async () => {
    const cm = await createUser('content_manager');
    const student = await createUser('student');

    await api().post('/api/v1/exams').set(bearer(student.token)).send(examBody).expect(403);
    const res = await api().post('/api/v1/exams').set(bearer(cm.token)).send(examBody).expect(201);
    expect(res.body.data).toMatchObject({ code: 'TNPSC_GROUP_4', status: 'draft', rulesVersion: 1 });
    expect(res.body.data.rules.negativeMarkPerWrong).toBe(0);
  });

  it('students only see active exams', async () => {
    const cm = await createUser('content_manager');
    const student = await createUser('student');
    const created = await api().post('/api/v1/exams').set(bearer(cm.token)).send(examBody).expect(201);
    const id = created.body.data.id;

    expect((await api().get('/api/v1/exams').set(bearer(student.token)).expect(200)).body.data).toHaveLength(0);
    await api().get(`/api/v1/exams/${id}`).set(bearer(student.token)).expect(404);

    await api().patch(`/api/v1/exams/${id}`).set(bearer(cm.token)).send({ status: 'active' }).expect(200);
    expect((await api().get('/api/v1/exams').set(bearer(student.token)).expect(200)).body.data).toHaveLength(1);
  });

  it('bumps rulesVersion only when rules change, and partial updates keep other fields', async () => {
    const cm = await createUser('content_manager');
    const created = await api().post('/api/v1/exams').set(bearer(cm.token)).send({ ...examBody, status: 'active' }).expect(201);
    const id = created.body.data.id;

    const renamed = await api()
      .patch(`/api/v1/exams/${id}`)
      .set(bearer(cm.token))
      .send({ name: { en: 'Group 4', ta: 'குரூப் 4' } })
      .expect(200);
    expect(renamed.body.data).toMatchObject({ rulesVersion: 1, status: 'active' });

    const updated = await api()
      .patch(`/api/v1/exams/${id}`)
      .set(bearer(cm.token))
      .send({ rules: { ...examBody.rules, durationMinutes: 200 } })
      .expect(200);
    expect(updated.body.data.rulesVersion).toBe(2);
    expect(updated.body.data.rules.durationMinutes).toBe(200);
  });

  it('rejects rules whose sections do not add up', async () => {
    const cm = await createUser('content_manager');
    const bad = { ...examBody, rules: { ...examBody.rules, totalQuestions: 150 } };
    const res = await api().post('/api/v1/exams').set(bearer(cm.token)).send(bad).expect(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('builds subject → topic → sub-topic and returns the tree', async () => {
    const cm = await createUser('content_manager');
    const exam = await api().post('/api/v1/exams').set(bearer(cm.token)).send({ ...examBody, status: 'active' }).expect(201);
    const examId = exam.body.data.id;

    const subject = await api()
      .post('/api/v1/subjects')
      .set(bearer(cm.token))
      .send({ examId, code: 'INDIAN_POLITY', name: { en: 'Indian Polity', ta: 'இந்திய ஆட்சியியல்' }, sectionCode: 'PART_B' })
      .expect(201);
    const topic = await api()
      .post('/api/v1/topics')
      .set(bearer(cm.token))
      .send({ subjectId: subject.body.data.id, code: 'CONSTITUTION', name: { en: 'Constitution' } })
      .expect(201);
    expect(topic.body.data.examId).toBe(examId);

    const subTopic = await api()
      .post('/api/v1/sub-topics')
      .set(bearer(cm.token))
      .send({ topicId: topic.body.data.id, code: 'PREAMBLE', name: { en: 'Preamble' } })
      .expect(201);
    expect(subTopic.body.data).toMatchObject({ examId, subjectId: subject.body.data.id });

    const dup = await api()
      .post('/api/v1/topics')
      .set(bearer(cm.token))
      .send({ subjectId: subject.body.data.id, code: 'CONSTITUTION', name: { en: 'Again' } })
      .expect(409);
    expect(dup.body.error.code).toBe('DUPLICATE');

    const student = await createUser('student');
    const tree = await api().get(`/api/v1/exams/${examId}/tree`).set(bearer(student.token)).expect(200);
    expect(tree.body.data.subjects[0].topics[0].subTopics[0].code).toBe('PREAMBLE');
  });

  it('hides inactive hierarchy nodes from students', async () => {
    const { exam, subject } = await seedHierarchy();
    const cm = await createUser('content_manager');
    const student = await createUser('student');

    await api().patch(`/api/v1/subjects/${subject.id}`).set(bearer(cm.token)).send({ isActive: false }).expect(200);
    const forStudent = await api().get('/api/v1/subjects').query({ examId: exam.id }).set(bearer(student.token)).expect(200);
    const forStaff = await api().get('/api/v1/subjects').query({ examId: exam.id }).set(bearer(cm.token)).expect(200);
    expect(forStudent.body.data).toHaveLength(0);
    expect(forStaff.body.data).toHaveLength(1);
  });

  it('returns 404 for a missing parent and 400 for a malformed id', async () => {
    const cm = await createUser('content_manager');
    await api()
      .post('/api/v1/subjects')
      .set(bearer(cm.token))
      .send({ examId: 'f'.repeat(24), code: 'X_SUBJECT', name: { en: 'X' } })
      .expect(404);
    await api().get('/api/v1/exams/not-an-id').set(bearer(cm.token)).expect(400);
  });
});
