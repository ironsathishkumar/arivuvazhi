import cors from 'cors';
import express, { type Express } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { env, isTest } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestContext } from './middleware/requestContext';
import { apiRouter } from './routes';

const rateLimitError = { error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } };

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.TRUST_PROXY);

  app.use(requestContext);
  app.use(helmet());
  app.use(
    cors({
      // Mobile apps send no Origin header; browsers (admin portal) must be on the allow-list.
      origin: (origin, callback) => callback(null, !origin || env.CORS_ORIGINS.includes(origin)),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: () => isTest,
    message: rateLimitError,
  });
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: () => isTest,
    message: rateLimitError,
  });

  app.use('/api/v1', globalLimiter);
  app.use(['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh'], authLimiter);
  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
