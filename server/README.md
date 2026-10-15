# Contratto narrativo OpenAI

`openaiLetterContract.ts` è un modulo esclusivamente backend, con una dipendenza
Node integrata (`node:buffer`). Non deve essere importato dal frontend. Non è
collegato all'applicazione: non chiama provider, non richiede chiavi e non cambia
il comportamento attuale.

L'input contiene soltanto categoria professionale normalizzata, livello d'italiano,
lingua di output e presenza degli allegati. La professione libera non va inoltrata:
le categorie sconosciute diventano `other`. Nome, genere, nazionalità, zone,
identificativi e dati delle strutture restano fuori dal contratto. I tipi non
costituiscono una validazione runtime dell'input: la futura integrazione dovrà
validarlo e costruirlo nel backend.

L'output contiene esattamente `intro`, `cooperativesIntro`, `schoolsIntro` e
`conclusion`. `schoolsIntro` è obbligatorio nel JSON: `null` quando non richiesto,
una stringa quando richiesto. Il futuro compositore convertirà `null` in assenza
del campo `LetterSection.schoolsIntro`.

## Validazione

- Oggetto di dati semplice, esattamente quattro proprietà proprie, senza accessor.
- Stringhe normalizzate Unicode NFC e ripulite ai bordi, misurate in punti di codice.
- Introduzione: 40–900 caratteri; ricerca: 60–1800; scuole: 40–700;
  conclusione: 30–600; totale massimo: 4000.
- Testo semplice: rifiuto conservativo di HTML, comuni sintassi Markdown e
  caratteri di controllo. Non è un parser completo di tutti i dialetti Markdown.
- Rifiuto di email, URL comuni, sequenze telefoniche e indirizzi numerati evidenti.
  Le euristiche possono avere falsi positivi e falsi negativi, specie multilingue.
- Il parser JSON applica un limite UTF-8 di 32 KiB prima del parsing. La futura
  integrazione dovrà anche limitare il corpo ricevuto durante il trasporto.
- Un risultato non valido contiene un motivo tecnico senza riprodurre il testo.
  Il chiamante dovrà scartare l'intero output e mantenere la lettera locale.

**Il validatore non garantisce l'assenza di informazioni inventate.** Non verifica
semanticamente lingua, nomi di strutture, qualifiche, esperienze, offerte o promesse.
Un test esplicito documenta questo limite. Servono istruzioni di generazione,
controlli semantici e revisione dell'operatore prima di integrare il provider.

## Composizione futura (non implementata)

Partire da `generateLocalFallback`, sostituire esclusivamente i quattro testi
validati mediante assegnazioni esplicite. Saluto, sezione uffici pubblici,
numerazione, dichiarazioni operative (inclusa Officina), titolo, oggetto,
destinatario e tutti gli array territoriali rimangono locali. Il modello non deve
generare né ricevere strutture o recapiti. Nessuno spread dell'output non fidato
nel `GeneratedLetter`.

Per una lettera multilingue, tutte le risposte necessarie dovranno superare i
controlli prima di sostituire i testi; altrimenti conservare l'intero fallback.
La coerenza degli allegati e l'indicatore `isLocalFallback` spettano al compositore.

## Test locali senza API

Con le dipendenze già disponibili:

```sh
node --import tsx --test --test-isolation=none --test-reporter=tap server/openaiLetterContract.test.ts
node_modules/.bin/tsc --noEmit
```

Il comando Node evita il socket IPC del CLI `tsx`, bloccato nella sandbox, e
mostra tutti i test (richiede una versione Node con `--test-isolation`).
Per controllare separatamente i nuovi file, anche in modalità strict:

```sh
node_modules/.bin/tsc --noEmit --strict --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --skipLibCheck server/openaiLetterContract.ts server/openaiLetterContract.test.ts
```

Il controllo TypeScript globale della baseline `928fcc9` presenta già due errori
TS2353 in `src/lib/fallbackGenerator.ts`, alle righe 15 e 73: la proprietà
`"Fondazione Roma Litorale"` non appartiene al tipo dichiarato del dizionario.
Questi errori sono stati riprodotti su un'esportazione del commit base e rimangono
gli unici errori globali con i nuovi file. Il generatore non viene modificato.

I test usano dati sintetici, importano soltanto il contratto e le librerie Node
integrate: nessun server, timer, SMTP o chiamata esterna viene avviato.
