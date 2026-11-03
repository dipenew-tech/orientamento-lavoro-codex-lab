import { seed } from './seed.ts';
import { exportArchive, importArchive } from './archive.ts';
try {
  if (process.argv[2] === 'seed') await seed();
  else if (process.argv[2] === 'export') await exportArchive(process.argv[3]);
  else if (process.argv[2] === 'import') await importArchive(process.argv[3]);
  else throw new Error('Unknown local command');
  console.log('Operazione completata solo sugli emulatori locali.');
  process.exit(0);
} catch (err) { console.error((err as Error).message); process.exit(1); }
