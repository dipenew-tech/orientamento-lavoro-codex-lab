# Aggiornamento Google AI Studio — versione senza login

Origine: ZIP esportato dall'app Google AI Studio, 22 ottobre 2026.

## Modifiche
- Ricerca testuale accent-insensitive e multi-parola.
- Matching: nessuna associazione automatica alla categoria Badante per professioni sconosciute.
- Deduplicazione basata su nome e indirizzo.
- Rimozione di recapiti email generici usati come fallback.
- Interfaccia semplificata per consultazione libera.
- Nessuna autenticazione, Firestore o dipendenza Firebase aggiunta.

## Limiti e test richiesti
- I recapiti del repertorio NON sono stati verificati individualmente presso le fonti ufficiali.
- Le modifiche sono state applicate ai due file sorgente principali del branch GitHub, non effettuando un import binario dello ZIP.
- Il branch potrebbe non coincidere con lo stato corrente dell'editor AI Studio; confrontare prima di sovrascrivere.
- La build e i test integrati del branch non sono ancora stati eseguiti in questa sessione.
- Testare ricerca per Ostia, parole con accenti, query a più parole, professioni sconosciute, generazione Word, funzioni amministrative.
- Non pubblicare prima di aver verificato l'anteprima e la procedura di rollback.
- L'importazione GitHub in AI Studio potrebbe creare un'app distinta: verificare la continuità dell'URL pubblico.
