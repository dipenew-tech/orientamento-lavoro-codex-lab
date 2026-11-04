import assert from "node:assert/strict";
import test from "node:test";
import { generateLocalFallback } from "../src/lib/fallbackGenerator.ts";
import { getMunicipioFromZone, queryLocalDb, getPublicOfficesForZone, getItalianSchoolsForZone } from "../src/lib/localDb.ts";
import { generateWordDocument } from "../src/lib/wordGenerator.ts";

const fakePerson = {
  recipientName: "Persona di prova",
  gender: "F",
  nationality: "Italia",
  italianLevel: "Basso",
  jobSought: "Badante (assistenza anziani)",
  zoneResident: "Ostia Lido",
  zoneJobSought: "Municipio X",
  officinaOpportunity: false
};

test("Ostia viene associata al Municipio X", () => {
  assert.equal(getMunicipioFromZone("Ostia Lido"), "Municipio X");
  assert.equal(getMunicipioFromZone("Municipio X"), "Municipio X");
});

test("repertorio locale consultabile senza backend", () => {
  assert.ok(Array.isArray(queryLocalDb(fakePerson.jobSought, fakePerson.zoneResident, fakePerson.zoneJobSought)));
  assert.ok(Array.isArray(getPublicOfficesForZone("Ostia Lido")));
  assert.ok(Array.isArray(getItalianSchoolsForZone("Ostia Lido")));
});

test("generazione locale e allegati coerenti", () => {
  const letter = generateLocalFallback(fakePerson);
  assert.equal(letter.recipientName, fakePerson.recipientName);
  assert.equal(letter.isLocalFallback, true);
  assert.ok(letter.italianLetter);
  assert.ok(Array.isArray(letter.cooperatives));
  assert.ok(Array.isArray(letter.publicOffices));
  assert.ok(Array.isArray(letter.italianSchools));
});

test("esportazione DOCX locale", async () => {
  const letter = generateLocalFallback(fakePerson);
  const doc = await generateWordDocument(letter);
  assert.ok(doc.size > 100);
  assert.equal(doc.type, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
});
