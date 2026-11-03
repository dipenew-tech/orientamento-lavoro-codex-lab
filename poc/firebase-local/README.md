# PoC Firebase esclusivamente locale — Orientamento Lavoro Caritas

Branch: `poc/firebase-local`. Base analizzata: `main` a `eb1c7b26036a470c5a42f816cb79518bac97b683`.

Questa PoC non è una migrazione, non è una configurazione di produzione e non
attiva Firebase, Google Cloud, AI Studio o fatturazione. I dati e gli account sono
inventati. Non inserire informazioni reali degli assistiti, credenziali Cloud o
identificativi di progetti reali. Non eseguire `firebase init`, `firebase login`,
`firebase use`, `firebase deploy` o collegamenti alla console per usarla.

## Architettura e isolamento

L'app esistente usa React/Vite (`src/App.tsx`), Express (`server.ts`), archivi TS
(`src/lib/localDb.ts`) condivisi fra browser/server, aggiunte locali nel
localStorage e statistiche in memoria/localStorage. La generazione principale
è locale; la personalizzazione OpenAI è opzionale. Non dispone di un repertorio
condiviso persistente né di un'autenticazione server degli operatori.

La PoC è autonoma e non importa archivi territoriali, statistiche, provider AI o
SMTP dell'app esistente. Nessun codice runtime esistente è modificato. L'unica
modifica esterna a questa cartella è l'esclusione di `poc` dal `tsconfig.json`
principale, per non richiedere le dipendenze della PoC al controllo tipi legacy.
`package.json`, lockfile, build, dev server, UI e dati legacy restano invariati.

Flusso: React → Auth Emulator → ID token → Express → verifica identità/ruolo →
Firestore Emulator. La pagina React non accede direttamente a Firestore: le
Security Rules negano ogni lettura/scrittura client. Il client server bypassa
le Rules: per questo ogni API verifica RBAC, e le transazioni di scrittura
rileggono l'abilitazione prima di salvare.

Progetto fisso **`demo-caritas-local`**, senza risorse reali. Backend solo
`127.0.0.1:3100`, Auth `127.0.0.1:9099`, Firestore `127.0.0.1:8080`, hub `4400`,
logging `4500`; Firestore usa anche websocket locale `9150`. Non esporre le
porte su LAN/Internet: gli emulatori non sono servizi di produzione sicuri.

Il launcher rifiuta progetti/host diversi e credenziali Cloud ereditate, imposta
un `FIREBASE_CONFIG` inerte e carica `network-guard.cjs`: richieste Node remote,
compresi MOTD/telemetria della CLI, vengono bloccate prima di aprire connessioni.
Il browser di test consente soltanto le due origini locali usate dalla pagina.
Questa protezione applicativa non sostituisce un firewall del sistema operativo
e non pretende di confinare qualsiasi programma esterno ostile.

## Installazione gratuita

Prerequisiti: Node 22 o 24, npm, JDK 17 o 21, porte libere. JDK 21 consigliato;
la CLI è fissata a `14.26.0` e l'emulatore Firestore a `1.19.8`, compatibili con
JDK 17. Non aggiornare la CLI implicitamente: versioni successive possono
richiedere Java 21. Il lockfile della PoC è separato da quello principale.

```bash
git switch poc/firebase-local
cd poc/firebase-local
npm ci
npm run setup
npm run setup:browser
npm run build
```

L'installazione richiede Internet per i pacchetti npm, Chromium e il binario
pubblico dell'emulatore. `setup` scarica soltanto l'eseguibile ufficiale Firestore
da `storage.googleapis.com/firebase-preview-drop/emulator/`, controllando SHA-256
e dimensione. Nessuna API di un progetto viene utilizzata. Dopo l'installazione
non sono necessari accesso Internet, account Google, carta o Firebase reale.
Su Linux Chromium può richiedere librerie di sistema già disponibili sul PC.

