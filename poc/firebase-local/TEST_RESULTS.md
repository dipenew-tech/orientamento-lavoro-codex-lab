# Risultati di collaudo — 20 ottobre 2026

Base: main `eb1c7b26036a470c5a42f816cb79518bac97b683`.
Ambiente: Linux, Node **24.19.0**, npm **11.9.0**, OpenJDK **17.0.20**,
Firebase CLI **14.26.0**, Firestore Emulator **1.19.8**,
Chromium **141.0.7390.37** (Playwright **1.56.1**).

## Esito finale eseguito

| Comando / controllo | Risultato |
| --- | --- |
| PoC: `npm test` | **PASS**, codice uscita 0 |
| Build e TypeScript strict PoC, inclusi client e test | **PASS** |
| Prima fase, Auth + Firestore locali avviati realmente | **20 pass, 0 fail**, nessuno skip |
| Seconda fase, arresto completo e nuovi processi con import | **1 pass, 0 fail**, nessuno skip |
| Legacy: `npm run build` dalla radice | **PASS** |
| Legacy: `node --import tsx --test server/*.test.ts` | **32 pass, 0 fail** |
| Legacy: `npm run lint` | **FAIL preesistente**, due TS2353 in fallbackGenerator.ts |
| `git diff --check` | **PASS** |

Il conteggio è quello emesso dal test runner Node, incluso il contenitore del
test di integrazione. Non vengono dichiarate prove Cloud, di produzione o su
due PC fisici: le tre sessioni sono contesti Chromium indipendenti sullo stesso
computer, oltre a sessioni HTTP separate.

## Funzionalità effettivamente verificate

- Browser: login distinto di operatore, lettore e amministratore; proposta non
  pubblica prima dell'approvazione; aggiornamento visibile nelle altre sessioni;
  revoca riconosciuta dalla sessione già aperta. Nessuna richiesta applicativa
  del browser verso origini esterne rilevata nel test.
- API: token assente, malformato, scaduto o di altro progetto; identità valida ma
  non abilitata; lettore senza permessi di scrittura; operatore senza permessi
  di approvazione o gestione utenti; campi/ruoli iniettati rifiutati.
- Claim amministratore nel token ignorato se il ruolo server è lettore.
- Firestore REST diretto con token client: **403**, Rules deny-all.
- Approvazione transazionale: versione incrementata e storico coerente; doppia
  approvazione e versione superata respinte; autoapprovazione vietata.
- Due approvazioni concorrenti sulla stessa versione: **200 + 409**, un solo
  aggiornamento applicato, nessuna perdita/sovrascrittura dell'altro.
- Revoca/downgrade membri con token già emessi; seed idempotente non riabilita
  il membro. Account Auth disabilitato: **401** sul token precedente.
- Riavvio del server Express: dati approvati invariati in Firestore.
- Export JSON consistente in transazione di sola lettura; import validato su
  collezioni vuote; checksum errato e import su dati esistenti rifiutati;
  ripristino di tutte e quattro le collezioni con versione/storico conservati.
- Export completo dei veri emulatori, arresto Auth/Firestore, nuovi processi,
  import senza seed: account demo, versione **3** e **2** revisioni sopravvivono.
- Configurazione: rifiuto di host remoti, progetti reali e credenziali Cloud.
  Firewall Node: fetch, HTTPS e TCP remoti bloccati prima della connessione.

## Regressione e modifiche

I 34 file originali sono stati acquisiti dal commit base e verificati tramite
SHA Git. Nessun archivio TS o localStorage esistente è migrato o modificato.

| Percorsi | Modifica |
| --- | --- |
| `tsconfig.json` principale | Una riga exclude per isolare la PoC dal controllo tipi legacy |
| `poc/firebase-local/package*.json`, `tsconfig.json` | Dipendenze e comandi autonomi, lockfile riproducibile |
| `firebase.json`, `firestore.rules`, `firestore.indexes.json` | Emulatori loopback, progetto demo, client Firestore negati |
| `server/*` | Auth, RBAC, fixture, proposte/approvazione/storico, revoca, export/import |
| `client/*` | Interfaccia React separata con sessioni in memoria e polling |
| `scripts/*` | Launcher locale, blocco egress, setup del binario verificato, build |
| `tests/*` | Browser, API, Rules, isolamento, concorrenza e riavvio completo |
| `.gitignore`, `README.md`, `TEST_RESULTS.md` | Esclusione stato/cache e istruzioni/risultati |

Gli errori TS2353 legacy sono su proprietà estranee al tipo del dizionario
in `src/lib/fallbackGenerator.ts` (righe 15 e 73 del commit base). Quel file
resta identico al blob originale. La build applicativa e i 32 test esistenti
passano, ma il lint generale non viene presentato come superato.

## Problemi risolti durante la verifica e limiti residui

La CLI standard tenta di leggere il MOTD pubblico da Firebase. Il primo avvio
è stato fermato dal controllo automatico prima del collaudo. La versione finale
separa il download pubblico del binario e blocca la rete remota durante CLI,
server e test; il warning MOTD è quindi atteso. Non sono stati creati servizi,
utilizzati progetti reali, effettuati login Cloud o attivati piani a pagamento.

La PoC non dimostra firme token di produzione (l'emulatore usa token non
firmati), OAuth Google reale, quote Spark, Starter Tier, costi futuri, IAM,
rete/regioni Cloud o persistenza dopo pubblicazione AI Studio. Il limite è
documentato senza attivare alcun servizio. L'export locale regolare non
garantisce recupero delle ultime modifiche dopo kill/crash della macchina.

Le cartelle `.local-*`, `node_modules`, log e binari non sono versionati.
Nessun deployment, collegamento al progetto di produzione o modifica ad AI
Studio è parte della consegna. La PR deve rimanere aperta e senza merge.
