import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { localEnvironment, PROJECT_ID } from './safety.mjs';

const cwd = fileURLToPath(new URL('../', import.meta.url));
process.chdir(cwd);
const env = localEnvironment();
env.FIREBASE_EMULATORS_PATH = path.join(cwd, '.local-cache');
// Prevent CLI MOTD, telemetry and SDKs from contacting real Firebase endpoints.
// Apply to CLI, Express, tests and their Node children, not to binary installation.
env.NODE_OPTIONS = `${env.NODE_OPTIONS || ''} --require=${JSON.stringify(path.join(cwd, 'scripts/network-guard.cjs'))}`;
const command = process.argv[2];
const cli = path.join(cwd, 'node_modules/firebase-tools/lib/bin/firebase.js');
function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd, env, stdio: 'inherit' });
    const forward = () => child.kill('SIGINT');
    process.once('SIGINT', forward); process.once('SIGTERM', forward);
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      process.removeListener('SIGINT', forward); process.removeListener('SIGTERM', forward);
      if (code === 0) resolve(0); else reject(new Error(`Local command failed (${code ?? signal})`));
    });
  });
}
const common = ['--only', 'auth,firestore', '--project', PROJECT_ID, '--config', 'firebase.json'];
try {
  if (command === 'emulators') {
    if (!existsSync('.local-cache/cloud-firestore-emulator-v1.19.8.jar')) throw new Error('Run npm run setup first (public binary download only)');
    const state = '.local-state';
    const args = [cli, 'emulators:start', ...common, `--export-on-exit=${state}`];
    if (existsSync(`${state}/firebase-export-metadata.json`)) args.push(`--import=${state}`);
    await run(args);
  } else if (command === 'dev') await run(['--import', 'tsx', 'server/start.ts']);
  else if (command === 'seed') await run(['--import', 'tsx', 'server/cli.ts', 'seed']);
  else if (command === 'export') {
    const filename = path.resolve('.local-exports', `repertoire-${Date.now()}.json`);
    await run(['--import', 'tsx', 'server/cli.ts', 'export', filename]); console.log(filename);
  } else if (command === 'import') {
    if (!process.argv[3]) throw new Error('Usage: npm run import -- PATH_TO_LOCAL_JSON');
    await run(['--import', 'tsx', 'server/cli.ts', 'import', path.resolve(process.argv[3])]);
  } else if (command === 'test') {
    if (!existsSync('.local-cache/cloud-firestore-emulator-v1.19.8.jar')) throw new Error('Run npm run setup first (public binary download only)');
    // Dedicated test runs overwrite ONLY the explicit test-export directory, not .local-state.
    env.CARITAS_POC_TEST = '1';
    mkdirSync('.local-test-state', { recursive: true });
    await run([cli, 'emulators:exec', ...common, '--export-on-exit=.local-test-state/emulators',
      'node --import tsx --test --test-concurrency=1 tests/browser.test.ts tests/network.test.cjs tests/guards.test.ts tests/integration.test.ts']);
    await run([cli, 'emulators:exec', ...common, '--import=.local-test-state/emulators',
      'node --import tsx --test tests/persistence.test.ts']);
  } else throw new Error('Only emulators/dev/seed/export/import/test are allowed; no deploy command');
} catch (err) { console.error(err.message); process.exitCode = 1; }
