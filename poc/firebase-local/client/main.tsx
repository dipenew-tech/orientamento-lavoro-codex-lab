import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, inMemoryPersistence, setPersistence,
  signInWithEmailAndPassword, signOut } from 'firebase/auth';

if (!['127.0.0.1', 'localhost'].includes(location.hostname) || location.port !== '3100') {
  throw new Error('Questa PoC funziona solo su loopback:3100');
}
const auth = getAuth(initializeApp({ projectId: 'demo-caritas-local', apiKey: 'demo-local-not-a-real-key',
  authDomain: 'localhost' }));
connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
await setPersistence(auth, inMemoryPersistence);
type Service = { id: string; name: string; description: string; access: string; version: number };
type Proposal = { id: string; serviceId: string; patch: { description?: string; access?: string }; status: string };
type Member = { id: string; active: boolean; role: string };

function App() {
  const [email, setEmail] = useState('lettore@example.invalid');
  const [password, setPassword] = useState('SoloDemo-2026!');
  const [actor, setActor] = useState<{ uid: string; role: string } | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [message, setMessage] = useState('Solo emulatori. Nessuna struttura o persona reale.');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  async function api(url: string, method = 'GET', body?: unknown) {
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch(`/api/poc/${url}`, { method, headers: {
      Authorization: `Bearer ${token || ''}`, 'Content-Type': 'application/json'
    }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const data = await res.json();
    if (!res.ok) throw new Error(`${res.status}: ${data.error}`);
    return data;
  }
  async function refresh() {
    try {
      const me = await api('me'); setActor(me);
      setServices((await api('services')).services);
      setProposals(me.role === 'lettore' ? [] : (await api('proposals')).proposals);
      setMembers(me.role === 'amministratore' ? (await api('memberships')).memberships : []);
    } catch (err) { setActor(null); setServices([]); setProposals([]); setMembers([]); throw err; }
  }
  async function action(fn: () => Promise<unknown>) {
    try { await fn(); await refresh(); setMessage('Operazione completata e dati riletti dal server.'); }
    catch (err) { setMessage((err as Error).message); }
  }
  useEffect(() => {
    if (!actor) return;
    const timer = setInterval(() => { refresh().catch(err => setMessage(err.message)); }, 3000);
    return () => clearInterval(timer);
  }, [actor?.uid, actor?.role]);
  return <main style={{ maxWidth: 1000, margin: '30px auto', padding: 20, fontFamily: 'system-ui', lineHeight: 1.5 }}>
    <h1>Orientamento Lavoro — PoC locale</h1>
    <p><strong>SOLO DATI FITTIZI · NESSUN CLOUD · NON PUBBLICARE</strong></p>
    <p role="status" aria-live="polite">{message}</p>
    {!actor ? <form onSubmit={event => { event.preventDefault(); action(() => signInWithEmailAndPassword(auth, email, password)); }}>
      <label>Account demo <select value={email} onChange={e => setEmail(e.target.value)}>
        {['lettore', 'operatore', 'amministratore'].map(role => <option key={role}>{role}@example.invalid</option>)}
      </select></label>{' '}
      <label>Password demo <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>{' '}
      <button>Accedi all’emulatore</button>
    </form> : <>
      <p>Sessione: <strong>{actor.uid}</strong> · ruolo server: <strong>{actor.role}</strong></p>
      <button onClick={() => action(refresh)}>Aggiorna ora</button>{' '}
      <button onClick={async () => { await signOut(auth); setActor(null); setServices([]); setProposals([]); setMembers([]); }}>Esci</button>
      <h2>Servizi inventati</h2>
      <p>Aggiornamento automatico ogni 3 secondi. Aprire un secondo browser o una finestra privata per un’altra sessione.</p>
      {services.map(service => <article key={service.id} style={{ border: '1px solid #aaa', margin: '15px 0', padding: 15 }}>
        <h3>{service.name} — versione {service.version}</h3><p>{service.description}</p><p>{service.access}</p>
        {actor.role !== 'lettore' && <form onSubmit={e => { e.preventDefault(); action(() => api('proposals', 'POST', {
          serviceId: service.id, baseVersion: service.version, patch: { description: drafts[service.id] || '' }
        })); }}><label>Nuova descrizione fittizia <textarea required maxLength={1000} value={drafts[service.id] || ''}
          onChange={e => setDrafts({ ...drafts, [service.id]: e.target.value })} /></label>{' '}<button>Proponi modifica</button></form>}
      </article>)}
      {actor.role !== 'lettore' && <section><h2>Proposte</h2>{proposals.map(p => <div key={p.id}>
        <p>{p.serviceId}: {p.patch.description || p.patch.access} — <strong>{p.status}</strong></p>
        {actor.role === 'amministratore' && p.status === 'pending' && <button onClick={() => action(() => api(`proposals/${p.id}/approve`, 'POST'))}>Approva</button>}
      </div>)}</section>}
      {actor.role === 'amministratore' && <section><h2>Abilitazioni demo</h2>{members.filter(m => m.id !== actor.uid).map(m => <p key={m.id}>
        {m.id} · {m.role} · {m.active ? 'attivo' : 'revocato'}{' '}
        <button onClick={() => action(() => api(`memberships/${m.id}`, 'PATCH', { role: m.role, active: !m.active }))}>{m.active ? 'Revoca' : 'Riabilita'}</button>
      </p>)}</section>}
    </>}
  </main>;
}
createRoot(document.getElementById('root')!).render(<App />);
