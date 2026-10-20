import { auth, db } from '../server/firebase.ts';
import { DEMO_PASSWORD } from '../server/fixtures.ts';
import { seed } from '../server/seed.ts';

export async function resetTestFixtures() {
  if (process.env.CARITAS_POC_TEST !== '1') throw new Error('Test opt-in required before clearing fixtures');
  for (const name of ['services', 'memberships', 'proposals', 'history']) await db.recursiveDelete(db.collection(name));
  const users = await auth.listUsers();
  for (const user of users.users) await auth.deleteUser(user.uid);
  await seed();
}
export async function signIn(email: string, password = DEMO_PASSWORD) {
  const res = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-only', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  const data = await res.json() as { idToken: string; refreshToken: string; error?: unknown };
  if (!res.ok) throw new Error(`Emulator sign-in failed: ${JSON.stringify(data.error)}`);
  return data.idToken;
}
