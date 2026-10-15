# Contratto narrativo OpenAI

`openaiLetterContract.ts` è un modulo esclusivamente backend, con una dipendenza
Node integrata (`node:buffer`). Non deve essere importato dal frontend. Il solo
contratto non chiama provider e non richiede chiavi; l'integrazione backend descritta
in fondo a questa pagina è disattivata per default.

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

## Regole di composizione

Partire da `generateLocalFallback`, aggiungere esclusivamente i quattro testi
validati mediante assegnazioni esplicite, preservando i testi locali. Saluto, sezione uffici pubblici,
numerazione, dichiarazioni operative (inclusa Officina), titolo, oggetto,
destinatario e tutti gli array territoriali rimangono locali. Il modello non deve
generare né ricevere strutture o recapiti. Nessuno spread dell'output non fidato
nel `GeneratedLetter`.

Per una lettera multilingue, tutte le risposte necessarie devono superare i
controlli prima di aggiungere i testi; altrimenti conservare l'intero fallback.
La coerenza degli allegati e l'indicatore `isLocalFallback` spettano al compositore.

## Test locali senza API

Con le dipendenze già disponibili:

```sh
node --import tsx --test --test-isolation=none --test-reporter=tap server/openaiLetterContract.test.ts
node_modules/.bin/tsc --noEmit
```

Il comando Node evita il socket IPC del CLI `tsx`, bloccato nella sandbox, e
mostra tutti gli undici test (richiede una versione Node con `--test-isolation`).
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

## Adapter backend

`openaiLetterAdapter.ts` usa l'SDK ufficiale `openai@7.34.0`, aggiunto a
`package.json` e `package-lock.json` con npm e script di installazione disabilitati.
Per questo intervento usare npm e il relativo lockfile: `bun.lock` resta quello
preesistente e non descrive ancora la nuova dipendenza. Gemini non è stato rimosso.
L'SDK richiede Node >=22 (verificato qui su Node 24). Il requisito è ora esplicito
nel manifest e nel README generale. Verificare il runtime di deployment prima
dell'attivazione. npm ha inoltre riallineato nel
lockfile `nodemailer` e `@types/nodemailer`, già dichiarati nel package.json base
ma mancanti dal lockfile: non sono nuove dipendenze funzionali dell'adapter.
L'adapter e il suo test importano l'SDK Node; non devono essere importati dal frontend.

### Configurazione esclusivamente server

- `OPENAI_API_KEY`: opzionale, letta dall'ambiente alla creazione dell'adapter.
  Se assente o vuota, ritorna `missing_key` senza creare il client.
- `OPENAI_LETTER_MODEL`: opzionale, default `gpt-4.1-mini`; unico override ammesso
  `gpt-4.1-mini-2025-04-14`. Modello scelto per testi brevi con output strutturato;
  disponibilità, qualità e prezzi devono essere rivalutati prima di una prova reale.
- Timeout server: default 15 secondi, configurabile nel codice tra 1 e 30000 ms.
  Nessun parametro modello, chiave o timeout deve provenire dalla richiesta HTTP.
- Creare una sola istanza per processo. Limite di una richiesta in attesa locale e dieci
  tentativi per finestra mobile di un minuto, senza retry automatici. Il limite è
  per istanza/processo, non distribuito né un tetto di spesa giornaliero. Ricreare
  l'adapter o riavviare il processo azzera i contatori.
- Massimo 1600 token di output; nessun tool, streaming o conversazione persistente.
  Timeout e rifiuto locale non garantiscono assenza di costi per lavoro già avviato.
  Prima dell'attivazione servono anche controlli di accesso e budget a livello di progetto.

### Richiesta e risultato

Usa `responses.create` con `text.format`, schema JSON strict e `store: false`.
L'input viene verificato a runtime: esattamente cinque campi, enum e booleani;
nessun nome, nazionalità, zona, recapito o campo libero. Il payload è ricostruito
esplicitamente. Le istruzioni vietano candidature, fatti personali, qualifiche,
esperienze, strutture, recapiti e offerte inventate, con consigli generici sugli allegati.

