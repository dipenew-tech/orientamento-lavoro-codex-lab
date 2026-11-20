# Segnalazioni di voci mancanti — ambiente di prova

## Stato
«Altro» permette di inserire una nazionalità o una professione libera. Alla ricerca su Indeed o alla generazione della lettera, l’app tenta la segnalazione delle voci libere con Turnstile. La lettera si genera in parallelo alla segnalazione. Una nazionalità libera produce la lettera in italiano.

Per aggiungere una copia dei risultati, apri Indeed, salva la pagina come PDF dalla stampa del browser e seleziona il file nella scheda. Le pagine vengono elaborate nel browser e entrano alla fine della lettera, anche nella stampa e nel Word.

L'invio automatico a `dipenew@gmail.com` richiede **tre configurazioni manuali**: Google Apps Script, Cloudflare Turnstile e Cloudflare Worker. Non pubblicare il frontend con l'invio attivo prima di aver completato il test end-to-end. I servizi hanno livelli gratuiti e quote, da verificare nell'account prima dell'attivazione.

## Google Apps Script
1. Aprire script.google.com con l'account autorizzato a inviare a dipenew@gmail.com.
2. Creare uno script e incollare `integrations/google-apps-script/report.gs`.
3. Impostare **Script properties → REPORT_SECRET** a una stringa casuale lunga; non inserirla nel frontend o nel repository.
4. Distribuire come **Web app**, eseguita come proprietario, accessibile da chiunque. L'endpoint rifiuta le richieste senza segreto; considerare comunque le quote Gmail e la gestione anti-abuso.
5. Conservare URL del deployment; autorizzare GmailApp tramite il flusso Google.

## Cloudflare
1. Creare widget Turnstile per l'hostname di test `orientamento-lavoro-caritas-ricerca-test.pages.dev`, annotare site key e secret.
2. Distribuire `integrations/cloudflare/report-worker.ts` come Worker, con variabili segrete `REPORT_SECRET` (uguale allo script), `APPS_SCRIPT_URL`, `TURNSTILE_SECRET` e `ALLOWED_ORIGIN=https://orientamento-lavoro-caritas-ricerca-test.pages.dev`.
3. Compilare il frontend con `VITE_SUGGESTIONS_ENDPOINT` impostato all'URL del Worker e `VITE_TURNSTILE_SITE_KEY` impostato alla site key pubblica. **Non** impostare secret nelle variabili VITE.
4. Testare con una voce fittizia: Turnstile, invio, arrivo email e assenza di dati personali.
5. Verificare anche token mancante/scaduto, tentativi ripetuti, origine non autorizzata, errori Gmail e indisponibilità del Worker.
6. Pubblicare prima su un **nuovo progetto di staging**. Non sostituire il sito di prova già collaudato senza autorizzazione.

## Limiti da considerare
- CORS/origin non costituiscono autenticazione; Turnstile riduce l'abuso ma non lo elimina.
- Google Apps Script e Gmail hanno quote e possono bloccare richieste; il pulsante deve riportare l'esito reale.
- Nessun inserimento automatico nel repertorio: l'email è una proposta da validare.
- La ricerca Wikidata è implementata ma non equivale a ricerca su fonti ufficiali ISTAT/Comune di Roma; una verifica su fonti ufficiali rimane necessaria prima dell'aggiornamento.

## Flusso previsto per il collaudo finale
- Scegliere «Altro» in uno dei due menu, digitare una voce fittizia e verificare che la professione libera sia ricercabile e che la nazionalità libera generi la lettera in italiano.
- Avviare una ricerca su Indeed o generare la lettera per tentare la segnalazione. Verificare la risposta del servizio e la ricezione nella casella amministrativa.
- Se il servizio risponde con errore, verificare che la lettera venga generata comunque.
- Selezionare voci presenti nei menu. Verificare i valori iniziali Ostia, l'apertura delle ricerche e la stampa dal browser.