## Esecuzione interattiva (tre terminali)

Terminale 1, dalla cartella della PoC:

```bash
npm run emulators
```

Terminale 2, dopo che entrambi gli emulatori sono pronti:

```bash
npm run seed
npm run dev
```

Aprire **http://127.0.0.1:3100**. Non è necessario avviare il dev server legacy.
Il seed è idempotente: non azzera versioni approvate, password modificate,
account disabilitati o autorizzazioni revocate già presenti.

| Account fittizio | Ruolo | Permessi API |
| --- | --- | --- |
| `lettore@example.invalid` | lettore | consultazione dei servizi pubblicati |
| `operatore@example.invalid` | operatore | consultazione e proposta di modifica; legge le proprie proposte |
| `amministratore@example.invalid` | amministratore | proposte, approvazione di proposte altrui, storico, ruoli e revoca |

Password di tutti gli account iniziali: **`SoloDemo-2026!`**, esclusivamente demo.
Ogni scheda/servizio ha `fictional: true`, contatti `.invalid` e area inventata.
Non viene raccolta alcuna scheda di assistito.

## Dimostrazione da due sessioni indipendenti

1. In una finestra accedere come operatore; in una finestra privata o altro
   browser come lettore. Le sessioni Auth sono mantenute in memoria, non nel
   localStorage condiviso. In una terza finestra accedere come amministratore.
2. L'operatore propone una descrizione fittizia. Il lettore vede ancora la
   versione pubblicata precedente.
3. L'amministratore approva. Le prime due finestre mostrano la nuova versione
   entro il polling di 3 secondi, oppure con **Aggiorna ora**.
4. Revocare l'operatore: il prossimo accesso API con lo stesso token riceve 403.
5. Due proposte sulla stessa versione possono coesistere; approvandole in
   concorrenza una sola è applicata. L'altra riceve 409, rimane pendente e deve
   essere riformulata sulla versione aggiornata. Nessuna sovrascrittura silenziosa.

La pagina è dimostrativa: il backend ricontrolla tutto anche se si saltano i
pulsanti e si chiamano direttamente le API. I ruoli non sono accettati nel token
o nel payload; l'abilitazione Firestore è letta a ogni richiesta, senza cache.
Un amministratore non può autoapprovare una proposta né modificare la propria
abilitazione. Non sono previsti nuovi ruoli o account attraverso questa UI.

## API dimostrative

| Metodo / percorso | Permesso |
| --- | --- |
| `GET /api/poc/me` | ogni membro attivo |
| `GET /api/poc/services` | ogni membro attivo |
| `GET /api/poc/proposals` | operatore (proprie), amministratore (tutte) |
| `POST /api/poc/proposals` | operatore o amministratore |
| `POST /api/poc/proposals/:id/approve` | amministratore diverso dall'autore |
| `GET /api/poc/history` | amministratore |
| `GET /api/poc/memberships` | amministratore |
| `PATCH /api/poc/memberships/:uid` | amministratore; ruolo e active espliciti |

Le richieste API portano `Authorization: Bearer <ID_TOKEN_EMULATORE>`.
Una proposta contiene `serviceId`, `baseVersion` intera e `patch` con soltanto
`description` e/o `access`. Campo extra, patch vuota e dati fuori schema: 400;
identità invalida: 401; ruolo/revoca: 403; versione superata: 409;
emulatore indisponibile: errore esplicito senza fallback Cloud.
Approvazione, incremento versione e storico sono un'unica transazione.

## Persistenza ed esportazione/importazione

Alla chiusura regolare con Ctrl+C, `emulators` esporta **Auth e Firestore** in
`.local-state/`; al riavvio reimporta quella cartella. Un arresto forzato può
perdere le modifiche successive all'ultimo export: la memoria dell'emulatore
non equivale alla durabilità di un servizio Cloud.

