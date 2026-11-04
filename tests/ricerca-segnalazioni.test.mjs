import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const component = readFileSync("src/components/NewEntryLookup.tsx", "utf8");
const worker = readFileSync("integrations/cloudflare/report-worker.ts", "utf8");
const app = readFileSync("src/App.tsx", "utf8");
test("Ricerca Wikidata esplicita con URL fonte e senza dati personali", () => {
  assert.match(component, /wbsearchentities/);
  assert.match(component, /Cerca anche sul web/);
  assert.match(component, /wikidata.org\\/wiki/);
  assert.doesNotMatch(component, /recipientName/);
});
test("Nuove voci integrate per le tre categorie", () => {
  for (const category of ["mestiere", "nazionalita", "quartiere"]) assert.match(app, new RegExp('category="'+category+'"'));
});
test("Invio protetto da Turnstile e segreti nel Worker", () => {
  assert.match(worker, /TURNSTILE_SECRET/);
  assert.match(worker, /REPORT_SECRET/);
  assert.match(worker, /siteverify/);
  assert.doesNotMatch(component, /REPORT_SECRET/);
});
