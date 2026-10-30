# Correzione repertorio Roma/Ostia — 30 ottobre 2026

Base remota verificata: `d1aa4ddf38e3f2859c94b921960a85dd21cb92b1`.
Branch dedicato: `fix/repertorio-roma-ostia-20261030`.

## TypeScript

I due TS2353 erano causati da chiavi di traduzione degli enti collocate nei blocchi `english` e `arabic` di `translations`, che ammettono esclusivamente le sezioni della lettera. Le 13 coppie per ciascuna lingua sono state spostate in `annexDict`, il dizionario già usato da `translateText`. Nessun allargamento del tipo e nessun cast per aggirare il controllo. Generatore locale, editor React e Word verificati dai test.

## Correzioni e comportamento

- CPI Ostia: numeri Accoglienza regionali; Fondazione sostituita negli uffici pubblici dal COL Pier Paolo Pasolini, Largo Capelvenere 13. CAP controverso non scelto automaticamente.
- Fondazione Roma Litorale: identità unica, servizio specialistico non pubblico, recapito SELFI, requisiti specifici; associazioni a mestieri non provate sospese. La pagina contatti distingue anche la sede formativa di Acilia: concordare la sede del servizio.
- CPIA 7: sedi distinte senza Levante/Ponente, orari pubblicati qualificati come orari sede, cellulare di Ostia 1 verificato. Telefono Ostia 2 conservato con avviso di conflitto.
- Sant’Egidio Ostia: segreteria domenica 9:30–11. Biblioteca Elsa Morante: sede sostitutiva al porto, categoria Biblioteca, esclusa dalle scuole suggerite senza corso attuale documentato.
- PrivatAssistenza: riferimento operativo ufficiale a Fiumicino con copertura Ostia, separando il comune sede dal Municipio X. Assistenza e Territorio: CAP e descrizione dei servizi riallineati.
- CPI di Roma: accoglienza, email, CAP e denominazioni; alias della stessa sede unificati. I gruppi municipali restano percorsi di orientamento e non creano uffici fisici distinti. Ricerca filtrata sulla localizzazione della sede.
- COL Simonetta Tosi, Gino Giugni, Vignali e Marconi: contatti e modalità di accesso corretti; Rubra sospeso negli invii automatici perché non verificato.
- CPIA 1/2/3/4: email ufficiali, telefoni documentati e centrale CPIA 4; alias CPIA 3 unificati. Caritas Roma: telefono/email scuola; civico controverso conservato e segnalato.
- Agenzie/cooperative: correzioni specifiche di San Saturnino, API-COLF, Prassi e Ricerca, Manser, Umana Centro, Adecco Ostiense/Esperanto, Trattoria de Gli Amici; identità per sede normalizzate per Randstad EUR, Gi Group, Synergie, La Cascina e Barikamà.
- Capodarco riclassificata struttura sanitaria; Cassa Edile ente bilaterale; Eurogiga studio professionale; API-COLF associazione. Queste categorie sono visibili nella ricerca.
- Le schede con attività o canali non documentati restano consultabili con avviso; `automaticMatching: false` le esclude dalle raccomandazioni. Nessun riempimento forzato a dieci risultati. Le aggiunte locali non sono abbinate in base alla sola zona: è richiesta pertinenza professionale nella descrizione.
- Rimossa la classificazione geografica per la sottostringa generica `stia`, che scambiava Ostiense per Ostia. Eliminato l’uso automatico di email dedotte dal nome dell’ente. Il vecchio helper non è usato da ricerca o matching.
- Gli orari di scuole/cooperative non confermati sono indicati da riconfermare. Le informazioni storiche restano nel registro allegato.
- L’introduzione italiana non promette più dieci indirizzi specializzati; il conteggio nelle traduzioni segue il numero effettivo degli allegati. I testi tradotti restano quelli preesistenti e non certificano disponibilità di lavoro: valgono i requisiti e gli avvisi delle singole schede.

## Evidenze e limiti

Riferimento: *Rapporto_repertorio_Roma_Ostia_2026-10-26.html*, 65 schede di verifica e 120 righe anagrafiche uniche. Il registro JSON contiene fonti, limiti integrali, catalogo originale e catalogo finale. Le fonti già documentate nel rapporto sono datate 26/10/2026; CPI regionali, COL Roma Capitale, CPIA7 e Fondazione sono stati ricontrollati il 30/10/2026. Non si afferma una nuova verifica integrale di tutte le strutture.

