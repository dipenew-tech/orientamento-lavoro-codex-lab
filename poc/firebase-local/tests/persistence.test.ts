import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createPocApp } from '../server/app.ts';
import { db } from '../server/firebase.ts';
import { signIn } from './helpers.ts';

test('cold restart imports real emulator export: accounts, approved version and audit survive', async () => {
  // Runs in a SECOND Auth + Firestore emulator process, without seeding.
  const token = await signIn('amministratore@example.invalid');
  const server = createPocApp().listen(0, '127.0.0.1'); await once(server, 'listening');
  try {
    const base = `http://127.0.0.1:${(server.address() as { port: number }).port}/api/poc/`;
    const headers = { Authorization: `Bearer ${token}` };
    const response = await fetch(base + 'services', { headers }); assert.equal(response.status, 200);
    const data = await response.json() as any;
    assert.equal(data.services.find((s: any) => s.id === 'demo-alfa').version, 3);
    const history = await (await fetch(base + 'history', { headers })).json() as any;
    assert.equal(history.history.length, 2);
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); await db.terminate(); }
});
