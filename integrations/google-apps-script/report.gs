/**
 * Google Apps Script: distribuire come Web App, esegui come proprietario.
 * Impostare la proprietà di script REPORT_SECRET (valore lungo e casuale).
 * Non inserire il segreto nel frontend: solo nel Worker Cloudflare.
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const secret = PropertiesService.getScriptProperties().getProperty("REPORT_SECRET");
    if (!secret || payload.secret !== secret) throw new Error("Not authorized");
    const category = String(payload.category || "");
    const value = String(payload.value || "").trim().slice(0, 120);
    if (!["mestiere", "nazionalita", "quartiere"].includes(category) || !value || /[\r\n]/.test(value)) throw new Error("Invalid request");
    const suggestions = Array.isArray(payload.suggestions) ? payload.suggestions.slice(0, 6).map(String).join("; ").slice(0, 600) : "";
    const description = String(payload.description || "").slice(0, 600);
    const body = [
      "Richiesta aggiornamento repertorio Orientamento Lavoro Caritas",
      "Categoria: " + category, "Voce proposta: " + value,
      "Corrispondenze locali: " + (suggestions || "nessuna"),
      "Esito ricerca locale: " + description,
      "Data: " + new Date().toISOString(),
      "Fonte: ricerca locale dell'applicazione; nessuna verifica web automatica.",
      "Verificare prima dell'inserimento nel database.",
      "Non includere dati personali degli assistiti."
    ].join("\n");
    GmailApp.sendEmail("dipenew@gmail.com", "[Caritas] Proposta repertorio: " + category, body);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ok:false})).setMimeType(ContentService.MimeType.JSON);
  }
}
