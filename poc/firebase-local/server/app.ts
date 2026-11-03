import express, { type Request, type Response, type NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { auth, db } from './firebase.ts';
import { memberSchema, proposalInput, type Role } from './schema.ts';

type Actor = { uid: string; role: Role };
type LocalRequest = Request & { actor?: Actor };
class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
const fail = (status: number, message: string): never => { throw new HttpError(status, message); };
const asyncRoute = (fn: (req: LocalRequest, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => { Promise.resolve(fn(req, res, next)).catch(next); };

function requireRole(actor: Actor, allowed: Role[]) {
  if (!allowed.includes(actor.role)) fail(403, 'Operazione non consentita al ruolo');
}

export function createPocApp() {
  const app = express();
  app.disable('x-powered-by');
  // Local-only web app. No CORS, forwarded-host trust or remote Host header.
  app.use((req, res, next) => {
    if (!['127.0.0.1', 'localhost'].includes(req.hostname)) return res.status(403).json({ error: 'Solo loopback' });
    const origin = req.get('origin');
    if (origin && !['http://127.0.0.1:3100', 'http://localhost:3100'].includes(origin)) {
      return res.status(403).json({ error: 'Origine non autorizzata' });
    }
    res.set('Cache-Control', 'no-store');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://127.0.0.1:9099; frame-ancestors 'none'; base-uri 'none'");
    next();
  });
  app.use(express.json({ limit: '16kb' }));
  app.get('/health', (_req, res) => res.json({ mode: 'emulators-only', projectId: 'demo-caritas-local' }));
  app.use('/api/poc', asyncRoute(async (req, _res, next) => {
    const header = req.get('authorization') || '';
    if (!/^Bearer \S+$/.test(header)) fail(401, 'Accesso richiesto');
    let uid: string;
    try { uid = (await auth.verifyIdToken(header.slice(7), true)).uid; }
    catch { fail(401, 'Token non valido, scaduto o revocato'); }
    const member = memberSchema.safeParse((await db.doc(`memberships/${uid!}`).get()).data());
    if (!member.success) return fail(403, 'Utente non abilitato');
    if (!member.data.active) fail(403, 'Utente non abilitato');
    req.actor = { uid: uid!, role: member.data.role };
    next();
  }));

  // Recheck membership inside write transactions: concurrent revocations conflict/retry.
  const checkWriter = async (tx: FirebaseFirestore.Transaction, actor: Actor, roles: Role[]) => {
    const member = memberSchema.safeParse((await tx.get(db.doc(`memberships/${actor.uid}`))).data());
    if (!member.success || !member.data.active || !roles.includes(member.data.role)) fail(403, 'Autorizzazione revocata');
  };
  app.get('/api/poc/me', asyncRoute(async (req, res) => res.json(req.actor)));
  app.get('/api/poc/services', asyncRoute(async (_req, res) => {
    const rows = await db.collection('services').orderBy('name').get();
    res.json({ services: rows.docs.map(d => ({ ...d.data(), id: d.id })) });
  }));
  app.get('/api/poc/proposals', asyncRoute(async (req, res) => {
    requireRole(req.actor!, ['operatore', 'amministratore']);
    const rows = await db.collection('proposals').get();
    res.json({ proposals: rows.docs.map(d => d.data()).filter(d => req.actor!.role === 'amministratore' || d.authorUid === req.actor!.uid) });
  }));
  app.post('/api/poc/proposals', asyncRoute(async (req, res) => {
    requireRole(req.actor!, ['operatore', 'amministratore']);
    const parsed = proposalInput.safeParse(req.body);
    if (!parsed.success) fail(400, 'Proposta non valida: solo description/access e versione attesa');
    const input = parsed.data!;
    const id = randomUUID();
    await db.runTransaction(async tx => {
      await checkWriter(tx, req.actor!, ['operatore', 'amministratore']);
      const service = await tx.get(db.doc(`services/${input.serviceId}`));
      if (!service.exists) fail(404, 'Servizio inesistente');
      if (service.data()!.version !== input.baseVersion) fail(409, 'Versione superata: rileggere il servizio');
      tx.create(db.doc(`proposals/${id}`), { ...input, id, authorUid: req.actor!.uid,
        status: 'pending', createdAt: new Date().toISOString() });
    });
    res.status(201).json({ id });
  }));
  app.post('/api/poc/proposals/:id/approve', asyncRoute(async (req, res) => {
    requireRole(req.actor!, ['amministratore']);
    if (!/^[a-f0-9-]{36}$/.test(String(req.params.id))) fail(400, 'ID non valido');
    await db.runTransaction(async tx => {
      await checkWriter(tx, req.actor!, ['amministratore']);
      const proposalRef = db.doc(`proposals/${req.params.id}`);
      const snap = await tx.get(proposalRef);
      if (!snap.exists) fail(404, 'Proposta inesistente');
      const proposal = snap.data()!;
      if (proposal.status !== 'pending') fail(409, 'Proposta già elaborata');
      if (proposal.authorUid === req.actor!.uid) fail(403, 'La propria proposta richiede un altro amministratore');
      const serviceRef = db.doc(`services/${proposal.serviceId}`);
      const service = await tx.get(serviceRef);
      if (!service.exists) fail(404, 'Servizio inesistente');
      const before = service.data()!;
      if (before.version !== proposal.baseVersion) fail(409, 'Conflitto: servizio modificato, creare una nuova proposta');
      const after = { ...before, ...proposal.patch, version: before.version + 1 };
      const approvedAt = new Date().toISOString();
      tx.update(serviceRef, after);
      tx.update(proposalRef, { status: 'approved', approvedBy: req.actor!.uid, approvedAt });
      tx.create(db.doc(`history/${proposal.id}`), { id: proposal.id, proposalId: proposal.id,
        serviceId: proposal.serviceId, before, after, approvedBy: req.actor!.uid, approvedAt });
    });
    res.json({ approved: true });
  }));
  app.get('/api/poc/memberships', asyncRoute(async (req, res) => {
    requireRole(req.actor!, ['amministratore']);
    res.json({ memberships: (await db.collection('memberships').get()).docs.map(d => ({ id: d.id, ...d.data() })) });
  }));
  app.patch('/api/poc/memberships/:uid', asyncRoute(async (req, res) => {
    requireRole(req.actor!, ['amministratore']);
    const parsed = memberSchema.safeParse(req.body);
    if (!parsed.success || !/^demo-[a-z0-9-]+$/.test(String(req.params.uid))) fail(400, 'Ruolo o UID non valido');
    if (req.params.uid === req.actor!.uid) fail(400, 'Non modificare la propria abilitazione');
    await db.runTransaction(async tx => {
      await checkWriter(tx, req.actor!, ['amministratore']);
      const ref = db.doc(`memberships/${req.params.uid}`);
      if (!(await tx.get(ref)).exists) fail(404, 'Utente inesistente');
      tx.update(ref, parsed.data!);
    });
    res.json({ updated: true });
  }));
  app.get('/api/poc/history', asyncRoute(async (req, res) => {
    requireRole(req.actor!, ['amministratore']);
    res.json({ history: (await db.collection('history').get()).docs.map(d => d.data()) });
  }));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API inesistente' }));
  app.use(express.static(fileURLToPath(new URL('../.local-dist/', import.meta.url))));
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
    if (err instanceof SyntaxError) return res.status(400).json({ error: 'JSON non valido' });
    // Do not log tokens, passwords or request bodies.
    res.status(503).json({ error: 'Emulatori non disponibili o operazione fallita; nessun fallback Cloud' });
  });
  return app;
}
