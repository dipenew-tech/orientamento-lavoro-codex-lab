export function getJobSearchTerms(profession: string): string[] {
  return profession.split("(")[0].split("/").map(term => term.trim()).filter(Boolean);
}

export function getJobBoardLinks(profession: string, area: string) {
  const job = profession.trim();
  const zone = area.trim();
  const citywide = /^(tutta\s+)?roma$/i.test(zone);
  const indeed = new URL("https://it.indeed.com/jobs");
  indeed.searchParams.set("q", job);
  indeed.searchParams.set("l", citywide ? "Roma, Lazio" : zone);
  const subito = new URL("https://www.subito.it/annunci-lazio/vendita/offerte-lavoro/roma/");
  subito.searchParams.set("q", citywide ? job : job + " " + zone);
  return { indeed: indeed.href, subito: subito.href };
}


export function formatSelectedJobLinks(input: string): string {
  const selected = new Map<string, string>();
  for (const line of input.split(/\r?\n/)) {
    const match = line.match(/https?:\/\/[^\s]+/i);
    if (!match) continue;
    let url: URL;
    try {
      url = new URL(match[0]);
    } catch {
      continue;
    }
    if (url.protocol !== "https:" || url.username || url.password || url.port) continue;
    const indeed = ["it.indeed.com", "www.indeed.com", "indeed.com"].includes(url.hostname)
      && ["/viewjob", "/rc/clk", "/pagead/clk"].includes(url.pathname)
      && url.searchParams.has("jk");
    const subito = ["subito.it", "www.subito.it"].includes(url.hostname)
      && /^\/offerte-lavoro\/[^/]+\.htm$/.test(url.pathname);
    if (!indeed && !subito) continue;
    const title = line.slice(0, match.index).trim().replace(/[-–—:]+$/, "").trim();
    const portal = indeed ? "Indeed" : "Subito";
    const link = indeed
      ? "https://it.indeed.com/viewjob?jk=" + encodeURIComponent(url.searchParams.get("jk")!)
      : url.origin + url.pathname;
    if (title || !selected.has(link)) {
      selected.set(link, (title ? title + " (" + portal + ")" : portal) + "\n" + link);
    }
  }
  return [...selected.values()].join("\n\n");
}
