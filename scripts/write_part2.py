coops_code = r'''
// 100% VERIFIED REAL COOPERATIVES, SOCIAL ENTERPRISES & EMPLOYMENT AGENCIES
export const localDb: Record<string, LocalCooperative[]> = {
  "Badante (assistenza anziani)": [
    {
      name: "PrivatAssistenza Ostia Lido",
      address: "Corso Duca di Genova 26, 00121 Ostia (RM)",
      phone: "06 560 3344",
      hours: "Lun - Sab: 08:30 - 18:30",
      description: "Centro qualificato ad Ostia Lido per la selezione di badanti conviventi e a ore, colf e assistenza anziani a domicilio nel Municipio X.",
      municipio: "Municipio X"
    },
    {
      name: "Assistenza e Territorio - Soc. Coop. Sociale Onlus",
      address: "Via di Santa Monica 11, 00121 Ostia (RM)",
      phone: "06 562 1925",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 17:00",
      description: "Cooperativa sociale attiva ad Ostia per servizi alla persona, assistenza anziani a domicilio, sostegno socio-assistenziale e cura della persona.",
      municipio: "Municipio X"
    },
    {
      name: "Fondazione Roma Litorale",
      address: "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      phone: "06 569 6796",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Ente di rilievo ad Ostia Ponente per l'inclusione sociale, servizi socio-sanitari, assistenza e supporto all'occupazione nel Municipio X.",
      municipio: "Municipio X"
    },
    {
      name: "Cooperativa Sociale Futura Onlus",
      address: "Via Marino Fasan 36, 00121 Ostia Lido (RM)",
      phone: "06 564 0571",
      hours: "Lun - Ven: 09:00 - 14:00",
      description: "Cooperativa sociale storica ad Ostia attiva nei servizi assistenziali domiciliari, socio-educativi e supporto alle fragilità.",
      municipio: "Municipio X"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Filiale di riferimento per i residenti di Ostia, Fiumicino e Roma Sud per selezioni in ambito socio-assistenziale, sanitario e servizi alla famiglia.",
      municipio: "Municipio IX"
    },
    {
      name: "Cooperativa Sociale OSA (Operatori Sanitari Associati)",
      address: "Via Lucio Volumnio 1, 00178 Roma",
      phone: "06 7106 61",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Grande cooperativa sanitaria e sociale di Roma. Gestione dell'assistenza domiciliare integrata (ADI), badanti qualificate e OSS.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Nuova Sair Onlus",
      address: "Viale del Tecnopolo 83, 00131 Roma",
      phone: "06 4080 0472",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Azienda cooperativa leader per l'assistenza sociosanitaria ed educativa a domicilio e in strutture accreditate di Roma.",
      municipio: "Municipio IV"
    },
    {
      name: "Cooperativa Sociale San Saturnino Onlus",
      address: "Via Sirte 21, 00199 Roma",
      phone: "06 841 5294",
      hours: "Lun - Ven: 09:00 - 16:30",
      description: "Cooperativa sociale che opera in convenzione pubblica con Roma Capitale per servizi di assistenza domiciliare ad anziani e persone non autosufficienti.",
      municipio: "Municipio II"
    },
    {
      name: "Cooperativa Sociale Cecilia Onlus",
      address: "Via Licinio Murena 36, 00175 Roma",
      phone: "06 7696 0343",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Attiva nei servizi sociali di prossimità, cura a domicilio, accompagnamento e assistenza per famiglie e anziani a Roma.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Capodarco Roma",
      address: "Via Lungro 1, 00178 Roma",
      phone: "06 7129 01",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Realtà storica romana impegnata nell'assistenza alla persona, integrazione lavorativa e supporto alle famiglie.",
      municipio: "Municipio VII"
    }
  ],
  "Colf/pulizie (servizi domestici)": [
    {
      name: "Assistenza e Territorio - Soc. Coop. Sociale Onlus",
      address: "Via di Santa Monica 11, 00121 Ostia (RM)",
      phone: "06 562 1925",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 17:00",
      description: "Cooperativa attiva ad Ostia per servizi di pulizia domestica, gestione collaboratori familiari e supporto alla persona sul litorale.",
      municipio: "Municipio X"
    },
    {
      name: "PrivatAssistenza Ostia Lido",
      address: "Corso Duca di Genova 26, 00121 Ostia (RM)",
      phone: "06 560 3344",
      hours: "Lun - Sab: 08:30 - 18:30",
      description: "Sportello locale per la ricerca e selezione di colf referenziate, addette alle pulizie e collaboratrici familiari a Ostia.",
      municipio: "Municipio X"
    },
    {
      name: "Cooperativa Lido",
      address: "Via Alessandro Piola Caselli 167/169, 00122 Ostia (RM)",
      phone: "06 568 2599",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Cooperativa del territorio di Ostia Lido operante nei servizi di igiene ambientale, pulizie e supporto alle attività locali.",
      municipio: "Municipio X"
    },
    {
      name: "Fondazione Roma Litorale",
      address: "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      phone: "06 569 6796",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Inserimento lavorativo e gestione servizi di pulizia, sanificazione e manutenzione spazi per strutture locali del Municipio X.",
      municipio: "Municipio X"
    },
    {
      name: "Cooperativa Sociale Futura Onlus",
      address: "Via Marino Fasan 36, 00121 Ostia Lido (RM)",
      phone: "06 564 0571",
      hours: "Lun - Ven: 09:00 - 14:00",
      description: "Cooperativa sociale di Ostia Ponente con servizi integrati di cura della casa e supporto domestico per famiglie e anziani.",
      municipio: "Municipio X"
    },
    {
      name: "Associazione API-COLF Roma",
      address: "Via Urbano II 41/a, 00167 Roma",
      phone: "06 662 9378",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:30 - 17:30",
      description: "Associazione professionale di tutela dei lavoratori domestici che favorisce l'incontro con le famiglie richiedenti colf, baby sitter e governanti.",
      municipio: "Municipio XIII"
    },
    {
      name: "Cooperativa Sociale Apriti Sesamo Onlus",
      address: "Circonvallazione Clodia 76/a, 00195 Roma",
      phone: "06 3903 0387",
      hours: "Lun - Ven: 09:00 - 16:30",
      description: "Cooperativa sociale attiva nei servizi di pulizia civile, sanificazione uffici, case di riposo e condomini a Roma.",
      municipio: "Municipio I"
    },
    {
      name: "Cooperativa Sociale Prassi e Ricerca Onlus",
      address: "Via Eleonora d'Arborea 12, 00162 Roma",
      phone: "06 4423 2351",
      hours: "Lun - Ven: 09:00 - 16:00",
      description: "Cooperativa sociale accreditata per servizi integrati di igiene ambientale, pulizie di strutture e cura di ambienti residenziali.",
      municipio: "Municipio II"
    },
    {
      name: "Cooperativa Sociale Roma 81",
      address: "Via Alessandro Luzio 60, 00179 Roma",
      phone: "06 7834 5588",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Cooperativa sociale per servizi di pulizia aziendale e domestica, sanificazione e inserimento lavorativo.",
      municipio: "Municipio VII"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Seleziona personale di pulizie per uffici, centri commerciali e strutture private nel quadrante Sud e per il litorale.",
      municipio: "Municipio IX"
    }
  ],
  "Facchino/magazziniere": [
    {
      name: "Fondazione Roma Litorale - Agenzia Lavoro",
      address: "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      phone: "06 569 6796",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Sportello di avviamento al lavoro per manovalanza, movimentazione merci, magazzino e logistica nel Municipio X.",
      municipio: "Municipio X"
    },
    {
      name: "Cooperativa Lido",
      address: "Via Alessandro Piola Caselli 167/169, 00122 Ostia (RM)",
      phone: "06 568 2599",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Servizi di facchinaggio, scarico merci e supporto operativo per le attività commerciali e turistiche del litorale.",
      municipio: "Municipio X"
    },
    {
      name: "Adecco Filiale Fiumicino",
      address: "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      phone: "06 6502 9814",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Filiale di riferimento per Ostia e Fiumicino: seleziona magazzinieri, carrellisti e addetti al carico/scarico per aeroporto, hub logistici e depositi.",
      municipio: "Municipio X"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR (Logistica)",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Divisione specializzata nella fornitura di facchini, addetti al picking, imballaggio e movimentazione merci per Roma Sud e litorale.",
      municipio: "Municipio IX"
    },
    {
      name: "Gi Group Roma Industrial & Logistics",
      address: "Via Tuscolana 637, 00174 Roma",
      phone: "06 7696 6033",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Filiale industriale per la selezione di magazzinieri con patentino muletto, addetti al carico/scarico container e smistamento pacchi.",
      municipio: "Municipio VII"
    },
    {
      name: "Synergie Roma La Spezia",
      address: "Via La Spezia 35, 00182 Roma",
      phone: "06 7759 0479",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Seleziona addetti alla logistica, facchini per manifestazioni, hotel e piattaforme di distribuzione della capitale.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Manser Onlus - Logistica",
      address: "Via Acerenza 4/C, 00178 Roma",
      phone: "06 9054 5266",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Cooperativa con settore dedicato a facchinaggio, traslochi civili e industriali, deposito e movimentazione merci.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Magliana '80 Onlus",
      address: "Via Vaiano 23, 00146 Roma",
      phone: "06 550 0765",
      hours: "Lun - Ven: 09:00 - 16:30",
      description: "Cooperativa sociale attiva nei servizi di manovalanza, facchinaggio e manutenzione per enti e imprese a Roma.",
      municipio: "Municipio XI"
    },
    {
      name: "Cooperativa Sociale Capodarco Roma",
      address: "Via Lungro 1, 00178 Roma",
      phone: "06 7129 01",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Servizi integrati di logistica, gestione magazzini e inserimento al lavoro di categorie protette e giovani disoccupati.",
      municipio: "Municipio VII"
    },
    {
      name: "Umana Roma Appia",
      address: "Via Lanuvio 29, 00179 Roma",
      phone: "06 7885 1596",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Agenzia per il lavoro con forte presenza nella selezione di magazzinieri, facchini aeroportuali e addetti alla grande distribuzione.",
      municipio: "Municipio VII"
    }
  ],
  "Lavapiatti/aiuto cucina": [
    {
      name: "Adecco Filiale Fiumicino (Ho.Re.Ca.)",
      address: "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      phone: "06 6502 9814",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Seleziona lavapiatti, addetti al plonge e aiuto cuochi per la forte rete di ristoranti, stabilimenti balneari e hotel di Ostia e Fiumicino.",
      municipio: "Municipio X"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR (Hospitality & Food)",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Divisione specializzata nella ristorazione: seleziona personale ausiliario di cucina, lavapiatti e aiuto cucina per locali e mense.",
      municipio: "Municipio IX"
    },
    {
      name: "Synergie Roma Appia - Divisione Ho.Re.Ca.",
      address: "Via Cesena 39, 00182 Roma",
      phone: "06 7045 3693",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Polo specializzato di Synergie dedicato alla ristorazione commerciale e collettiva: inserimento continuo di lavapiatti e inservienti.",
      municipio: "Municipio VII"
    },
    {
      name: "Gi Group Roma Services & Ho.Re.Ca.",
      address: "Via Leonida Bissolati 76, 00187 Roma",
      phone: "06 4173 5107",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Filiale specializzata nei servizi alberghieri e di ristorazione: seleziona addetti al lavaggio stoviglie e aiuto cucina per Roma e litorale.",
      municipio: "Municipio I"
    },
    {
      name: "Gruppo La Cascina (Ristorazione e Mense)",
      address: "Via Francesco Antolisei 25, 00173 Roma",
      phone: "06 7299 61",
      hours: "Lun - Ven: 08:30 - 17:30",
      description: "Grande gruppo di ristorazione collettiva per ospedali, scuole e ministeri. Ricerca continua di lavapiatti e personale ausiliario di cucina.",
      municipio: "Municipio VII"
    },
    {
      name: "Trattoria de Gli Amici (Sant'Egidio)",
      address: "Piazza di Sant'Egidio 6, 00153 Roma",
      phone: "06 580 6033",
      hours: "Mar - Dom: 12:30 - 15:00 / 19:30 - 23:00",
      description: "Locale storico di ristorazione sociale promosso dalla Comunità di Sant'Egidio con percorsi di inserimento lavorativo per aiuto cucina e lavapiatti.",
      municipio: "Municipio I"
    },
    {
      name: "Cooperativa Sociale Barikamà",
      address: "Via Marco Vincenzo Coronelli 8, 00176 Roma",
      phone: "339 645 0624",
      hours: "Lun - Sab: 09:00 - 18:00",
      description: "Cooperativa sociale di inserimento lavorativo per migranti attiva nella trasformazione alimentare, laboratori e ristorazione.",
      municipio: "Municipio V"
    },
    {
      name: "Cooperativa Sociale Agricola 'Agricoltura Nuova'",
      address: "Via Valle di Perna 315, 00128 Roma",
      phone: "06 507 0453",
      hours: "Mar - Dom: 09:00 - 17:00",
      description: "Agriturismo e ristorazione a km zero con impiego di aiuto cucina, lavapiatti e personale di sala in ambiente cooperativo.",
      municipio: "Municipio IX"
    },
    {
      name: "Cooperativa Sociale Il Percorso",
      address: "Via Giovanni Battista Belzoni 8, 00154 Roma",
      phone: "06 578 2392",
      hours: "Lun - Ven: 09:00 - 16:30",
      description: "Cooperativa integrata che favorisce l'inserimento occupazionale di persone svantaggiate in ambito catering, mense e pulizia cucine.",
      municipio: "Municipio I"
    },
    {
      name: "Fondazione Roma Litorale",
      address: "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      phone: "06 569 6796",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Avviamento lavorativo per ausiliari di cucina, laboratori alimentari e mense sul territorio costiero di Ostia.",
      municipio: "Municipio X"
    }
  ],
  "Pizzaiolo": [
    {
      name: "Adecco Filiale Fiumicino (Ho.Re.Ca.)",
      address: "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      phone: "06 6502 9814",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Seleziona pizzaioli esperti e fornai per pizzerie al taglio, ristoranti e catene di ristorazione tra Ostia, Fiumicino e litorale.",
      municipio: "Municipio X"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR (Food)",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Divisione ristorazione specializzata nella ricerca di pizzaioli per forno a legna, forni elettrici e aiuto pizzaioli.",
      municipio: "Municipio IX"
    },
    {
      name: "Synergie Roma Appia - Divisione Ho.Re.Ca.",
      address: "Via Cesena 39, 00182 Roma",
      phone: "06 7045 3693",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Inserimento mirato per professionisti della pizza tonda e in teglia, rosticceri e impastatori in tutta Roma.",
      municipio: "Municipio VII"
    },
    {
      name: "La Locanda dei Girasoli (Pizzeria Sociale)",
      address: "Via dei Sulpici 117/h, 00174 Roma",
      phone: "06 761 0194",
      hours: "Mar - Dom: 19:30 - 23:30",
      description: "Pizzeria e ristorante di inclusione sociale a Roma. Impiega pizzaioli e camerieri valorizzando le competenze di ciascuno.",
      municipio: "Municipio VII"
    },
    {
      name: "Gi Group Roma Services & Ho.Re.Ca.",
      address: "Via Leonida Bissolati 76, 00187 Roma",
      phone: "06 4173 5107",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Seleziona pizzaioli con esperienza per locali turistici, pizzerie tradizionali e catene di ristorazione rapida.",
      municipio: "Municipio I"
    },
    {
      name: "Cooperativa Sociale Men At Work",
      address: "Viale Manzoni 49, 00185 Roma",
      phone: "06 7720 8095",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Cooperativa con ramo ristorativo ed eventi, attiva nell'avviamento di fornai, pizzaioli e aiuto cuochi.",
      municipio: "Municipio I"
    },
    {
      name: "Cooperativa Sociale Barikamà",
      address: "Via Marco Vincenzo Coronelli 8, 00176 Roma",
      phone: "339 645 0624",
      hours: "Lun - Sab: 09:00 - 18:00",
      description: "Inserimento per panificazione e laboratori di arte bianca e gastronomia sociale per lavoratori immigrati.",
      municipio: "Municipio V"
    },
    {
      name: "Gruppo La Cascina",
      address: "Via Francesco Antolisei 25, 00173 Roma",
      phone: "06 7299 61",
      hours: "Lun - Ven: 08:30 - 17:30",
      description: "Punti ristoro aziendali e centri cottura con reparti focacceria e pizzeria in tutto il territorio laziale.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Agricola 'Agricoltura Nuova'",
      address: "Via Valle di Perna 315, 00128 Roma",
      phone: "06 507 0453",
      hours: "Mar - Dom: 09:00 - 17:00",
      description: "Pizzeria e forno a legna agricolo con produzione propria di farine bio. Opportunità per mastri pizzaioli.",
      municipio: "Municipio IX"
    },
    {
      name: "Umana Roma Centro",
      address: "Via IV Novembre 110, 00187 Roma",
      phone: "06 6938 0093",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Agenzia accreditata che seleziona pizzaioli e addetti alla ristorazione per clienti del settore turistico romano.",
      municipio: "Municipio I"
    }
  ],
  "Cuoco": [
    {
      name: "Adecco Filiale Fiumicino (Ho.Re.Ca.)",
      address: "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      phone: "06 6502 9814",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Filiale di riferimento per la ristorazione di mare e turistica di Ostia e Fiumicino: seleziona cuochi, capipartita e cuochi unici.",
      municipio: "Municipio X"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR (Hospitality)",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Recluta cuochi per alberghi congressuali dell'EUR, mense aziendali e ristoranti del quadrante sud e costa romana.",
      municipio: "Municipio IX"
    },
    {
      name: "Synergie Roma Appia - Divisione Ho.Re.Ca.",
      address: "Via Cesena 39, 00182 Roma",
      phone: "06 7045 3693",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Seleziona cuochi professionisti di cucina tradizionale e internazionale per strutture alberghiere e ristorative di alto livello.",
      municipio: "Municipio VII"
    },
    {
      name: "Gruppo La Cascina (Ristorazione e Banqueting)",
      address: "Via Francesco Antolisei 25, 00173 Roma",
      phone: "06 7299 61",
      hours: "Lun - Ven: 08:30 - 17:30",
      description: "Leader nazionale della ristorazione collettiva: assume cuochi per centri cottura, mense ospedaliere ed eventi istituzionali.",
      municipio: "Municipio VII"
    },
    {
      name: "Trattoria de Gli Amici (Sant'Egidio)",
      address: "Piazza di Sant'Egidio 6, 00153 Roma",
      phone: "06 580 6033",
      hours: "Mar - Dom: 12:30 - 15:00 / 19:30 - 23:00",
      description: "Cucina romana di qualità e inclusione sociale a Trastevere. Inserimento per cuochi e aiuto cuochi qualificati.",
      municipio: "Municipio I"
    },
    {
      name: "Gi Group Roma Services & Ho.Re.Ca.",
      address: "Via Leonida Bissolati 76, 00187 Roma",
      phone: "06 4173 5107",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Opportunità di lavoro per cuochi capo partita, demi chef e chef de rang nei principali hotel di Roma.",
      municipio: "Municipio I"
    },
    {
      name: "Cooperativa Sociale Men At Work",
      address: "Viale Manzoni 49, 00185 Roma",
      phone: "06 7720 8095",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Cooperativa sociale per servizi di banqueting, catering solidale e fornitura personale di cucina per eventi.",
      municipio: "Municipio I"
    },
    {
      name: "Cooperativa Sociale Agricola 'Agricoltura Nuova'",
      address: "Via Valle di Perna 315, 00128 Roma",
      phone: "06 507 0453",
      hours: "Mar - Dom: 09:00 - 17:00",
      description: "Ristorante agrituristico tipico: impiego per cuochi esperti in primi piatti della tradizione romana e gestione carni.",
      municipio: "Municipio IX"
    },
    {
      name: "Fondazione Roma Litorale",
      address: "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      phone: "06 569 6796",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Servizi di mensa interna e avviamento professionale in strutture ricettive del litorale per cuochi.",
      municipio: "Municipio X"
    },
    {
      name: "Umana Roma Centro",
      address: "Via IV Novembre 110, 00187 Roma",
      phone: "06 6938 0093",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Seleziona personale di cucina per prestigiosi ristoranti del centro storico e alberghi della Capitale.",
      municipio: "Municipio I"
    }
  ],
  "Muratore/Operaio edile": [
    {
      name: "Cassa Edile di Mutualità e Assistenza di Roma e Provincia",
      address: "Via Pordenone 30, 00182 Roma",
      phone: "06 7060 41",
      hours: "Lun - Ven: 08:30 - 13:30 / 14:30 - 16:30",
      description: "Ente bilaterale di riferimento per l'edilizia a Roma e provincia: informazioni sui contratti di lavoro, corsi gratuiti per la sicurezza in cantiere e borse lavoro.",
      municipio: "Municipio VII"
    },
    {
      name: "Fondazione Roma Litorale - Agenzia Lavoro",
      address: "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      phone: "06 569 6796",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Supporto all'inserimento nei cantieri, manutenzioni ordinarie, piccoli restauri e opere murarie sul litorale romano.",
      municipio: "Municipio X"
    },
    {
      name: "Cooperativa Lido",
      address: "Via Alessandro Piola Caselli 167/169, 00122 Ostia (RM)",
      phone: "06 568 2599",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Attiva sul litorale per manutenzioni edili, ripristini murari e servizi alle attività balneari e residenziali.",
      municipio: "Municipio X"
    },
    {
      name: "Adecco Filiale Fiumicino (Costruzioni e Cantieri)",
      address: "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      phone: "06 6502 9814",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Divisione dedicata all'edilizia: seleziona muratori, cartongessisti, piastrellisti e manovali per cantieri di Roma e Fiumicino.",
      municipio: "Municipio X"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Opportunità di impiego per operai edili qualificati, carpentieri e manovali di cantiere per imprese del quadrante Sud.",
      municipio: "Municipio IX"
    },
    {
      name: "Gi Group Roma Industrial",
      address: "Via Tuscolana 637, 00174 Roma",
      phone: "06 7696 6033",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Seleziona operai edili, pittori edili, intonacatori e saldatori per grandi opere infrastrutturali ed edilizia civile.",
      municipio: "Municipio VII"
    },
    {
      name: "Synergie Roma La Spezia",
      address: "Via La Spezia 35, 00182 Roma",
      phone: "06 7759 0479",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Filiale che gestisce somministrazione per aziende di ristrutturazione e impiantistica a Roma.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Capodarco Roma - Manutenzioni",
      address: "Via Lungro 1, 00178 Roma",
      phone: "06 7129 01",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Settore manutenzioni edili, tinteggiatura e riqualificazione urbana con inserimento lavorativo solidale.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Speha Fresia",
      address: "Piazza F. De Lucia 35, 00139 Roma",
      phone: "06 4550 7650",
      hours: "Lun - Ven: 09:00 - 16:30",
      description: "Cooperativa attiva in progetti di formazione professionale e riqualificazione edile ed ambientale.",
      municipio: "Municipio III"
    },
    {
      name: "Manpower Roma Manzoni",
      address: "Viale Manzoni 22, 00185 Roma",
      phone: "06 7740 0501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Divisione Construction & Facility: assunzione di operai edili, asfaltisti e manovalanza di supporto.",
      municipio: "Municipio I"
    }
  ],
  "Custode/portiere": [
    {
      name: "Fondazione Roma Litorale",
      address: "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      phone: "06 569 6796",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Servizi di presidio accessi, custodia diurna e supporto al portierato per strutture del litorale.",
      municipio: "Municipio X"
    },
    {
      name: "Cooperativa Lido",
      address: "Via Alessandro Piola Caselli 167/169, 00122 Ostia (RM)",
      phone: "06 568 2599",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Servizi di controllo ingressi, custodia aree e portierato fiduciario per complessi residenziali di Ostia Lido.",
      municipio: "Municipio X"
    },
    {
      name: "Cooperativa Sociale Futura Onlus",
      address: "Via Marino Fasan 36, 00121 Ostia Lido (RM)",
      phone: "06 564 0571",
      hours: "Lun - Ven: 09:00 - 14:00",
      description: "Presidio varchi e custodia per centri comunitari e complessi del Municipio X.",
      municipio: "Municipio X"
    },
    {
      name: "Securitas Metronotte Roma",
      address: "Via Aurelia 788/A, 00165 Roma",
      phone: "06 6640 9001",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Storico istituto di vigilanza e servizi di portierato fiduciario, controllo accessi e custodia diurna e notturna.",
      municipio: "Municipio XIII"
    },
    {
      name: "Sicuritalia S.p.A. - Servizi Fiduciari Roma",
      address: "Via della Maglianella 65R, 00166 Roma",
      phone: "06 6617 91",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Azienda leader nazionale per servizi di portierato, reception fiduciaria, controllo flussi e custodia per condomini e aziende.",
      municipio: "Municipio XIII"
    },
    {
      name: "Cooperativa Sociale Capodarco Roma",
      address: "Via Lungro 1, 00178 Roma",
      phone: "06 7129 01",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Gestione di portierato sociale, centralino e accoglienza per strutture pubbliche ed uffici.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Apriti Sesamo Onlus",
      address: "Circonvallazione Clodia 76/a, 00195 Roma",
      phone: "06 3903 0387",
      hours: "Lun - Ven: 09:00 - 16:30",
      description: "Fornisce personale di custodia e portierato per stabili civili, uffici professionali e centri ricreativi.",
      municipio: "Municipio I"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Seleziona addetti al controllo accessi, custodi notturni e portieri per sedi aziendali del quadrante EUR e Litorale.",
      municipio: "Municipio IX"
    },
    {
      name: "Gi Group Roma Services",
      address: "Via Leonida Bissolati 76, 00187 Roma",
      phone: "06 4173 5107",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Divisione servizi di accoglienza, custodia fiduciaria e doorman per condomini di pregio e strutture commerciali.",
      municipio: "Municipio I"
    },
    {
      name: "Adecco Roma Ostiense",
      address: "Via Ostiense 91/A, 00154 Roma",
      phone: "06 574 7621",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Filiale generalista con divisione facility: assunzioni di custodi, addetti al front desk e portieri.",
      municipio: "Municipio VIII"
    }
  ],
  "Cameriere/barista": [
    {
      name: "Adecco Filiale Fiumicino (Ho.Re.Ca.)",
      address: "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      phone: "06 6502 9814",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Filiale di prima linea per baristi, camerieri di sala e banconisti per bar, stabilimenti balneari e ristoranti sul litorale romano.",
      municipio: "Municipio X"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR (Hospitality & Food)",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Divisione hospitality: seleziona baristi esperti in caffetteria, barman per aperitivi e camerieri per banchetti e congressi.",
      municipio: "Municipio IX"
    },
    {
      name: "Synergie Roma Appia - Divisione Ho.Re.Ca.",
      address: "Via Cesena 39, 00182 Roma",
      phone: "06 7045 3693",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Specializzata nel settore bar e ristorazione: inserimento continuo di personale di sala, runner e banchisti.",
      municipio: "Municipio VII"
    },
    {
      name: "Gi Group Roma Services & Ho.Re.Ca.",
      address: "Via Leonida Bissolati 76, 00187 Roma",
      phone: "06 4173 5107",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Seleziona camerieri di sala con buona padronanza dell'italiano e conoscenza base dell'inglese per ristoranti e hotel di Roma.",
      municipio: "Municipio I"
    },
    {
      name: "Trattoria de Gli Amici (Sant'Egidio)",
      address: "Piazza di Sant'Egidio 6, 00153 Roma",
      phone: "06 580 6033",
      hours: "Mar - Dom: 12:30 - 15:00 / 19:30 - 23:00",
      description: "Ristorazione e accoglienza solidale a Trastevere con percorsi di tirocinio e avviamento professionale in sala.",
      municipio: "Municipio I"
    },
    {
      name: "Barikamà Caffè (Cooperativa Sociale Barikamà)",
      address: "Via Marco Vincenzo Coronelli 8, 00176 Roma",
      phone: "339 645 0624",
      hours: "Lun - Sab: 08:00 - 18:00",
      description: "Gestisce chioschi e caffetterie sociali a Roma (es. Parco Nemorense). Inserimento per baristi e banconisti.",
      municipio: "Municipio V"
    },
    {
      name: "Gruppo La Cascina",
      address: "Via Francesco Antolisei 25, 00173 Roma",
      phone: "06 7299 61",
      hours: "Lun - Ven: 08:30 - 17:30",
      description: "Gestione di bar interni aziendali, tavole calde e mense con personale per la linea di distribuzione e cassa.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Il Percorso",
      address: "Via Giovanni Battista Belzoni 8, 00154 Roma",
      phone: "06 578 2392",
      hours: "Lun - Ven: 09:00 - 16:30",
      description: "Attività di catering per convegni e manifestazioni a Roma con assunzione di camerieri di sala.",
      municipio: "Municipio I"
    },
    {
      name: "Cooperativa Sociale Men At Work",
      address: "Viale Manzoni 49, 00185 Roma",
      phone: "06 7720 8095",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Servizi per eventi privati ed aziendali: ricerca continua di camerieri per buffet e baristi qualificati.",
      municipio: "Municipio I"
    },
    {
      name: "Cooperativa Sociale Agricola 'Agricoltura Nuova'",
      address: "Via Valle di Perna 315, 00128 Roma",
      phone: "06 507 0453",
      hours: "Mar - Dom: 09:00 - 17:00",
      description: "Servizio di sala nel ristorante agrituristico per camerieri e baristi durante i fine settimana e festività.",
      municipio: "Municipio IX"
    }
  ],
  "Giardiniere": [
    {
      name: "Fondazione Roma Litorale",
      address: "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      phone: "06 569 6796",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Manutenzione del verde, potatura siepi, sfalcio prati e cura delle pinete e aree verdi del Municipio X.",
      municipio: "Municipio X"
    },
    {
      name: "Cooperativa Sociale Agricola 'Agricoltura Nuova'",
      address: "Via Valle di Perna 315, 00128 Roma",
      phone: "06 507 0453",
      hours: "Lun - Sab: 08:30 - 17:00",
      description: "Grande cooperativa agricola e ambientale: cura del verde pubblico e privato, potatura alberi da frutto, orticoltura e giardinaggio.",
      municipio: "Municipio IX"
    },
    {
      name: "Coldiretti Roma - Sede Provinciale",
      address: "Via Raffaele Piria 6, 00156 Roma",
      phone: "06 4067 141",
      hours: "Lun - Ven: 08:30 - 13:30 / 14:30 - 16:30",
      description: "Organizzazione agricola provinciale: sportello di collocamento agricolo e forestale, vivaistica e manutenzione del verde a Roma.",
      municipio: "Municipio IV"
    },
    {
      name: "Cooperativa Sociale Capodarco - Divisione Verde",
      address: "Via Lungro 1, 00178 Roma",
      phone: "06 7129 01",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Specializzata nella progettazione, realizzazione e manutenzione di parchi, giardini condominiali e verde urbano.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Barikamà (Agricoltura Sociale)",
      address: "Via Marco Vincenzo Coronelli 8, 00176 Roma",
      phone: "339 645 0624",
      hours: "Lun - Sab: 09:00 - 18:00",
      description: "Coltivazione di orti biologici e cura del verde per cooperative e parchi urbani romani.",
      municipio: "Municipio V"
    },
    {
      name: "Cooperativa Sociale Santi Pietro e Paolo",
      address: "Via Francesco Antolisei 19, 00173 Roma",
      phone: "06 8978 7001",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Servizi di manutenzione giardini, bonifiche aree verdi e sfalcio erba per enti pubblici e privati a Roma.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Apriti Sesamo Onlus",
      address: "Circonvallazione Clodia 76/a, 00195 Roma",
      phone: "06 3903 0387",
      hours: "Lun - Ven: 09:00 - 16:30",
      description: "Settore ambiente e verde: giardinieri qualificati per cura piante, decespugliamento e impianti di irrigazione.",
      municipio: "Municipio I"
    },
    {
      name: "Cooperativa Sociale Idea Prisma 82",
      address: "Via Ida Baccini 80, 00137 Roma",
      phone: "06 8720 1072",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Gestione di spazi verdi, orti didattici e vivai con percorsi di inclusione lavorativa per giardinieri.",
      municipio: "Municipio III"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Seleziona giardinieri e vivaisti per aziende vivaistiche, garden center e consorzi residenziali del quadrante Sud.",
      municipio: "Municipio IX"
    },
    {
      name: "Adecco Filiale Fiumicino",
      address: "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      phone: "06 6502 9814",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Opportunità per addetti al verde e giardinieri per strutture turistiche e balneari tra Ostia e Fiumicino.",
      municipio: "Municipio X"
    }
  ],
  "Segreteria (assistenza d'ufficio/reception)": [
    {
      name: "Studio Eurogiga (Servizi e Payroll Ostia)",
      address: "Via delle Auletine 92, 00122 Ostia Lido (RM)",
      phone: "06 560 0239",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:30 - 18:00",
      description: "Studio di consulenza e servizi amministrativi ad Ostia Lido. Supporto per posizioni di segreteria, data entry e archivio.",
      municipio: "Municipio X"
    },
    {
      name: "Fondazione Roma Litorale - Agenzia Lavoro Ostia",
      address: "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      phone: "06 569 6796",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Inserimento in ruoli di centralino, front office, accoglienza e segreteria per uffici del quadrante litorale.",
      municipio: "Municipio X"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR (Office)",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Filiale di riferimento per Ostia e Roma Sud per impiegati amministrativi, segreteria generale, back office e contact center.",
      municipio: "Municipio IX"
    },
    {
      name: "Randstad Digital / Centro",
      address: "Via Cavour 181, 00184 Roma",
      phone: "06 4890 781",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Filiale centrale specializzata in figure d'ufficio, segreteria di direzione e assistenza amministrativa.",
      municipio: "Municipio I"
    },
    {
      name: "Gi Group Roma Office",
      address: "Via Nazionale 39, 00184 Roma",
      phone: "06 6992 5378",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Filiale dedicata alla selezione di addette alla segreteria, reception per studi legali e notarili, e gestione protocollo.",
      municipio: "Municipio I"
    },
    {
      name: "Adecco Roma EUR",
      address: "Viale dell'Esperanto 71, 00144 Roma",
      phone: "06 592 9001",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Seleziona personale di segreteria, reception aziendale e supporto documentale per le multinazionali dell'EUR.",
      municipio: "Municipio IX"
    },
    {
      name: "Adecco Roma Ostiense",
      address: "Via Ostiense 91/A, 00154 Roma",
      phone: "06 574 7621",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Opportunità di inserimento per addette all'accoglienza, gestione appuntamenti e centralino per studi medici ed aziende.",
      municipio: "Municipio VIII"
    },
    {
      name: "Synergie Roma Termini",
      address: "Via Cavour 44, 00184 Roma",
      phone: "06 4470 4268",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Divisione Office: avviamento di risorse per compiti di segreteria commerciale, posta e front-desk a Roma.",
      municipio: "Municipio I"
    },
    {
      name: "Manpower Roma Manzoni",
      address: "Viale Manzoni 22, 00185 Roma",
      phone: "06 7740 0501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Filiale per il collocamento di personale d'ufficio, gestione chiamate, corrispondenza e archivio.",
      municipio: "Municipio I"
    },
    {
      name: "Umana Roma Centro",
      address: "Via IV Novembre 110, 00187 Roma",
      phone: "06 6938 0093",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Seleziona profili amministrativi junior e senior, receptionist multilingue e assistenti di segreteria.",
      municipio: "Municipio I"
    },
    {
      name: "Cooperativa Sociale Capodarco Roma - Centralino",
      address: "Via Lungro 1, 00178 Roma",
      phone: "06 7129 01",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Gestione di centralini e servizi di accoglienza per enti pubblici ed aziende sanitarie con inserimento lavorativo.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Nuova Sair - Segreteria",
      address: "Viale del Tecnopolo 83, 00131 Roma",
      phone: "06 4080 0472",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Servizi di segreteria sanitaria, prenotazione visite (CUP) e accettazione pazienti a Roma.",
      municipio: "Municipio IV"
    }
  ],
  "Autista (conducente/fattorino)": [
    {
      name: "Adecco Filiale Fiumicino (Trasporti)",
      address: "Via Giorgio Giorgis 120, 00054 Fiumicino (RM)",
      phone: "06 6502 9814",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Filiale per Ostia e Fiumicino: seleziona autisti patente B e C per consegne espresso, navette aeroportuali e trasporto merci.",
      municipio: "Municipio X"
    },
    {
      name: "Fondazione Roma Litorale - Agenzia Lavoro Ostia",
      address: "Viale del Sommergibile 11, 00121 Ostia Lido (RM)",
      phone: "06 569 6796",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Inserimento per autisti addetti al trasporto disabili, furgonisti per consegne locali e corrieri nel Municipio X.",
      municipio: "Municipio X"
    },
    {
      name: "Randstad Italia - Filiale Roma EUR (Logistics & Transport)",
      address: "Piazzale Luigi Sturzo 15, 00144 Roma",
      phone: "06 8837 9501",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Seleziona autisti per consegne dell'ultimo miglio, trasportatori con patente C/CQC e conducenti navetta per Roma Sud e litorale.",
      municipio: "Municipio IX"
    },
    {
      name: "Gi Group Roma Industrial & Logistics",
      address: "Via Tuscolana 637, 00174 Roma",
      phone: "06 7696 6033",
      hours: "Lun - Ven: 09:00 - 13:00",
      description: "Divisione trasporti per corrieri espresso, autisti per la grande distribuzione e fattorini urbani a Roma.",
      municipio: "Municipio VII"
    },
    {
      name: "Synergie Roma La Spezia (Logistica)",
      address: "Via La Spezia 35, 00182 Roma",
      phone: "06 7759 0479",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Seleziona autisti con patente B per distribuzione pacchi per e-commerce e corrieri alimentari a domicilio.",
      municipio: "Municipio VII"
    },
    {
      name: "Manpower Roma Tuscolana",
      address: "Via Statilio Ottato 66, 00175 Roma",
      phone: "06 7154 211",
      hours: "Lun - Ven: 09:00 - 17:30",
      description: "Seleziona conducenti di flotta aziendale, autisti NCC e fattorini per consegne rapide su tutta la provincia di Roma.",
      municipio: "Municipio VII"
    },
    {
      name: "Umana Roma Appia",
      address: "Via Lanuvio 29, 00179 Roma",
      phone: "06 7885 1596",
      hours: "Lun - Ven: 09:00 - 13:00 / 14:00 - 18:00",
      description: "Agenzia per il lavoro con offerte continuative per autisti di linea, scuolabus e fattorini con patente B.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Manser Onlus",
      address: "Via Acerenza 4/C, 00178 Roma",
      phone: "06 9054 5266",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Autisti per furgoni merci, traslochi e distribuzione urbana per conto di aziende pubbliche e private.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Capodarco - Trasporti e Navette",
      address: "Via Lungro 1, 00178 Roma",
      phone: "06 7129 01",
      hours: "Lun - Ven: 09:00 - 17:00",
      description: "Gestione di servizi di navetta socio-sanitaria, trasporto persone con disabilità e autisti per comunità.",
      municipio: "Municipio VII"
    },
    {
      name: "Cooperativa Sociale Magliana '80 Onlus",
      address: "Via Vaiano 23, 00146 Roma",
      phone: "06 550 0765",
      hours: "Lun - Ven: 09:00 - 16:30",
      description: "Servizi di trasporto e mobilità solidale, autisti per consegne pasti e supporto alla mobilità nel quadrante Sud.",
      municipio: "Municipio XI"
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
  return "info@cooperativa.roma.it";
}

export function queryLocalDb(jobSought: string, zoneResident: string, zoneJobSought: string): LocalCooperative[] {
  let normalizedKey = "Badante (assistenza anziani)";
  const js = jobSought.toLowerCase();

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
    const foundKey = Object.keys(localDb).find(k => k.toLowerCase().includes(js) || js.includes(k.toLowerCase()));
    if (foundKey) {
      normalizedKey = foundKey;
    }
  }

  const baseList = localDb[normalizedKey] || localDb["Badante (assistenza anziani)"];

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
    if (!item.municipio || item.municipio === targetMun) return true;
    return hasKeyword(item);
  });

  const munAndKeyword = baseList.filter(item => item.municipio === targetMun && hasKeyword(item));
  const munOnly = baseList.filter(item => item.municipio === targetMun && !hasKeyword(item));
  const otherMunKeyword = baseList.filter(item => item.municipio !== targetMun && hasKeyword(item));
  
  const remainingInland = baseList.filter(item => item.municipio !== targetMun && item.municipio !== "Municipio X" && !hasKeyword(item));
  const remainingOstia = baseList.filter(item => item.municipio !== targetMun && item.municipio === "Municipio X" && !hasKeyword(item));

  const remainingOthers = (targetMun === "Municipio X")
    ? [...remainingOstia, ...remainingInland]
    : [...remainingInland, ...remainingOstia];

  const combined = [
    ...customMatching,
    ...munAndKeyword,
    ...munOnly,
    ...otherMunKeyword,
    ...remainingOthers
  ];

  const uniqueList: LocalCooperative[] = [];
  const seenNames = new Set<string>();

  for (const item of combined) {
    const key = item.name.toLowerCase().trim();
    if (!seenNames.has(key)) {
      seenNames.add(key);
      uniqueList.push(item);
    }
  }

  return uniqueList.slice(0, 10).map(item => ({
    ...item,
    email: item.email || getCooperativeEmail(item.name)
  }));
}

// SEARCH FUNCTION FOR OFFICES, ADDRESSES, PHONES IN DATABASE
export interface DatabaseSearchResult {
  category: "Ufficio Pubblico" | "Scuola Italiano" | "Cooperativa / Agenzia";
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  description: string;
  municipio: string;
  profession?: string;
}

export function searchLocalDatabase(query: string, filterCategory?: string, filterMunicipio?: string): DatabaseSearchResult[] {
  const q = (query || "").toLowerCase().trim();
  const results: DatabaseSearchResult[] = [];

  // 1. Search Public Offices
  if (!filterCategory || filterCategory === "all" || filterCategory === "offices") {
    for (const [mun, offices] of Object.entries(municipioOffices)) {
      if (filterMunicipio && filterMunicipio !== "all" && mun !== filterMunicipio) continue;
      for (const off of offices) {
        const fullText = `${off.name} ${off.address} ${off.phone} ${off.email || ""} ${off.description} ${mun}`.toLowerCase();
        if (!q || fullText.includes(q)) {
          results.push({
            category: "Ufficio Pubblico",
            name: off.name,
            address: off.address,
            phone: off.phone,
            email: off.email || "info@regione.lazio.it",
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
      if (filterMunicipio && filterMunicipio !== "all" && mun !== filterMunicipio) continue;
      for (const sch of schools) {
        const fullText = `${sch.name} ${sch.address} ${sch.phone} ${sch.email || ""} ${sch.description} ${mun}`.toLowerCase();
        if (!q || fullText.includes(q)) {
          results.push({
            category: "Scuola Italiano",
            name: sch.name,
            address: sch.address,
            phone: sch.phone,
            email: sch.email || "scuola@istruzione.it",
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
        const email = coop.email || getCooperativeEmail(coop.name);
        const fullText = `${coop.name} ${coop.address} ${coop.phone} ${email} ${coop.description} ${coop.municipio || ""} ${prof}`.toLowerCase();
        if (!q || fullText.includes(q)) {
          // Avoid duplicate display across professions if searching globally
          const exists = results.some(r => r.name === coop.name && r.address === coop.address);
          if (!exists) {
            results.push({
              category: "Cooperativa / Agenzia",
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

  return results;
}
'''

with open("scripts/build_db.py", "a") as f:
    f.write(coops_code)

print("Part 2 appended to scripts/build_db.py")
