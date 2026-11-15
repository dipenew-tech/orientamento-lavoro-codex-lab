import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getJobBoardLinks, getJobSearchTerms } from "../src/lib/jobBoardLinks.ts";

const report = readFileSync("src/components/MissingEntryReport.tsx", "utf8");
const worker = readFileSync("integrations/cloudflare/report-worker.ts", "utf8");
const app = readFileSync("src/App.tsx", "utf8");

test("Altro permette solo la segnalazione, senza ricerca", () => {
  assert.doesNotMatch(report + app, /Wikidata|NewEntryLookup|resolveNewEntry/);
  for (const category of ["mestiere", "nazionalita"]) {
    assert.match(app, new RegExp('MissingEntryReport category="' + category + '"'));
  }
  assert.match(app, /if \(!canSearch \|\| !formData\.zoneResident\.trim\(\)\)/);
  assert.match(app, /const canSearch = !isOtherNationality && !isOtherJob/);
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
  assert.match(subito.pathname, /offerte-lavoro/);
  assert.equal(subito.searchParams.get("q"), "Badante Ostia");
  assert.equal(new URL(getJobBoardLinks("Cuoco", "Tutta Roma").subito).searchParams.get("q"), "Cuoco");
});
