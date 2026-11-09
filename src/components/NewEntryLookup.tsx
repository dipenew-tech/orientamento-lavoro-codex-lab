import React, { useEffect, useRef, useState } from "react";
import { getMunicipioFromZone } from "../lib/localDb";

type Category = "mestiere" | "nazionalita" | "quartiere";
type Props = { category: Category; value: string; existingValues?: string[]; onChoose?: (value: string) => void };
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
export default function NewEntryLookup({ category, value, existingValues = [], onChoose }: Props) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [webBusy, setWebBusy] = useState(false);
  const [webError, setWebError] = useState("");
  const [webResults, setWebResults] = useState<{label:string;description:string;url:string}[]>([]);
  const [lastSearched, setLastSearched] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");
  const [confirmedChoice, setConfirmedChoice] = useState("");
  const sentKeys = useRef(new Set<string>());
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
  }, [siteKey, Boolean(value.trim())]);
  const result = resolveNewEntry(category, value, existingValues);
  const endpoint = import.meta.env.VITE_SUGGESTIONS_ENDPOINT as string | undefined;
  async function searchWeb() {
    const query = value.trim().slice(0, 120);
    if (!query || webBusy) return;
    setWebBusy(true); setWebError(""); setWebResults([]); setSelectedUrl(""); setConfirmedChoice(""); setLastSearched(query);
    try {
      const params = new URLSearchParams({action:"wbsearchentities",search:query,language:"it",uselang:"it",type:"item",limit:"5",format:"json",origin:"*"});
      const response = await fetch(`https://www.wikidata.org/w/api.php?${params}`, {credentials:"omit"});
      if (!response.ok) throw new Error("Servizio non disponibile");
      const data = await response.json() as {search?:{id:string;label:string;description?:string}[]};
      const items = (data.search || []).filter(item => /^Q\d+$/.test(item.id)).map(item => ({label:item.label,description:item.description || "Descrizione non disponibile",url:`https://www.wikidata.org/wiki/${item.id}`}));
      setWebResults(items);
      if (!items.length) setWebError("Nessun risultato trovato nella fonte consultata.");
    } catch { setWebError("Ricerca web non disponibile. Usa le corrispondenze locali oppure riprova."); }
    finally { setWebBusy(false); }
  }
  async function report() {
    if (!confirmedChoice || !selectedUrl || !endpoint || !turnstileToken || busy) return;
    const key = `${category}:${selectedUrl}:${confirmedChoice}`;
    if (sentKeys.current.has(key)) return;
    sentKeys.current.add(key);
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, value: confirmedChoice.slice(0, 120), suggestions: result.suggestions, description: result.description, webResults: webResults.filter(item => item.url === selectedUrl).map(item => `${item.label}: ${item.description} (${item.url})`), turnstileToken })
      });
      if (!response.ok) throw new Error("Invio non riuscito");
      const receipt = await response.json() as {ok?:boolean};
      if (receipt.ok !== true) throw new Error("Invio non confermato");
      setStatus("Segnalazione inviata per la verifica del repertorio.");
    } catch {
      sentKeys.current.delete(key);
      setStatus("Invio non riuscito. La voce resta utilizzabile nella scheda.");
    } finally { setBusy(false); setTurnstileToken(""); (window as unknown as {turnstile?: {reset: (el: HTMLElement) => void}}).turnstile?.reset(captchaContainer.current!); }
  }
  useEffect(() => {
    if (confirmedChoice && selectedUrl && turnstileToken && endpoint && !busy) void report();
  }, [confirmedChoice, selectedUrl, turnstileToken, endpoint, category]);
  if (!value.trim()) return null;
  return <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-slate-800" aria-live="polite">
    <strong>Ricerca locale — {category}</strong>
    <p className="mt-1">{result.description}</p>
    {result.suggestions.length > 0 && <p className="mt-1">Corrispondenze: {result.suggestions.map(item => <button type="button" key={item} onClick={() => onChoose?.(item)} className="mx-1 underline">{item}</button>)}</p>}
    <p className="mt-1 text-slate-600">La ricerca locale non verifica i dati in tempo reale. Non inserire nomi o dati degli assistiti.</p>
    <button type="button" onClick={searchWeb} disabled={webBusy || !value.trim()} className="mt-2 rounded border border-blue-700 px-3 py-2 text-blue-900 disabled:opacity-50">{webBusy ? "Ricerca in corso..." : "Cerca anche sul web (Wikidata)"}</button>
    {lastSearched && lastSearched !== value.trim().slice(0,120) && <p className="mt-1 text-amber-700">La voce è cambiata: ripeti la ricerca web.</p>}
    {webError && <p className="mt-2">{webError}</p>}
    {(lastSearched === value.trim().slice(0,120) || !!confirmedChoice) && webResults.length > 0 && <div className="mt-2"><strong>Risultati web — Wikidata (da verificare)</strong><ul className="list-disc pl-4">{webResults.map(item => <li key={item.url}><input type="radio" name={`wikidata-${category}`} checked={selectedUrl === item.url} onChange={() => setSelectedUrl(item.url)} aria-label={`Seleziona ${item.label}`} /> <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline">{item.label}</a>: {item.description}</li>)}</ul><button type="button" disabled={!selectedUrl} onClick={() => { const item = webResults.find(entry => entry.url === selectedUrl); if (!item) return; setConfirmedChoice(item.label); onChoose?.(item.label); }} className="mt-2 rounded bg-blue-800 px-3 py-2 text-white disabled:opacity-50">Conferma questa voce</button>{confirmedChoice && <p role="status" className="mt-2 font-semibold">Voce confermata: {confirmedChoice}</p>}<p className="mt-1">Wikidata è una fonte collaborativa: le voci possono essere omonime o non pertinenti. Verificare prima dell’uso.</p></div>}
    {endpoint && siteKey && <div className="mt-2"><p>Verifica anti-abuso per la segnalazione automatica:</p><div ref={captchaContainer} /></div>}
    {endpoint && siteKey ? <p className="mt-2 font-medium">{busy ? "Invio segnalazione in corso..." : confirmedChoice ? "La segnalazione parte automaticamente dopo la conferma e la verifica anti-abuso." : "Seleziona e conferma una voce per inviare automaticamente la segnalazione."}</p> : <p className="mt-1 font-semibold">Invio automatico non attivo: manca la configurazione sicura del servizio email. La voce confermata resta utilizzabile nella lettera.</p>}
    {status && <p className="mt-2">{status}</p>}
  </div>;
}
