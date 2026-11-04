import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("generazione lettere lato browser", () => {
  const app = read("src/App.tsx");
  assert.match(app, /generateLocalFallback\(payload\)/);
  assert.doesNotMatch(app, /fetch\s*\(\s*["'`]\/api\/generate-letter/);
});

test("nessuna chiamata API nel pannello lettere", () => {
  const editor = read("src/components/LetterEditor.tsx");
  assert.doesNotMatch(editor, /fetch\s*\(\s*["'`]\/api\//);
});

test("statistiche inizialmente vuote e separate", () => {
  const stats = read("src/lib/statsStore.ts");
  assert.match(stats, /orientamento_lavoro_letter_stats_web_v2/);
  assert.doesNotMatch(stats, /INITIAL_SAMPLE_STATS/);
  assert.match(stats, /return \[\];/);
  assert.doesNotMatch(stats, /fetch\s*\(/);
});

test("nessuna chiamata API nel pannello statistiche", () => {
  const admin = read("src/components/AdminStatsModal.tsx");
  assert.doesNotMatch(admin, /fetch\s*\(\s*["'`]\/api\//);
});
