/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.ts$': ['@swc/jest', { jsc: { parser: { syntax: 'typescript' }, target: 'es2022' } }],
  },
  setupFiles: ['<rootDir>/test/setupEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setupDb.ts'],
  testTimeout: 60000,
};