Non risolti automaticamente: telefono Ostia 2 e termine 16:12 di Ostia 1; civici Perazzi, Caritas Zoccolette e Trattoria de Gli Amici; CAP del COL Pasolini; telefoni Cecilia; operatività corrente di Futura, Nuova Sair, Adecco Fiumicino, Manpower Manzoni/Tuscolana, Barikamà e Il Percorso; riapertura della sede storica della Locanda dei Girasoli; attivazione attuale dei corsi L2 della biblioteca e disponibilità iscrizioni di altre scuole. I contatti non integralmente verificati sono qualificati nelle descrizioni, senza certificare chiusure o inesistenza di vecchie email.

Nessuna modifica a Google AI Studio, nessun deployment, nessun nuovo servizio, nessun dato di assistiti reali. PR Firebase #7 esclusa.

## Verifica finale

- `npm run lint`: PASS.
- `npm run build`: PASS; solo avviso Vite per dimensione del bundle.
- `node --import tsx --test server/*.test.ts src/lib/*.test.ts`: 37 PASS, 0 FAIL, nessuno skip.
- Ricerca: classificazioni, filtro municipio fisico e deduplicazione verificati.
- Matching: tutte le 12 professioni, sospensioni, limite massimo senza riempimento, lavoro non riconosciuto e Ostiense/Ostia verificati.
- Lettere: 12 professioni per 5 nazionalità, scuole opzionali e traduzioni; test esistenti di editor, Word, route Express e fallback senza provider reale.
- `git diff --check`: PASS.
- Ciascun file iniziale confrontato con SHA Git del commit base; dipendenze locali corrispondenti al lockfile già disponibili, nessuna installazione a pagamento.

## Registro delle strutture esaminate

I limiti riportati qui sono quelli del rapporto di riferimento; le modifiche effettive sono confrontabili nei due cataloghi del JSON.

