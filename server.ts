import express from "express";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { queryLocalDb, searchLocalDatabase, municipioOffices, municipioSchools, localDb } from "./src/lib/localDb";
import { generateLocalFallback } from "./src/lib/fallbackGenerator";
import { createGenerateLetterHandler } from "./server/generateLetterRoute";
import { createLetterPersonalizer } from "./server/letterPersonalizer";

dotenv.config();
const personalizeLetter = createLetterPersonalizer();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } else {
    console.warn("GEMINI_API_KEY not found in environment variables.");
  }
} catch (error) {
  console.error("Error initializing Gemini:", error);
}

// Unified SMTP email sender for Gmail / Custom SMTP
async function sendEmail({ subject, text, html }: { subject: string; text: string; html: string }): Promise<{ success: boolean; message: string; details?: any }> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const rawUser = process.env.SMTP_USER || process.env.GMAIL_USER || "dipenew@gmail.com";
  const rawPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "";

  const user = rawUser.trim();
  // Strip spaces from Google App Passwords (e.g., "xxxx yyyy zzzz wwww" -> "xxxxyyyyzzzzwww")
  const pass = rawPass.trim().replace(/\s+/g, "");

  console.log(`[SMTP] Controllo configurazione: Host=${host}, Port=${port}, User=${user}, PassLength=${pass ? pass.length : 0}`);

  if (!pass) {
    const msg = `SMTP non attivo: la password d'ambiente SMTP_PASS (o GMAIL_APP_PASSWORD) non è definita. Per inviare mail con Gmail (${user}), inserire la 'Password per le app' a 16 caratteri (https://myaccount.google.com/apppasswords) nei Secret/Impostazioni.`;
    console.warn(`[SMTP Warning] ${msg}`);
    return { success: false, message: msg };
  }

  try {
    const isGmail = host.includes("gmail") || user.endsWith("@gmail.com");
    
    const transporterOptions: any = isGmail
      ? {
          service: "gmail",
          auth: { user, pass },
          tls: { rejectUnauthorized: false }
        }
      : {
          host,
          port,
          secure: port === 465,
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 10000,
          auth: { user, pass },
          tls: { rejectUnauthorized: false }
        };

    const transporter = nodemailer.createTransport(transporterOptions);

    await transporter.verify();
    console.log(`[SMTP] Connessione al server mail ${host} verificata con successo.`);

    const info = await transporter.sendMail({
      from: `Orientamento Lavoro Roma <${user}>`,
      to: "dipenew@gmail.com",
      subject,
      text,
      html
    });

    console.log(`[SMTP Success] Email inviata con successo a dipenew@gmail.com per "${subject}". MessageID: ${info.messageId}`);
    return { success: true, message: `Email inviata con successo a dipenew@gmail.com (ID: ${info.messageId})` };
  } catch (error: any) {
    let friendlyMessage = error.message || "Errore SMTP";
    if (error.code === 'EAUTH' || (error.response && error.response.includes('535'))) {
      friendlyMessage = `Errore di autenticazione Gmail (535): La password utilizzata per ${user} non è valida. Per account Gmail con verifica in 2 passaggi, occorre generare e inserire una 'Password per le app' a 16 lettere su https://myaccount.google.com/apppasswords ed impostarla nella variabile SMTP_PASS.`;
      console.warn(`[SMTP Auth Failed] ${friendlyMessage}`);
    } else {
      console.error(`[SMTP Error] Errore durante l'invio dell'email:`, error);
    }
    return { success: false, message: friendlyMessage, details: error };
  }
}

// Helper per segnalazione silenziosa nuova professione
async function sendSilentEmail(profession: string) {
  console.log(`[SMTP] Invio segnalazione per nuova professione: "${profession}"`);
  return sendEmail({
    subject: `Nuova professione cercata: ${profession}`,
    text: `È stata cercata la professione "${profession}" tramite l'applicazione Orientamento Lavoro Roma, ma non è ancora presente nel database locale.\n\nSi prega di completare il DB con questa professione su AI Studio.`,
    html: `<p>È stata cercata la professione <strong>"${profession}"</strong> tramite l'applicazione Orientamento Lavoro Roma, ma non è ancora presente nel database locale.</p><p>Si prega di completare il DB con questa professione su AI Studio.</p>`
  });
}

