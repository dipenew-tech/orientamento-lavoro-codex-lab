# Collaudo utente — Orientamento Lavoro Caritas web autonoma

Questa versione è separata da Google AI Studio. Non usare dati personali reali durante il collaudo.

## Pubblicazione di prova
- Hosting previsto: Cloudflare Pages, piano Free.
- Repository: dipenew-tech/orientamento-lavoro-codex-lab; branch: feature/web-autonoma-gratuita.
- Build command: npm run build.
- Build output directory: dist.
- Variabili di ambiente: nessuna chiave API richiesta per le funzioni locali.
- Non attivare deployment automatico da main prima dell'approvazione.

## Verifiche prima della pubblicazione
1. npm ci
2. npm run lint
3. npm run build
4. npm test --if-present
5. Controllare assenza di chiamate /api/ dal frontend e assenza di credenziali nel bundle.
6. Controllare che la pagina statistiche non contenga controlli email/ZIP non operativi.
7. Controllare che le statistiche partano a zero, rimangano a zero dopo cancellazione e che un nuovo documento incrementi il conteggio.
8. Verificare corrispondenza dei dati di Fondazione Roma Litorale e del repertorio Ostia con main.
9. Verificare generazione, modifica e download DOCX con dati fittizi.

## Prove UAT
- Inserire una scheda fittizia per Ostia/Municipio X e generare la lettera.
- Verificare recapiti e tipologia di ciascun servizio proposto.
- Ripetere con un'altra professione e un altro Municipio.
- Modificare la lettera ed esportare DOCX.
- Cercare una struttura dal pannello repertorio.
- Controllare statistiche iniziali, nuovo conteggio, esportazione CSV/JSON e azzeramento.
- Aprire il sito da una finestra anonima: nessuna autenticazione volontari.
- Da strumenti sviluppatore > Rete, verificare assenza di richieste a servizi AI e server applicativi.

## Condizione di rilascio
Non procedere al passaggio definitivo finché i test automatici e le prove UAT non sono superati. Il vecchio sito resta disponibile per rollback.
