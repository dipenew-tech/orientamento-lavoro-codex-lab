import type { RequestHandler } from "express";
import type { GeneratedLetter, UserFormInputs, LetterStatRecord } from "../src/types.ts";

/** Dependency-injected route: no server, SMTP or provider is started on import. */
export function createGenerateLetterHandler(dependencies: {
  generateLocalFallback: (input: UserFormInputs) => GeneratedLetter;
  personalizeLetter: (base: GeneratedLetter, input: UserFormInputs) => Promise<GeneratedLetter>;
  detectLanguageInfo: (nationality: string) => { language: string; isMissing: boolean };
  sendMissingLanguageEmail: (nationality: string) => Promise<unknown>;
  sendSilentEmail: (profession: string) => Promise<unknown>;
  recordStat: (stat: LetterStatRecord) => void;
}): RequestHandler {
  const { generateLocalFallback, personalizeLetter, detectLanguageInfo,
    sendMissingLanguageEmail, sendSilentEmail, recordStat } = dependencies;
  return async (req, res) => {
    try {
      const { nationality, italianLevel, jobSought, zoneResident, zoneJobSought, recipientName, gender, officinaOpportunity } = req.body ?? {};

      if (![nationality, italianLevel, jobSought, zoneResident, zoneJobSought].every(value => typeof value === "string" && value.trim().length > 0 && value.length <= 200)
        || (recipientName !== undefined && (typeof recipientName !== "string" || recipientName.length > 200))
        || (gender !== undefined && !["M", "F"].includes(gender))
        || (officinaOpportunity !== undefined && typeof officinaOpportunity !== "boolean")) {
        return res.status(400).json({ error: "Tutti i campi obbligatori devono essere compilati." });
      }

      const langInfo = detectLanguageInfo(nationality);

      if (langInfo.isMissing) {
        console.log(`[LINGUA MANCANTE] Lingua per nazionalità "${nationality}" non censita. Uso Inglese ed invio email a dipenew@gmail.com.`);
        sendMissingLanguageEmail(nationality).catch(err => {
          console.error("Error sending missing language email in background:", err);
        });
      }
      const CORE_PROFESSIONS = [
        "Badante (assistenza anziani)",
        "Colf/pulizie (servizi domestici)",
        "Facchino/magazziniere",
        "Lavapiatti/aiuto cucina",
        "Pizzaiolo",
        "Cuoco",
        "Muratore/Operaio edile",
        "Custode/portiere",
        "Cameriere/barista",
        "Giardiniere",
        "Segreteria (assistenza d'ufficio/reception)",
        "Autista (conducente/fattorino)"
      ];

      // Check if it is one of the core professions
      const isCore = CORE_PROFESSIONS.some(p =>
        p.toLowerCase() === jobSought.toLowerCase() ||
        jobSought.toLowerCase().includes(p.split(" (")[0].toLowerCase()) ||
        jobSought.toLowerCase().includes(p.split("/")[0].toLowerCase()) ||
        p.toLowerCase().includes(jobSought.toLowerCase().split(" (")[0])
      );

      if (!isCore) {
        console.log(`[ALTRO] Ricevuta richiesta per la professione: "${jobSought}"`);
        // Invia l'email silenziosa in background (non bloccante) per segnalare la nuova professione
        sendSilentEmail(jobSought).catch(err => {
          console.error("Error sending silent email in background:", err);
        });
      } else {
        console.log(`[CORE DB] Generazione istantanea da database locale per: "${jobSought}"`);
      }

      // Generazione istantanea ad altissima velocità tramite database locale e dizionari nativi
      const localLetter = generateLocalFallback({
        recipientName, gender, nationality, italianLevel, jobSought, zoneResident, zoneJobSought, officinaOpportunity
      });
      const letterData = await personalizeLetter(localLetter, {
        recipientName, gender, nationality, italianLevel, jobSought, zoneResident, zoneJobSought, officinaOpportunity
      });

      // Automatically record stat on server
      const statRecord = {
        id: `stat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        recipientName: recipientName || "Anonimo",
        gender: gender || "M",
        nationality,
        italianLevel,
        jobSought,
        zoneResident,
        zoneJobSought,
        translationLanguage: letterData.translationLanguage || langInfo.language,
        officinaOpportunity: !!officinaOpportunity,
        cooperativesCount: letterData.cooperatives ? letterData.cooperatives.length : 0,
        publicOfficesCount: letterData.publicOffices ? letterData.publicOffices.length : 0,
        schoolsCount: letterData.italianSchools ? letterData.italianSchools.length : 0,
        isLocalFallback: letterData.isLocalFallback
      };
      recordStat(statRecord);

      return res.json(letterData);
    } catch (error: any) {
      console.error("Error in /api/generate-letter");
      res.status(500).json({ error: "Errore interno durante la generazione della lettera." });
    }
  };
}
