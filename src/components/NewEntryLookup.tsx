import React, { useEffect, useRef, useState } from "react";
import { getMunicipioFromZone } from "../lib/localDb";

type Category = "mestiere" | "nazionalita" | "quartiere";
type Props = { category: Category; value: string; existingValues?: string[] };
const normalize = (v: string) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("it");
const aliases: Record<string, string> = {
  "badante": "Badante (assistenza anziani)",
  "magazziniere": "Facchino/magazziniere",
  "colf": "Colf/pulizie (servizi domestici)",
  "repubblica democratica del congo": "Rep. Dem. del Congo",
  "moldova": "Moldavia",
  "sri lanka": "Sri-Lanka",
  "ostia lido": "Ostia",
};
export function resolveNewEntry(category: Category, value: string, existingValues: string[] = []) {
  const query = normalize(value);
  if (!query) return { suggestions: [] as string[], description: "Inserisci una voce da cercare." };
  const suggestions = [...new Set([...existingValues.filter(v => normalize(v).includes(query) || query.includes(normalize(v))), ...(aliases[query] ? [aliases[query]] : [])])].slice(0, 6);
  const municipio = category === "quartiere" ? getMunicipioFromZone(value) : "";
  const description = category === "quartiere"
    ? (municipio ? `Corrispondenza territoriale locale: ${municipio}. Verificare indirizzo e competenza prima dell'utilizzo.` : "Quartiere non riconosciuto con certezza nel repertorio locale.")
    : suggestions.length ? "Possibili denominazioni già presenti: verifica la corrispondenza prima di creare una nuova voce." : "Nessuna corrispondenza affidabile nel repertorio locale. Puoi continuare con la voce libera.";
  return { suggestions, description };
}
export default function NewEntryLookup({ category, value, existingValues = [] }: Props) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const captchaContainer = useRef<HTMLDivElement>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  useEffect(() => {
    if (!siteKey || !captchaContainer.current) return;
    let cancelled = false;
    const mount = () => {
      const turnstile = (window as unknown as { turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => void } }).turnstile;
      if (!cancelled && turnstile && captchaContainer.current && !captchaContainer.current.hasChildNodes()) turnstile.render(captchaContainer.current, { sitekey: siteKey, callback: (token: string) => setTurnstileToken(token), "expired-callback": () => setTurnstileToken("") });
    };
    if (!document.querySelector("script[data-caritas-turnstile]")) { const script = document.createElement("script"); script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; script.async = true; script.dataset.caritasTurnstile = "1"; script.onload = mount; document.head.appendChild(script); } else { const timer = window.setInterval(mount, 300); return () => { cancelled = true; window.clearInterval(timer); }; }
    return () => { cancelled = true; };
  }, [siteKey]);
  const result = resolveNewEntry(category, value, existingValues);
  const endpoint = import.meta.env.VITE_SUGGESTIONS_ENDPOINT as string | undefined;
  async function report() {
    if (!value.trim() || !endpoint || !turnstileToken || busy) return;
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, value: value.trim().slice(0, 120), suggestions: result.suggestions, description: result.description, turnstileToken })
      });
      if (!response.ok) throw new Error("Invio non riuscito");
      setStatus("Segnalazione inviata per la verifica del repertorio.");
    } catch {
      setStatus("Invio non riuscito. La voce resta utilizzabile nella scheda.");
    } finally { setBusy(false); }
  }
  if (!value.trim()) return null;
  return <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-slate-800" aria-live="polite">
    <strong>Ricerca locale — {category}</strong>
    <p className="mt-1">{result.description}</p>
    {result.suggestions.length > 0 && <p className="mt-1">Corrispondenze: {result.suggestions.join("; ")}</p>}
    <p className="mt-1 text-slate-600">Risultati dal repertorio locale, non da Internet. Non includere nomi o dati degli assistiti.</p>
    {endpoint && siteKey && <div ref={captchaContainer} className="mt-2" />}
    {endpoint && siteKey ? <button type="button" onClick={report} disabled={busy || !turnstileToken} className="mt-2 rounded bg-blue-800 px-3 py-2 text-white disabled:opacity-50">{busy ? "Invio in corso..." : "Segnala automaticamente per aggiornamento"}</button> : <p className="mt-1 font-semibold">Invio automatico in attesa della configurazione sicura del servizio email.</p>}
    {status && <p className="mt-2">{status}</p>}
  </div>;
}
