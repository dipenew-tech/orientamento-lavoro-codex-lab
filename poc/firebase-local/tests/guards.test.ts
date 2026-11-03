import test from 'node:test';
import assert from 'node:assert/strict';
import { assertLocalEnvironment, localEnvironment, PROJECT_ID } from '../scripts/safety.mjs';

test('requires opt-in and both exact loopback emulator endpoints', () => {
  assert.throws(() => assertLocalEnvironment({}));
  const valid = localEnvironment({}); assert.doesNotThrow(() => assertLocalEnvironment(valid));
  for (const key of ['FIRESTORE_EMULATOR_HOST', 'FIREBASE_AUTH_EMULATOR_HOST', 'CARITAS_POC_LOCAL']) {
    const invalid = { ...valid }; delete invalid[key as keyof typeof invalid];
    assert.throws(() => assertLocalEnvironment(invalid));
  }
});
test('rejects real projects, remote endpoints and Cloud credentials', () => {
  for (const pair of [
    ['GOOGLE_CLOUD_PROJECT', 'real-project'], ['GCLOUD_PROJECT', 'real-project'],
    ['FIRESTORE_EMULATOR_HOST', 'firestore.googleapis.com:443'],
    ['FIREBASE_AUTH_EMULATOR_HOST', '10.0.0.1:9099'],
    ['GOOGLE_APPLICATION_CREDENTIALS', '/tmp/credentials.json'],
    ['FIREBASE_CONFIG', '{}'], ['FIREBASE_TOKEN', 'forbidden']
  ]) assert.throws(() => localEnvironment({ [pair[0]]: pair[1] }));
  assert.equal(localEnvironment({}).GOOGLE_CLOUD_PROJECT, PROJECT_ID);
});
