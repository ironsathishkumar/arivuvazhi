import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './db/connect';
import { logger } from './lib/logger';

async function main() {
  await connectDatabase();
  const server = createApp().listen(env.PORT, () => {
    logger.info(`ArivuVazhi API listening on http://localhost:${env.PORT}/api/v1`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  logger.error('Failed to start API', { err });
  process.exit(1);
});
