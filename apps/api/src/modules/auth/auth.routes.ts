import { loginSchema, refreshTokenSchema, registerSchema } from '@arivuvazhi/shared';
import { Router, type Request } from 'express';
import { notFound } from '../../lib/errors';
import { authenticate, requireAuth } from '../../middleware/auth';
import { UserModel } from '../users/user.model';
import * as authService from './auth.service';

function clientContext(req: Request): authService.ClientContext {
  return { ip: req.ip, userAgent: req.get('user-agent') };
}

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const result = await authService.register(registerSchema.parse(req.body), clientContext(req));
  res.status(201).json({ data: result });
});

authRouter.post('/login', async (req, res) => {
  const result = await authService.login(loginSchema.parse(req.body), clientContext(req));
  res.json({ data: result });
});

authRouter.post('/refresh', async (req, res) => {
  const { refreshToken } = refreshTokenSchema.parse(req.body);
  res.json({ data: await authService.refresh(refreshToken, clientContext(req)) });
});

authRouter.post('/logout', async (req, res) => {
  const { refreshToken } = refreshTokenSchema.parse(req.body);
  await authService.logout(refreshToken);
  res.status(204).end();
});

authRouter.get('/me', authenticate, async (req, res) => {
  const user = await UserModel.findById(requireAuth(req).userId);
  if (!user) throw notFound('User');
  res.json({ data: user });
});
