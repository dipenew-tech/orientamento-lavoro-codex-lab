import { useEffect, useRef, useState } from "react";

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

const getTurnstile = () => (window as Window & { turnstile?: Turnstile }).turnstile;

export default function MissingEntryReport({ category, value }: {
  category: "nazionalita" | "mestiere";
  value: string;
}) {
  const entry = value.trim();
  const endpoint = import.meta.env.VITE_SUGGESTIONS_ENDPOINT;
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const sending = useRef(false);
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

  if (!entry) return null;
  const key = entry.toLocaleLowerCase("it");
  const label = category === "nazionalita" ? "nazionalità" : "professione";
  const subject = "[Caritas] Aggiunta al repertorio: " + label;
  const body = "Ti chiedo di verificare e aggiungere al repertorio questa " + label + ": " + entry;
  const mailto = "mailto:dipenew@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

  async function report() {
    if (!endpoint || !token || sending.current || sent.current.has(key)) return;
    sending.current = true;
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, value: entry, turnstileToken: token }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok || (await response.json()).ok !== true) throw new Error();
      sent.current.add(key);
      setStatus("Segnalazione accettata dal servizio email.");
      setFailed(false);
    } catch {
      setStatus("Invio automatico non confermato.");
      setFailed(true);
    } finally {
      setBusy(false);
      sending.current = false;
      setToken("");
      if (widget.current) getTurnstile()?.reset(widget.current);
    }
  }

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
