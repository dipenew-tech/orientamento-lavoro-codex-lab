export const accounts = [
  { uid: 'demo-reader', email: 'lettore@example.invalid', role: 'lettore' },
  { uid: 'demo-operator', email: 'operatore@example.invalid', role: 'operatore' },
  { uid: 'demo-admin', email: 'amministratore@example.invalid', role: 'amministratore' }
] as const;
export const DEMO_PASSWORD = 'SoloDemo-2026!';
export const services = [
  { id: 'demo-alfa', name: 'Sportello Alfa — FITTIZIO',
    description: 'Servizio inventato per provare orientamento e revisioni; non contattare.',
    area: 'AREA-DEMO-A', access: 'Modalità dimostrativa, nessun appuntamento reale.',
    email: 'alfa@example.invalid', fictional: true, version: 1 },
  { id: 'demo-beta', name: 'Laboratorio Beta — FITTIZIO',
    description: 'Corso inventato per il collaudo, nessuna iscrizione disponibile.',
    area: 'AREA-DEMO-B', access: 'Accesso simulato senza requisiti personali.',
    email: 'beta@example.invalid', fictional: true, version: 1 },
  { id: 'demo-gamma', name: 'Centro Gamma — FITTIZIO',
    description: 'Servizio di accompagnamento completamente inventato.',
    area: 'AREA-DEMO-A', access: 'Esempio tecnico locale, non è una struttura territoriale.',
    email: 'gamma@example.invalid', fictional: true, version: 1 }
];
