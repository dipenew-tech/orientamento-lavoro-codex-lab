import { createPocApp } from './app.ts';
const server = createPocApp().listen(3100, '127.0.0.1', () => {
  console.log('PoC LOCALE: http://127.0.0.1:3100 — solo dati fittizi, nessun Cloud');
});
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => server.close(() => process.exit(0)));
