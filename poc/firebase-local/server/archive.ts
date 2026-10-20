import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { archiveSchema } from './schema.ts';
import { db } from './firebase.ts';

const collections = ['services', 'memberships', 'proposals', 'history'] as const;
const digest = (data: unknown) => createHash('sha256').update(JSON.stringify(data)).digest('hex');
export async function exportArchive(filename: string) {
  const values = await db.runTransaction(async tx => Promise.all(collections.map(async name => [name,
    (await tx.get(db.collection(name))).docs.map(doc => ({ ...doc.data(), id: doc.id }))])), { readOnly: true });
  const archive = archiveSchema.parse({ format: 'caritas-local-poc-v1', projectId: 'demo-caritas-local',
    fictionalOnly: true, collections: Object.fromEntries(values) });
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, JSON.stringify({ sha256: digest(archive), archive }, null, 2), { flag: 'wx' });
  return archive;
}
export async function importArchive(filename: string) {
  const text = await readFile(filename, 'utf8');
  if (Buffer.byteLength(text) > 2_000_000) throw new Error('Archive too large');
  const envelope = JSON.parse(text);
  if (envelope.sha256 !== digest(envelope.archive)) throw new Error('Checksum mismatch');
  const archive = archiveSchema.parse(envelope.archive);
  const serviceIds = new Set(archive.collections.services.map(s => s.id));
  for (const p of archive.collections.proposals) if (!serviceIds.has(p.serviceId)) throw new Error('Orphan proposal');
  for (const h of archive.collections.history) if (!serviceIds.has(h.serviceId)) throw new Error('Orphan history');
  // Local demonstration only: restore into an EMPTY database, never overwrite live work.
  for (const name of collections) if (!(await db.collection(name).limit(1).get()).empty) throw new Error('Import requires empty PoC collections');
  for (const name of collections) {
    const ids = archive.collections[name].map(row => row.id);
    if (new Set(ids).size !== ids.length) throw new Error('Duplicate IDs');
  }
  // One transaction: no partially restored archive. Cap at 450 docs for portability.
  const total = collections.reduce((n, name) => n + archive.collections[name].length, 0);
  if (total > 450) throw new Error('PoC import supports at most 450 documents');
  await db.runTransaction(async tx => {
    const existing = await Promise.all(collections.map(name => tx.get(db.collection(name).limit(1))));
    if (existing.some(q => !q.empty)) throw new Error('Concurrent writes: import cancelled');
    for (const name of collections) for (const row of archive.collections[name]) {
      const { id, ...data } = row;
      tx.create(db.doc(`${name}/${id}`), name === 'memberships' ? data : row);
    }
  });
  return archive;
}