```bash
# Con emulatori accesi, esporta solo i dati Firestore della PoC:
npm run export
# Percorso stampato dal comando; import solo in collezioni PoC vuote:
npm run import -- .local-exports/repertoire-NUMERO.json
```

L'archivio JSON ha schema, progetto demo e SHA-256; contiene servizi,
abilitazioni, proposte e storico. Import validato in transazione, massimo 450
documenti; rifiuta checksum errato, riferimenti orfani, duplicati o destinazione
non vuota. Il checksum rileva corruzione, non autentica un file proveniente da
terzi. Non modificare/importare file da fonti non affidabili.

Il JSON non salva password/sessioni/Auth: per questi usare l'export completo
degli emulatori. Per una prova manuale di import JSON in ambiente vuoto, fermare
gli emulatori, conservare/rinominare `.local-state`, riavviare, importare JSON,
poi eseguire seed per ricreare gli account con UID stabili. Non cancellare dati
che si vogliono conservare. Non committare le cartelle locali di stato.

## Test automatici

**Fermare prima gli emulatori interattivi.** I test usano le stesse porte ma una
cartella di export separata `.local-test-state/`, non `.local-state/`.

```bash
npm test
```

Il comando controlla i tipi in modalità strict, crea il bundle React, avvia
veri emulatori locali e verifica tre contesti browser Chromium isolati, RBAC,
accessi diretti negati dalle Rules, revoca con token preesistenti, concorrenza,
riavvio Express ed export/import. Quindi arresta entrambi gli emulatori,
riavvia nuovi processi con l'export e verifica account, versione e storico
senza rieseguire il seed. Non è un mock di Firestore.

Controlli veloci senza emulatori: `npm run test:guards` e
`node --test tests/network.test.cjs`.
L'avviso CLI "Unable to fetch the CLI MOTD" è previsto: la rete remota è
bloccata intenzionalmente. L'avviso Java <21 riguarda aggiornamenti futuri.
Risultati e limiti verificati sono riportati in `TEST_RESULTS.md`.

## Limiti: cosa questa PoC non dimostra

- L'Auth Emulator emette token non firmati: qui sono accettati solo localmente.
  Non dimostra verifica crittografica, Google OAuth/redirect, MFA, deliverability
  email o revoca in Firebase di produzione. Le prove con token scaduti/progetto
  errato verificano i controlli dell'emulatore, non una firma di produzione.
- Non verifica Starter Tier, quote Spark, billing, IAM, regioni, HTTPS pubblico,
  AI Studio o persistenza dopo deploy. Non garantisce la futura configurazione
  Cloud gratuita. Non esistono impostazioni di deploy in questa PoC.
- Firestore Emulator non riproduce tutti gli indici, limiti, latenze e conflitti
  del servizio reale. UI aggiornata tramite polling, non listener Firestore.
- Revoca del membro nell'app immediata alla richiesta successiva; account
  Firebase disabilitato controllato dal server. Revoca concorrente a una
  scrittura provoca retry/rifiuto grazie alla lettura del membro in transazione.
- Import JSON pensato per fixture piccole e database vuoto, non per migrazione
  del repertorio reale. Nessun backup programmato o PITR Cloud.
- Dipendenze CLI transitive possono avere avvisi di deprecazione; sono strumenti
  locali fissati nel lockfile, non uno stack pronto per essere esposto online.

## Riferimenti ufficiali

- https://firebase.google.com/docs/emulator-suite/connect_auth
- https://firebase.google.com/docs/emulator-suite/connect_firestore
- https://firebase.google.com/docs/emulator-suite/install_and_configure
- https://firebase.google.com/docs/auth/admin/verify-id-tokens
- https://firebase.google.com/docs/firestore/security/rules-conditions

I progetti `demo-` non hanno risorse reali. Questa implementazione applica inoltre
blocchi locali di configurazione e di rete: non cambiare l'ID per puntare al
progetto di produzione.