// Helper per segnalazione nuova nazionalità da aggiungere
async function sendMissingLanguageEmail(nationality: string) {
  console.log(`[SMTP] Invio richiesta aggiunta nazionalità "${nationality}" a dipenew@gmail.com`);
  return sendEmail({
    subject: `Richiesta aggiunta nuova nazionalità: ${nationality}`,
    text: `È stata selezionata la voce 'Altro' ed inserita la nuova nazionalità "${nationality}" nell'applicazione Orientamento Lavoro Roma.\n\nNel frattempo la lettera è stata tradotta automaticamente in Inglese.\n\nSi prega di aggiungere questa nuova nazionalità ed la relativa lingua principale nel DB locale dell'applicazione.`,
    html: `<p>È stata selezionata la voce <strong>'Altro'</strong> ed inserita la nuova nazionalità <strong>"${nationality}"</strong> nell'applicazione Orientamento Lavoro Roma.</p><p>Nel frattempo la lettera di orientamento è stata tradotta in <strong>Inglese</strong> per agevolare la persona nel suo percorso.</p><p>Si prega di aggiungere questa nuova nazionalità e la relativa lingua principale nel DB locale su AI Studio.</p>`
  });
}

// Helper per eseguire chiamate Gemini con retry ed exponential backoff in caso di errori di quota o temporanei (429/503)
async function generateContentWithRetry(aiClient: any, params: any, maxRetries = 3, delayMs = 3000): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Executing Gemini API call (attempt ${attempt}/${maxRetries})...`);
      const response = await aiClient.models.generateContent(params);
      return response;
    } catch (error: any) {
      console.warn(`Attempt ${attempt} failed with error: ${error.message || error}`);
      if (attempt === maxRetries) {
        throw error;
      }
      const waitTime = delayMs * Math.pow(2, attempt - 1);
      console.log(`Waiting ${waitTime}ms before retrying...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

// Helper to detect correct target translation language based on nationality
function detectLanguageInfo(nationality: string): { language: string; isMissing: boolean } {
  let nat = (nationality || "").toLowerCase().trim();
  nat = nat.replace(/^altro\s*:\s*/i, "").replace(/^altro\s*-\s*/i, "").trim();

  if (!nat || nat === "altro") {
    return { language: "Inglese", isMissing: true };
  }
  if (nat.includes("ital")) {
    return { language: "Italiano", isMissing: false };
  }
  if (nat.includes("sri") || nat.includes("lanka") || nat.includes("cingal") || nat.includes("sinhala") || nat.includes("sinhal")) {
    return { language: "Cingalese", isMissing: false };
  }
  if (nat.includes("peru") || nat.includes("spag") || nat.includes("colom") || nat.includes("venez") || nat.includes("ecuad") || nat.includes("boliv") || nat.includes("argent") || nat.includes("cile") || nat.includes("uruguay") || nat.includes("hondur") || nat.includes("salvad") || nat.includes("messi") || nat.includes("cuba") || nat.includes("dominic") || nat.includes("nicara") || nat.includes("panam") || nat.includes("costar") || nat.includes("spagnol") || nat.includes("spagna")) {
    return { language: "Spagnolo", isMissing: false };
  }
  if (nat.includes("rumen") || nat.includes("moldav") || nat.includes("romania") || nat.includes("romeno")) {
    return { language: "Rumeno", isMissing: false };
  }
  if (nat.includes("ucrai") || nat.includes("russa") || nat.includes("bielor") || nat.includes("ucrain")) {
    return { language: "Ucraino", isMissing: false };
  }
  if (nat.includes("egitt") || nat.includes("egiz") || nat.includes("egypt") || nat.includes("arab") || nat.includes("siria") || nat.includes("iraq") || nat.includes("maroc") || nat.includes("tunis") || nat.includes("alger") || nat.includes("libia") || nat.includes("yemen") || nat.includes("giordan") || nat.includes("palest")) {
    return { language: "Arabo", isMissing: false };
  }
  if (nat.includes("senegal") || nat.includes("franc") || nat.includes("mali") || nat.includes("costa d'avorio") || nat.includes("camerun") || nat.includes("congo") || nat.includes("guinea") || nat.includes("burkina") || nat.includes("togo") || nat.includes("benin") || nat.includes("gabon") || nat.includes("madagasc") || nat.includes("francese")) {
    return { language: "Francese", isMissing: false };
  }
  if (nat.includes("pola") || nat.includes("polacc") || nat.includes("polon") || nat.includes("polish") || nat.includes("polski")) {
    return { language: "Polacco", isMissing: false };
  }
  if (nat.includes("alban")) {
    return { language: "Albanese", isMissing: false };
  }
  if (nat.includes("bangla") || nat.includes("bengal")) {
    return { language: "Bengalese", isMissing: false };
  }
  if (nat.includes("serb")) {
    return { language: "Serbo", isMissing: false };
  }
  if (nat.includes("bosn")) {
    return { language: "Bosniaco", isMissing: false };
  }
  if (nat.includes("bulgar")) {
    return { language: "Bulgaro", isMissing: false };
  }
  if (nat.includes("croa")) {
    return { language: "Croato", isMissing: false };
  }
  if (nat.includes("filippin") || nat.includes("tagalog")) {
    return { language: "Tagalog (Filippino)", isMissing: false };
  }
  if (nat.includes("georgi")) {
    return { language: "Georgiano", isMissing: false };
  }
  if (nat.includes("macedon")) {
    return { language: "Macedone", isMissing: false };
  }
  if (nat.includes("ceca") || nat.includes("czech")) {
    return { language: "Ceco", isMissing: false };
  }
  if (nat.includes("somal")) {
    return { language: "Somalo", isMissing: false };
  }
  if (nat.includes("tanzan") || nat.includes("swahili")) {
    return { language: "Swahili", isMissing: false };
  }
  if (nat.includes("turc") || nat.includes("turchi")) {
    return { language: "Turco", isMissing: false };
  }
  if (nat.includes("indi") || nat.includes("hindi")) {
    return { language: "Hindi", isMissing: false };
  }
  if (nat.includes("nigeri") || nat.includes("apolide") || nat.includes("ingles") || nat.includes("inghilterr") || nat.includes("regno unito") || nat.includes("uk") || nat.includes("stati uniti") || nat.includes("usa") || nat.includes("australi") || nat.includes("canada") || nat.includes("irland")) {
    return { language: "Inglese", isMissing: false };
  }
  return { language: "Inglese", isMissing: true };
}

