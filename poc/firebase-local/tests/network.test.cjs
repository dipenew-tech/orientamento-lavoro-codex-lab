const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
test('runtime blocks remote fetch, HTTPS and TCP before networking', () => {
  for (const expression of [
    "fetch('https://firebase-public.firebaseio.com/cli.json').catch(e=>{if(!e.message.includes('POC_EGRESS_BLOCKED'))process.exit(2)})",
    "try{require('https').get('https://firestore.googleapis.com/')}catch(e){if(!e.message.includes('POC_EGRESS_BLOCKED'))process.exit(2)}",
    "try{require('net').connect(443,'firestore.googleapis.com')}catch(e){if(!e.message.includes('POC_EGRESS_BLOCKED'))process.exit(2)}"
  ]) {
    const result = spawnSync(process.execPath, ['--require', path.resolve('scripts/network-guard.cjs'), '-e', expression], { timeout: 5000 });
    assert.equal(result.status, 0, result.stderr?.toString());
  }
});
