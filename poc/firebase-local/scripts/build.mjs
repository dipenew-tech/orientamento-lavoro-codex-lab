import { build } from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('.local-dist', { recursive: true });
await build({ entryPoints: ['client/main.tsx'], bundle: true, minify: true,
  outfile: '.local-dist/client.js', platform: 'browser', format: 'esm', target: 'es2022', sourcemap: false });
await copyFile('client/index.html', '.local-dist/index.html');
