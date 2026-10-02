import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { isProduction } from '../config/env';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';

interface ErrorBody {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
}

function toErrorResponse(err: unknown): { status: number; body: ErrorBody } {
  if (err instanceof AppError) {
    return { status: err.status, body: { code: err.code, message: err.message, details: err.details } };
  }
  if (err instanceof ZodError) {
    return {
      status: 400,
      body: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      },
    };
  }
  if (err instanceof mongoose.Error.CastError) {
    return { status: 400, body: { code: 'INVALID_ID', message: `Invalid value for ${err.path}` } };
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return {
      status: 400,
      body: {
        code: 'VALIDATION_ERROR',
        message: 'Data validation failed',
        details: Object.values(err.errors).map((e) => ({ path: e.path, message: e.message })),
      },
    };
  }
  if (typeof err === 'object' && err !== null) {
    const e = err as { code?: unknown; type?: unknown; keyValue?: unknown };
    if (e.code === 11000) {
      return { status: 409, body: { code: 'DUPLICATE', message: 'A record with these values already exists', details: e.keyValue } };
    }
    if (e.type === 'entity.parse.failed') {
      return { status: 400, body: { code: 'INVALID_JSON', message: 'Request body is not valid JSON' } };
    }
    if (e.type === 'entity.too.large') {
      return { status: 413, body: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large' } };
    }
  }
  return { status: 500, body: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } };
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, 'ROUTE_NOT_FOUND', `Route ${req.method} ${req.path} not found`));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const { status, body } = toErrorResponse(err);
  if (status >= 500) {
    logger.error('Unhandled error', { requestId: req.requestId, err });
    if (!isProduction && err instanceof Error) body.details = err.stack;
  }
  body.requestId = req.requestId;
  res.status(status).json({ error: body });
};
