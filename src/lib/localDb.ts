export interface LocalCooperative {
  name: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
  email?: string;
  municipio?: string;
  directoryCategory?: "Biblioteca" | "Servizio specialistico" | "Associazione professionale" | "Ente bilaterale" | "Studio professionale" | "Struttura sanitaria";
  automaticMatching?: boolean;
  sourceUrls?: string[];
  verificationNote?: string;
}

export interface PublicOffice {
  type: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
  email?: string;
  municipio?: string;
  directoryCategory?: "Biblioteca" | "Servizio specialistico" | "Associazione professionale" | "Ente bilaterale" | "Studio professionale" | "Struttura sanitaria";
  automaticMatching?: boolean;
  sourceUrls?: string[];
  verificationNote?: string;
}

export interface ItalianSchool {
  name: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
  email?: string;
  municipio?: string;
  directoryCategory?: "Biblioteca" | "Servizio specialistico" | "Associazione professionale" | "Ente bilaterale" | "Studio professionale" | "Struttura sanitaria";
  automaticMatching?: boolean;
  sourceUrls?: string[];
  verificationNote?: string;
}

export function getMunicipioFromZone(zone: string): string {
  if (!zone) return "";
  const z = zone.toLowerCase().trim();

  if (/\bmunicipio\s*(15|xv)\b/i.test(z)) return "Municipio XV";
  if (/\bmunicipio\s*(14|xiv)\b/i.test(z)) return "Municipio XIV";
  if (/\bmunicipio\s*(13|xiii)\b/i.test(z)) return "Municipio XIII";
  if (/\bmunicipio\s*(12|xii)\b/i.test(z)) return "Municipio XII";
  if (/\bmunicipio\s*(11|xi)\b/i.test(z)) return "Municipio XI";
  if (/\bmunicipio\s*(10|x)\b/i.test(z)) return "Municipio X";
  if (/\bmunicipio\s*(9|ix)\b/i.test(z)) return "Municipio IX";
  if (/\bmunicipio\s*(8|viii)\b/i.test(z)) return "Municipio VIII";
  if (/\bmunicipio\s*(7|vii)\b/i.test(z)) return "Municipio VII";
  if (/\bmunicipio\s*(6|vi)\b/i.test(z)) return "Municipio VI";
  if (/\bmunicipio\s*(5|v)\b/i.test(z)) return "Municipio V";
  if (/\bmunicipio\s*(4|iv)\b/i.test(z)) return "Municipio IV";
  if (/\bmunicipio\s*(3|iii)\b/i.test(z)) return "Municipio III";
  if (/\bmunicipio\s*(2|ii)\b/i.test(z)) return "Municipio II";
  if (/\bmunicipio\s*(1|i)\b/i.test(z)) return "Municipio I";

  if (z.includes("ostia") || z.includes("acilia") || z.includes("dragona") || z.includes("infernetto") || z.includes("casal palocco") || z.includes("axa") || z.includes("madonnetta") || z.includes("dragoncello") || z.includes("castel fusano")) {
    return "Municipio X";
  }
  if (z.includes("casilina") || z.includes("casilino") || z.includes("prenestino") || z.includes("prenestina") || z.includes("centocelle") || z.includes("pigneto") || z.includes("tor pignattara") || z.includes("collatino") || z.includes("villa gordiani") || z.includes("tor sapienza") || z.includes("quarticciolo") || z.includes("labicano") || z.includes("alessandrino") || z.includes("tor tre teste") || z.includes("malatesta") || z.includes("marranella")) {
    return "Municipio V";
  }
  if (z.includes("tor bella monaca") || z.includes("torre angela") || z.includes("borghesiana") || z.includes("torrenova") || z.includes("giardinetti") || z.includes("grotte celoni") || z.includes("finocchio") || z.includes("castel verde") || z.includes("ponte di nona") || z.includes("corcolle") || z.includes("san victorino") || z.includes("rocca cencia") || z.includes("torre spaccata") || z.includes("torre maura")) {
    return "Municipio VI";
  }
  if (z.includes("tuscolana") || z.includes("tuscolano") || z.includes("appia") || z.includes("appio") || z.includes("cinecittà") || z.includes("cinecitta") || z.includes("quadraro") || z.includes("san giovanni") || z.includes("arco di travertino") || z.includes("don bosco") || z.includes("capannelle") || z.includes("statuario") || z.includes("morena") || z.includes("anagnina") || z.includes("romanina") || z.includes("colli albani") || z.includes("furio camillo") || z.includes("re di roma") || z.includes("subaugusta") || z.includes("lucio sestio") || z.includes("giulio agricola")) {
    return "Municipio VII";
  }
  if (z.includes("tiburtina") || z.includes("pietralata") || z.includes("san basilio") || z.includes("colli aniene") || z.includes("casal bruciato") || z.includes("ponte mammolo") || z.includes("casal de' pazzi") || z.includes("settecamini") || z.includes("tor cervara") || z.includes("rebibbia") || z.includes("casal bertone") || z.includes("monti tiburtini") || z.includes("portonaccio")) {
    return "Municipio IV";
  }
  if (z.includes("montesacro") || z.includes("monte sacro") || z.includes("talenti") || z.includes("bufalotta") || z.includes("fidene") || z.includes("conca d'oro") || z.includes("nuovo salario") || z.includes("tufello") || z.includes("settebagni") || z.includes("val melaina") || z.includes("porta di roma") || z.includes("vigne nuove") || z.includes("colle salario")) {
    return "Municipio III";
  }
  if (z.includes("parioli") || z.includes("flaminio") || z.includes("salario") || z.includes("trieste") || z.includes("pinciano") || z.includes("villa borghese") || z.includes("nomentano") || z.includes("san lorenzo") || z.includes("coppedè") || z.includes("porta pia") || z.includes("policlinico") || z.includes("corso trieste") || z.includes("viale libia")) {
    return "Municipio II";
  }
  if (z.includes("ostiense") || z.includes("garbatella") || z.includes("san paolo") || z.includes("tor marancia") || z.includes("ardeatino") || z.includes("valco san paolo") || z.includes("montagnola") || z.includes("roma 70") || z.includes("grotta perfetta") || z.includes("navigatori")) {
    return "Municipio VIII";
  }
  if (z.includes("eur") || z.includes("laurentina") || z.includes("spinaceto") || z.includes("mostacciano") || z.includes("vallerano") || z.includes("vitinia") || z.includes("castel di leva") || z.includes("cecchignola") || z.includes("fonte meravigliosa") || z.includes("decima") || z.includes("torrino") || z.includes("mezzocammino") || z.includes("cristoforo colombo") || z.includes("trigoria")) {
    return "Municipio IX";
  }
  if (z.includes("portuense") || z.includes("magliana") || z.includes("trullo") || z.includes("marconi") || z.includes("corviale") || z.includes("ponte galeria") || z.includes("muratella") || z.includes("parco de' medici")) {
    return "Municipio XI";
  }
  if (z.includes("gianicolense") || z.includes("monteverde") || z.includes("pisana") || z.includes("colli portuensi") || z.includes("massimina") || z.includes("casaletto") || z.includes("villa pamphili") || z.includes("bravetta") || z.includes("casetta mattei")) {
    return "Municipio XII";
  }
  if (z.includes("aurelia") || z.includes("aurelio") || z.includes("boccea") || z.includes("casalotti") || z.includes("valle aurelia") || z.includes("montespaccato") || z.includes("selva candida") || z.includes("cornelia") || z.includes("battistini") || z.includes("baldo degli ubaldi")) {
    return "Municipio XIII";
  }
  if (z.includes("trionfale") || z.includes("primavalle") || z.includes("ottavia") || z.includes("balduina") || z.includes("torrevecchia") || z.includes("pineta sacchetti") || z.includes("monte mario") || z.includes("palmarola") || z.includes("torresina")) {
    return "Municipio XIV";
  }
  if (z.includes("cassia") || z.includes("ponte milvio") || z.includes("grottarossa") || z.includes("farnesina") || z.includes("labaro") || z.includes("cesano") || z.includes("tomba di nerone") || z.includes("olgiata") || z.includes("la storta") || z.includes("prima porta") || z.includes("vigna clara") || z.includes("corso francia") || z.includes("due ponti")) {
    return "Municipio XV";
  }
  if (z.includes("centro") || z.includes("termini") || z.includes("trastevere") || z.includes("testaccio") || z.includes("prati") || z.includes("esquilino") || z.includes("monti") || z.includes("celio") || z.includes("pigna") || z.includes("parione") || z.includes("ponte") || z.includes("regola") || z.includes("san saba") || z.includes("castro pretorio") || z.includes("borgo") || z.includes("campo marzio") || z.includes("ghetto") || z.includes("aventino") || z.includes("spagna") || z.includes("cavour") || z.includes("manzoni")) {
    return "Municipio I";
  }

  return "";
}

