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
  const subito = new URL("https://www.subito.it/annunci-lazio/vendita/offerte-lavoro/roma/roma/");
  subito.searchParams.set("q", citywide ? job : job + " " + zone);
  return { indeed: indeed.href, subito: subito.href };
}
