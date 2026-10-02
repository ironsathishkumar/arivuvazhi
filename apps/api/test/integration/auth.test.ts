import { UserModel } from '../../src/modules/users/user.model';
import { api, bearer, createUser } from '../helpers';

const registration = { name: 'Kavya', email: 'Kavya@Example.com', password: 'StrongPass#1', preferredLanguage: 'ta' };

describe('auth', () => {
  it('registers a student, normalises email and never returns the password hash', async () => {
    const res = await api().post('/api/v1/auth/register').send(registration).expect(201);
    expect(res.body.data.user).toMatchObject({ email: 'kavya@example.com', role: 'student', preferredLanguage: 'ta' });
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(res.body.data.user.id).toBeDefined();
    expect(res.body.data.accessToken).toEqual(expect.any(String));

    const stored = await UserModel.findOne({ email: 'kavya@example.com' }).select('+passwordHash').lean();
    expect(stored?.passwordHash).toMatch(/^\$argon2id\$/);
  });

  it('ignores attempts to self-assign a role on registration', async () => {
    const res = await api()
      .post('/api/v1/auth/register')
      .send({ ...registration, role: 'super_admin' })
      .expect(201);
    expect(res.body.data.user.role).toBe('student');
  });

  it('rejects duplicate emails and weak passwords', async () => {
    await api().post('/api/v1/auth/register').send(registration).expect(201);
    const dup = await api().post('/api/v1/auth/register').send(registration).expect(409);
    expect(dup.body.error.code).toBe('EMAIL_TAKEN');

    const weak = await api()
      .post('/api/v1/auth/register')
      .send({ ...registration, email: 'other@example.com', password: 'short' })
      .expect(400);
    expect(weak.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('logs in and returns the current user from /me', async () => {
    await api().post('/api/v1/auth/register').send(registration).expect(201);
    const login = await api()
      .post('/api/v1/auth/login')
      .send({ email: registration.email, password: registration.password })
      .expect(200);
    const me = await api().get('/api/v1/auth/me').set(bearer(login.body.data.accessToken)).expect(200);
    expect(me.body.data.email).toBe('kavya@example.com');
  });

  it('uses the same error for unknown email and wrong password', async () => {
    await api().post('/api/v1/auth/register').send(registration).expect(201);
    const wrongPw = await api().post('/api/v1/auth/login').send({ email: registration.email, password: 'nope-nope' }).expect(401);
    const unknown = await api().post('/api/v1/auth/login').send({ email: 'ghost@example.com', password: 'nope-nope' }).expect(401);
    expect(wrongPw.body.error.code).toBe('INVALID_CREDENTIALS');
    expect(unknown.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('rejects requests without a valid token', async () => {
    await api().get('/api/v1/auth/me').expect(401);
    const res = await api().get('/api/v1/auth/me').set(bearer('not-a-jwt')).expect(401);
    expect(res.body.error.code).toBe('INVALID_TOKEN');
  });

  it('rotates refresh tokens and revokes the family when an old token is reused', async () => {
    const { refreshToken } = await createUser('student');

    const first = await api().post('/api/v1/auth/refresh').send({ refreshToken }).expect(200);
    const rotated = first.body.data.refreshToken as string;
    expect(rotated).not.toBe(refreshToken);

    const reuse = await api().post('/api/v1/auth/refresh').send({ refreshToken }).expect(401);
    expect(reuse.body.error.code).toBe('TOKEN_REUSED');

    // The legitimately rotated token is revoked too, forcing a fresh login.
    await api().post('/api/v1/auth/refresh').send({ refreshToken: rotated }).expect(401);
  });

  it('logout revokes the refresh token', async () => {
    const { refreshToken } = await createUser('student');
    await api().post('/api/v1/auth/logout').send({ refreshToken }).expect(204);
    await api().post('/api/v1/auth/refresh').send({ refreshToken }).expect(401);
  });

  it('blocks deactivated users immediately, even with an unexpired access token', async () => {
    const { user, token } = await createUser('student');
    await UserModel.updateOne({ _id: user._id }, { isActive: false });
    const res = await api().get('/api/v1/auth/me').set(bearer(token)).expect(401);
    expect(res.body.error.code).toBe('ACCOUNT_INACTIVE');
  });
});

describe('user management', () => {
  it('only super admins can create admin accounts', async () => {
    const admin = await createUser('admin');
    const superAdmin = await createUser('super_admin');
    const body = { name: 'New Admin', email: 'new-admin@test.local', password: 'Password@123', role: 'admin' };

    await api().post('/api/v1/users').set(bearer(admin.token)).send(body).expect(403);
    const res = await api().post('/api/v1/users').set(bearer(superAdmin.token)).send(body).expect(201);
    expect(res.body.data.role).toBe('admin');
  });

  it('admins can create content managers; students cannot manage users', async () => {
    const admin = await createUser('admin');
    const student = await createUser('student');
    const body = { name: 'Content', email: 'cm@test.local', password: 'Password@123', role: 'content_manager' };

    await api().post('/api/v1/users').set(bearer(student.token)).send(body).expect(403);
    await api().post('/api/v1/users').set(bearer(admin.token)).send(body).expect(201);
  });

  it('deactivating a user revokes their sessions and is audited', async () => {
    const superAdmin = await createUser('super_admin');
    const target = await createUser('content_manager');

    await api().patch(`/api/v1/users/${target.user.id}`).set(bearer(superAdmin.token)).send({ isActive: false }).expect(200);
    await api().post('/api/v1/auth/refresh').send({ refreshToken: target.refreshToken }).expect(401);

    const logs = await api().get('/api/v1/audit-logs').query({ action: 'user.update' }).set(bearer(superAdmin.token)).expect(200);
    expect(logs.body.data).toHaveLength(1);
  });

  it('prevents changing your own role', async () => {
    const superAdmin = await createUser('super_admin');
    const res = await api()
      .patch(`/api/v1/users/${superAdmin.user.id}`)
      .set(bearer(superAdmin.token))
      .send({ role: 'student' })
      .expect(400);
    expect(res.body.error.code).toBe('SELF_MODIFICATION');
  });
});
