export const PROJECT_ID = 'demo-caritas-local';
export const AUTH_HOST = '127.0.0.1:9099';
export const FIRESTORE_HOST = '127.0.0.1:8080';

/** Exact allowlist: no ADC lookup, real project IDs or remote emulator hosts. */
export function assertLocalEnvironment(env = process.env) {
  if (env.CARITAS_POC_LOCAL !== '1') throw new Error('Local PoC opt-in missing');
  for (const key of ['GOOGLE_CLOUD_PROJECT', 'GCLOUD_PROJECT']) {
    if (env[key] !== PROJECT_ID) throw new Error(`Unsafe ${key}: only ${PROJECT_ID} allowed`);
  }
  if (env.FIREBASE_AUTH_EMULATOR_HOST !== AUTH_HOST || env.FIRESTORE_EMULATOR_HOST !== FIRESTORE_HOST) {
    throw new Error('Both emulators must use the fixed loopback endpoints');
  }
  for (const key of ['GOOGLE_APPLICATION_CREDENTIALS', 'FIREBASE_TOKEN']) {
    if (env[key]) throw new Error(`Remove ${key}; Cloud credentials/config are forbidden`);
  }
  if (env.FIREBASE_CONFIG) {
    const config = JSON.parse(env.FIREBASE_CONFIG);
    if (Object.keys(config).length !== 1 || config.projectId !== PROJECT_ID) throw new Error('Only the inert demo FIREBASE_CONFIG is allowed');
  }
}

export function localEnvironment(base = process.env) {
  // Never silently overwrite a potentially real project/host supplied by a user.
  for (const [key, expected] of Object.entries({ GOOGLE_CLOUD_PROJECT: PROJECT_ID,
    GCLOUD_PROJECT: PROJECT_ID, FIREBASE_AUTH_EMULATOR_HOST: AUTH_HOST,
    FIRESTORE_EMULATOR_HOST: FIRESTORE_HOST })) {
    if (base[key] && base[key] !== expected) throw new Error(`Refusing inherited ${key}`);
  }
  const env = { ...base, CARITAS_POC_LOCAL: '1', GOOGLE_CLOUD_PROJECT: PROJECT_ID,
    GCLOUD_PROJECT: PROJECT_ID, FIREBASE_AUTH_EMULATOR_HOST: AUTH_HOST,
    FIRESTORE_EMULATOR_HOST: FIRESTORE_HOST, FIREBASE_CLI_DISABLE_UPDATE_CHECK: 'true',
    FIREBASE_CLI_TELEMETRY_DISABLED: '1', CI: 'true' };
  assertLocalEnvironment(env);
  // CLI otherwise injects an unused databaseURL/storageBucket. Provide only demo ID.
  env.FIREBASE_CONFIG = JSON.stringify({ projectId: PROJECT_ID });
  return env;
}
