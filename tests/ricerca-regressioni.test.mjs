import test from "node:test";
import assert from "node:assert/strict";
import { getMunicipioFromZone, queryLocalDb } from "../src/lib/localDb.ts";
import { generateLocalFallback } from "../src/lib/fallbackGenerator.ts";

test("Ostia Antica viene associata al Municipio X e non a tutta Roma", () => {
  assert.equal(getMunicipioFromZone("Ostia Antica"), "Municipio X");
  assert.equal(getMunicipioFromZone("Quartiere inesistente xyz"), "");
});
test("Idraulico non genera false agenzie pertinenti", () => {
  const letter = generateLocalFallback({recipientName:"Mario Test",gender:"M",nationality:"Italia",italianLevel:"Alto",jobSought:"Idraulico",zoneResident:"Ostia Antica",zoneJobSought:"Ostia Antica"});
  assert.match(letter.italianLetter.cooperativesIntro, /PER IL MESTIERE RICHIESTO/);
  assert.equal(letter.cooperatives.length, queryLocalDb("Idraulico","Ostia Antica","Ostia Antica").length);
});
test("Vietnam non viene tradotto erroneamente in inglese", () => {
  const letter = generateLocalFallback({recipientName:"Utente Test",gender:"M",nationality:"Altro: Vietnam",italianLevel:"Alto",jobSought:"Idraulico",zoneResident:"Ostia Antica",zoneJobSought:"Ostia Antica"});
  assert.equal(letter.hasTranslation, false);
  assert.equal(letter.translatedLetter, undefined);
});
