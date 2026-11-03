import { auth, db } from './firebase.ts';
import { accounts, DEMO_PASSWORD, services } from './fixtures.ts';

export async function seed() {
  for (const account of accounts) {
    try { await auth.getUser(account.uid); }
    catch (err) {
      if ((err as { code?: string }).code !== 'auth/user-not-found') throw err;
      await auth.createUser({ uid: account.uid, email: account.email, password: DEMO_PASSWORD });
    }
    const ref = db.doc(`memberships/${account.uid}`);
    await db.runTransaction(async tx => {
      if (!(await tx.get(ref)).exists) tx.create(ref, { role: account.role, active: true });
    });
  }
  for (const service of services) {
    const ref = db.doc(`services/${service.id}`);
    await db.runTransaction(async tx => { if (!(await tx.get(ref)).exists) tx.create(ref, service); });
  }
}
