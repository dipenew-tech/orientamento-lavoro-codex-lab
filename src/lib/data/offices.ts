import { PublicOffice } from "../localDb";

// Verified, real, official Public Offices (CPI Regione Lazio & COL Roma Capitale) per Municipio
export const municipioOffices: Record<string, PublicOffice[]> = {
  "Municipio I": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Testaccio",
      address: "Via Galvani 108, 00153 Roma",
      phone: "06 5168 2771",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego della Regione Lazio competente per il Municipio I (Centro Storico, Trastevere, Testaccio, Prati, Esquilino). Rilascio DID e certificato storico occupazionale.",
      municipio: "Municipio I"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Portafuturo Testaccio",
      address: "Via Galvani 108, 00153 Roma",
      phone: "06 6960 1100",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Centro di Orientamento al Lavoro di Roma Capitale. Stesura del CV, bilancio di competenze e postazioni informatiche per la ricerca attiva.",
      municipio: "Municipio I"
    }
  ],
  "Municipio II": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Tiburtino",
      address: "Via Scorticabove 77, 00156 Roma",
      phone: "06 4561 4901",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego della Regione Lazio competente per il quadrante Nomentano/Tiburtino e Municipio II (Parioli, Flaminio, Salario, Trieste, San Lorenzo).",
      municipio: "Municipio II"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Termini - Via Goito",
      address: "Via Goito 35, 00185 Roma",
      phone: "06 6710 5197",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Centro di Orientamento al Lavoro di Roma Capitale (Municipio II). Consulenza gratuita su curriculum, annunci di lavoro e tirocini.",
      municipio: "Municipio II"
    }
  ],
  "Municipio III": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Tiburtino",
      address: "Via Scorticabove 77, 00156 Roma",
      phone: "06 4561 4901",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego pubblico della Regione Lazio competente per il Municipio III (Montesacro, Talenti, Tufello, Bufalotta, Fidene).",
      municipio: "Municipio III"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Sempione",
      address: "Piazza Sempione 12, 00141 Roma",
      phone: "06 6710 8023",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Centro di Orientamento al Lavoro di Roma Capitale nel Municipio III. Colloqui personalizzati, revisione CV e bandi.",
      municipio: "Municipio III"
    }
  ],
  "Municipio IV": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Tiburtino",
      address: "Via Scorticabove 77, 00156 Roma",
      phone: "06 4561 4901",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego regionale competente per il Municipio IV (Tiburtina, Pietralata, Colli Aniene, San Basilio, Rebibbia). Rilascio DID e schede professionali.",
      municipio: "Municipio IV"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Tiburtino III",
      address: "Via W. A. Mozart 77, 00159 Roma",
      phone: "06 6710 8431",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Centro di Orientamento al Lavoro comunale nel Municipio IV. Supporto alla redazione del curriculum e simulazione colloqui.",
      municipio: "Municipio IV"
    }
  ],
  "Municipio V": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Torre Angela",
      address: "Via Jacopo Torriti 7, 00133 Roma",
      phone: "06 201 7542",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego della Regione Lazio competente per il quadrante Roma Est (compreso Municipio V: Prenestino, Centocelle, Pigneto, Tor Pignattara).",
      municipio: "Municipio V"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Palmiro Togliatti",
      address: "Via Prenestina 510, 00155 Roma",
      phone: "06 6710 6100",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Centro di Orientamento al Lavoro di Roma Capitale nel Municipio V. Inserimento lavorativo, corsi professionali e tirocini.",
      municipio: "Municipio V"
    }
  ],
  "Municipio VI": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Torre Angela",
      address: "Via Jacopo Torriti 7, 00133 Roma",
      phone: "06 201 7542",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego regionale competente per il Municipio VI (Tor Bella Monaca, Torre Angela, Giardinetti, Borghesiana, Finocchio).",
      municipio: "Municipio VI"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Gino Giugni",
      address: "Via della Tenuta di Torrenova 124, 00133 Roma",
      phone: "06 6710 4400",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Centro di Orientamento al Lavoro di Roma Capitale nel Municipio VI. Sportello di orientamento per giovani e disoccupati.",
      municipio: "Municipio VI"
    }
  ],
  "Municipio VII": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Cinecittà",
      address: "Viale Rolando Vignali 14, 00173 Roma",
      phone: "06 5168 2815",
      hours: "Lun - Ven: 09:00 - 12:00, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego competente per il Municipio VII (Tuscolano, Cinecittà, Appio Latino, Quadraro, San Giovanni).",
      municipio: "Municipio VII"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Luigi Petroselli - Vignali",
      address: "Viale Rolando Vignali 14, 00173 Roma",
      phone: "06 6710 70621",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Centro di Orientamento al Lavoro di Roma Capitale nel Municipio VII. Consulenza per la redazione del curriculum e opportunità professionali.",
      municipio: "Municipio VII"
    }
  ],
  "Municipio VIII": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Testaccio",
      address: "Via Galvani 108, 00153 Roma",
      phone: "06 5168 2771",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego competente per il Municipio VIII (Ostiense, Garbatella, San Paolo, Tor Marancia, Montagnola).",
      municipio: "Municipio VIII"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Guglielmo Marconi",
      address: "Largo Giuseppe Veratti 30, 00146 Roma",
      phone: "06 5460 2499",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Centro di Orientamento al Lavoro e centro documentazione rete COL di Roma Capitale nel Municipio VIII.",
      municipio: "Municipio VIII"
    }
  ],
  "Municipio IX": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Cinecittà",
      address: "Viale Rolando Vignali 14, 00173 Roma",
      phone: "06 5168 2815",
      hours: "Lun - Ven: 09:00 - 12:00, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego regionale competente per il quadrante Sud ed EUR (Municipio IX: EUR, Laurentina, Spinaceto, Torrino, Mostacciano).",
      municipio: "Municipio IX"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Guglielmo Marconi",
      address: "Largo Giuseppe Veratti 30, 00146 Roma",
      phone: "06 5460 2499",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Sportello municipale di riferimento per l'orientamento lavorativo dei residenti del quadrante EUR/Marconi.",
      municipio: "Municipio IX"
    }
  ],
  "Municipio X": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Ostia",
      address: "Via Domenico Baffigo 145, 00122 Roma (Ostia Lido)",
      phone: "06 5168 2733",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego della Regione Lazio competente per il Municipio X (Ostia, Acilia, Dragona, Infernetto, Casal Palocco). Indispensabile per iscrizione alle liste di disoccupazione e rilascio DID.",
      municipio: "Municipio X"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Pier Paolo Pasolini (Municipio X)",
      address: "Largo Capelvenere 13, 00125 Roma (Acilia / Ostia)",
      phone: "06 6710 4403",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Centro di Orientamento al Lavoro di Roma Capitale nel Municipio X. Offre bilancio di competenze, stesura del CV e supporto gratuito per trovare lavoro sul litorale.",
      municipio: "Municipio X"
    }
  ],
  "Municipio XI": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Primavalle",
      address: "Via Decio Azzolino 7, 00167 Roma",
      phone: "06 5168 2317",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego della Regione Lazio competente per i municipi occidentali (compreso Municipio XI: Portuense, Magliana, Trullo, Corviale).",
      municipio: "Municipio XI"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Guglielmo Marconi",
      address: "Largo Giuseppe Veratti 30, 00146 Roma",
      phone: "06 5460 2499",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Sportello municipale di orientamento al lavoro per i residenti del quadrante Marconi/Portuense/Magliana.",
      municipio: "Municipio XI"
    }
  ],
  "Municipio XII": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Primavalle",
      address: "Via Decio Azzolino 7, 00167 Roma",
      phone: "06 5168 2317",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego regionale competente per il quadrante Ovest (Municipio XII: Monteverde, Gianicolense, Pisana, Colli Portuensi).",
      municipio: "Municipio XII"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Portafuturo Testaccio",
      address: "Via Galvani 108, 00153 Roma",
      phone: "06 6960 1100",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Polo d'orientamento facilmente raggiungibile dai quartieri Monteverde e Gianicolense (linea tram 8).",
      municipio: "Municipio XII"
    }
  ],
  "Municipio XIII": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Primavalle",
      address: "Via Decio Azzolino 7, 00167 Roma",
      phone: "06 5168 2317",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego pubblico competente per il Municipio XIII (Aurelio, Boccea, Casalotti, Montespaccato).",
      municipio: "Municipio XIII"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Azzolino",
      address: "Via Decio Azzolino 7, 00167 Roma",
      phone: "06 6710 4406",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Centro di Orientamento al Lavoro di Roma Capitale nel quadrante Aurelio / Torrevecchia. Consulenza gratuita.",
      municipio: "Municipio XIII"
    }
  ],
  "Municipio XIV": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Primavalle",
      address: "Via Decio Azzolino 7, 00167 Roma",
      phone: "06 5168 2317",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego regionale competente per il Municipio XIV (Primavalle, Monte Mario, Trionfale, Ottavia, Balduina).",
      municipio: "Municipio XIV"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Azzolino",
      address: "Via Decio Azzolino 7, 00167 Roma",
      phone: "06 6710 4406",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Centro di Orientamento al Lavoro comunale nel Municipio XIV. Supporto stesura CV e orientamento professionale.",
      municipio: "Municipio XIV"
    }
  ],
  "Municipio XV": [
    {
      type: "Centro per l'Impiego",
      name: "Centro per l'Impiego Roma Primavalle",
      address: "Via Decio Azzolino 7, 00167 Roma",
      phone: "06 5168 2317",
      hours: "Lun - Ven: 09:00 - 12:30, Mar e Gio anche 14:45 - 16:45",
      description: "Centro per l'Impiego competente per il Municipio XV (Cassia, Flaminia, Ponte Milvio, Labaro, Prima Porta, Cesano).",
      municipio: "Municipio XV"
    },
    {
      type: "Centro Orientamento Lavoro",
      name: "COL Sempione",
      address: "Piazza Sempione 12, 00141 Roma",
      phone: "06 6710 8023",
      hours: "Lun - Gio: 09:00 - 14:00 (venerdì assistenza da remoto)",
      description: "Sportello municipale di orientamento al lavoro per i residenti del quadrante Roma Nord.",
      municipio: "Municipio XV"
    }
  ]
};
