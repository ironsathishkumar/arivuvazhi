import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { logger } from '../lib/logger';

const REQUEST_ID_PATTERN = /^[\w-]{8,100}$/;

export const requestContext: RequestHandler = (req, res, next) => {
  const incoming = req.get('x-request-id');
  req.requestId = incoming && REQUEST_ID_PATTERN.test(incoming) ? incoming : randomUUID();
  res.setHeader('X-Request-Id', req.requestId);

  const startedAt = process.hrtime.bigint();
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    logger.http('request', {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Math.round(durationMs),
      userId: req.auth?.userId,
    });
  });
  next();
};
