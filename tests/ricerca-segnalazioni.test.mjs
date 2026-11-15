import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { formatSelectedJobLinks, getJobBoardLinks, getJobSearchTerms } from "../src/lib/jobBoardLinks.ts";

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
  assert.match(report, /mailto:dipenew@gmail\.com/);
});

test("I portali ricevono professione e zona e Subito apre solo le offerte", () => {
  assert.deepEqual(getJobSearchTerms("Colf/pulizie (servizi domestici)"), ["Colf", "pulizie"]);
  const [term] = getJobSearchTerms("Badante (assistenza anziani)");
  const links = getJobBoardLinks(term, " Ostia ");
  const indeed = new URL(links.indeed);
  const subito = new URL(links.subito);
  assert.equal(indeed.origin, "https://it.indeed.com");
  assert.equal(indeed.searchParams.get("q"), "Badante");
  assert.equal(indeed.searchParams.get("l"), "Ostia");
  assert.equal(subito.pathname, "/annunci-lazio/vendita/offerte-lavoro/roma/");
  assert.equal(subito.searchParams.get("q"), "Badante Ostia");
  assert.equal(new URL(getJobBoardLinks("Cuoco", "Tutta Roma").subito).searchParams.get("q"), "Cuoco");
});


test("Solo gli annunci scelti vengono aggiunti, senza duplicati o tracciamento", () => {
  const input = [
    "Aiuto cuoco — https://it.indeed.com/viewjob?jk=TEST001&from=tracking",
    "https://it.indeed.com/viewjob?jk=TEST001",
    "Cuoco — https://www.subito.it/offerte-lavoro/cuoco-roma-123456.htm?utm_source=test",
    "https://www.subito.it/cerco-lavoro/candidato-123456.htm",
    "https://it.indeed.com/jobs?q=Cuoco",
    "https://it.indeed.com.example.org/viewjob?jk=TEST002",
  ].join("\n");
  const result = formatSelectedJobLinks(input);
  assert.equal((result.match(/TEST001/g) || []).length, 1);
  assert.match(result, /Cuoco \(Subito\)/);
  assert.doesNotMatch(result, /tracking|utm_source|candidato|example\.org|\/jobs/);
});