// Server-side Statistics Storage
let serverLetterStats: any[] = [];

// Helper per inviare il report statistico completo a dipenew@gmail.com
async function sendStatsEmailReport(records: any[]) {
  const total = records.length;
  if (total === 0) {
    return sendEmail({
      subject: "Report Statistico Orientamento Lavoro - Nessuna lettera generata",
      text: "Il registro delle statistiche è attualmente vuoto.",
      html: "<p>Il registro delle statistiche è attualmente vuoto.</p>"
    });
  }

  // Count aggregates
  const nats: Record<string, number> = {};
  const profs: Record<string, number> = {};
  const langs: Record<string, number> = {};
  const zones: Record<string, number> = {};
  let officinaCount = 0;

  records.forEach((r) => {
    if (r.officinaOpportunity) officinaCount++;
    nats[r.nationality || "N/D"] = (nats[r.nationality || "N/D"] || 0) + 1;
    profs[r.jobSought || "N/D"] = (profs[r.jobSought || "N/D"] || 0) + 1;
    langs[r.translationLanguage || "N/D"] = (langs[r.translationLanguage || "N/D"] || 0) + 1;
    zones[r.zoneResident || "N/D"] = (zones[r.zoneResident || "N/D"] || 0) + 1;
  });

  const buildRows = (obj: Record<string, number>) => {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `<tr><td style="padding: 6px 12px; border-bottom: 1px solid #e2e8f0;">${k}</td><td style="padding: 6px 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">${v} (${Math.round((v / total) * 100)}%)</td></tr>`)
      .join("");
  };

  const recentTableRows = records.slice(0, 15).map((r) => `
    <tr>
      <td style="padding: 6px; font-size: 11px; border-bottom: 1px solid #edf2f7;">${new Date(r.timestamp).toLocaleDateString("it-IT")}</td>
      <td style="padding: 6px; font-size: 11px; border-bottom: 1px solid #edf2f7; font-weight: bold;">${r.recipientName || "Anonimo"} (${r.gender || "M"})</td>
      <td style="padding: 6px; font-size: 11px; border-bottom: 1px solid #edf2f7;">${r.nationality}</td>
      <td style="padding: 6px; font-size: 11px; border-bottom: 1px solid #edf2f7;">${r.jobSought}</td>
      <td style="padding: 6px; font-size: 11px; border-bottom: 1px solid #edf2f7;">${r.translationLanguage}</td>
      <td style="padding: 6px; font-size: 11px; border-bottom: 1px solid #edf2f7;">${r.zoneResident}</td>
      <td style="padding: 6px; font-size: 11px; border-bottom: 1px solid #edf2f7; text-align: center;">${r.officinaOpportunity ? 'SI' : '-'}</td>
    </tr>
  `).join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b; max-width: 750px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #f59e0b; font-size: 20px;">Report Statistico — Orientamento Lavoro Roma</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Riepilogo completo inviato a <strong>dipenew@gmail.com</strong></p>
      </div>

      <div style="display: flex; gap: 12px; margin-bottom: 24px;">
        <div style="flex: 1; background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center;">
          <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Totale Lettere</span>
          <h3 style="margin: 4px 0 0 0; font-size: 24px; color: #0f172a;">${total}</h3>
        </div>
        <div style="flex: 1; background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center;">
          <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Inclusione Officina</span>
          <h3 style="margin: 4px 0 0 0; font-size: 24px; color: #d97706;">${Math.round((officinaCount / total) * 100)}%</h3>
        </div>
      </div>

      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">1. Dettaglio per Professione Cercata</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; background: #fff;">
        <tbody>${buildRows(profs)}</tbody>
      </table>

      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">2. Dettaglio per Nazionalità</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; background: #fff;">
        <tbody>${buildRows(nats)}</tbody>
      </table>

      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">3. Lingue di Traduzione</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; background: #fff;">
        <tbody>${buildRows(langs)}</tbody>
      </table>

      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">4. Ultime Lettere Generate (Registro Dettagliato)</h3>
      <table style="width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e2e8f0;">
        <thead>
          <tr style="background: #f1f5f9; text-align: left; font-size: 11px; text-transform: uppercase;">
            <th style="padding: 6px;">Data</th>
            <th style="padding: 6px;">Utente</th>
            <th style="padding: 6px;">Nazione</th>
            <th style="padding: 6px;">Professione</th>
            <th style="padding: 6px;">Lingua</th>
            <th style="padding: 6px;">Zona</th>
            <th style="padding: 6px; text-align: center;">Officina</th>
          </tr>
        </thead>
        <tbody>${recentTableRows}</tbody>
      </table>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 15px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">Report generato automaticamente dall'Area Riservata di Orientamento Lavoro Roma.</p>
    </div>
  `;

  return sendEmail({
    subject: `Report Statistico Orientamento Lavoro (${total} lettere generate)`,
    text: `Report Statistico Orientamento Lavoro Roma.\nTotale lettere: ${total}\nInclusione Officina: ${Math.round((officinaCount / total) * 100)}%`,
    html: htmlContent
  });
}

// Endpoint per la registrazione o invio di log statistici da client
app.post("/api/admin/log-letter", (req, res) => {
  const statRecord = req.body;
  if (statRecord && statRecord.id) {
    const existingIndex = serverLetterStats.findIndex(r => r.id === statRecord.id);
    if (existingIndex >= 0) {
      serverLetterStats[existingIndex] = statRecord;
    } else {
      serverLetterStats.unshift(statRecord);
    }
  }
  return res.json({ success: true, totalLogged: serverLetterStats.length });
});

app.get("/api/admin/stats", (req, res) => {
  return res.json({ records: serverLetterStats });
});

app.post("/api/admin/clear-stats", (req, res) => {
  serverLetterStats = [];
  return res.json({ success: true });
});

app.post("/api/admin/send-stats-email", async (req, res) => {
  try {
    const recordsToUse = (req.body && Array.isArray(req.body.records) && req.body.records.length > 0)
      ? req.body.records
      : serverLetterStats;

    const result = await sendStatsEmailReport(recordsToUse);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Errore durante l'invio dell'email delle statistiche" });
  }
});

// Endpoint per la ricerca e verifica di uffici, indirizzi e telefoni nel Database
app.post("/api/search-database", (req, res) => {
  try {
    const { query, category, municipio } = req.body;
    const results = searchLocalDatabase(query || "", category, municipio);
    return res.json({
      success: true,
      total: results.length,
      results
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Errore nella ricerca del database." });
  }
});

// Endpoint per la ricerca strutture per municipio e professione
app.post("/api/search-by-municipio", (req, res) => {
  try {
    const { jobSought } = req.body;
    const municipiList = Array.from({ length: 15 }, (_, i) => `Municipio ${["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"][i]}`);
    
    const results = municipiList.map(mun => {
      const offices = municipioOffices[mun] || [];
      const schools = municipioSchools[mun] || [];
      const coops = queryLocalDb(jobSought || "badante", mun, mun);
      return {
        municipio: mun,
        offices,
        schools,
        cooperatives: coops
      };
    });

    return res.json({ municipi: results });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Errore nella ricerca per municipio." });
  }
});

// Endpoint per la generazione dell'orientamento
app.post("/api/generate-letter", createGenerateLetterHandler({
  generateLocalFallback, personalizeLetter, detectLanguageInfo,
  sendMissingLanguageEmail, sendSilentEmail,
  recordStat: stat => { serverLetterStats.unshift(stat); },
}));

// Daily Progressive Stats Email Scheduler
async function sendDailyStatsEmail() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
  const todayISO = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);

  // Filter serverLetterStats for today's records
  const todayRecords = serverLetterStats.filter((r) => {
    if (!r.timestamp) return false;
    const rDateObj = new Date(r.timestamp);
    const rISO = new Date(rDateObj.getTime() - (rDateObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
    return rISO === todayISO;
  });

  const totalAllTime = serverLetterStats.length;
  const countToday = todayRecords.length;

  console.log(`[DAILY SCHEDULER] Invio report giornaliero (${dateStr}) a dipenew@gmail.com: ${countToday} lettere oggi, ${totalAllTime} totali.`);

  // Build aggregates for today
  const profs: Record<string, number> = {};
  const nats: Record<string, number> = {};
  const langs: Record<string, number> = {};
  let officinaTodayCount = 0;

  todayRecords.forEach((r) => {
    if (r.officinaOpportunity) officinaTodayCount++;
    profs[r.jobSought || "N/D"] = (profs[r.jobSought || "N/D"] || 0) + 1;
    nats[r.nationality || "N/D"] = (nats[r.nationality || "N/D"] || 0) + 1;
    langs[r.translationLanguage || "N/D"] = (langs[r.translationLanguage || "N/D"] || 0) + 1;
  });

  const buildRows = (obj: Record<string, number>, baseTotal: number) => {
    if (Object.keys(obj).length === 0) return `<tr><td style="padding: 8px; color: #64748b; font-style: italic;" colspan="2">Nessuna lettera generata nella giornata di oggi</td></tr>`;
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `<tr><td style="padding: 6px 12px; border-bottom: 1px solid #e2e8f0;">${k}</td><td style="padding: 6px 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">${v} (${Math.round((v / baseTotal) * 100)}%)</td></tr>`)
      .join("");
  };

  const appUrl = process.env.APP_URL || "https://ais-dev-ekdrvn5uw3qwkkovcsxxon-987805295481.europe-west2.run.app";
  const adminLink = `${appUrl}?admin=true`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b; max-width: 700px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #f59e0b; font-size: 20px;">Report Giornaliero Statistiche — Orientamento Lavoro Roma</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Statistiche progressive del giorno <strong>${dateStr}</strong> inviate a <strong>dipenew@gmail.com</strong></p>
      </div>

      <div style="display: flex; gap: 12px; margin-bottom: 24px;">
        <div style="flex: 1; background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center;">
          <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Lettere Generate Oggi</span>
          <h3 style="margin: 4px 0 0 0; font-size: 26px; color: #059669;">${countToday}</h3>
        </div>
        <div style="flex: 1; background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center;">
          <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Totale Progressivo Storico</span>
          <h3 style="margin: 4px 0 0 0; font-size: 26px; color: #0f172a;">${totalAllTime}</h3>
        </div>
        <div style="flex: 1; background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center;">
          <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Inclusione Officina Oggi</span>
          <h3 style="margin: 4px 0 0 0; font-size: 26px; color: #d97706;">${countToday > 0 ? Math.round((officinaTodayCount / countToday) * 100) : 0}%</h3>
        </div>
      </div>

      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
        <h3 style="margin: 0 0 8px 0; color: #78350f; font-size: 16px;">🔐 Link Diretto Accesso Area Riservata Statistiche</h3>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #92400e;">Clicca sul pulsante sottostante per accedere alla dashboard con possibilità di <strong>filtro per giorno</strong> e consultazione storica completa:</p>
        <a href="${adminLink}" target="_blank" style="display: inline-block; background-color: #d97706; color: #ffffff; text-decoration: none; font-weight: bold; padding: 10px 20px; border-radius: 8px; font-size: 14px;">Apri Dashboard Statistiche (PIN: 1234)</a>
      </div>

      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">1. Professioni Cercate Oggi (${countToday})</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; background: #fff;">
        <tbody>${buildRows(profs, countToday || 1)}</tbody>
      </table>

      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">2. Nazionalità Utenti di Oggi</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; background: #fff;">
        <tbody>${buildRows(nats, countToday || 1)}</tbody>
      </table>

      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px;">3. Lingue di Traduzione Oggi</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; background: #fff;">
        <tbody>${buildRows(langs, countToday || 1)}</tbody>
      </table>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 15px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">Email giornaliera automatica generata dal sistema Orientamento Lavoro Roma per dipenew@gmail.com.</p>
    </div>
  `;

  return sendEmail({
    subject: `Statistiche Giornaliere Orientamento Lavoro (${dateStr}: ${countToday} lettere)`,
    text: `Report Giornaliero Orientamento Lavoro Roma (${dateStr}).\nLettere oggi: ${countToday}\nTotale storico: ${totalAllTime}\nAccedi alle statistiche con PIN: ${adminLink}`,
    html: htmlContent
  });
}