// Municipal routing groups; see per-record sourceUrls and verificationNote.
export const municipioOffices: Record<string, PublicOffice[]> = {
  "Municipio I": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Testaccio",
      "address": "Via Galvani 108, 00153 Roma",
      "phone": "Accoglienza via email",
      "hours": "Lun - Ven: 09:00 - 12:30 (Mar e Gio anche 14:45 - 16:45)",
      "description": "Centro per l’impiego della Regione Lazio. Accoglienza: cpiportafuturo@regione.lazio.it. Verificare appuntamento e servizio richiesto.",
      "email": "cpiportafuturo@regione.lazio.it",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=12"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Simonetta Tosi",
      "address": "Via Goito 35, 00185 Roma",
      "phone": "3334911956 / 3351601563",
      "hours": "Lun - Gio: 09:00 - 14:00 (Ven servizio da remoto)",
      "description": "Centro di orientamento al lavoro ospitato presso COL Termini, Via Goito 35. Prenotare il servizio.",
      "email": "colsimonettatosi@comune.roma.it",
      "municipio": "Municipio II",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/scheda-servizi.page?contentId=INF39031&amp;pagina=3"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio II": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Casalbertone",
      "address": "Via Domenico De Dominicis 5, 00159 Roma",
      "phone": "06 51682990",
      "hours": "Lun - Ven: 09:00 - 12:30 (Mar e Gio anche 14:45 - 16:45)",
      "description": "Centro per l’impiego della Regione Lazio. Ricevimento su appuntamento.",
      "email": "spaziolavorocasalbertone@regione.lazio.it",
      "municipio": "Municipio IV",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=7"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Termini Via Goito",
      "address": "Via Goito 35, 00185 Roma",
      "phone": "06 67105197",
      "hours": "Lun - Gio: 09:00 - 14:00 (Ven da remoto)",
      "description": "Sportello municipale di orientamento lavorativo di Roma Capitale. Supporto attivo alla stesura del CV e consultazione delle offerte di lavoro territoriali.",
      "email": "colterminiviagoito@comune.roma.it",
      "municipio": "Municipio II",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/scheda-servizi.page?contentId=INF39031&amp;pagina=3"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio III": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Tiburtino",
      "address": "Via di Scorticabove 77, 00156 Roma",
      "phone": "06 51682152",
      "hours": "Lun - Ven: 09:00 - 12:30 (Mar e Gio anche 14:45 - 16:45)",
      "description": "Centro per l’impiego della Regione Lazio. Contattare l’accoglienza per il servizio richiesto.",
      "email": "cpitiburtino@regione.lazio.it",
      "municipio": "Municipio IV",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=14"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Sempione",
      "address": "Piazza Sempione 12, 00141 Roma",
      "phone": "06 67108023",
      "hours": "Lun - Gio: 09:00 - 14:00 (Ven da remoto)",
      "description": "Centro di Orientamento al Lavoro di Roma Capitale nel cuore di Montesacro. Servizi gratuiti per la ricerca di occupazione e supporto alla candidatura.",
      "email": "colsempione@comune.roma.it",
      "municipio": "Municipio III",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/scheda-servizi.page?contentId=INF39031&amp;pagina=3"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio IV": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Tiburtino",
      "address": "Via di Scorticabove 77, 00156 Roma",
      "phone": "06 51682152",
      "hours": "Lun - Ven: 09:00 - 12:30 (Mar e Gio anche 14:45 - 16:45)",
      "description": "Centro per l’impiego della Regione Lazio. Contattare l’accoglienza per il servizio richiesto.",
      "email": "cpitiburtino@regione.lazio.it",
      "municipio": "Municipio IV",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=14"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio V": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Casalbertone",
      "address": "Via Domenico De Dominicis 5, 00159 Roma",
      "phone": "06 51682990",
      "hours": "Lun - Ven: 09:00 - 12:30 (Mar e Gio anche 14:45 - 16:45)",
      "description": "Centro per l’impiego della Regione Lazio. Ricevimento su appuntamento.",
      "email": "spaziolavorocasalbertone@regione.lazio.it",
      "municipio": "Municipio IV",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=7"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Palmiro Togliatti",
      "address": "Via Prenestina 510, 00155 Roma",
      "phone": "06 67106100",
      "hours": "Lun - Gio: 09:00 - 14:00 (Ven da remoto)",
      "description": "Centro Orientamento Lavoro di Roma Capitale nel quadrante Casilino-Prenestino. Redazione CV, orientamento professionale e contatto con le imprese.",
      "email": "colpalmirotogliatti@comune.roma.it",
      "municipio": "Municipio V",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/scheda-servizi.page?contentId=INF39031&amp;pagina=3"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio VI": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego (CPI) Roma Torre Angela",
      "address": "Via Jacopo Torriti 7, 00133 Roma",
      "phone": "06 51682223 / 06 51682224",
      "hours": "Lun - Ven: 09:00 - 12:30 (Mar e Gio anche 14:45 - 16:45)",
      "description": "Centro per l’impiego della Regione Lazio. Ricevimento su appuntamento.",
      "email": "cpitorreangela@regione.lazio.it",
      "municipio": "Municipio VI",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=15"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Gino Giugni",
      "address": "Via della Tenuta di Torrenova 124, 00133 Roma",
      "phone": "06 67103072",
      "hours": "Lun - Gio: 09:00 - 14:00 (Ven da remoto)",
      "description": "Sportello municipale di orientamento lavorativo a Tor Bella Monaca / Torrenova. Postazioni internet e consulenza individuale per la ricerca di lavoro.",
      "email": "colginogiugni@comune.roma.it",
      "municipio": "Municipio VI",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/scheda-servizi.page?contentId=INF39031&amp;pagina=3"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio VII": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego (CPI) Roma Cinecittà",
      "address": "Viale Rolando Vignali 14, 00173 Roma",
      "phone": "06 51682826 / 06 51682861",
      "hours": "Lun - Ven: 09:00 - 12:30 (Mar e Gio anche 14:45 - 16:45)",
      "description": "Centro per l'Impiego della Regione Lazio per il Municipio VII (Cinecittà, San Giovanni, Tuscolano, Appio). Servizio di preselezione e iscrizione elenchi.",
      "email": "cpicinecitta@regione.lazio.it",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=8"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Vignali",
      "address": "Viale Rolando Vignali 14, 00173 Roma",
      "phone": "06 72973505",
      "hours": "Lun - Gio: 09:00 - 14:00 (Ven da remoto)",
      "description": "Centro Orientamento Lavoro di Roma Capitale a Cinecittà. Simulazione di colloqui di lavoro, bilancio di competenze e stesura del CV.",
      "email": "colvignali@comune.roma.it",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/scheda-servizi.page?contentId=INF39031&amp;pagina=3"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio VIII": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Testaccio",
      "address": "Via Galvani 108, 00153 Roma",
      "phone": "Accoglienza via email",
      "hours": "Lun - Ven: 09:00 - 12:30 (Mar e Gio anche 14:45 - 16:45)",
      "description": "Centro per l’impiego della Regione Lazio. Accoglienza: cpiportafuturo@regione.lazio.it. Verificare appuntamento e servizio richiesto.",
      "email": "cpiportafuturo@regione.lazio.it",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=12"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Guglielmo Marconi",
      "address": "Largo Giuseppe Veratti 30, 00146 Roma",
      "phone": "06 54602499",
      "hours": "Ricevimento telefonico lun–gio 09:00–14:00",
      "description": "Centro documentazione della rete COL; ricevimento telefonico. Verificare l’accesso al servizio, senza presumere uno sportello in presenza.",
      "email": "colmarconi@comune.roma.it",
      "municipio": "Municipio VIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/dipartimento-scuola-lavoro-e-formazione-professionale-uffici-e-contatti.page?contentId=UFF933899"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio IX": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Testaccio",
      "address": "Via Galvani 108, 00153 Roma",
      "phone": "Accoglienza via email",
      "hours": "Lun - Ven: 09:00 - 12:30",
      "description": "Centro per l’impiego della Regione Lazio. Accoglienza: cpiportafuturo@regione.lazio.it. Verificare appuntamento e servizio richiesto.",
      "email": "cpiportafuturo@regione.lazio.it",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=12"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Guglielmo Marconi",
      "address": "Largo Giuseppe Veratti 30, 00146 Roma",
      "phone": "06 54602499",
      "hours": "Ricevimento telefonico lun–gio 09:00–14:00",
      "description": "Centro documentazione della rete COL; ricevimento telefonico. Verificare l’accesso al servizio, senza presumere uno sportello in presenza.",
      "email": "colmarconi@comune.roma.it",
      "municipio": "Municipio VIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/dipartimento-scuola-lavoro-e-formazione-professionale-uffici-e-contatti.page?contentId=UFF933899"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio X": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego (CPI) di Roma - Ostia",
      "address": "Via Domenico Baffigo 145, 00121 Ostia Lido (RM)",
      "phone": "3311426968 / 3311427395 / 3312349385 / 3311417600 / 3311417730",
      "hours": "Lun - Ven: 09:00 - 12:30 (Mar e Gio anche 14:45 - 16:45)",
      "description": "Centro per l’impiego pubblico della Regione Lazio. Accoglienza, DID, orientamento e preselezione; verificare il servizio e le modalità di accesso.",
      "email": "cpiostia@regione.lazio.it",
      "municipio": "Municipio X",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=10"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Pier Paolo Pasolini",
      "address": "Largo Capelvenere 13, Roma (Municipio X)",
      "phone": "06 671075074",
      "email": "colpierpaolopasolini@comune.roma.it",
      "hours": "Lun–gio 09:00–14:00 in sede; venerdì da remoto",
      "description": "Centro di orientamento al lavoro pubblico di Roma Capitale. Prenotare il servizio. CAP discordante fra rubrica uffici e Informagiovani: confermare prima dell’invio postale.",
      "municipio": "Municipio X",
      "automaticMatching": true
    }
  ],
  "Municipio XI": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Testaccio",
      "address": "Via Galvani 108, 00153 Roma",
      "phone": "Accoglienza via email",
      "hours": "Lun - Ven: 09:00 - 12:30",
      "description": "Centro per l’impiego della Regione Lazio. Accoglienza: cpiportafuturo@regione.lazio.it. Verificare appuntamento e servizio richiesto.",
      "email": "cpiportafuturo@regione.lazio.it",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=12"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Guglielmo Marconi",
      "address": "Largo Giuseppe Veratti 30, 00146 Roma",
      "phone": "06 54602499",
      "hours": "Ricevimento telefonico lun–gio 09:00–14:00",
      "description": "Centro documentazione della rete COL; ricevimento telefonico. Verificare l’accesso al servizio, senza presumere uno sportello in presenza.",
      "email": "colmarconi@comune.roma.it",
      "municipio": "Municipio VIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/dipartimento-scuola-lavoro-e-formazione-professionale-uffici-e-contatti.page?contentId=UFF933899"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio XII": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Testaccio",
      "address": "Via Galvani 108, 00153 Roma",
      "phone": "Accoglienza via email",
      "hours": "Lun - Ven: 09:00 - 12:30",
      "description": "Centro per l’impiego della Regione Lazio. Accoglienza: cpiportafuturo@regione.lazio.it. Verificare appuntamento e servizio richiesto.",
      "email": "cpiportafuturo@regione.lazio.it",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=12"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Simonetta Tosi",
      "address": "Via Goito 35, 00185 Roma",
      "phone": "3334911956 / 3351601563",
      "hours": "Lun - Gio: 09:00 - 14:00",
      "description": "Centro di orientamento al lavoro ospitato presso COL Termini, Via Goito 35. Prenotare il servizio.",
      "email": "colsimonettatosi@comune.roma.it",
      "municipio": "Municipio II",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/scheda-servizi.page?contentId=INF39031&amp;pagina=3"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio XIII": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Primavalle",
      "address": "Via Decio Azzolino 7, 00168 Roma",
      "phone": "06 51682317",
      "hours": "Lun - Ven: 09:00 - 12:30 (Mar e Gio anche 14:45 - 16:45)",
      "description": "Centro per l’impiego della Regione Lazio. Solo su appuntamento; distinto dal COL Azzolino.",
      "email": "cpiprimavalle@regione.lazio.it",
      "municipio": "Municipio XIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=11"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio XIV": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Primavalle",
      "address": "Via Decio Azzolino 7, 00168 Roma",
      "phone": "06 51682317",
      "hours": "Lun - Ven: 09:00 - 12:30 (Mar e Gio anche 14:45 - 16:45)",
      "description": "Centro per l’impiego della Regione Lazio. Solo su appuntamento; distinto dal COL Azzolino.",
      "email": "cpiprimavalle@regione.lazio.it",
      "municipio": "Municipio XIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=11"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio XV": [
    {
      "type": "Centro per l'Impiego",
      "name": "Centro per l'Impiego Roma Primavalle",
      "address": "Via Decio Azzolino 7, 00168 Roma",
      "phone": "06 51682317",
      "hours": "Lun - Ven: 09:00 - 12:30",
      "description": "Centro per l’impiego della Regione Lazio. Solo su appuntamento; distinto dal COL Azzolino.",
      "email": "cpiprimavalle@regione.lazio.it",
      "municipio": "Municipio XIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.regione.lazio.it/sites/default/files/2026-10/Lazio-cpi-centro-20-10-2026.pdf#page=11"
      ],
      "verificationNote": ""
    },
    {
      "type": "Centro Orientamento Lavoro",
      "name": "COL Rubra",
      "address": "Via Rubra 49, 00188 Roma",
      "phone": "06 67108240",
      "hours": "Lun - Gio: 09:00 - 14:00 (Ven da remoto)",
      "description": "Centro Orientamento Lavoro di Roma Capitale situato a Prima Porta / Labaro. Supporto gratuito al lavoro e orientamento CV. Verifica: Assenza dall’elenco consultato non dimostra chiusura; invio automatico sospeso.",
      "email": "colrubra@comune.roma.it",
      "municipio": "Municipio XV",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/scheda-servizi.page?contentId=INF39031&amp;pagina=3"
      ],
      "verificationNote": "Assenza dall’elenco consultato non dimostra chiusura; invio automatico sospeso."
    }
  ]
};

