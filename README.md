# Orientamento Lavoro Roma Capitale

Applicazione web completa per l'accoglienza, l'orientamento professionale e la generazione di lettere di orientamento e contatti territoriali (CPI, COL, CPIA, Agenzie per il lavoro, Cooperative sociali) per Roma Capitale e Municipio X (Ostia Lido, Acilia, Fiumicino).

## Caratteristiche Principali

- **Generazione Lettere di Orientamento Multilingue**:
  - Supporto per tutte le nazionalità (incluso Egitto, Tunisia, Marocco, Senegal, Ucraina, Perù, ecc.).
  - Traduzione automatica in Arabo, Francese, Inglese, Spagnolo, Polacco, Ucraino e altre lingue.
  - Generazione di lettere personalizzate con contatti territoriali mirati.
- **Database Territoriale Verificato al 100%**:
  - Centri per l'Impiego (CPI) ufficiali della Regione Lazio (Ostia, Testaccio, Cinecittà, Tiburtino, Primavalle, Aurelio).
  - Centri di Orientamento al Lavoro (COL) di Roma Capitale.
  - Scuole d'Italiano per stranieri e CPIA (incluso CPIA 7 Ostia, CPIA 1, CPIA 2, CPIA 3, CPIA 4, Comunità di Sant'Egidio, Caritas Roma).
  - Cooperative Sociali e Agenzie per il Lavoro con indirizzi e recapiti verificati per Roma e Municipio X / Ostia Lido.
- **Strumenti di Verifica e Ricerca**:
  - Motore di ricerca rapido nel database per uffici, cooperative, scuole, indirizzi e numeri di telefono.
  - Verifica della vicinanza e del Municipio.
- **Esportazione & Condivisione**:
  - Esportazione in formato DOCX (Word).
  - Esportazione e anteprima di stampa/PDF.
  - Invio e-mail tramite SMTP (Gmail o server dedicato).
  - Dashboard statistiche con PIN di sicurezza.
  - Esportazione dell'intero progetto in archivio ZIP.

## Requisiti

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installazione e Avvio Rapido

1. Estrarre il contenuto dello zip.
2. Installare le dipendenze:
```bash
npm install
```
3. Avviare l'applicazione in modalità sviluppo:
```bash
npm run dev
```
4. Aprire il browser su [http://localhost:3000](http://localhost:3000).

## Build per Produzione

Per compilare l'applicazione per la produzione:
```bash
npm run build
npm start
```

## Variabili di Ambiente (.env)

Copia `.env.example` in `.env` e configura i seguenti valori opzionali:
- `GEMINI_API_KEY`: Per abilitare la generazione avanzata con Gemini AI (in assenza della chiave, è attivo il motore fallback locale con database territoriale completo).
- `SMTP_USER` / `GMAIL_USER`: Indirizzo email mittente per notifiche e statistiche.
- `SMTP_PASS` / `GMAIL_APP_PASSWORD`: Password per le app di Google a 16 caratteri per l'invio delle e-mail.