Una risposta completata, non rifiutata e accettata dal validatore produce
`{ ok: true, sections }`. Altrimenti ritorna soltanto `{ ok: false, code }`:
`invalid_input`, `missing_key`, `invalid_config`, `usage_limit`, `circuit_open`, `timeout`,
`provider_error`, `invalid_response` o `refused`. Nessun errore del provider, prompt,
chiave o corpo della risposta viene restituito o scritto nei log. Anche il logging
SDK è disabilitato e l'endpoint SDK è fissato a quello ufficiale, senza override ambientali.
La scadenza richiede l'interruzione tramite abort e restituisce `timeout`, liberando
lo slot locale anche se la Promise sottostante non termina. Dopo il primo timeout
è consentita una nuova richiesta esplicita (nessun retry automatico). Dopo il
secondo timeout, anche se rilevato dall'SDK, l'istanza restituisce `circuit_open`
senza ulteriori chiamate. Il budget di due timeout vale per tutta la vita
dell'istanza: né la finestra di frequenza né risposte tardive lo azzerano. Il
futuro chiamante dovrà scegliere il fallback locale per questi errori.

Questo compromesso permette un solo recupero: al massimo due chiamate possono
rimanere pendenti indefinitamente per timeout nella stessa istanza. Una risposta
tardiva non cambia il risultato già restituito e non libera lo slot di una
richiesta successiva. La Promise in ritardo conserva soltanto i gestori della
gara, senza continuazioni che cambino lo stato dell'adapter.

**Limiti di sicurezza:** abort non dimostra che il provider abbia interrotto il
lavoro o la fatturazione. Perciò il circuito non si riapre automaticamente, nemmeno
quando una Promise scaduta termina. Il limite riguarda l'accumulo dovuto a timeout,
non certifica lo stato remoto dopo errori di rete o altri errori del provider.
Ricreare l'istanza, riavviare il processo o usare più processi aggira il budget:
non farlo automaticamente per recuperare il servizio. Prima di un ripristino
operativo occorre valutare le richieste incerte e i limiti del progetto provider.
Non è possibile ottenere dal solo client una garanzia globale di cancellazione.

`store: false` non equivale a una garanzia di zero conservazione lato provider:
prima dell'uso reale verificare le condizioni di trattamento dati applicabili.
L'adapter non certifica veridicità, lingua o assenza di tutte le forme di recapito:
le euristiche e i limiti semantici del contratto restano validi. I filtri aggiuntivi
della PR #3 sono una modifica separata e non vengono duplicati in questo branch.

### Test offline dell'adapter e del contratto

```sh
node --import tsx --test --test-isolation=none --test-reporter=tap server/openaiLetterAdapter.test.ts server/openaiLetterContract.test.ts
node_modules/.bin/tsc --noEmit --strict --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --skipLibCheck server/openaiLetterAdapter.ts server/openaiLetterAdapter.test.ts server/openaiLetterContract.ts server/openaiLetterContract.test.ts
node_modules/.bin/tsc --noEmit
```

I test includono il vero SDK con `fetch` sostituito da un trasporto simulato:
nessuna chiamata OpenAI reale, chiave reale o costo. Il mock HTTP include
`object: "response"`: l'SDK 7.34.0 usa questo discriminante per aggiungere
`output_text` concatenando i contenuti `output_text` dei messaggi. Un mock che
lo omette non riproduce la risposta Responses API e produce un risultato invalido.
Sono coperti configurazione assente, minimizzazione, schema, risposta invalida,
rifiuto, timeout SDK e applicativo, Promise che ignorano abort indefinitamente,
recupero limitato e circuito persistente, risposte/rifiuti tardivi, errori di rete,
assenza di retry e limiti d'uso.
Il controllo globale resta soggetto ai due errori TS2353 della baseline descritti sopra.

Fonti ufficiali consultate:
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://developers.openai.com/api/docs/models/gpt-4.1-mini
- https://github.com/openai/openai-node
- Sorgenti installati `openai/src/resources/responses/responses.ts` (`create`) e
  `openai/src/lib/ResponsesParser.ts` (`addOutputText`).

## Integrazione nell'endpoint: disattivata per default

