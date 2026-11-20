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
  const requested = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "waiting" | "sending" | "sent" | "failed">("idle");
  const [challengeError, setChallengeError] = useState(false);
  const hasEntry = Boolean(entry);

  useEffect(() => {
    setToken("");
    setChallengeError(false);
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
          appearance: "always",
          "error-callback": () => { setToken(""); setChallengeError(true); },
        });
      } catch {
        setToken("");
        setChallengeError(true);
      }
    }, 200);
    return () => {
      window.clearInterval(timer);
      if (widget.current) getTurnstile()?.remove(widget.current);
      widget.current = undefined;
    };
  }, [hasEntry, endpoint, siteKey]);

  const key = entry.toLocaleLowerCase("it");

  useEffect(() => {
    if (token && requested.current === key) void report();
  }, [token, key]);

  function report(): Promise<boolean> {
    if (sent.current.has(key)) return Promise.resolve(true);
    if (pending.current) return pending.current.key === key ? pending.current.result : Promise.resolve(false);
    if (!entry || !endpoint) return Promise.resolve(false);
    if (!token) {
      requested.current = key;
      setStatus("waiting");
      return Promise.resolve(false);
    }
    requested.current = null;
    setStatus("sending");
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
        setStatus("sent");
        return true;
      } catch {
        setStatus("failed");
        return false;
      } finally {
        pending.current = null;
        setToken("");
        // Reset only after an attempted send; never auto-retry a failed request.
        if (widget.current) getTurnstile()?.reset(widget.current);
      }
    }
  }

  useImperativeHandle(ref, () => ({ send: report }));
  return hasEntry && endpoint && siteKey ? (
    <div className="rounded-lg bg-white p-2 text-xs text-slate-800 shadow-md" role="status">
      <div ref={container} />
      {status === "waiting" && <p>Verifica di sicurezza in attesa: completa il controllo qui sopra per inviare la segnalazione.</p>}
      {status === "sending" && <p>Invio della segnalazione in corso…</p>}
      {status === "sent" && <p>Segnalazione inviata.</p>}
      {status === "failed" && <p>Segnalazione non inviata. La lettera resta disponibile.</p>}
      {challengeError && <p>Verifica di sicurezza non disponibile: controlla la connessione o le impostazioni Turnstile.</p>}
    </div>
  ) : null;
}
