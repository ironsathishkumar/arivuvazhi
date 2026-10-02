import type { Role } from '@arivuvazhi/shared';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      auth?: { userId: string; role: Role };
    }
  }
}

export {};
