import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Firestore } from 'firebase-admin/firestore';
import { assertLocalEnvironment, PROJECT_ID } from '../scripts/safety.mjs';

assertLocalEnvironment();
// Explicit inert credential: never discovers credentials or contacts metadata servers.
const app = initializeApp({ projectId: PROJECT_ID, credential: {
  getAccessToken: async () => ({ access_token: 'local-emulator-only', expires_in: 3600 })
} }, 'caritas-local-only');
export const auth = getAuth(app);
// Direct server client avoids Admin SDK credential discovery; insecure transport
// is restricted to the exact loopback emulator by the guard above.
export const db = new Firestore({ projectId: PROJECT_ID, host: process.env.FIRESTORE_EMULATOR_HOST, ssl: false });