`server.ts` crea una sola istanza di `createLetterPersonalizer` dopo dotenv e
registra `createGenerateLetterHandler` su POST `/api/generate-letter`. Il modulo
di route riceve generatori, notifiche e registrazione statistiche come dipendenze:
importarlo nei test non avvia server, timer o SMTP. La selezione del database e il
generatore locale non sono modificati. La route valida tipi e lunghezze prima di
usare i valori; gli errori interni restituiscono un messaggio generico.

`OPENAI_LETTER_ENABLED=true` è l'unico valore che attiva la personalizzazione.
Assenza, stringa vuota, `false`, `1` o `TRUE` non chiamano l'adapter. Non esiste un
parametro frontend per attivarlo. Chiave e modello rimangono nel solo ambiente
server. Configurare le variabili prima dell'avvio, senza commettere file segreti.

Il personalizzatore parte dalla lettera locale completa. In caso di successo
antepone i quattro testi narrativi validati alle corrispondenti sezioni locali:
non sostituisce istruzioni, numerazioni, candidature Officina, riferimenti o
allegati. Saluto e sezione uffici sono esattamente locali. Gli array territoriali
sono conservati, inclusi campi tradotti. Questa scelta può rendere il documento
più lungo e ripetitivo, ma evita di perdere informazioni operative.

Per utenti stranieri genera prima italiano e poi la lingua già scelta localmente:
soltanto se entrambe le risposte sono valide compone la lettera. Qualunque errore
restituisce tutti i testi originali, con `isLocalFallback: true` e motivo tecnico
controllato. Lingua non mappata o sezione tradotta assente causano fallback senza
chiamate. Non si correggono in questo intervento le euristiche linguistiche locali.
Il frontend conserva il flag restituito dal server anziché forzarlo a false.

### Limiti di costo dell'endpoint pubblico

`OPENAI_LETTER_MAX_CALLS` imposta il tetto totale dei tentativi per istanza di
personalizzatore (default 20, intero tra 1 e 100). Non esiste reset automatico:
dopo l'esaurimento il servizio continua con lettere locali. Una lettera bilingue
richiede due tentativi e la disponibilità viene controllata prima di iniziare.
Gli errori consumano quota. Il limite di concorrenza del personalizzatore impedisce
di avviare composizioni contemporanee; restano anche 10 tentativi/minuto, 1600
token per chiamata, timeout e circuito dell'adapter. Con il default si possono
richiedere al massimo 32000 token di output nell'intera vita dell'istanza; non è
una stima di prezzo e include anche token non effettivamente generati.

L'endpoint non ha autenticazione: un utente abusivo può consumare la quota e
forzare fallback per gli altri utenti. Il costo AI è limitato per istanza, ma più
repliche, riavvii e autoscaling moltiplicano il tetto. Prima di attivare in
produzione usare un progetto provider dedicato con controlli di spesa effettivi,
un numero di repliche/riavvii controllato e protezione d'accesso al deployment.
Non abilitare la funzione su un deployment che ricrea istanze senza limiti.
I limiti in memoria non sostituiscono un contatore distribuito persistente.
Il percorso resta disattivato finché queste condizioni non sono gestite.

Non sono stati cambiati i comportamenti SMTP preesistenti per valori non censiti,
né la duplicazione delle statistiche client/server. Anche senza OpenAI il server
può inviare queste email secondo la sua configurazione esistente.

### Verifiche integrazione offline

```sh
node --import tsx --test --test-isolation=none --test-reporter=tap server/*.test.ts
node_modules/.bin/tsc --noEmit --strict --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --skipLibCheck server/letterPersonalizer.ts server/letterPersonalizer.test.ts server/generateLetterRoute.ts server/openaiLetterAdapter.ts server/openaiLetterContract.ts
node_modules/.bin/tsc --noEmit
```

I test chiamano il vero handler Express con richiesta/risposta simulate, il
generatore reale, il rendering server dell'editor e l'esportazione Word in memoria.
Non viene aperta una porta né avviato `server.ts`. Il fetch globale è bloccato:
ogni tentativo esterno fa fallire la suite. L'SDK usa soltanto trasporto simulato.
Gli import dinamici del codice legacy evitano di trascinare nel controllo strict
isolato errori già presenti e moduli React privi di dichiarazioni nel progetto;
la compatibilità viene verificata a runtime. Il controllo globale continua a
segnalare esclusivamente i due TS2353 della baseline in `fallbackGenerator.ts`.
