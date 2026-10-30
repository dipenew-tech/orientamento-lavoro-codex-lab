import test from 'node:test';
import assert from 'node:assert/strict';
import { getMunicipioFromZone, getPublicOfficesForZone, getItalianSchoolsForZone, queryLocalDb, searchLocalDatabase, localDb } from './localDb';
import { generateLocalFallback } from './fallbackGenerator';
import { municipioOffices as compatibilityOffices } from './data/offices';
import { municipioOffices } from './localDb';

test('Ostia public referrals use CPI reception and the public COL, never the Foundation', () => {
 const offices = getPublicOfficesForZone('Ostia');
 assert.equal(offices.length, 2);
 assert.match(offices[0].phone, /3311426968/);
 assert.equal(offices[1].name, 'COL Pier Paolo Pasolini');
 assert.equal(offices[1].email, 'colpierpaolopasolini@comune.roma.it');
 assert.equal(compatibilityOffices, municipioOffices);
});

test('schools retain two distinct Ostia sites, contact conflicts and actual published hours', () => {
 const schools = getItalianSchoolsForZone('Ostia');
 assert.equal(schools.length, 3);
 assert.equal(schools[0].phone, '3333345135');
 assert.match(schools[0].hours, /16:12/);
 assert.match(schools[1].hours, /16:00/);
 assert.match(schools[1].description, /confermare/);
 assert.ok(schools.every(s => !s.name.includes('Biblioteca') && !/Levante|Ponente/.test(s.name)));
});

test('search classifies library and specialist Foundation correctly and deduplicates aliases', () => {
 assert.equal(searchLocalDatabase('Elsa Morante')[0].category, 'Biblioteca');
 const foundation = searchLocalDatabase('Fondazione Inclusione');
 assert.equal(foundation.length, 1);
 assert.equal(foundation[0].category, 'Servizio specialistico');
 const testaccio = searchLocalDatabase('Testaccio', 'offices').filter(x => x.name.includes('Impiego'));
 assert.equal(testaccio.length, 1);
 assert.equal(testaccio[0].municipio, 'Municipio I');
 assert.equal(searchLocalDatabase('Testaccio','offices','Municipio IX').length, 0);
});

test('matching excludes unsupported occupational links without filling to ten', () => {
 for (const job of Object.keys(localDb)) {
  const list = queryLocalDb(job, 'Ostia', 'Ostia');
  assert.ok(list.every(r => r.automaticMatching !== false));
  assert.ok(!list.some(r => /Fondazione Inclusione|Eurogiga|Capodarco|Locanda dei Girasoli/.test(r.name)));
  assert.equal(new Set(list.map(r => r.name+'|'+r.address)).size,list.length);
  assert.ok(list.length <= 10);
 }
 assert.deepEqual(queryLocalDb('', 'Ostia', 'Ostia'), []);
 assert.deepEqual(queryLocalDb('astronauta', 'Ostia', 'Ostia'), []);
 assert.equal(getMunicipioFromZone('Ostiense'), 'Municipio VIII');
 assert.equal(getMunicipioFromZone('Ostia'), 'Municipio X');
});

test('all supported professions produce coherent local letters with optional schools and translations', () => {
 const nationalities = ['italiana','inglese','egiziana','francese','spagnola'];
 for (const job of Object.keys(localDb).filter(k => !k.startsWith('Servizi territoriali'))) {
  for (const nationality of nationalities) {
   const letter = generateLocalFallback({recipientName:'Persona Test',nationality,italianLevel:'Basso',jobSought:job,zoneResident:'Ostia',zoneJobSought:'Ostia'});
   assert.ok(letter.italianLetter.greeting.includes('Persona Test'));
   assert.equal(letter.publicOffices[1].name,'COL Pier Paolo Pasolini');
   assert.ok(!letter.cooperatives.some(c => c.name.includes('Fondazione Inclusione')));
   assert.ok(letter.italianSchools?.length);
   if (letter.hasTranslation) assert.ok(letter.translatedLetter?.greeting);
  }
 }
 const letter = generateLocalFallback({recipientName:'Persona Test',nationality:'italiana',italianLevel:'Alto',jobSought:'astronauta',zoneResident:'Ostia',zoneJobSought:'Ostia'});
 assert.equal(letter.cooperatives.length,0);
 assert.ok(!letter.italianSchools?.length);
});
