// Download ONLY the public emulator executable. No Firebase API, project or login.
import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const cwd = fileURLToPath(new URL('../', import.meta.url));
const info = JSON.parse(await readFile(path.join(cwd, 'node_modules/firebase-tools/lib/emulator/downloadableEmulatorInfo.json'), 'utf8')).firestore;
const expectedUrl = 'https://storage.googleapis.com/firebase-preview-drop/emulator/cloud-firestore-emulator-v1.19.8.jar';
const expectedHash = '9d43599ed6151199e8d604dc87fac51218e49e5f3a48519b1ae560bbe5e3382d';
if (info.remoteUrl !== expectedUrl || info.expectedChecksumSHA256 !== expectedHash) throw new Error('Unexpected emulator metadata');
const cache = path.join(cwd, '.local-cache'); await mkdir(cache, { recursive: true });
const destination = path.join(cache, info.downloadPathRelativeToCacheDir);
let bytes;
try { bytes = await readFile(destination); } catch {}
if (!bytes || createHash('sha256').update(bytes).digest('hex') !== expectedHash) {
  const response = await fetch(expectedUrl, { redirect: 'error' });
  if (!response.ok) throw new Error(`Public binary download failed: ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length !== info.expectedSize || createHash('sha256').update(bytes).digest('hex') !== expectedHash) throw new Error('Emulator checksum mismatch');
  await writeFile(destination + '.tmp', bytes); await rename(destination + '.tmp', destination);
}
console.log('Official Firestore emulator cached; SHA-256 verified. No Cloud service created.');
