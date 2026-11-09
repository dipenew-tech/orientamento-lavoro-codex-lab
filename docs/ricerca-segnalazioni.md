# Ricerca nuove voci e segnalazioni automatiche — ambiente di prova

## Stato
La ricerca immediata usa il repertorio locale e sinonimi documentati nel codice. È disponibile anche il pulsante **Cerca anche sul web (Wikidata)**, che interroga esplicitamente l'API pubblica di Wikidata e mostra link alle schede originali. I risultati collaborativi non sono verificati, non garantiscono la corretta classificazione di professioni/nazionalità/quartieri e non vanno inseriti automaticamente nel repertorio. La ricerca può essere indisponibile per limiti API/CORS. Non inserire dati personali nelle ricerche. Le nuove voci possono essere usate provvisoriamente nei campi liberi. Nessun dato dell'assistito deve essere inviato.

L'invio automatico a `dipenew@gmail.com` richiede **tre configurazioni manuali**: Google Apps Script, Cloudflare Turnstile e Cloudflare Worker. Non pubblicare il frontend con l'invio attivo prima di aver completato il test end-to-end. I servizi hanno livelli gratuiti e quote, da verificare nell'account prima dell'attivazione.

## Google Apps Script
1. Aprire script.google.com con l'account autorizzato a inviare a dipenew@gmail.com.
2. Creare uno script e incollare `integrations/google-apps-script/report.gs`.
3. Impostare **Script properties → REPORT_SECRET** a una stringa casuale lunga; non inserirla nel frontend o nel repository.
4. Distribuire come **Web app**, eseguita come proprietario, accessibile da chiunque. L'endpoint rifiuta le richieste senza segreto; considerare comunque le quote Gmail e la gestione anti-abuso.
5. Conservare URL del deployment; autorizzare GmailApp tramite il flusso Google.

## Cloudflare
1. Creare widget Turnstile per l'hostname di test `orientamento-lavoro-caritas-test.pages.dev`, annotare site key e secret.
2. Distribuire `integrations/cloudflare/report-worker.ts` come Worker, con variabili segrete `REPORT_SECRET` (uguale allo script), `APPS_SCRIPT_URL`, `TURNSTILE_SECRET` e `ALLOWED_ORIGIN=https://orientamento-lavoro-caritas-test.pages.dev`.
3. Compilare il frontend con `VITE_SUGGESTIONS_ENDPOINT` impostato all'URL del Worker e `VITE_TURNSTILE_SITE_KEY` impostato alla site key pubblica. **Non** impostare secret nelle variabili VITE.
4. Testare con una voce fittizia: ricerca locale, Turnstile, conferma invio, arrivo email e assenza di dati personali.
5. Verificare anche token mancante/scaduto, tentativi ripetuti, origine non autorizzata, errori Gmail e indisponibilità del Worker.
6. Pubblicare prima su un **nuovo progetto di staging**. Non sostituire il sito di prova già collaudato senza autorizzazione.

## Limiti da considerare
- CORS/origin non costituiscono autenticazione; Turnstile riduce l'abuso ma non lo elimina.
- Google Apps Script e Gmail hanno quote e possono bloccare richieste; il pulsante deve riportare l'esito reale.
- Nessun inserimento automatico nel repertorio: l'email è una proposta da validare.
- La ricerca Wikidata è implementata ma non equivale a ricerca su fonti ufficiali ISTAT/Comune di Roma; una verifica su fonti ufficiali rimane necessaria prima dell'aggiornamento.

## Flusso previsto per il collaudo finale
- Scegliere «Altro» per nazionalità e/o professione, digitare la voce, premere «Cerca anche sul web (Wikidata)», selezionare una scheda tramite radio button e premere «Conferma questa voce».
- La scelta viene trasferita al campo e compare nel testo italiano della lettera. La selezione non implica che esista una traduzione nella lingua scelta: non inventare traduzioni.
- Se il Worker, Turnstile e lo script Gmail sono configurati, la segnalazione viene inviata automaticamente dopo conferma e verifica anti-abuso. L'email contiene categoria, voce e link Wikidata scelto, mai nome o dati della persona assistita.
- Se non sono configurati, l'interfaccia segnala chiaramente che l'invio non è attivo. Non dichiarare la ricezione email senza testare la casella.
- La presenza di una professione nel DB non garantisce strutture con matching autorizzato: quelle con `automaticMatching:false` non devono comparire come opportunità verificate.
- La build CI ordinaria non include le variabili VITE per email. Per il collaudo dell'invio occorre una build specifica con `VITE_SUGGESTIONS_ENDPOINT` e `VITE_TURNSTILE_SITE_KEY` impostate prima di `npm run build`.
