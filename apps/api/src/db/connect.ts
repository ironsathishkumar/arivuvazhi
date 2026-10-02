import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../lib/logger';

mongoose.set('strictQuery', true);

export async function connectDatabase(uri = env.MONGODB_URI): Promise<void> {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  logger.info('Connected to MongoDB', { host: mongoose.connection.host, db: mongoose.connection.name });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
}
