import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getIndeedSearchLink, getJobSearchTerms } from "../src/lib/jobBoardLinks.ts";

const report = readFileSync("src/components/MissingEntryReport.tsx", "utf8");
const worker = readFileSync("integrations/cloudflare/report-worker.ts", "utf8");
const app = readFileSync("src/App.tsx", "utf8");

test("Altro usa la professione libera per la ricerca e mantiene la segnalazione", () => {
  assert.doesNotMatch(report + app, /Wikidata|NewEntryLookup|resolveNewEntry/);
  for (const category of ["mestiere", "nazionalita"]) {
    assert.match(app, new RegExp('MissingEntryReport [^>]*category="' + category + '"'));
  }
});

test("La segnalazione usa Turnstile e trasmette solo categoria e voce", () => {
  assert.match(worker, /siteverify/);
  assert.match(worker, /REPORT_SECRET/);
  assert.match(report, /JSON\.stringify\(\{ category, value: entry, turnstileToken: token \}\)/);
  assert.doesNotMatch(report, /REPORT_SECRET|recipientName/);
  assert.doesNotMatch(report, /Invia segnalazione|mailto:/);
});

test("La ricerca usa solo Indeed con professione e zona", () => {
  assert.deepEqual(getJobSearchTerms("Colf/pulizie (servizi domestici)"), ["Colf", "pulizie"]);
  const [term] = getJobSearchTerms("Badante (assistenza anziani)");
  const indeed = new URL(getIndeedSearchLink(term, " Ostia "));
  assert.equal(indeed.origin, "https://it.indeed.com");
  assert.equal(indeed.searchParams.get("q"), "Badante");
  assert.equal(indeed.searchParams.get("l"), "Ostia");
  assert.doesNotMatch(app, /Risultati Subito|Aggiungere gli annunci scelti/);
});
