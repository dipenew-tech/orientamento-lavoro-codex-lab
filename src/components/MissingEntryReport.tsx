import type { Ref } from "react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

const getTurnstile = () => (window as Window & { turnstile?: Turnstile }).turnstile;

export type EntryReportHandle = { send: () => Promise<boolean> };
type Category = "nazionalita" | "mestiere";

export function getEntryReportMailto(category: Category, entry: string): string {
  const label = category === "nazionalita" ? "nazionalità" : "professione";
  const subject = "[Caritas] Aggiunta al repertorio: " + label;
  const body = "Ti chiedo di verificare e aggiungere al repertorio questa " + label + ": " + entry;
  return "mailto:dipenew@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

export default function MissingEntryReport({ category, value, ref }: {
  category: Category;
  ref?: Ref<EntryReportHandle>;
  value: string;
}) {
  const entry = value.trim();
  const endpoint = import.meta.env.VITE_SUGGESTIONS_ENDPOINT;
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const pending = useRef<{ key: string; result: Promise<boolean> } | null>(null);
  const sent = useRef(new Set<string>());
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasEntry = Boolean(entry);

  useEffect(() => {
    setToken("");
    setFailed(false);
    if (!hasEntry || !siteKey || !endpoint) return;
    if (!document.querySelector("script[data-caritas-turnstile]")) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.dataset.caritasTurnstile = "true";
      document.head.appendChild(script);
    }
    const timer = window.setInterval(() => {
      const turnstile = getTurnstile();
      if (!turnstile || !container.current) return;
      window.clearInterval(timer);
      try {
        widget.current = turnstile.render(container.current, {
          sitekey: siteKey,
          callback: setToken,
          "expired-callback": () => setToken(""),
          "error-callback": () => setFailed(true),
        });
      } catch {
        setFailed(true);
      }
    }, 200);
    const timeout = window.setTimeout(() => {
      if (!widget.current) setFailed(true);
    }, 8000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(timeout);
      if (widget.current) getTurnstile()?.remove(widget.current);
      widget.current = undefined;
    };
  }, [hasEntry, endpoint, siteKey]);

  const key = entry.toLocaleLowerCase("it");
  const mailto = getEntryReportMailto(category, entry);

  function report(): Promise<boolean> {
    if (sent.current.has(key)) return Promise.resolve(true);
    if (pending.current) return pending.current.key === key ? pending.current.result : Promise.resolve(false);
    if (!entry || !endpoint || !token) {
      setFailed(true);
      return Promise.resolve(false);
    }
    setBusy(true);
    setStatus("");
    const result = send();
    pending.current = { key, result };
    return result;

    async function send() {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, value: entry, turnstileToken: token }),
          signal: AbortSignal.timeout(6000),
        });
        if (!response.ok || (await response.json()).ok !== true) throw new Error();
        sent.current.add(key);
        setFailed(false);
        return true;
      } catch {
        setStatus("Invio automatico non confermato.");
        setFailed(true);
        return false;
      } finally {
        pending.current = null;
        setBusy(false);
        setToken("");
        if (widget.current) getTurnstile()?.reset(widget.current);
      }
    }
  }

  useImperativeHandle(ref, () => ({ send: report }));
  if (!entry) return null;

  return (
    <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-slate-800">
      <p>Chiedi all’amministratore di aggiungere questa voce. Inserisci solo la voce da aggiungere.</p>
      {endpoint && siteKey && (
        <>
          <div ref={container} className="mt-2" />
          <button type="button" onClick={report} disabled={!token || busy || sent.current.has(key)}
            className="mt-2 rounded bg-blue-800 px-3 py-2 text-white disabled:opacity-50">
            {busy ? "Invio in corso…" : "Invia segnalazione"}
          </button>
        </>
      )}
      {(!endpoint || !siteKey || failed) && !sent.current.has(key) && (
        <p className="mt-2"><a href={mailto} className="underline">Apri la bozza nel tuo programma di posta</a> e inviala all’amministratore.</p>
      )}
      <p className="mt-1" role="status">{sent.current.has(key) ? "Segnalazione accettata dal servizio email." : status === "Invio automatico non confermato." ? status : ""}</p>
    </div>
  );
}