// Pianificazione invio mail giornaliera ogni 24 ore
setInterval(sendDailyStatsEmail, 24 * 60 * 60 * 1000);

// Endpoint per attivare manualmente l'invio dell'email giornaliera
app.post("/api/admin/send-daily-email", async (req, res) => {
  try {
    const result = await sendDailyStatsEmail();
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Errore durante l'invio dell'email giornaliera" });
  }
});

// Endpoint di test per verificare la configurazione SMTP
app.get("/api/test-email", async (req, res) => {
  const result = await sendEmail({
    subject: "Test Email SMTP - Orientamento Lavoro Roma",
    text: "Questo è un messaggio di test inviato dal server Orientamento Lavoro per verificare la configurazione SMTP con Gmail.",
    html: "<p>Questo è un messaggio di test inviato dal server <strong>Orientamento Lavoro Roma</strong> per verificare la configurazione SMTP con Gmail.</p>"
  });
  return res.json(result);
});

// Endpoint per scaricare l'intero progetto in formato ZIP
app.get("/api/download-zip", (req, res) => {
  try {
    const zipPath = path.join(process.cwd(), "orientamento-lavoro-roma.zip");
    const scriptPath = path.join(process.cwd(), "scripts", "export_zip.py");
    
    // Rigenera o aggiorna il file zip se il relativo script è presente
    if (fs.existsSync(scriptPath)) {
      try {
        execSync(`python3 "${scriptPath}"`, { stdio: "ignore" });
      } catch (err) {
        console.warn("Avviso durante l'esecuzione di export_zip.py:", err);
      }
    }
    
    if (fs.existsSync(zipPath)) {
      res.setHeader("Content-Disposition", 'attachment; filename="orientamento-lavoro-roma.zip"');
      res.setHeader("Content-Type", "application/zip");
      return res.sendFile(zipPath);
    } else {
      return res.status(404).json({ success: false, message: "Archivio zip non trovato" });
    }
  } catch (error: any) {
    console.error("Errore durante il download dello zip:", error);
    return res.status(500).json({ success: false, message: error.message || "Errore durante la creazione dello zip" });
  }
});

// Endpoint per ottenere info sul file ZIP del progetto
app.get("/api/zip-info", (req, res) => {
  try {
    const zipPath = path.join(process.cwd(), "orientamento-lavoro-roma.zip");
    if (fs.existsSync(zipPath)) {
      const stats = fs.statSync(zipPath);
      return res.json({
        success: true,
        filename: "orientamento-lavoro-roma.zip",
        sizeBytes: stats.size,
        sizeMb: (stats.size / (1024 * 1024)).toFixed(2),
        downloadUrl: "/api/download-zip"
      });
    }
    return res.json({ success: false, message: "Archivio zip non ancora generato" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Serve static or Vite in dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