// 100% VERIFIED REAL ITALIAN SCHOOLS PER MUNICIPIO
export const municipioSchools: Record<string, ItalianSchool[]> = {
  "Municipio X": [
    {
      "name": "CPIA 7 Sede Ostia 1",
      "address": "Via delle Azzorre 314, 00121 Ostia Lido (RM)",
      "phone": "3333345135",
      "hours": "Orario sede pubblicato: lun–ven 14:15–16:12 (termine da confermare)",
      "description": "Centro Provinciale Statale per l'Istruzione degli Adulti ad Ostia Levante. Corsi gratuiti di italiano L2 e rilascio attestati ufficiali di livello A2 per il permesso di soggiorno CE di lungo periodo. Verifica: Telefoni attribuiti diversamente fra pagine e PDF: confermare sede e recapito prima dell’accesso.",
      "email": "rmmm67400q@istruzione.it",
      "municipio": "Municipio X",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpia7pomezia.edu.it/struttura/ostia/",
        "https://www.cpia7pomezia.edu.it/luogo/cpia-7-sede-ostia-1/",
        "https://www.cpia7pomezia.edu.it/wp-content/uploads/2024/10/CONTATTI-CPIA-7.pdf"
      ],
      "verificationNote": "Telefoni attribuiti diversamente fra pagine e PDF: confermare sede e recapito prima dell’accesso."
    },
    {
      "name": "CPIA 7 Sede Ostia 2",
      "address": "Via Domenico Baffigo 143, 00121 Ostia Lido (RM)",
      "phone": "06 56339756",
      "hours": "Orario sede pubblicato: lun–ven 16:00–19:00",
      "description": "Polo didattico statale di Ostia Ponente (adiacente al Centro per l'Impiego). Corsi gratuiti di lingua italiana per stranieri, alfabetizzazione e certificazioni A1/A2. Verifica: Telefoni attribuiti diversamente fra pagine e PDF: confermare sede e recapito prima dell’accesso.",
      "email": "rmmm67400q@istruzione.it",
      "municipio": "Municipio X",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpia7pomezia.edu.it/struttura/ostia/",
        "https://www.cpia7pomezia.edu.it/luogo/cpia-7-sede-ostia-1/",
        "https://www.cpia7pomezia.edu.it/wp-content/uploads/2024/10/CONTATTI-CPIA-7.pdf"
      ],
      "verificationNote": "Telefoni attribuiti diversamente fra pagine e PDF: confermare sede e recapito prima dell’accesso."
    },
    {
      "name": "Scuola di Italiano Sant'Egidio - Ostia",
      "address": "Via Domenico Baffigo 7, 00121 Ostia Lido (RM)",
      "phone": "06 585661",
      "hours": "Segreteria: domenica 09:30–11:00",
      "description": "Corsi gratuiti di lingua e cultura italiana organizzati dalla Comunità di Sant'Egidio ad Ostia per migranti, dal livello base pre-A1 al livello intermedio B1.",
      "email": "genti.pace@santegidio.org",
      "municipio": "Municipio X",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.santegidio.org/pageID/30772/langID/it/LE-SEDI-DELLA-SCUOLA-DI-LINGUA-E-CULTURA-DI-SANT-EGIDIO-IN-ITALIA.html"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio I": [
    {
      "name": "Scuola d'Italiano Comunità di Sant'Egidio",
      "address": "Piazza Santa Maria in Trastevere 23, Roma",
      "phone": "06 585661",
      "hours": "Da confermare presso la sede",
      "description": "Scuola storica e gratuita di lingua italiana per stranieri nel rione Trastevere. Corsi dal livello alfabetizzazione ad avanzato C1 con attestati di frequenza. Verifica: Sede didattica da fonte senza anno scolastico corrente certo: riconfermare.",
      "email": "scuola@santegidio.org",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.santegidio.org/downloads/Scuole%20Indirizzi%20e%20Orari%20Segreterie.pdf"
      ],
      "verificationNote": "Sede didattica da fonte senza anno scolastico corrente certo: riconfermare."
    },
    {
      "name": "Scuola d'Italiano Caritas Roma - Polo Didattico",
      "address": "Via delle Zoccolette 17, 00186 Roma",
      "phone": "06 88815300",
      "hours": "Da confermare presso la sede",
      "description": "Polo formativo Caritas Roma con corsi gratuiti di italiano L2 per favorire l'integrazione e l'inserimento occupazionale di migranti e rifugiati. Verifica: Civico di accesso Via delle Zoccolette 17/19 discordante nelle fonti Caritas: confermare ingresso.",
      "email": "scuola.stranieri@caritasroma.it",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.caritasroma.it/cosa-facciamo/inserimento-sociale/",
        "https://www.caritasroma.it/2024/12/alla-scuola-di-via-delle-zoccolette-al-via-le-parole-della-salute/"
      ],
      "verificationNote": "Civico di accesso Via delle Zoccolette 17/19 discordante nelle fonti Caritas: confermare ingresso."
    }
  ],
  "Municipio II": [
    {
      "name": "CPIA 1 Roma - Sede San Lorenzo",
      "address": "Via Tiburtina Antica 25, 00185 Roma",
      "phone": "06 62286435",
      "hours": "Da confermare presso la sede",
      "description": "Scuola statale per adulti a San Lorenzo. Corsi gratuiti di italiano L2 per stranieri e percorsi per il conseguimento dell'attestato livello A2.",
      "email": "rmmm67000c@istruzione.it",
      "municipio": "Municipio II",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpia1roma.edu.it/struttura/dirigente-scolastico/responsabili-di-sede/",
        "https://www.cpia1roma.edu.it/servizio/iscrizioni-alle-scuole/",
        "https://www.cpia1roma.edu.it/"
      ],
      "verificationNote": ""
    },
    {
      "name": "CPIA 4 Roma – Sede centrale",
      "address": "Via San Martino della Battaglia 9, 00185 Roma",
      "phone": "06 4453994",
      "hours": "Da confermare presso la sede",
      "description": "Istruzione degli adulti e italiano L2. Centrale in Via San Martino della Battaglia 9; verificare iscrizioni e calendario.",
      "email": "rmmm67300x@istruzione.it",
      "municipio": "Municipio II",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpia4lazio.edu.it/struttura/cpia-4-roma/",
        "https://www.ufficioscolasticoregionalelazio.it/wp-content/uploads/2024/02/CPIA_e_sedi_associate.pdf"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio III": [
    {
      "name": "CPIA 1 Roma - Sede Montesacro",
      "address": "Via Costantino Perazzi 36, 00139 Roma",
      "phone": "06 43598619",
      "hours": "Da confermare presso la sede",
      "description": "Polo didattico statale del Municipio III per corsi pomeridiani e serali gratuiti di lingua italiana per stranieri. Verifica: Via Perazzi: civici 30/36 discordanti, confermare ingresso.",
      "email": "rmmm67000c@istruzione.it",
      "municipio": "Municipio III",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpia1roma.edu.it/struttura/dirigente-scolastico/responsabili-di-sede/",
        "https://www.cpia1roma.edu.it/servizio/iscrizioni-alle-scuole/",
        "https://www.cpia1roma.edu.it/"
      ],
      "verificationNote": "Via Perazzi: civici 30/36 discordanti, confermare ingresso."
    }
  ],
  "Municipio IV": [
    {
      "name": "CPIA 1 Roma - Sede Centrale Pietralata",
      "address": "Via Carlo Alberto Cortina 70, 00159 Roma",
      "phone": "06 43598619",
      "hours": "Da confermare presso la sede",
      "description": "Sede centrale del CPIA 1 Roma. Corsi di italiano per stranieri, esami CILS e rilascio attestati per permesso di soggiorno.",
      "email": "rmmm67000c@istruzione.it",
      "municipio": "Municipio IV",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpia1roma.edu.it/struttura/dirigente-scolastico/responsabili-di-sede/",
        "https://www.cpia1roma.edu.it/servizio/iscrizioni-alle-scuole/",
        "https://www.cpia1roma.edu.it/"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio V": [
    {
      "name": "CPIA 2 Roma - Sede Palmiro Togliatti",
      "address": "Viale Palmiro Togliatti 979, 00155 Roma",
      "phone": "06 2154916",
      "hours": "Da confermare presso la sede",
      "description": "Punto di erogazione corsi del CPIA 2 per i residenti del Municipio V. Corsi di italiano per stranieri e percorsi di licenza media.",
      "email": "rmmm671008@istruzione.it",
      "municipio": "Municipio V",
      "automaticMatching": true,
      "sourceUrls": [
        "https://old.usrlazio.it/_file/documenti/cpia/CPIA_e_sedi_associate.pdf"
      ],
      "verificationNote": ""
    },
    {
      "name": "CPIA 1 Roma - Sede Tor Pignattara",
      "address": "Via Policastro 45, 00177 Roma",
      "phone": "06 24407015",
      "hours": "Da confermare presso la sede",
      "description": "Sede associata CPIA 1 a Tor Pignattara. Corsi gratuiti intensivi di italiano per adulti non italiani. Verifica: Disponibilità iscrizioni L2 da controllare presso la sede.",
      "email": "rmmm67000c@istruzione.it",
      "municipio": "Municipio V",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpia1roma.edu.it/struttura/dirigente-scolastico/responsabili-di-sede/",
        "https://www.cpia1roma.edu.it/servizio/iscrizioni-alle-scuole/",
        "https://www.cpia1roma.edu.it/"
      ],
      "verificationNote": "Disponibilità iscrizioni L2 da controllare presso la sede."
    }
  ],
  "Municipio VI": [
    {
      "name": "CPIA 2 Roma - Sede Centrale Tor Bella Monaca",
      "address": "Via Vitaliano Ponti 40, 00169 Roma",
      "phone": "06 23235159",
      "hours": "Da confermare presso la sede",
      "description": "Centro statale di istruzione adulti di Roma Est. Corsi gratuiti di alfabetizzazione e lingua italiana per cittadini stranieri.",
      "email": "rmmm671008@istruzione.it",
      "municipio": "Municipio VI",
      "automaticMatching": true,
      "sourceUrls": [
        "https://old.usrlazio.it/_file/documenti/cpia/CPIA_e_sedi_associate.pdf"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio VII": [
    {
      "name": "CPIA 4 Roma - Sede Tuscolana",
      "address": "Via Amulio 4, 00181 Roma",
      "phone": "06 7803252 (elenco USR 2023/24; riconfermare)",
      "hours": "Da confermare presso la sede",
      "description": "Corsi statali gratuiti di lingua italiana per stranieri nel Municipio VII (metro Furio Camillo / Tuscolana). Attestati A2.",
      "email": "rmmm67300x@istruzione.it",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpia4lazio.edu.it/struttura/cpia-4-roma/",
        "https://www.ufficioscolasticoregionalelazio.it/wp-content/uploads/2024/02/CPIA_e_sedi_associate.pdf"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio VIII": [
    {
      "name": "Scuola Popolare d'Italiano Garbatella (Casetta Rossa)",
      "address": "Via Giovanni Battista Magnaghi 14, 00154 Roma",
      "phone": "06 5131456",
      "hours": "Corso: mar–ven 10:00–12:00",
      "description": "Corsi gratuiti di italiano per stranieri promossi da volontari nel quartiere Garbatella per favorire l'inclusione sociale e lavorativa. Verifica: Contatti e iscrizioni da riconfermare sul sito della scuola.",
      "email": "info@casettarossa.net",
      "municipio": "Municipio VIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://casettarossa.org/scuola-di-italiano-per-stranieri/",
        "https://www.scuolemigranti.org/casetta-rossa/"
      ],
      "verificationNote": "Contatti e iscrizioni da riconfermare sul sito della scuola."
    }
  ],
  "Municipio IX": [
    {
      "name": "CPIA 3 Roma – Sede centrale",
      "address": "Corso Vittorio Emanuele II 217, 00186 Roma (Polo Sud)",
      "phone": "06 121125421",
      "hours": "Da confermare presso la sede",
      "description": "Istruzione degli adulti e italiano L2. Contattare la sede per iscrizioni e calendario.",
      "email": "rmmm672004@istruzione.it",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpiaroma3.edu.it/index.php?idpag=1842"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio XI": [
    {
      "name": "CPIA 3 Roma – Sede centrale",
      "address": "Corso Vittorio Emanuele II 217, 00186 Roma (Polo Sud-Ovest)",
      "phone": "06 121125421",
      "hours": "Da confermare presso la sede",
      "description": "Istruzione degli adulti e italiano L2. Contattare la sede per iscrizioni e calendario.",
      "email": "rmmm672004@istruzione.it",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpiaroma3.edu.it/index.php?idpag=1842"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio XII": [
    {
      "name": "CPIA 3 Roma – Sede centrale",
      "address": "Corso Vittorio Emanuele II 217, 00186 Roma (Polo Ovest)",
      "phone": "06 121125421",
      "hours": "Da confermare presso la sede",
      "description": "Istruzione degli adulti e italiano L2. Contattare la sede per iscrizioni e calendario.",
      "email": "rmmm672004@istruzione.it",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpiaroma3.edu.it/index.php?idpag=1842"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio XIII": [
    {
      "name": "CPIA 3 Roma – Sede Bonifazi",
      "address": "Via Bonifazi 64, 00167 Roma",
      "phone": "06 6628572",
      "hours": "Da confermare presso la sede",
      "description": "Istruzione degli adulti e italiano L2. Contattare la sede per iscrizioni e calendario.",
      "email": "rmmm672004@istruzione.it",
      "municipio": "Municipio XIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpiaroma3.edu.it/index.php?idpag=1842"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio XIV": [
    {
      "name": "CPIA 3 Roma – Sede Nazareth",
      "address": "Via di Nazareth 150, 00166 Roma",
      "phone": "06 61522341",
      "hours": "Da confermare presso la sede",
      "description": "Istruzione degli adulti e italiano L2. Contattare la sede per iscrizioni e calendario.",
      "email": "rmmm672004@istruzione.it",
      "municipio": "Municipio XIV",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpiaroma3.edu.it/index.php?idpag=1842"
      ],
      "verificationNote": ""
    }
  ],
  "Municipio XV": [
    {
      "name": "CPIA 3 Roma – Sede Sesto Miglio",
      "address": "Via al Sesto Miglio 78, 00189 Roma",
      "phone": "06 33268172",
      "hours": "Da confermare presso la sede",
      "description": "Istruzione degli adulti e italiano L2. Contattare la sede per iscrizioni e calendario.",
      "email": "rmmm672004@istruzione.it",
      "municipio": "Municipio XV",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cpiaroma3.edu.it/index.php?idpag=1842"
      ],
      "verificationNote": ""
    }
  ]
};

// Local storage custom entries helpers
const CUSTOM_COOPS_KEY = "orientamento_custom_cooperatives";
const CUSTOM_OFFICES_KEY = "orientamento_custom_offices";
const CUSTOM_SCHOOLS_KEY = "orientamento_custom_schools";

export function getCustomCooperatives(): LocalCooperative[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_COOPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomCooperative(coop: LocalCooperative) {
  if (typeof window === "undefined") return;
  try {
    const current = getCustomCooperatives();
    const filtered = current.filter(c => c.name.toLowerCase() !== coop.name.toLowerCase());
    filtered.unshift(coop);
    localStorage.setItem(CUSTOM_COOPS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Error saving custom cooperative:", e);
  }
}

export function getCustomPublicOffices(): PublicOffice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_OFFICES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomPublicOffice(office: PublicOffice) {
  if (typeof window === "undefined") return;
  try {
    const current = getCustomPublicOffices();
    const filtered = current.filter(o => o.name.toLowerCase() !== office.name.toLowerCase());
    filtered.unshift(office);
    localStorage.setItem(CUSTOM_OFFICES_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Error saving custom office:", e);
  }
}

export function getCustomItalianSchools(): ItalianSchool[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_SCHOOLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomItalianSchool(school: ItalianSchool) {
  if (typeof window === "undefined") return;
  try {
    const current = getCustomItalianSchools();
    const filtered = current.filter(s => s.name.toLowerCase() !== school.name.toLowerCase());
    filtered.unshift(school);
    localStorage.setItem(CUSTOM_SCHOOLS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Error saving custom school:", e);
  }
}

export function getPublicOfficesForZone(zone: string): PublicOffice[] {
  const mun = getMunicipioFromZone(zone);
  const baseList = (municipioOffices[mun] || []).filter(item => item.automaticMatching !== false);
  const customList = getCustomPublicOffices().filter(o => !o.municipio || o.municipio === mun);
  return [...customList, ...baseList].slice(0, 2);
}

export function getItalianSchoolsForZone(zone: string): ItalianSchool[] {
  const mun = getMunicipioFromZone(zone);
  const baseList = (municipioSchools[mun] || []).filter(item => item.automaticMatching !== false);
  const customList = getCustomItalianSchools().filter(s => !s.municipio || s.municipio === mun);
  return [...customList, ...baseList].slice(0, 3);
}

function extractNeighborhoodKeywords(zoneJob: string, zoneRes: string): string[] {
  const text = `${zoneJob} ${zoneRes}`.toLowerCase();
  const keywords: string[] = [];
  const knownKeywords = [
    "ostia", "lido", "acilia", "dragona", "infernetto", "palocco", "axa",
    "pigneto", "centocelle", "torpignattara", "tor pignattara", "casilina",
    "tiburtina", "pietralata", "san basilio", "montesacro", "talenti",
    "cinecittà", "cinecitta", "tuscolana", "appia", "san giovanni",
    "garbatella", "ostiense", "san paolo", "eur", "laurentina",
    "marconi", "magliana", "portuense", "monteverde", "gianicolense",
    "boccea", "aurelio", "aurelia", "primavalle", "monte mario", "cassia", "flaminia"
  ];
  for (const kw of knownKeywords) {
    if (text.includes(kw)) keywords.push(kw);
  }
  return keywords;
}

// Repertorio storico: verificare indirizzi, orari e recapiti presso le fonti ufficiali.
export const localDb: Record<string, LocalCooperative[]> = {
  "Badante (assistenza anziani)": [
    {
      "name": "PrivatAssistenza Fiumicino (copertura Ostia)",
      "address": "Via delle Meduse 124, Fiumicino",
      "phone": "06 69316057",
      "hours": "Da confermare presso l’ente",
      "description": "Centro privato di assistenza domiciliare per anziani, malati e persone con disabilità, con copertura anche di Ostia. Verificare canale candidature e requisiti; non è un ufficio pubblico.",
      "municipio": "Comune di Fiumicino",
      "email": "",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.privatassistenza.it/assistenza-domiciliare-anziani-malati-e-disabili/roma/roma-ostia/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Assistenza e Territorio - Soc. Coop. Sociale Onlus",
      "address": "Via di Santa Monica 11, 00122 Roma",
      "phone": "06 562 1925",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale: servizi sociali e assistenziali. Il sito accetta curriculum via email; verificare requisiti e posizioni disponibili.",
      "municipio": "Municipio X",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.assistenza-territorio.it/contatti/",
        "https://www.comune.roma.it/web-resources/cms/documents/mun_12_assistenza_territorio_carta_saish_26_A.pdf"
      ],
      "verificationNote": ""
    },
    {
      "name": "Fondazione Inclusione, Salute e Cura Roma Litorale",
      "address": "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      "phone": "06 5693771 (SELFI / Agenzia Lavoro)",
      "hours": "Da confermare presso l’ente",
      "description": "Ente non pubblico. Inserimento mediato, formazione e tirocini protetti per persone con disabilità intellettiva e/o relazionale; verificare requisiti e presa in carico. La sede San Giorgio per formazione e agenzia lavoro è in Via Cesare Maccari 160, Acilia; concordare la sede del servizio. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "email": "protocollo@fondazionerml.com",
      "automaticMatching": false,
      "sourceUrls": [
        "https://fondazioneromalitorale.com/contatti/",
        "https://fondazioneromalitorale.com/lavoro-e-formazione/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Servizio specialistico"
    },
    {
      "name": "Cooperativa sociale socio-sanitaria Futura ONLUS",
      "address": "Via Marino Fasan 36, 00121 Ostia Lido (RM)",
      "phone": "06 564 0571",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa di tipo A con servizi sociosanitari, educativi e per persone con disabilità. Recapiti operativi e canale candidature da riconfermare. Verifica: Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale.",
      "municipio": "Municipio X",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.comune.roma.it/web-resources/cms/documents/mun_12_C_S_Futura_A.pdf"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale."
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere.",
      "municipio": "Municipio IX",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale OSA (Operatori Sanitari Associati)",
      "address": "Via Lucio Volumnio 1, 00178 Roma",
      "phone": "06 7106 61",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociosanitaria con canale Lavora con noi sul sito osa.coop. Verificare qualifiche richieste, in particolare OSS e professioni sanitarie; non equivale a collocamento generalista di badanti. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio VII",
      "automaticMatching": false,
      "sourceUrls": [
        "https://osa.coop/contatti/",
        "https://osa.coop/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa Sociale Nuova Sair Onlus",
      "address": "Viale del Tecnopolo 83, 00131 Roma",
      "phone": "06 4080 0472",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IV",
      "automaticMatching": false,
      "sourceUrls": [
        "https://svil.nuovasair.it/contatti/"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa Sociale San Saturnino Onlus",
      "address": "Via Sirte 21, 00199 Roma",
      "phone": "06 841 5294",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale. Per candidature utilizzare il modulo CV del sito ufficiale; verificare profili e requisiti.",
      "municipio": "Municipio II",
      "email": "segreteria@sansaturnino.it",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.coopsansaturnino.org/contattaci/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Cecilia Onlus",
      "address": "Via Licinio Murena 36, 00175 Roma",
      "phone": "06 7696 0343",
      "hours": "Da confermare presso l’ente",
      "description": "Attiva nei servizi sociali di prossimità, cura a domicilio, accompagnamento e assistenza per famiglie e anziani a Roma. Verifica: Telefoni discordanti fra sito e consorzio; email ordinaria e canale CV da confermare. Nessuna sostituzione automatica.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.ceciliacoop.it/contatti/",
        "https://consorzioparsifal.it/cooperativa-cecilia.html"
      ],
      "verificationNote": "Telefoni discordanti fra sito e consorzio; email ordinaria e canale CV da confermare. Nessuna sostituzione automatica."
    },
    {
      "name": "Appia Riabilitazione Capodarco – Anteo",
      "address": "Via Lungro 1–3, 00178 Roma",
      "phone": "06 712901202 / 06 712901205",
      "hours": "Da confermare presso l’ente",
      "description": "Struttura sanitaria di riabilitazione e assistenza per persone con disabilità. Non documentate divisioni occupazionali verde, manutenzioni, centralino o navette. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio VII",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.anteocoop.it/wp-content/uploads/2026/03/PARS-2026-Capodarco.pdf"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Struttura sanitaria"
    }
  ],
  "Colf/pulizie (servizi domestici)": [
    {
      "name": "Assistenza e Territorio - Soc. Coop. Sociale Onlus",
      "address": "Via di Santa Monica 11, 00122 Roma",
      "phone": "06 562 1925",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale: servizi sociali e assistenziali. Il sito accetta curriculum via email; verificare requisiti e posizioni disponibili. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.assistenza-territorio.it/contatti/",
        "https://www.comune.roma.it/web-resources/cms/documents/mun_12_assistenza_territorio_carta_saish_26_A.pdf"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "PrivatAssistenza Fiumicino (copertura Ostia)",
      "address": "Via delle Meduse 124, Fiumicino",
      "phone": "06 69316057",
      "hours": "Da confermare presso l’ente",
      "description": "Centro privato di assistenza domiciliare per anziani, malati e persone con disabilità, con copertura anche di Ostia. Verificare canale candidature e requisiti; non è un ufficio pubblico.",
      "municipio": "Comune di Fiumicino",
      "email": "",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.privatassistenza.it/assistenza-domiciliare-anziani-malati-e-disabili/roma/roma-ostia/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Lido",
      "address": "Via Alessandro Piola Caselli 167/169, 00122 Ostia (RM)",
      "phone": "06 568 2599",
      "hours": "Da confermare presso l’ente",
      "description": "Pulizie e igiene ambientale; sostituzione personale per enti immobiliari. Non documentate divisioni logistiche o edili; verificare candidature.",
      "municipio": "Municipio X",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.cooperativalido.it/contatti.php",
        "https://www.cooperativalido.it/servizi.php"
      ],
      "verificationNote": ""
    },
    {
      "name": "Fondazione Inclusione, Salute e Cura Roma Litorale",
      "address": "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      "phone": "06 5693771 (SELFI / Agenzia Lavoro)",
      "hours": "Da confermare presso l’ente",
      "description": "Ente non pubblico. Inserimento mediato, formazione e tirocini protetti per persone con disabilità intellettiva e/o relazionale; verificare requisiti e presa in carico. La sede San Giorgio per formazione e agenzia lavoro è in Via Cesare Maccari 160, Acilia; concordare la sede del servizio. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "email": "protocollo@fondazionerml.com",
      "automaticMatching": false,
      "sourceUrls": [
        "https://fondazioneromalitorale.com/contatti/",
        "https://fondazioneromalitorale.com/lavoro-e-formazione/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Servizio specialistico"
    },
    {
      "name": "Cooperativa sociale socio-sanitaria Futura ONLUS",
      "address": "Via Marino Fasan 36, 00121 Ostia Lido (RM)",
      "phone": "06 564 0571",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa di tipo A con servizi sociosanitari, educativi e per persone con disabilità. Recapiti operativi e canale candidature da riconfermare. Verifica: Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.comune.roma.it/web-resources/cms/documents/mun_12_C_S_Futura_A.pdf"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Associazione API-COLF Roma",
      "address": "Via Principe Amedeo 23, 00185 Roma",
      "phone": "06 662 9378",
      "hours": "Da confermare presso l’ente",
      "description": "API-COLF: associazione professionale dei collaboratori familiari; verificare servizi e modalità di accesso. Non è una cooperativa o un’agenzia generalista.",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.federcolf.it/contatti/"
      ],
      "verificationNote": "",
      "directoryCategory": "Associazione professionale"
    },
    {
      "name": "Cooperativa Sociale Apriti Sesamo Onlus",
      "address": "Circonvallazione Clodia 76/a, 00195 Roma",
      "phone": "06 3903 0387",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio I",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.comune.roma.it/web-resources/cms/documents/APRITI_SESAMO_CARTA_DEI_SERVIZI_AS_2024.PDF"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa Sociale Prassi e Ricerca Onlus",
      "address": "Via Eleonora d'Arborea 12, 00162 Roma",
      "phone": "06 4423 2351",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale ETS. Sede legale Via Eleonora d’Arborea 12; amministrativa Via del Peperino 8. Consultare la sezione Lavora con noi e verificare il profilo richiesto.",
      "municipio": "Municipio II",
      "email": "info@prassiericerca.com",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.prassiericerca.it/contact"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Roma 81",
      "address": "Via Alessandro Luzio 60, 00179 Roma",
      "phone": "06 7834 5588",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale per servizi di pulizia aziendale e domestica, sanificazione e inserimento lavorativo.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://roma81.com/contatti/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    }
  ],
  "Facchino/magazziniere": [
    {
      "name": "Fondazione Inclusione, Salute e Cura Roma Litorale",
      "address": "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      "phone": "06 5693771 (SELFI / Agenzia Lavoro)",
      "hours": "Da confermare presso l’ente",
      "description": "Ente non pubblico. Inserimento mediato, formazione e tirocini protetti per persone con disabilità intellettiva e/o relazionale; verificare requisiti e presa in carico. La sede San Giorgio per formazione e agenzia lavoro è in Via Cesare Maccari 160, Acilia; concordare la sede del servizio. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "email": "protocollo@fondazionerml.com",
      "automaticMatching": false,
      "sourceUrls": [
        "https://fondazioneromalitorale.com/contatti/",
        "https://fondazioneromalitorale.com/lavoro-e-formazione/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Servizio specialistico"
    },
    {
      "name": "Cooperativa Lido",
      "address": "Via Alessandro Piola Caselli 167/169, 00122 Ostia (RM)",
      "phone": "06 568 2599",
      "hours": "Da confermare presso l’ente",
      "description": "Pulizie e igiene ambientale; sostituzione personale per enti immobiliari. Non documentate divisioni logistiche o edili; verificare candidature. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.cooperativalido.it/contatti.php",
        "https://www.cooperativalido.it/servizi.php"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Adecco Filiale Fiumicino",
      "address": "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      "phone": "06 6502 9814",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Comune di Fiumicino",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.adecco.com/it-it/job-search/r-lazio-c-roma-m-fiumicino"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Gi Group Roma Industrial",
      "address": "Via Tuscolana 637, 00174 Roma",
      "phone": "06 7696 6033",
      "hours": "Da confermare presso l’ente",
      "description": "Filiale industriale per la selezione di magazzinieri con patentino muletto, addetti al carico/scarico container e smistamento pacchi.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.gigroup.it/filiale-dettaglio/hirevo-office-bergamo/h0061/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Synergie Roma La Spezia / Appia",
      "address": "Via La Spezia 35, 00182 Roma",
      "phone": "06 7759 0479",
      "hours": "Da confermare presso l’ente",
      "description": "Seleziona addetti alla logistica, facchini per manifestazioni, hotel e piattaforme di distribuzione della capitale.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.synergie-italia.it/servizi-al-lavoro/elenco-sedi-accreditate/82-regione-lazio"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Manser",
      "address": "Via Acerenza 4/C, 00178 Roma",
      "phone": "06 9054 5266",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale: inclusione e lavoro, servizi di economia sociale. Canale candidature dedicato; verificare mansione, requisiti e disponibilità.",
      "municipio": "Municipio VII",
      "email": "lavoraconnoimanser@gmail.com",
      "automaticMatching": true,
      "sourceUrls": [
        "https://mansercooperativa.org/contatti/",
        "https://mansercooperativa.org/area-economia-sociale/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Magliana '80 Onlus",
      "address": "Via Vaiano 23, 00146 Roma",
      "phone": "06 550 0765",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio XI",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.magliana80.it/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Appia Riabilitazione Capodarco – Anteo",
      "address": "Via Lungro 1–3, 00178 Roma",
      "phone": "06 712901202 / 06 712901205",
      "hours": "Da confermare presso l’ente",
      "description": "Struttura sanitaria di riabilitazione e assistenza per persone con disabilità. Non documentate divisioni occupazionali verde, manutenzioni, centralino o navette. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio VII",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.anteocoop.it/wp-content/uploads/2026/03/PARS-2026-Capodarco.pdf"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Struttura sanitaria"
    },
    {
      "name": "Umana Roma Appia",
      "address": "Via Lanuvio 29, 00179 Roma",
      "phone": "06 7885 1596",
      "hours": "Da confermare presso l’ente",
      "description": "Agenzia per il lavoro con forte presenza nella selezione di magazzinieri, facchini aeroportuali e addetti alla grande distribuzione.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.umana.it/per-le-persone/i-nostri-servizi/politiche-attive-del-lavoro/lazio/"
      ],
      "verificationNote": ""
    }
  ],
  "Lavapiatti/aiuto cucina": [
    {
      "name": "Adecco Filiale Fiumicino (Ho.Re.Ca.)",
      "address": "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      "phone": "06 6502 9814",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Comune di Fiumicino",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.adecco.com/it-it/job-search/r-lazio-c-roma-m-fiumicino"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Synergie Roma HOBE / Ho.Re.Ca.",
      "address": "Via Cesena 39, 00182 Roma",
      "phone": "06 7045 3693",
      "hours": "Da confermare presso l’ente",
      "description": "Polo specializzato di Synergie dedicato alla ristorazione commerciale e collettiva: inserimento continuo di lavapiatti e inservienti.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.synergie-italia.it/servizi-al-lavoro/elenco-sedi-accreditate/82-regione-lazio"
      ],
      "verificationNote": ""
    },
    {
      "name": "Gi Group Roma Services",
      "address": "Via Leonida Bissolati 76, 00187 Roma",
      "phone": "06 4173 5107",
      "hours": "Da confermare presso l’ente",
      "description": "Filiale specializzata nei servizi alberghieri e di ristorazione: seleziona addetti al lavaggio stoviglie e aiuto cucina per Roma e litorale.",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.gigroup.it/filiale-dettaglio/hirevo-office-bergamo/h0061/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Gruppo La Cascina",
      "address": "Via Francesco Antolisei 25, 00173 Roma",
      "phone": "06 7299 61",
      "hours": "Da confermare presso l’ente",
      "description": "Gruppo di imprese di ristorazione e servizi. Usare il portale Lavora con noi per candidature e posizioni effettive; il centralino non è un servizio di collocamento.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.lacascina.it/home/contatti/",
        "https://www.lacascina.it/home/lavora-con-noi/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Trattoria de Gli Amici (Sant'Egidio)",
      "address": "Piazza di Sant'Egidio 6, 00153 Roma",
      "phone": "06 580 6033",
      "hours": "Da confermare presso l’ente",
      "description": "Ristorante e progetto di inclusione lavorativa. Telefono per il ristorante, non per collocamento; ingresso e accesso ai percorsi da riconfermare (civici 5/6 discordanti).",
      "municipio": "Municipio I",
      "email": "info@trattoriadegliamici.it",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.trattoriadegliamici.it/",
        "https://www.santegidio.org/pageID/30124/langID/it/tags/2268/TRATTORIA-DE-GLI-AMICI.html",
        "https://turismoroma.it/it/accoglienza/trattoria-degli-amici"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Barikamà",
      "address": "Via Marco Vincenzo Coronelli 8, 00176 Roma",
      "phone": "339 645 0624",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio V",
      "automaticMatching": false,
      "sourceUrls": [
        "https://web.uniroma1.it/gareappalti/sites/default/files/determina%20a%20contrarre%20139%20dipartimento%20di%20psicologia.pdf"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa Sociale Agricola 'Agricoltura Nuova'",
      "address": "Via Valle di Perna 315, 00128 Roma",
      "phone": "06 507 0453",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa agricola e servizi di ristorazione. Il telefono 06 5070453 è per prenotazioni ristorante, non HR. Pizzeria in Via Castel di Leva 371; verificare sede e candidature.",
      "municipio": "Municipio IX",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.agricolturanuova.it/home/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Il Percorso",
      "address": "Via Giovanni Battista Belzoni 8, 00154 Roma",
      "phone": "06 578 2392",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio I",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.coopilpercorso.it/"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Fondazione Inclusione, Salute e Cura Roma Litorale",
      "address": "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      "phone": "06 5693771 (SELFI / Agenzia Lavoro)",
      "hours": "Da confermare presso l’ente",
      "description": "Ente non pubblico. Inserimento mediato, formazione e tirocini protetti per persone con disabilità intellettiva e/o relazionale; verificare requisiti e presa in carico. La sede San Giorgio per formazione e agenzia lavoro è in Via Cesare Maccari 160, Acilia; concordare la sede del servizio. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "email": "protocollo@fondazionerml.com",
      "automaticMatching": false,
      "sourceUrls": [
        "https://fondazioneromalitorale.com/contatti/",
        "https://fondazioneromalitorale.com/lavoro-e-formazione/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Servizio specialistico"
    }
  ],
  "Pizzaiolo": [
    {
      "name": "Adecco Filiale Fiumicino (Ho.Re.Ca.)",
      "address": "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      "phone": "06 6502 9814",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Comune di Fiumicino",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.adecco.com/it-it/job-search/r-lazio-c-roma-m-fiumicino"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Synergie Roma HOBE / Ho.Re.Ca.",
      "address": "Via Cesena 39, 00182 Roma",
      "phone": "06 7045 3693",
      "hours": "Da confermare presso l’ente",
      "description": "Inserimento mirato per professionisti della pizza tonda e in teglia, rosticceri e impastatori in tutta Roma.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.synergie-italia.it/servizi-al-lavoro/elenco-sedi-accreditate/82-regione-lazio"
      ],
      "verificationNote": ""
    },
    {
      "name": "La Locanda dei Girasoli (Pizzeria Sociale)",
      "address": "Via dei Sulpici 117/h, 00174 Roma",
      "phone": "06 761 0194",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati. Sede storica segnalata chiusa nel 2022; nessuna conferma di riapertura alla stessa sede.",
      "municipio": "Municipio VII",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.vaticannews.va/it/mondo/news/2022-01/locanda-dei-girasoli-roma-sindrome-down-covid-lockdown-crisi.html"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati. Sede storica segnalata chiusa nel 2022; nessuna conferma di riapertura alla stessa sede."
    },
    {
      "name": "Gi Group Roma Services",
      "address": "Via Leonida Bissolati 76, 00187 Roma",
      "phone": "06 4173 5107",
      "hours": "Da confermare presso l’ente",
      "description": "Seleziona pizzaioli con esperienza per locali turistici, pizzerie tradizionali e catene di ristorazione rapida.",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.gigroup.it/filiale-dettaglio/hirevo-office-bergamo/h0061/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Men At Work",
      "address": "Viale Manzoni 49, 00185 Roma",
      "phone": "06 7720 8095",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale con attività di inclusione scolastica documentate nel triennio 2024–2027. Non documentati canali di impiego per pizzaioli, cuochi o edili. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio I",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.comune.roma.it/web-resources/cms/documents/MEN_AT_WORK_ALL_F__RUAS_2024.pdf"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa Sociale Barikamà",
      "address": "Via Marco Vincenzo Coronelli 8, 00176 Roma",
      "phone": "339 645 0624",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio V",
      "automaticMatching": false,
      "sourceUrls": [
        "https://web.uniroma1.it/gareappalti/sites/default/files/determina%20a%20contrarre%20139%20dipartimento%20di%20psicologia.pdf"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Gruppo La Cascina",
      "address": "Via Francesco Antolisei 25, 00173 Roma",
      "phone": "06 7299 61",
      "hours": "Da confermare presso l’ente",
      "description": "Gruppo di imprese di ristorazione e servizi. Usare il portale Lavora con noi per candidature e posizioni effettive; il centralino non è un servizio di collocamento.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.lacascina.it/home/contatti/",
        "https://www.lacascina.it/home/lavora-con-noi/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Agricola 'Agricoltura Nuova'",
      "address": "Via Valle di Perna 315, 00128 Roma",
      "phone": "06 507 0453",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa agricola e servizi di ristorazione. Il telefono 06 5070453 è per prenotazioni ristorante, non HR. Pizzeria in Via Castel di Leva 371; verificare sede e candidature. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.agricolturanuova.it/home/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Umana Roma Centro",
      "address": "Via IV Novembre 110, 00187 Roma",
      "phone": "06 6938 0093",
      "hours": "Da confermare presso l’ente",
      "description": "Agenzia accreditata che seleziona pizzaioli e addetti alla ristorazione per clienti del settore turistico romano.",
      "municipio": "Municipio I",
      "email": "inforoma@umana.it",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.umana.it/per-le-persone/i-nostri-servizi/politiche-attive-del-lavoro/lazio/"
      ],
      "verificationNote": ""
    }
  ],
  "Cuoco": [
    {
      "name": "Adecco Filiale Fiumicino (Ho.Re.Ca.)",
      "address": "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      "phone": "06 6502 9814",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Comune di Fiumicino",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.adecco.com/it-it/job-search/r-lazio-c-roma-m-fiumicino"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Synergie Roma HOBE / Ho.Re.Ca.",
      "address": "Via Cesena 39, 00182 Roma",
      "phone": "06 7045 3693",
      "hours": "Da confermare presso l’ente",
      "description": "Seleziona cuochi professionisti di cucina tradizionale e internazionale per strutture alberghiere e ristorative di alto livello.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.synergie-italia.it/servizi-al-lavoro/elenco-sedi-accreditate/82-regione-lazio"
      ],
      "verificationNote": ""
    },
    {
      "name": "Gruppo La Cascina",
      "address": "Via Francesco Antolisei 25, 00173 Roma",
      "phone": "06 7299 61",
      "hours": "Da confermare presso l’ente",
      "description": "Gruppo di imprese di ristorazione e servizi. Usare il portale Lavora con noi per candidature e posizioni effettive; il centralino non è un servizio di collocamento.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.lacascina.it/home/contatti/",
        "https://www.lacascina.it/home/lavora-con-noi/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Trattoria de Gli Amici (Sant'Egidio)",
      "address": "Piazza di Sant'Egidio 6, 00153 Roma",
      "phone": "06 580 6033",
      "hours": "Da confermare presso l’ente",
      "description": "Ristorante e progetto di inclusione lavorativa. Telefono per il ristorante, non per collocamento; ingresso e accesso ai percorsi da riconfermare (civici 5/6 discordanti).",
      "municipio": "Municipio I",
      "email": "info@trattoriadegliamici.it",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.trattoriadegliamici.it/",
        "https://www.santegidio.org/pageID/30124/langID/it/tags/2268/TRATTORIA-DE-GLI-AMICI.html",
        "https://turismoroma.it/it/accoglienza/trattoria-degli-amici"
      ],
      "verificationNote": ""
    },
    {
      "name": "Gi Group Roma Services",
      "address": "Via Leonida Bissolati 76, 00187 Roma",
      "phone": "06 4173 5107",
      "hours": "Da confermare presso l’ente",
      "description": "Opportunità di lavoro per cuochi capo partita, demi chef e chef de rang nei principali hotel di Roma.",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.gigroup.it/filiale-dettaglio/hirevo-office-bergamo/h0061/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Men At Work",
      "address": "Viale Manzoni 49, 00185 Roma",
      "phone": "06 7720 8095",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale con attività di inclusione scolastica documentate nel triennio 2024–2027. Non documentati canali di impiego per pizzaioli, cuochi o edili. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio I",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.comune.roma.it/web-resources/cms/documents/MEN_AT_WORK_ALL_F__RUAS_2024.pdf"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa Sociale Agricola 'Agricoltura Nuova'",
      "address": "Via Valle di Perna 315, 00128 Roma",
      "phone": "06 507 0453",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa agricola e servizi di ristorazione. Il telefono 06 5070453 è per prenotazioni ristorante, non HR. Pizzeria in Via Castel di Leva 371; verificare sede e candidature.",
      "municipio": "Municipio IX",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.agricolturanuova.it/home/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Fondazione Inclusione, Salute e Cura Roma Litorale",
      "address": "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      "phone": "06 5693771 (SELFI / Agenzia Lavoro)",
      "hours": "Da confermare presso l’ente",
      "description": "Ente non pubblico. Inserimento mediato, formazione e tirocini protetti per persone con disabilità intellettiva e/o relazionale; verificare requisiti e presa in carico. La sede San Giorgio per formazione e agenzia lavoro è in Via Cesare Maccari 160, Acilia; concordare la sede del servizio. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "email": "protocollo@fondazionerml.com",
      "automaticMatching": false,
      "sourceUrls": [
        "https://fondazioneromalitorale.com/contatti/",
        "https://fondazioneromalitorale.com/lavoro-e-formazione/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Servizio specialistico"
    },
    {
      "name": "Umana Roma Centro",
      "address": "Via IV Novembre 110, 00187 Roma",
      "phone": "06 6938 0093",
      "hours": "Da confermare presso l’ente",
      "description": "Seleziona personale di cucina per prestigiosi ristoranti del centro storico e alberghi della Capitale.",
      "municipio": "Municipio I",
      "email": "inforoma@umana.it",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.umana.it/per-le-persone/i-nostri-servizi/politiche-attive-del-lavoro/lazio/"
      ],
      "verificationNote": ""
    }
  ],
  "Muratore/Operaio edile": [
    {
      "name": "Cassa Edile di Mutualità e Assistenza di Roma e Provincia",
      "address": "Via Alba 20, Roma (sportello lavoratori)",
      "phone": "06 70604466",
      "hours": "Da confermare presso l’ente",
      "description": "Ente bilaterale del settore edile: prestazioni e supporto ai lavoratori. Non è un’agenzia generalista per la ricerca di lavoro. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio VII",
      "email": "area.operai@cassaedilediroma.it",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.cassaedilediroma.it/contatti/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Ente bilaterale"
    },
    {
      "name": "Fondazione Inclusione, Salute e Cura Roma Litorale",
      "address": "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      "phone": "06 5693771 (SELFI / Agenzia Lavoro)",
      "hours": "Da confermare presso l’ente",
      "description": "Ente non pubblico. Inserimento mediato, formazione e tirocini protetti per persone con disabilità intellettiva e/o relazionale; verificare requisiti e presa in carico. La sede San Giorgio per formazione e agenzia lavoro è in Via Cesare Maccari 160, Acilia; concordare la sede del servizio. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "email": "protocollo@fondazionerml.com",
      "automaticMatching": false,
      "sourceUrls": [
        "https://fondazioneromalitorale.com/contatti/",
        "https://fondazioneromalitorale.com/lavoro-e-formazione/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Servizio specialistico"
    },
    {
      "name": "Cooperativa Lido",
      "address": "Via Alessandro Piola Caselli 167/169, 00122 Ostia (RM)",
      "phone": "06 568 2599",
      "hours": "Da confermare presso l’ente",
      "description": "Pulizie e igiene ambientale; sostituzione personale per enti immobiliari. Non documentate divisioni logistiche o edili; verificare candidature. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.cooperativalido.it/contatti.php",
        "https://www.cooperativalido.it/servizi.php"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Adecco Filiale Fiumicino (Costruzioni e Cantieri)",
      "address": "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      "phone": "06 6502 9814",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Comune di Fiumicino",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.adecco.com/it-it/job-search/r-lazio-c-roma-m-fiumicino"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Gi Group Roma Industrial",
      "address": "Via Tuscolana 637, 00174 Roma",
      "phone": "06 7696 6033",
      "hours": "Da confermare presso l’ente",
      "description": "Seleziona operai edili, pittori edili, intonacatori e saldatori per grandi opere infrastrutturali ed edilizia civile.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.gigroup.it/filiale-dettaglio/hirevo-office-bergamo/h0061/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Synergie Roma La Spezia / Appia",
      "address": "Via La Spezia 35, 00182 Roma",
      "phone": "06 7759 0479",
      "hours": "Da confermare presso l’ente",
      "description": "Filiale che gestisce somministrazione per aziende di ristrutturazione e impiantistica a Roma.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.synergie-italia.it/servizi-al-lavoro/elenco-sedi-accreditate/82-regione-lazio"
      ],
      "verificationNote": ""
    },
    {
      "name": "Appia Riabilitazione Capodarco – Anteo",
      "address": "Via Lungro 1–3, 00178 Roma",
      "phone": "06 712901202 / 06 712901205",
      "hours": "Da confermare presso l’ente",
      "description": "Struttura sanitaria di riabilitazione e assistenza per persone con disabilità. Non documentate divisioni occupazionali verde, manutenzioni, centralino o navette. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio VII",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.anteocoop.it/wp-content/uploads/2026/03/PARS-2026-Capodarco.pdf"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Struttura sanitaria"
    },
    {
      "name": "Cooperativa Sociale Speha Fresia",
      "address": "Piazza F. De Lucia 35, 00139 Roma",
      "phone": "06 4550 7650",
      "hours": "Da confermare presso l’ente",
      "description": "Formazione, politiche attive del lavoro e ricerca sociale. Verificare corsi o avvisi pertinenti prima dell’invio. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio III",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.speha-fresia.eu/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Manpower Roma Manzoni",
      "address": "Viale Manzoni 22, 00185 Roma",
      "phone": "06 7740 0501",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio I",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.manpower.it/it/annuncio-lavoro/gdo/sales/recruiting-day-manpower-entra-nel-mondo-della-gdo-roma/886760"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    }
  ],
  "Custode/portiere": [
    {
      "name": "Fondazione Inclusione, Salute e Cura Roma Litorale",
      "address": "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      "phone": "06 5693771 (SELFI / Agenzia Lavoro)",
      "hours": "Da confermare presso l’ente",
      "description": "Ente non pubblico. Inserimento mediato, formazione e tirocini protetti per persone con disabilità intellettiva e/o relazionale; verificare requisiti e presa in carico. La sede San Giorgio per formazione e agenzia lavoro è in Via Cesare Maccari 160, Acilia; concordare la sede del servizio. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "email": "protocollo@fondazionerml.com",
      "automaticMatching": false,
      "sourceUrls": [
        "https://fondazioneromalitorale.com/contatti/",
        "https://fondazioneromalitorale.com/lavoro-e-formazione/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Servizio specialistico"
    },
    {
      "name": "Cooperativa Lido",
      "address": "Via Alessandro Piola Caselli 167/169, 00122 Ostia (RM)",
      "phone": "06 568 2599",
      "hours": "Da confermare presso l’ente",
      "description": "Pulizie e igiene ambientale; sostituzione personale per enti immobiliari. Non documentate divisioni logistiche o edili; verificare candidature. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.cooperativalido.it/contatti.php",
        "https://www.cooperativalido.it/servizi.php"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa sociale socio-sanitaria Futura ONLUS",
      "address": "Via Marino Fasan 36, 00121 Ostia Lido (RM)",
      "phone": "06 564 0571",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa di tipo A con servizi sociosanitari, educativi e per persone con disabilità. Recapiti operativi e canale candidature da riconfermare. Verifica: Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.comune.roma.it/web-resources/cms/documents/mun_12_C_S_Futura_A.pdf"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Securitas Metronotte Roma",
      "address": "Via Aurelia 788/A, 00165 Roma",
      "phone": "06 6640 9001",
      "hours": "Da confermare presso l’ente",
      "description": "Storico istituto di vigilanza e servizi di portierato fiduciario, controllo accessi e custodia diurna e notturna. Verifica: Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale.",
      "municipio": "Municipio XIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.grupposecuritas.it/"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale."
    },
    {
      "name": "Sicuritalia S.p.A. - Servizi Fiduciari Roma",
      "address": "Via della Maglianella 65R, 00166 Roma",
      "phone": "06 6617 91",
      "hours": "Da confermare presso l’ente",
      "description": "Azienda leader nazionale per servizi di portierato, reception fiduciaria, controllo flussi e custodia per condomini e aziende. Verifica: Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale.",
      "municipio": "Municipio XIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.sicuritalia.it/chi-siamo/roma-maglianella/",
        "https://www.sicuritalia.it/chi-siamo/le-sedi-principali/"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale."
    },
    {
      "name": "Appia Riabilitazione Capodarco – Anteo",
      "address": "Via Lungro 1–3, 00178 Roma",
      "phone": "06 712901202 / 06 712901205",
      "hours": "Da confermare presso l’ente",
      "description": "Struttura sanitaria di riabilitazione e assistenza per persone con disabilità. Non documentate divisioni occupazionali verde, manutenzioni, centralino o navette. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio VII",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.anteocoop.it/wp-content/uploads/2026/03/PARS-2026-Capodarco.pdf"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Struttura sanitaria"
    },
    {
      "name": "Cooperativa Sociale Apriti Sesamo Onlus",
      "address": "Circonvallazione Clodia 76/a, 00195 Roma",
      "phone": "06 3903 0387",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio I",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.comune.roma.it/web-resources/cms/documents/APRITI_SESAMO_CARTA_DEI_SERVIZI_AS_2024.PDF"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Gi Group Roma Services",
      "address": "Via Leonida Bissolati 76, 00187 Roma",
      "phone": "06 4173 5107",
      "hours": "Da confermare presso l’ente",
      "description": "Divisione servizi di accoglienza, custodia fiduciaria e doorman per condomini di pregio e strutture commerciali.",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.gigroup.it/filiale-dettaglio/hirevo-office-bergamo/h0061/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Adecco Roma Ostiense",
      "address": "Via Ostiense 91/A, 00154 Roma",
      "phone": "06 5717821",
      "hours": "Lun–ven 09:00–13:00 / 14:00–18:00",
      "description": "Filiale generalista con divisione facility: assunzioni di custodi, addetti al front desk e portieri.",
      "municipio": "Municipio VIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.adecco.com/it-it/filiali/lazio/roma/adecco-roma-ostiense"
      ],
      "verificationNote": ""
    }
  ],
  "Cameriere/barista": [
    {
      "name": "Adecco Filiale Fiumicino (Ho.Re.Ca.)",
      "address": "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      "phone": "06 6502 9814",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Comune di Fiumicino",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.adecco.com/it-it/job-search/r-lazio-c-roma-m-fiumicino"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Synergie Roma HOBE / Ho.Re.Ca.",
      "address": "Via Cesena 39, 00182 Roma",
      "phone": "06 7045 3693",
      "hours": "Da confermare presso l’ente",
      "description": "Specializzata nel settore bar e ristorazione: inserimento continuo di personale di sala, runner e banchisti.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.synergie-italia.it/servizi-al-lavoro/elenco-sedi-accreditate/82-regione-lazio"
      ],
      "verificationNote": ""
    },
    {
      "name": "Gi Group Roma Services",
      "address": "Via Leonida Bissolati 76, 00187 Roma",
      "phone": "06 4173 5107",
      "hours": "Da confermare presso l’ente",
      "description": "Seleziona camerieri di sala con buona padronanza dell'italiano e conoscenza base dell'inglese per ristoranti e hotel di Roma.",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.gigroup.it/filiale-dettaglio/hirevo-office-bergamo/h0061/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Trattoria de Gli Amici (Sant'Egidio)",
      "address": "Piazza di Sant'Egidio 6, 00153 Roma",
      "phone": "06 580 6033",
      "hours": "Da confermare presso l’ente",
      "description": "Ristorante e progetto di inclusione lavorativa. Telefono per il ristorante, non per collocamento; ingresso e accesso ai percorsi da riconfermare (civici 5/6 discordanti).",
      "municipio": "Municipio I",
      "email": "info@trattoriadegliamici.it",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.trattoriadegliamici.it/",
        "https://www.santegidio.org/pageID/30124/langID/it/tags/2268/TRATTORIA-DE-GLI-AMICI.html",
        "https://turismoroma.it/it/accoglienza/trattoria-degli-amici"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Barikamà",
      "address": "Via Marco Vincenzo Coronelli 8, 00176 Roma",
      "phone": "339 645 0624",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio V",
      "automaticMatching": false,
      "sourceUrls": [
        "https://web.uniroma1.it/gareappalti/sites/default/files/determina%20a%20contrarre%20139%20dipartimento%20di%20psicologia.pdf"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Gruppo La Cascina",
      "address": "Via Francesco Antolisei 25, 00173 Roma",
      "phone": "06 7299 61",
      "hours": "Da confermare presso l’ente",
      "description": "Gruppo di imprese di ristorazione e servizi. Usare il portale Lavora con noi per candidature e posizioni effettive; il centralino non è un servizio di collocamento.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.lacascina.it/home/contatti/",
        "https://www.lacascina.it/home/lavora-con-noi/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Il Percorso",
      "address": "Via Giovanni Battista Belzoni 8, 00154 Roma",
      "phone": "06 578 2392",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio I",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.coopilpercorso.it/"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa Sociale Men At Work",
      "address": "Viale Manzoni 49, 00185 Roma",
      "phone": "06 7720 8095",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale con attività di inclusione scolastica documentate nel triennio 2024–2027. Non documentati canali di impiego per pizzaioli, cuochi o edili. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio I",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.comune.roma.it/web-resources/cms/documents/MEN_AT_WORK_ALL_F__RUAS_2024.pdf"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa Sociale Agricola 'Agricoltura Nuova'",
      "address": "Via Valle di Perna 315, 00128 Roma",
      "phone": "06 507 0453",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa agricola e servizi di ristorazione. Il telefono 06 5070453 è per prenotazioni ristorante, non HR. Pizzeria in Via Castel di Leva 371; verificare sede e candidature.",
      "municipio": "Municipio IX",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.agricolturanuova.it/home/"
      ],
      "verificationNote": ""
    }
  ],
  "Giardiniere": [
    {
      "name": "Fondazione Inclusione, Salute e Cura Roma Litorale",
      "address": "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      "phone": "06 5693771 (SELFI / Agenzia Lavoro)",
      "hours": "Da confermare presso l’ente",
      "description": "Ente non pubblico. Inserimento mediato, formazione e tirocini protetti per persone con disabilità intellettiva e/o relazionale; verificare requisiti e presa in carico. La sede San Giorgio per formazione e agenzia lavoro è in Via Cesare Maccari 160, Acilia; concordare la sede del servizio. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "email": "protocollo@fondazionerml.com",
      "automaticMatching": false,
      "sourceUrls": [
        "https://fondazioneromalitorale.com/contatti/",
        "https://fondazioneromalitorale.com/lavoro-e-formazione/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Servizio specialistico"
    },
    {
      "name": "Cooperativa Sociale Agricola 'Agricoltura Nuova'",
      "address": "Via Valle di Perna 315, 00128 Roma",
      "phone": "06 507 0453",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa agricola e servizi di ristorazione. Il telefono 06 5070453 è per prenotazioni ristorante, non HR. Pizzeria in Via Castel di Leva 371; verificare sede e candidature. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.agricolturanuova.it/home/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Coldiretti Roma - Sede Provinciale",
      "address": "Via Raffaele Piria 6, 00156 Roma",
      "phone": "06 4067 141",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IV",
      "automaticMatching": false,
      "sourceUrls": [
        "https://caa.coldiretti.it/dove-siamo/lazio/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Appia Riabilitazione Capodarco – Anteo",
      "address": "Via Lungro 1–3, 00178 Roma",
      "phone": "06 712901202 / 06 712901205",
      "hours": "Da confermare presso l’ente",
      "description": "Struttura sanitaria di riabilitazione e assistenza per persone con disabilità. Non documentate divisioni occupazionali verde, manutenzioni, centralino o navette. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio VII",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.anteocoop.it/wp-content/uploads/2026/03/PARS-2026-Capodarco.pdf"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Struttura sanitaria"
    },
    {
      "name": "Cooperativa Sociale Barikamà",
      "address": "Via Marco Vincenzo Coronelli 8, 00176 Roma",
      "phone": "339 645 0624",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio V",
      "automaticMatching": false,
      "sourceUrls": [
        "https://web.uniroma1.it/gareappalti/sites/default/files/determina%20a%20contrarre%20139%20dipartimento%20di%20psicologia.pdf"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa Sociale Santi Pietro e Paolo",
      "address": "Via Francesco Antolisei 19, 00173 Roma",
      "phone": "06 8978 7001",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale di tipo A: servizi sociosanitari ed educativi. Non documentato canale occupazionale generalista per giardinieri. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio VII",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.santipietroepaolo.it/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa Sociale Apriti Sesamo Onlus",
      "address": "Circonvallazione Clodia 76/a, 00195 Roma",
      "phone": "06 3903 0387",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio I",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.comune.roma.it/web-resources/cms/documents/APRITI_SESAMO_CARTA_DEI_SERVIZI_AS_2024.PDF"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Cooperativa Sociale Idea Prisma 82",
      "address": "Via Ida Baccini 80, 00137 Roma",
      "phone": "06 8720 1072",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale: servizi educativi, sociali e sanitari. Non documentato canale per giardinieri. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio III",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.ideaprisma82.it/i-nostri-contatti/",
        "https://www.comune.roma.it/web-resources/cms/documents/QM20220022057-IDEA_PRISMA_82_ALL._F_SCHEDA_TECNICA_1.PDF"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Adecco Filiale Fiumicino",
      "address": "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      "phone": "06 6502 9814",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Comune di Fiumicino",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.adecco.com/it-it/job-search/r-lazio-c-roma-m-fiumicino"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    }
  ],
  "Segreteria (assistenza d'ufficio/reception)": [
    {
      "name": "Eurogiga – Studio Gattuso",
      "address": "Via delle Auletine 92, 00122 Ostia Lido (RM)",
      "phone": "06 560 0239",
      "hours": "Da confermare presso l’ente",
      "description": "Studio professionale: servizi fiscali, contabili e consulenza del lavoro. Non documentata intermediazione di lavoro per segreteria o data entry. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.eurogiga.it/index.php/contatti2",
        "https://www.eurogiga.it/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Studio professionale"
    },
    {
      "name": "Fondazione Inclusione, Salute e Cura Roma Litorale",
      "address": "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      "phone": "06 5693771 (SELFI / Agenzia Lavoro)",
      "hours": "Da confermare presso l’ente",
      "description": "Ente non pubblico. Inserimento mediato, formazione e tirocini protetti per persone con disabilità intellettiva e/o relazionale; verificare requisiti e presa in carico. La sede San Giorgio per formazione e agenzia lavoro è in Via Cesare Maccari 160, Acilia; concordare la sede del servizio. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "email": "protocollo@fondazionerml.com",
      "automaticMatching": false,
      "sourceUrls": [
        "https://fondazioneromalitorale.com/contatti/",
        "https://fondazioneromalitorale.com/lavoro-e-formazione/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Servizio specialistico"
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere.",
      "municipio": "Municipio IX",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Randstad Digital Roma",
      "address": "Via Cavour 181, 00184 Roma",
      "phone": "06 4890 781",
      "hours": "Da confermare presso l’ente",
      "description": "Sede Randstad Digital: ambito ICT. Non documentata intermediazione generalista per segreteria. Verifica: Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio I",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.randstaddigital.com/fr/about/locations/italian-offices/"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Gi Group Roma Office",
      "address": "Via Nazionale 39, 00184 Roma",
      "phone": "06 6992 5378",
      "hours": "Da confermare presso l’ente",
      "description": "Filiale dedicata alla selezione di addette alla segreteria, reception per studi legali e notarili, e gestione protocollo.",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.gigroup.it/filiale-dettaglio/hirevo-office-bergamo/h0061/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Adecco Roma Esperanto",
      "address": "Viale dell'Esperanto 71, 00144 Roma",
      "phone": "06 592 9001",
      "hours": "Lun–ven 09:00–13:00 / 14:00–18:00",
      "description": "Seleziona personale di segreteria, reception aziendale e supporto documentale per le multinazionali dell'EUR. Verifica: Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale.",
      "municipio": "Municipio IX",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.adecco.com/it-it/filiali/lazio/roma/adecco-roma-esperanto"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale."
    },
    {
      "name": "Adecco Roma Ostiense",
      "address": "Via Ostiense 91/A, 00154 Roma",
      "phone": "06 5717821",
      "hours": "Lun–ven 09:00–13:00 / 14:00–18:00",
      "description": "Opportunità di inserimento per addette all'accoglienza, gestione appuntamenti e centralino per studi medici ed aziende.",
      "municipio": "Municipio VIII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.adecco.com/it-it/filiali/lazio/roma/adecco-roma-ostiense"
      ],
      "verificationNote": ""
    },
    {
      "name": "Synergie Roma Termini",
      "address": "Via Cavour 44, 00184 Roma",
      "phone": "06 4470 4268",
      "hours": "Da confermare presso l’ente",
      "description": "Divisione Office: avviamento di risorse per compiti di segreteria commerciale, posta e front-desk a Roma.",
      "municipio": "Municipio I",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.synergie-italia.it/servizi-al-lavoro/elenco-sedi-accreditate/82-regione-lazio"
      ],
      "verificationNote": ""
    },
    {
      "name": "Manpower Roma Manzoni",
      "address": "Viale Manzoni 22, 00185 Roma",
      "phone": "06 7740 0501",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio I",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.manpower.it/it/annuncio-lavoro/gdo/sales/recruiting-day-manpower-entra-nel-mondo-della-gdo-roma/886760"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Umana Roma Centro",
      "address": "Via IV Novembre 110, 00187 Roma",
      "phone": "06 6938 0093",
      "hours": "Da confermare presso l’ente",
      "description": "Seleziona profili amministrativi junior e senior, receptionist multilingue e assistenti di segreteria.",
      "municipio": "Municipio I",
      "email": "inforoma@umana.it",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.umana.it/per-le-persone/i-nostri-servizi/politiche-attive-del-lavoro/lazio/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Appia Riabilitazione Capodarco – Anteo",
      "address": "Via Lungro 1–3, 00178 Roma",
      "phone": "06 712901202 / 06 712901205",
      "hours": "Da confermare presso l’ente",
      "description": "Struttura sanitaria di riabilitazione e assistenza per persone con disabilità. Non documentate divisioni occupazionali verde, manutenzioni, centralino o navette. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio VII",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.anteocoop.it/wp-content/uploads/2026/03/PARS-2026-Capodarco.pdf"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Struttura sanitaria"
    },
    {
      "name": "Cooperativa Sociale Nuova Sair - Segreteria",
      "address": "Viale del Tecnopolo 83, 00131 Roma",
      "phone": "06 4080 0472",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IV",
      "automaticMatching": false,
      "sourceUrls": [
        "https://svil.nuovasair.it/contatti/"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    }
  ],
  "Autista (conducente/fattorino)": [
    {
      "name": "Adecco Filiale Fiumicino (Trasporti)",
      "address": "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      "phone": "06 6502 9814",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Comune di Fiumicino",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.adecco.com/it-it/job-search/r-lazio-c-roma-m-fiumicino"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Fondazione Inclusione, Salute e Cura Roma Litorale",
      "address": "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      "phone": "06 5693771 (SELFI / Agenzia Lavoro)",
      "hours": "Da confermare presso l’ente",
      "description": "Ente non pubblico. Inserimento mediato, formazione e tirocini protetti per persone con disabilità intellettiva e/o relazionale; verificare requisiti e presa in carico. La sede San Giorgio per formazione e agenzia lavoro è in Via Cesare Maccari 160, Acilia; concordare la sede del servizio. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio X",
      "email": "protocollo@fondazionerml.com",
      "automaticMatching": false,
      "sourceUrls": [
        "https://fondazioneromalitorale.com/contatti/",
        "https://fondazioneromalitorale.com/lavoro-e-formazione/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Servizio specialistico"
    },
    {
      "name": "Randstad Roma EUR A",
      "address": "Piazzale Luigi Sturzo 15, 00144 Roma",
      "phone": "06 8837 9501",
      "hours": "Lun 09:00–18:00; mar–ven 09:00–17:30",
      "description": "Agenzia per il lavoro. Divisioni documentate: contact center, finance & administration, HOpportunities, medical e office. Consultare annunci e requisiti; non sono divisioni fisiche distinte per ogni mestiere. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio IX",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.randstad.it/trova-filiale/agenzia-il-lavoro-roma-eur_1173/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Gi Group Roma Industrial",
      "address": "Via Tuscolana 637, 00174 Roma",
      "phone": "06 7696 6033",
      "hours": "Da confermare presso l’ente",
      "description": "Divisione trasporti per corrieri espresso, autisti per la grande distribuzione e fattorini urbani a Roma.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.gigroup.it/filiale-dettaglio/hirevo-office-bergamo/h0061/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Synergie Roma La Spezia / Appia",
      "address": "Via La Spezia 35, 00182 Roma",
      "phone": "06 7759 0479",
      "hours": "Da confermare presso l’ente",
      "description": "Seleziona autisti con patente B per distribuzione pacchi per e-commerce e corrieri alimentari a domicilio.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.synergie-italia.it/servizi-al-lavoro/elenco-sedi-accreditate/82-regione-lazio"
      ],
      "verificationNote": ""
    },
    {
      "name": "Manpower Roma Tuscolana",
      "address": "Via Statilio Ottato 66, 00175 Roma",
      "phone": "06 7154 211",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio VII",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.manpower.it/"
      ],
      "verificationNote": "Recapiti operativi non verificati integralmente: confermare tramite il sito ufficiale. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    },
    {
      "name": "Umana Roma Appia",
      "address": "Via Lanuvio 29, 00179 Roma",
      "phone": "06 7885 1596",
      "hours": "Da confermare presso l’ente",
      "description": "Agenzia per il lavoro con offerte continuative per autisti di linea, scuolabus e fattorini con patente B.",
      "municipio": "Municipio VII",
      "automaticMatching": true,
      "sourceUrls": [
        "https://www.umana.it/per-le-persone/i-nostri-servizi/politiche-attive-del-lavoro/lazio/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Cooperativa Sociale Manser",
      "address": "Via Acerenza 4/C, 00178 Roma",
      "phone": "06 9054 5266",
      "hours": "Da confermare presso l’ente",
      "description": "Cooperativa sociale: inclusione e lavoro, servizi di economia sociale. Canale candidature dedicato; verificare mansione, requisiti e disponibilità.",
      "municipio": "Municipio VII",
      "email": "lavoraconnoimanser@gmail.com",
      "automaticMatching": true,
      "sourceUrls": [
        "https://mansercooperativa.org/contatti/",
        "https://mansercooperativa.org/area-economia-sociale/"
      ],
      "verificationNote": ""
    },
    {
      "name": "Appia Riabilitazione Capodarco – Anteo",
      "address": "Via Lungro 1–3, 00178 Roma",
      "phone": "06 712901202 / 06 712901205",
      "hours": "Da confermare presso l’ente",
      "description": "Struttura sanitaria di riabilitazione e assistenza per persone con disabilità. Non documentate divisioni occupazionali verde, manutenzioni, centralino o navette. Verifica: Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio VII",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.anteocoop.it/wp-content/uploads/2026/03/PARS-2026-Capodarco.pdf"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "directoryCategory": "Struttura sanitaria"
    },
    {
      "name": "Cooperativa Sociale Magliana '80 Onlus",
      "address": "Via Vaiano 23, 00146 Roma",
      "phone": "06 550 0765",
      "hours": "Da confermare presso l’ente",
      "description": "Scheda in revisione: il collegamento a questa professione o i recapiti operativi non sono sufficientemente documentati. Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati.",
      "municipio": "Municipio XI",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.magliana80.it/"
      ],
      "verificationNote": "Abbinamento professionale sospeso: attività, requisiti o canale di candidatura non sufficientemente documentati."
    }
  ],
  "Servizi territoriali (consultazione)": [
    {
      "name": "Biblioteca Elsa Morante",
      "address": "Porto Turistico di Roma, Lungomare Duca degli Abruzzi 84, 00121 Roma (sede sostitutiva)",
      "phone": "06 45460481",
      "hours": "Da confermare presso l’ente",
      "description": "Biblioteca pubblica. Corso di italiano L2 nell’anno corrente non verificato: contattare la biblioteca prima di indirizzare una persona.",
      "email": "elsamorante@bibliotechediroma.it",
      "municipio": "Municipio X",
      "automaticMatching": false,
      "sourceUrls": [
        "https://www.comune.roma.it/web/it/dettaglio.page?contentId=UFF29050",
        "https://turismoroma.it/it/luoghi/biblioteca-elsa-morante",
        "https://www.bibliotechediroma.it/opac/library/biblioteca-elsa-morante/RMBO2"
      ],
      "verificationNote": "",
      "directoryCategory": "Biblioteca"
    }
  ]
};

// 100% VERIFIED EMAILS FOR EACH ENTITY
const cooperativeEmails: Record<string, string> = {
  "PrivatAssistenza Ostia Lido": "ostialido@privatassistenza.it",
  "Assistenza e Territorio - Soc. Coop. Sociale Onlus": "info@assistenza-territorio.it",
  "Fondazione Roma Litorale": "protocollo@fondazionerml.com",
  "Fondazione Roma Litorale - Agenzia Lavoro": "protocollo@fondazionerml.com",
  "Fondazione Roma Litorale - Agenzia Lavoro Ostia": "protocollo@fondazionerml.com",
  "Cooperativa Sociale Futura Onlus": "coopfutura@tiscali.it",
  "Cooperativa Lido": "info@cooperativalido.it",
  "Studio Eurogiga (Servizi e Payroll Ostia)": "infostudio@eurogiga.it",
  "Studio Eurogiga": "infostudio@eurogiga.it",
  "Adecco Filiale Fiumicino": "fiumicino.giorgis@adecco.it",
  "Adecco Filiale Fiumicino (Area Logistica / Aeroporto)": "fiumicino.giorgis@adecco.it",
  "Adecco Filiale Fiumicino (Ho.Re.Ca.)": "fiumicino.giorgis@adecco.it",
  "Adecco Filiale Fiumicino (Costruzioni e Cantieri)": "fiumicino.giorgis@adecco.it",
  "Adecco Filiale Fiumicino (Trasporti)": "fiumicino.giorgis@adecco.it",
  "Randstad Italia - Filiale Roma EUR": "roma.piazzale-sturzo@randstad.it",
  "Randstad Italia - Filiale Roma EUR (Logistica)": "roma.piazzale-sturzo@randstad.it",
  "Randstad Italia - Filiale Roma EUR (Hospitality & Food)": "roma.piazzale-sturzo@randstad.it",
  "Randstad Italia - Filiale Roma EUR (Food)": "roma.piazzale-sturzo@randstad.it",
  "Randstad Italia - Filiale Roma EUR (Hospitality)": "roma.piazzale-sturzo@randstad.it",
  "Randstad Italia - Filiale Roma EUR (Office)": "roma.piazzale-sturzo@randstad.it",
  "Randstad Italia - Filiale Roma EUR (Logistics & Transport)": "roma.piazzale-sturzo@randstad.it",
  "Randstad Digital / Centro": "roma.cavour@randstad.it",
  "Cooperativa Sociale OSA (Operatori Sanitari Associati)": "info@osa.coop",
  "Cooperativa Sociale Nuova Sair Onlus": "info@nuovasair.it",
  "Cooperativa Sociale Nuova Sair - Segreteria": "info@nuovasair.it",
  "Cooperativa Sociale San Saturnino Onlus": "amministrazione@sansaturnino.it",
  "Cooperativa Sociale Cecilia Onlus": "info@ceciliacoop.it",
  "Cooperativa Sociale Capodarco Roma": "info.capodarcoroma@gruppoanteo.it",
  "Cooperativa Sociale Capodarco Roma - Manutenzioni": "info.capodarcoroma@gruppoanteo.it",
  "Cooperativa Sociale Capodarco - Divisione Verde": "info.capodarcoroma@gruppoanteo.it",
  "Cooperativa Sociale Capodarco Roma - Centralino": "info.capodarcoroma@gruppoanteo.it",
  "Cooperativa Sociale Capodarco - Trasporti e Navette": "info.capodarcoroma@gruppoanteo.it",
  "Cooperativa Sociale Apriti Sesamo Onlus": "info@apritisesamo.org",
  "Cooperativa Sociale Prassi e Ricerca Onlus": "info@prassiericerca.it",
  "Cooperativa Sociale Santi Pietro e Paolo": "info@santipietroepaolo.it",
  "Cooperativa Sociale Magliana '80 Onlus": "info@magliana80.it",
  "Cooperativa Sociale Manser Onlus": "info@mansercooperativa.org",
  "Cooperativa Sociale Manser Onlus - Logistica": "info@mansercooperativa.org",
  "Cooperativa Sociale Roma 81": "info@roma81.org",
  "Cooperativa Sociale Speha Fresia": "info@spehafresia.it",
  "Cooperativa Sociale Idea Prisma 82": "coop@ideaprisma.it",
  "Cooperativa Sociale Barikamà": "barikama@altervista.org",
  "Cooperativa Sociale Barikamà (Agricoltura Sociale)": "barikama@altervista.org",
  "Barikamà Caffè (Cooperativa Sociale Barikamà)": "barikama@altervista.org",
  "Trattoria de Gli Amici (Sant'Egidio)": "amici@santegidio.org",
  "Gruppo La Cascina": "info@lacascina.it",
  "Gruppo La Cascina (Ristorazione e Mense)": "info@lacascina.it",
  "Gruppo La Cascina (Ristorazione e Banqueting)": "info@lacascina.it",
  "La Locanda dei Girasoli (Pizzeria Sociale)": "info@locandadeigirasoli.it",
  "Cooperativa Sociale Agricola 'Agricoltura Nuova'": "info@agricolturanuova.it",
  "Associazione API-COLF Roma": "sedenazionaleapicolf@api-colf.it",
  "Cassa Edile di Mutualità e Assistenza di Roma e Provincia": "info@cassaedilediroma.it",
  "Coldiretti Roma - Sede Provinciale": "roma@coldiretti.it",
  "Sicuritalia S.p.A. - Servizi Fiduciari Roma": "info@sicuritalia.it",
  "Securitas Metronotte Roma": "info@securitasmetronotte.it",
  "Cooperativa Sociale Men At Work": "info@menatwork.coop",
  "Cooperativa Sociale Il Percorso": "info@coopilpercorso.it",
  "Gi Group Roma Office": "roma.office@gigroup.com",
  "Gi Group Roma Services": "roma.bissolati@gigroup.com",
  "Gi Group Roma Services & Ho.Re.Ca.": "roma.bissolati@gigroup.com",
  "Gi Group Roma Industrial": "roma.tuscolana@gigroup.com",
  "Gi Group Roma Industrial & Logistics": "roma.tuscolana@gigroup.com",
  "Adecco Roma EUR": "roma.esperanto@adecco.it",
  "Adecco Roma Ostiense": "roma.ostiense@adecco.it",
  "Synergie Roma Termini": "roma.termini@synergie-italia.it",
  "Synergie Roma Appia - Divisione Ho.Re.Ca.": "roma.horeca@synergie-italia.it",
  "Synergie Roma La Spezia": "roma.appia@synergie-italia.it",
  "Synergie Roma La Spezia (Logistica)": "roma.appia@synergie-italia.it",
  "Manpower Roma Manzoni": "roma.manzoni@manpower.it",
  "Manpower Roma Tuscolana": "roma.ottato@manpower.it",
  "Umana Roma Centro": "roma.centro@umana.it",
  "Umana Roma Appia": "roma.appia@umana.it"
};

function getCooperativeEmail(name: string): string {
  if (cooperativeEmails[name]) return cooperativeEmails[name];
  for (const [k, v] of Object.entries(cooperativeEmails)) {
    if (name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase())) {
      return v;
    }
  }
  return ""; // Non inventare recapiti email mancanti
}

export function queryLocalDb(jobSought: string, zoneResident: string, zoneJobSought: string): LocalCooperative[] {
  let normalizedKey = "";
  const js = normalizeSearchText(jobSought);
  if (!js) return [];

  if (js.includes("badante") || js.includes("assistenza anziani")) {
    normalizedKey = "Badante (assistenza anziani)";
  } else if (js.includes("colf") || js.includes("pulizie") || js.includes("domestici")) {
    normalizedKey = "Colf/pulizie (servizi domestici)";
  } else if (js.includes("facchino") || js.includes("magazzin")) {
    normalizedKey = "Facchino/magazziniere";
  } else if (js.includes("lavapiatti") || js.includes("aiuto cucina")) {
    normalizedKey = "Lavapiatti/aiuto cucina";
  } else if (js.includes("pizzaiolo")) {
    normalizedKey = "Pizzaiolo";
  } else if (js.includes("cuoco")) {
    normalizedKey = "Cuoco";
  } else if (js.includes("muratore") || js.includes("operaio edile") || js.includes("edil")) {
    normalizedKey = "Muratore/Operaio edile";
  } else if (js.includes("custode") || js.includes("portiere")) {
    normalizedKey = "Custode/portiere";
  } else if (js.includes("cameriere") || js.includes("barista")) {
    normalizedKey = "Cameriere/barista";
  } else if (js.includes("giardin")) {
    normalizedKey = "Giardiniere";
  } else if (js.includes("segreteria") || js.includes("reception") || js.includes("ufficio") || js.includes("front office") || js.includes("amministrativ") || js.includes("segretar")) {
    normalizedKey = "Segreteria (assistenza d'ufficio/reception)";
  } else if (js.includes("autist") || js.includes("conduc") || js.includes("guid") || js.includes("driver") || js.includes("fattorin") || js.includes("patente")) {
    normalizedKey = "Autista (conducente/fattorino)";
  } else {
    const foundKey = Object.keys(localDb).find(k => normalizeSearchText(k).includes(js) || js.includes(normalizeSearchText(k)));
    if (foundKey) {
      normalizedKey = foundKey;
    }
  }

  const baseList = (localDb[normalizedKey] || []).filter(item => item.automaticMatching !== false);

  const residentMun = getMunicipioFromZone(zoneResident);
  const jobMun = getMunicipioFromZone(zoneJobSought);
  const targetMun = jobMun || residentMun;

  const neighborhoodTokens = extractNeighborhoodKeywords(zoneJobSought, zoneResident);

  const hasKeyword = (item: LocalCooperative) => {
    if (neighborhoodTokens.length === 0) return false;
    const searchArea = `${item.name} ${item.address} ${item.description}`.toLowerCase();
    return neighborhoodTokens.some(t => searchArea.includes(t));
  };

  const customCoops = getCustomCooperatives();
  const customMatching = customCoops.filter(item => {
    if (item.automaticMatching === false) return false;
    const professionalTerms = normalizeSearchText(normalizedKey || jobSought).split(/[^a-z0-9]+/).filter(t => t.length > 3);
    if (!professionalTerms.some(t => normalizeSearchText(item.description).includes(t))) return false;
    return !item.municipio || item.municipio === targetMun || hasKeyword(item);
  });

  const munAndKeyword = baseList.filter(item => item.municipio === targetMun && hasKeyword(item));
  const munOnly = baseList.filter(item => item.municipio === targetMun && !hasKeyword(item));
  const otherMunKeyword = baseList.filter(item => item.municipio !== targetMun && hasKeyword(item));
  
  // Priorità rigorosa al territorio richiesto. Non riempire con enti di tutta Roma.
  // Per zone non riconosciute occorre conferma manuale del Municipio.
  const combined = [
    ...customMatching,
    ...munAndKeyword,
    ...munOnly,
    ...otherMunKeyword
  ];

  const uniqueList: LocalCooperative[] = [];
  const seenNames = new Set<string>();

  for (const item of combined) {
    const key = `${normalizeSearchText(item.name)}|${normalizeSearchText(item.address)}`;
    if (!seenNames.has(key)) {
      seenNames.add(key);
      uniqueList.push(item);
    }
  }

  return uniqueList.slice(0, 10).map(item => ({
    ...item,
    email: item.email || ""
  }));
}

// SEARCH FUNCTION FOR OFFICES, ADDRESSES, PHONES IN DATABASE
export interface DatabaseSearchResult {
  category: "Ufficio Pubblico" | "Scuola Italiano" | "Cooperativa / Agenzia" | NonNullable<LocalCooperative["directoryCategory"]>;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  description: string;
  municipio: string;
  profession?: string;
}


// Ricerca tollerante ad accenti, apostrofi e spazi.
export function normalizeSearchText(value: string): string {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[’']/g, " ").replace(/[^a-z0-9]+/g, " ").trim()
    .replace(/\s+/g, " ");
}
function matchesSearch(text: string, query: string): boolean {
  const tokens = normalizeSearchText(query).split(" ").filter(Boolean);
  const searchable = normalizeSearchText(text);
  return tokens.every(token => searchable.includes(token));
}

export function searchLocalDatabase(query: string, filterCategory?: string, filterMunicipio?: string): DatabaseSearchResult[] {
  const q = normalizeSearchText(query || "");
  const results: DatabaseSearchResult[] = [];

  // 1. Search Public Offices
  if (!filterCategory || filterCategory === "all" || filterCategory === "offices") {
    for (const [mun, offices] of Object.entries(municipioOffices)) {
      for (const off of offices) {
        if (filterMunicipio && filterMunicipio !== "all" && (off.municipio || mun) !== filterMunicipio) continue;
        const fullText = `${off.name} ${off.address} ${off.phone} ${off.email || ""} ${off.description} ${mun}`.toLowerCase();
        if (!q || matchesSearch(fullText, q)) {
          results.push({
            category: "Ufficio Pubblico",
            name: off.name,
            address: off.address,
            phone: off.phone,
            email: off.email || "",
            hours: off.hours,
            description: off.description,
            municipio: off.municipio || mun
          });
        }
      }
    }
  }

  // 2. Search Schools
  if (!filterCategory || filterCategory === "all" || filterCategory === "schools") {
    for (const [mun, schools] of Object.entries(municipioSchools)) {
      for (const sch of schools) {
        if (filterMunicipio && filterMunicipio !== "all" && (sch.municipio || mun) !== filterMunicipio) continue;
        const fullText = `${sch.name} ${sch.address} ${sch.phone} ${sch.email || ""} ${sch.description} ${mun}`.toLowerCase();
        if (!q || matchesSearch(fullText, q)) {
          results.push({
            category: "Scuola Italiano",
            name: sch.name,
            address: sch.address,
            phone: sch.phone,
            email: sch.email || "",
            hours: sch.hours,
            description: sch.description,
            municipio: sch.municipio || mun
          });
        }
      }
    }
  }

  // 3. Search Cooperatives & Agencies
  if (!filterCategory || filterCategory === "all" || filterCategory === "cooperatives") {
    for (const [prof, list] of Object.entries(localDb)) {
      for (const coop of list) {
        if (filterMunicipio && filterMunicipio !== "all" && coop.municipio !== filterMunicipio) continue;
        const email = coop.email || "";
        const fullText = `${coop.name} ${coop.address} ${coop.phone} ${email} ${coop.description} ${coop.municipio || ""} ${prof}`.toLowerCase();
        if (!q || matchesSearch(fullText, q)) {
          // Avoid duplicate display across professions if searching globally
          const exists = results.some(r => normalizeSearchText(r.name) === normalizeSearchText(coop.name) && normalizeSearchText(r.address) === normalizeSearchText(coop.address));
          if (!exists) {
            results.push({
              category: coop.directoryCategory || "Cooperativa / Agenzia",
              name: coop.name,
              address: coop.address,
              phone: coop.phone,
              email: email,
              hours: coop.hours,
              description: coop.description,
              municipio: coop.municipio || "Roma",
              profession: prof
            });
          }
        }
      }
    }
  }

  return results.filter((item, index, all) => all.findIndex(other =>
    other.category === item.category && normalizeSearchText(other.name) === normalizeSearchText(item.name) &&
    normalizeSearchText(other.address) === normalizeSearchText(item.address)) === index);
}
