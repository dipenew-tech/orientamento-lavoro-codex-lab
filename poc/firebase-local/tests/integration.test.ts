import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { createPocApp } from '../server/app.ts';
import { auth, db } from '../server/firebase.ts';
import { seed } from '../server/seed.ts';
import { exportArchive, importArchive } from '../server/archive.ts';
import { resetTestFixtures, signIn } from './helpers.ts';

test('real Auth + Firestore emulators, server RBAC and shared state', { timeout: 120_000 }, async t => {
  await resetTestFixtures();
  let server = createPocApp().listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(async () => { await new Promise<void>(resolve => server.close(() => resolve())); await db.terminate(); });
  const url = () => `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  const reader = await signIn('lettore@example.invalid');
  const operatorA = await signIn('operatore@example.invalid');
  const operatorB = await signIn('operatore@example.invalid');
  const admin = await signIn('amministratore@example.invalid');
  async function request(route: string, token?: string, method = 'GET', body?: unknown) {
    const res = await fetch(url() + '/api/poc/' + route, { method, headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json'
    }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: res.status, body: await res.json() as any };
  }
  const proposal = (description: string, baseVersion = 1) => ({ serviceId: 'demo-alfa', baseVersion, patch: { description } });
  let approvedId: string;
  await t.test('missing/invalid/wrong-project/expired tokens are denied', async () => {
    assert.equal((await request('services')).status, 401);
    assert.equal((await request('services', 'invalid')).status, 401);
    const parts = reader.split('.'); const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    const forged = (data: object) => `${parts[0]}.${Buffer.from(JSON.stringify(data)).toString('base64url')}.${parts[2]}`;
    assert.equal((await request('services', forged({ ...payload, aud: 'other-project' }))).status, 401);
    assert.equal((await request('services', forged({ ...payload, exp: 1 }))).status, 401);
  });
  await t.test('valid but unlisted identity is denied', async () => {
    await auth.createUser({ uid: 'demo-outsider', email: 'estraneo@example.invalid', password: 'SoloDemo-2026!' });
    assert.equal((await request('services', await signIn('estraneo@example.invalid'))).status, 403);
  });
  await t.test('reader can read but cannot propose, approve, list members or history', async () => {
    const list = await request('services', reader); assert.equal(list.status, 200);
    assert.equal(list.body.services.length, 3);
    assert.ok(list.body.services.every((s: any) => s.fictional === true));
    assert.equal((await request('proposals', reader, 'POST', proposal('Fittizio'))).status, 403);
    assert.equal((await request('proposals/00000000-0000-0000-0000-000000000000/approve', reader, 'POST')).status, 403);
    assert.equal((await request('memberships', reader)).status, 403);
    assert.equal((await request('history', reader)).status, 403);
  });
  await t.test('direct browser Firestore access is denied by Rules', async () => {
    const res = await fetch('http://127.0.0.1:8080/v1/projects/demo-caritas-local/databases/(default)/documents/services/demo-alfa', {
      headers: { Authorization: `Bearer ${reader}` }
    }); assert.equal(res.status, 403);
  });
  await t.test('server rejects role injection and unauthorized fields', async () => {
    assert.equal((await request('proposals', operatorA, 'POST', { ...proposal('Demo'), role: 'amministratore' })).status, 400);
    assert.equal((await request('proposals', operatorA, 'POST', { ...proposal('Demo'), patch: { version: 999 } })).status, 400);
    assert.equal((await request('memberships/demo-reader', operatorA, 'PATCH', { role: 'amministratore', active: true })).status, 403);
  });
  await t.test('admin-looking token claims cannot override the server membership role', async () => {
    await auth.setCustomUserClaims('demo-reader', { role: 'amministratore' });
    const token = await signIn('lettore@example.invalid');
    assert.equal((await request('me', token)).body.role, 'lettore');
    assert.equal((await request('proposals', token, 'POST', proposal('Ruolo non autorizzato'))).status, 403);
    await auth.setCustomUserClaims('demo-reader', {});
  });
  await t.test('proposal is not published before approval; operator cannot approve', async () => {
    const result = await request('proposals', operatorA, 'POST', proposal('Descrizione fittizia approvata tra due sessioni'));
    assert.equal(result.status, 201); approvedId = result.body.id;
    const list = await request('services', operatorB);
    assert.equal(list.body.services.find((s: any) => s.id === 'demo-alfa').version, 1);
    assert.equal((await request(`proposals/${approvedId}/approve`, operatorA, 'POST')).status, 403);
  });
  await t.test('admin approval is visible to independent sessions A and B and reader', async () => {
    assert.equal((await request(`proposals/${approvedId}/approve`, admin, 'POST')).status, 200);
    for (const token of [operatorA, operatorB, reader]) {
      const row = (await request('services', token)).body.services.find((s: any) => s.id === 'demo-alfa');
      assert.equal(row.version, 2); assert.equal(row.description, 'Descrizione fittizia approvata tra due sessioni');
    }
    const history = await request('history', admin); assert.equal(history.body.history.length, 1);
    assert.equal((await request(`proposals/${approvedId}/approve`, admin, 'POST')).status, 409);
  });
  await t.test('stale proposal is rejected and admin cannot approve own proposal', async () => {
    assert.equal((await request('proposals', operatorA, 'POST', proposal('Versione superata'))).status, 409);
    const own = await request('proposals', admin, 'POST', proposal('Proposta amministratore', 2));
    assert.equal(own.status, 201);
    assert.equal((await request(`proposals/${own.body.id}/approve`, admin, 'POST')).status, 403);
  });
  await t.test('concurrent approvals: exactly one success, one conflict, no lost update', async () => {
    const a = await request('proposals', operatorA, 'POST', proposal('Concorrente A', 2));
    const b = await request('proposals', operatorB, 'POST', proposal('Concorrente B', 2));
    const results = await Promise.all([a, b].map(p => request(`proposals/${p.body.id}/approve`, admin, 'POST')));
    assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
    const row = (await request('services', reader)).body.services.find((s: any) => s.id === 'demo-alfa');
    assert.equal(row.version, 3); assert.ok(['Concorrente A', 'Concorrente B'].includes(row.description));
    assert.equal((await request('history', admin)).body.history.length, 2);
  });
  await t.test('revocation and downgrade affect already-issued tokens immediately; seed does not re-enable', async () => {
    assert.equal((await request('memberships/demo-operator', admin, 'PATCH', { role: 'operatore', active: false })).status, 200);
    await seed();
    assert.equal((await request('services', operatorA)).status, 403);
    assert.equal((await request('services', operatorB)).status, 403);
    assert.equal((await request('memberships/demo-operator', admin, 'PATCH', { role: 'lettore', active: true })).status, 200);
    assert.equal((await request('services', operatorA)).status, 200);
    assert.equal((await request('proposals', operatorA, 'POST', proposal('No', 3))).status, 403);
    await request('memberships/demo-operator', admin, 'PATCH', { role: 'operatore', active: true });
  });
  await t.test('disabled Firebase account is denied with an existing token', async () => {
    await auth.updateUser('demo-reader', { disabled: true });
    assert.equal((await request('services', reader)).status, 401);
    await auth.updateUser('demo-reader', { disabled: false });
  });
  await t.test('Express restart preserves approved data in Firestore', async () => {
    await new Promise<void>(resolve => server.close(() => resolve()));
    server = createPocApp().listen(0, '127.0.0.1'); await once(server, 'listening');
    assert.equal((await request('services', admin)).body.services.find((s: any) => s.id === 'demo-alfa').version, 3);
  });
  await t.test('checked local export/import restores all collections; invalid or nonempty imports fail', async () => {
    const folder = '.local-test-state'; await mkdir(folder, { recursive: true });
    const filename = folder + '/archive.json'; await rm(filename, { force: true });
    const exported = await exportArchive(filename);
    await assert.rejects(importArchive(filename), /empty/);
    const envelope = JSON.parse(await readFile(filename, 'utf8')); envelope.archive.fictionalOnly = false;
    const corrupt = folder + '/corrupt.json'; await writeFile(corrupt, JSON.stringify(envelope));
    await assert.rejects(importArchive(corrupt), /Checksum/);
    for (const name of ['services', 'memberships', 'proposals', 'history']) await db.recursiveDelete(db.collection(name));
    const restored = await importArchive(filename); assert.deepEqual(restored, exported);
    assert.equal((await request('history', admin)).body.history.length, 2);
    assert.equal((await request('services', admin)).body.services.find((s: any) => s.id === 'demo-alfa').version, 3);
  });
  await t.test('rejects cross-origin requests and serves the isolated React client', async () => {
    const badOrigin = await fetch(url() + '/api/poc/services', { headers: { Origin: 'https://evil.invalid', Authorization: `Bearer ${admin}` } });
    assert.equal(badOrigin.status, 403);
    const html = await fetch(url()); assert.equal(html.status, 200); assert.match(await html.text(), /client.js/);
  });
});
