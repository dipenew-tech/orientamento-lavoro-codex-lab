export function getJobSearchTerms(profession: string): string[] {
  return profession.split("(")[0].split("/").map(term => term.trim()).filter(Boolean);
}

export function getIndeedSearchLink(profession: string, area: string) {
  const job = profession.trim();
  const zone = area.trim();
  const citywide = /^(tutta\s+)?roma$/i.test(zone);
  const indeed = new URL("https://it.indeed.com/jobs");
  indeed.searchParams.set("q", job);
  indeed.searchParams.set("l", citywide ? "Roma, Lazio" : zone);
  return indeed.href;
}