| ID | Struttura / servizio | Evidenza e limiti |
|---|---|---|
| X01 | CPI Roma Ostia |  Nel documento regionale aggiornato il 20/10/2026 il fisso presente nel codice è associato alla responsabile, non alla riga Accoglienza. Non sono stati utilizzati recapiti nominativi.  |
| X02 | Fondazione Roma Litorale: ente e Agenzia Lavoro |  La pagina Lavoro e Formazione descrive destinatari e percorsi specifici. Non prova lo sportello generalista per tutti i mestieri o le singole attività attribuite dal codice. Orari del codice non confermati.  |
| X03 | CPIA 7 Ostia: due sedi distinte |  La scheda di Ostia 1 conferma il cellulare istituzionale. Un PDF dei contatti inverte numeri/sedi rispetto ad altre pagine: non correggere automaticamente il telefono di Ostia 2. Il curioso 16:12 va confermato, non arrotondato arbitrariamente. Le etichette Levante/Ponente non compaiono nelle denominazioni ufficiali consultate.  |
| X04 | Sant’Egidio: scuola di Ostia |  Sede e livelli confermati; il termine delle 12 nel codice non coincide. Telefono ed email del codice non confermati come recapiti della sede di Ostia.  |
| X05 | Biblioteca Elsa Morante |  La scheda comunale riporta sede storica e sostitutiva; il catalogo e Turismo Roma indicano la sostitutiva. Catalogo e notizia di trasferimento hanno restituito 403 alla lettura diretta: consultati indicizzazione e portali istituzionali alternativi.  |
| X06 | PrivatAssistenza per Ostia |  Il sito ufficiale propone oggi questo centro per Ostia. Non conferma la sede di Corso Duca di Genova, il telefono e l’email presenti nel repertorio; ciò non dimostra da solo una cessazione.  |
| X07 | Assistenza e Territorio |  Contatti confermati; il CAP 00121 nel codice differisce dal documento comunale. Pulizie domestiche e orari non confermati dalla pagina contatti.  |
| X08 | Futura di Ostia |  Identità, sede e servizi confermati da carta pubblicata dal Comune, senza data di aggiornamento operativa certa. Telefono ed email ordinaria del codice non verificati su fonte primaria attuale.  |
| X09 | Cooperativa Lido |  Contatti confermati. L’elenco servizi non dimostra una divisione logistica o edile: sgrossatura cantieri è pulizia, non lavoro murario. Orari non verificati.  |
| X10 | Studio Eurogiga / Studio Gattuso |  I recapiti coincidono; la consulenza del lavoro non prova un servizio di intermediazione per segretarie e data entry.  |
| X11 | Adecco Fiumicino: recapiti storici |  La combinazione indirizzo/telefono/email appare in repertori non ufficiali, ma non è stata confermata nel localizzatore ufficiale. I suffissi Ho.Re.Ca., Costruzioni e Trasporti non provano divisioni fisiche distinte.  |
| R01 | CPI Roma Casalbertone |  Recapiti confermati; ricevimento su appuntamento. Il campo municipio del codice mescola localizzazione e bacino di utenza.  |
| R02 | CPI Roma Tiburtino e alias |  Email Spazio Lavoro separata non confermata.  |
| R03 | CPI Roma Testaccio e ambiti |  Il fisso del codice è pubblicato per una referente; Accoglienza indica la mail. Gli ambiti nel nome non sono sedi distinte.  |
| R04 | CPI Roma Cinecittà |  Il fisso 06 51682815 del codice non compare come Accoglienza nella rubrica aggiornata.  |
| R05 | CPI Roma Primavalle e alias |  CAP del codice 00167: la rubrica riporta 00168. Solo su appuntamento.  |
| R06 | CPI Roma Torre Angela |  Il fisso del codice non coincide con Accoglienza; ricevimento su appuntamento.  |
| C01 | COL Simonetta Tosi |  Sede ospitata dal COL Termini; non è una sede del Municipio I o XII. Il numero comune nel codice coincide con Termini.  |
| C02 | COL Termini Via Goito |  Recapiti principali confermati.  |
| C03 | COL Sempione e Palmiro Togliatti |  Controllati indirizzo, telefono ed email di entrambe le schede.  |
| C04 | COL Gino Giugni |  Sede confermata; telefono e mail nel codice differiscono.  |
| C05 | COL Vignali |  Indirizzo ed email del codice confermati; fisso da aggiornare.  |
| C06 | COL Guglielmo Marconi |  Contatti coincidono, ma il sito qualifica funzione e modalità telefonica; non è prova di sportello generalista aperto in presenza nel Municipio IX o XI.  |
| C07 | COL Rubra |  Non trovato nell’attuale elenco ufficiale consultato. Assenza dall’elenco non dimostra chiusura. Recapiti non verificati.  |
| S01 | CPIA 1: quattro sedi |  Il codice usa rmmm671005, diverso dall’email ufficiale. Quattro sedi riconoscibili. Su Perazzi esistono civici 30/36 in documenti diversi. La homepage segnala iscrizioni L2 temporaneamente complete a Policastro.  |
| S02 | CPIA 2: Togliatti e Tor Bella Monaca |  Telefoni e civici principali riconoscibili nell’elenco USR 2023/24; email del codice rmmm67300c errata rispetto all’elenco e agli atti scolastici 2025/26 trovati.  |
| S03 | CPIA 3: sei etichette, quattro sedi ufficiali |  La centrale in Centro storico è replicata come Polo Sud, Sud-Ovest e Ovest nei Municipi IX, XI e XII. Queste denominazioni territoriali non sono confermate. Il codice usa un’email diversa.  |
| S04 | CPIA 4: centrale e Tuscolana |  La pagina aggiornata il 28/09/2026 non indica Via Palestro 38 come centrale. Email nel codice diversa; telefono di Amulio da riallineare e ricontrollare.  |
| S05 | Caritas Roma: scuola italiano |  Il codice riporta telefono precedente e mail generica. Due civici nelle fonti ufficiali: non risolto il corretto ingresso per la scuola.  |
| S06 | Sant’Egidio: scuola centrale |  Il codice usa l’indirizzo della Comunità, non quello della scuola nella fonte specifica. PDF senza anno scolastico corrente certo.  |
| S07 | Casetta Rossa: italiano L2 |  Sede Magnaghi 14 corroborata dalla rete Scuolemigranti; telefono/email del codice non verificati nella pagina specifica.  |
| A01 | Randstad Roma EUR: un’unica filiale e specializzazioni |  Recapiti confermati; il sito non conferma ogni divisione tematica aggiunta nei nomi del database.  |
| A02 | OSA |  Recapiti confermati. Assistenza sanitaria/OSS non equivale automaticamente a collocamento di badanti senza qualifiche.  |
| A03 | Nuova Sair |  Pagina sul sottodominio di sviluppo; sito principale 403. Identità/sede/telefono plausibili, ma fonte secondaria interna insufficiente per certificare l’operatività corrente.  |
| A04 | San Saturnino |  Email del codice amministrazione@ non è il contatto indicato per questa pagina.  |
| A05 | Cecilia |  Il telefono nel codice compare nel sito del consorzio Parsifal, ma il sito dell’ente ne pubblica altri. Email info@ non confermata.  |
| A06 | Capodarco: sede sanitaria e presunte divisioni |  La fonte 2026 identifica una struttura sanitaria. Non dimostra che lo stesso recapito gestisca verde, manutenzioni, centralino e trasporti/navette come canali di lavoro distinti.  |
| A07 | API-COLF |  Il sito corrente indica sede diversa da Via Urbano II nel codice.  |
| A08 | Apriti Sesamo |  Recapiti confermati da carta 2024; non sono confermati automaticamente i mestieri attribuiti nel codice.  |
| A09 | Prassi e Ricerca |  Dominio email .com sul sito, .it nel codice.  |
| A10 | Roma81 |  Contatti principali confermati.  |
| A11 | Gi Group: tre filiali romane |  La pagina restituita include elenco nazionale con sedi romane, ma la lettura diretta è andata in timeout. Suffissi Logistics e Ho.Re.Ca. vanno qualificati come settori, non sedi distinte.  |
| A12 | Synergie: Appia/La Spezia, HOBE e Termini |  Recapiti del codice confermati. Home e pagina accreditamenti denominano diversamente le due prime sedi; divisioni aggiunte non equivalgono a filiali nuove.  |
| A13 | Manser |  Email info@mansercooperativa.org del codice non riscontrata.  |
| A14 | Magliana 80 |  Contatti confermati; la presenza di servizi sociali non conferma una specializzazione in magazzino o edilizia.  |
| A15 | Umana Roma Appia e Centro |  Indirizzi e telefoni delle due sedi corrispondono; mail Centro differente da roma.centro@ nel codice.  |
| A16 | Gruppo La Cascina |  Contatti confermati. I tre nomi commerciali del codice condividono recapiti; non sono tre sportelli distinti.  |
| A17 | Trattoria de Gli Amici |  Il telefono è per il ristorante, non un servizio generalista di collocamento; mail amici@santegidio.org del codice non confermata. Civico 5 nel portale Turismo Roma contro 6 nel codice: ingresso da riconfermare.  |
| A18 | Barikamà: sede e attività da qualificare |  Sito dell’ente non accessibile (500); sede operativa agricola o caffè, telefono, email e operatività attuale del recapito del codice non verificati.  |
| A19 | Agricoltura Nuova |  La sede e il fisso sono confermati ma il fisso è qualificato per prenotazioni. Email del codice non verificata su questa pagina.  |
| A20 | Il Percorso |  Dominio non accessibile; repertori terzi citano la sede ma non consentono di verificare integralmente identità, telefono, email e attività attuali.  |
| A21 | La Locanda dei Girasoli |  Fonte giornalistica istituzionale, non anagrafe camerale. Non trovata conferma primaria di riapertura alla stessa sede. Non si conclude che tutto il progetto sia cessato definitivamente.  |
| A22 | Men At Work |  Recapiti confermati in atto per triennio scolastico 2024–2027; sito in costruzione. Non prova impieghi di pizzaiolo, cuoco o edile.  |
| A23 | Cassa Edile Roma |  Contatti generali confermati. Prestazioni e adempimenti non equivalgono a un servizio generalista di ricerca lavoro.  |
| A24 | Speha Fresia |  Contatti confermati; non prova selezioni specifiche da muratore.  |
| A25 | Manpower Roma Manzoni |  Evidenza storica di sede, non conferma attuale di telefono, mail e orari.  |
| A26 | Securitas Metronotte |  Sede e settore confermati; telefono ed email del codice non verificati nel testo consultabile.  |
| A27 | Sicuritalia Roma |  Sede confermata; fisso locale del codice non verificato.  |
| A28 | Adecco Roma Ostiense |  Telefono del codice diverso; email non pubblicata nel testo corrente consultato.  |
| A29 | Coldiretti Roma |  Numero ed email della presunta sede provinciale nel codice non confermati da fonte specifica; presente un ufficio CAA allo stesso indirizzo.  |
| A30 | Santi Pietro e Paolo |  Contatti confermati; la fonte non prova giardinaggio come canale occupazionale generalista.  |
| A31 | Idea Prisma 82 |  Recapiti confermati; non riscontrato il canale per giardinieri.  |
| A32 | Randstad Digital / Centro |  Sede confermata; telefono ed email nel codice non verificati. Digital non è prova di intermediazione generalista per segreteria.  |
| A33 | Adecco Roma Esperanto / EUR |  Sede confermata; telefono ed email del codice non visibili nella pagina consultata.  |
| A34 | Manpower Roma Tuscolana |  Non risolta una scheda ufficiale attuale per l’indirizzo e i contatti del codice.  |

Registro completo: [repertorio-review-2026-10-30.json](repertorio-review-2026-10-30.json).

Il commit effettivo di integrazione va verificato sul branch remoto `main` dopo il merge; il suo SHA è comunicato nel risultato finale.
