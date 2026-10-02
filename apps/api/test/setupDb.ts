import os from 'node:os';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer | undefined;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  // The driver otherwise loads `os` via dynamic import(), which Jest's CommonJS sandbox
  // rejects; the driver swallows that and sends an empty handshake the server refuses.
  await mongoose.connect(mongod.getUri(), { runtimeAdapters: { os } });
  await Promise.all(Object.values(mongoose.models).map((m) => m.init()));
});

afterEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod?.stop();
});
