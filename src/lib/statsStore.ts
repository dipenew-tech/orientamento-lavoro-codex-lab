import { LetterStatRecord } from "../types";
export type { LetterStatRecord };

const STATS_STORAGE_KEY = "orientamento_lavoro_letter_stats_web_v2";

export function getLetterStats(): LetterStatRecord[] {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Error reading stats from localStorage:", err);
    return [];
  }
}

export function saveLetterStat(data: Omit<LetterStatRecord, "id" | "timestamp">): LetterStatRecord {
  const current = getLetterStats();
  const newRecord: LetterStatRecord = {
    ...data,
    id: `stat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString()
  };

  const updated = [newRecord, ...current];
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving stat record to localStorage:", err);
  }

  // Le statistiche rimangono esclusivamente in questo browser.
  return newRecord;
}

export function clearLetterStats(): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error("Error clearing stats:", err);
  }
}

export interface AggregatedStats {
  totalLetters: number;
  totalOfficina: number;
  officinaPercentage: number;
  maleCount: number;
  femaleCount: number;
  byNationality: Record<string, number>;
  byProfession: Record<string, number>;
  byLanguage: Record<string, number>;
  byZoneResident: Record<string, number>;
  byItalianLevel: Record<string, number>;
  topNationality: string;
  topProfession: string;
  topZone: string;
  topLanguage: string;
}

export function computeAggregatedStats(records: LetterStatRecord[]): AggregatedStats {
  const totalLetters = records.length;
  if (totalLetters === 0) {
    return {
      totalLetters: 0,
      totalOfficina: 0,
      officinaPercentage: 0,
      maleCount: 0,
      femaleCount: 0,
      byNationality: {},
      byProfession: {},
      byLanguage: {},
      byZoneResident: {},
      byItalianLevel: {},
      topNationality: "N/D",
      topProfession: "N/D",
      topZone: "N/D",
      topLanguage: "N/D"
    };
  }

  let totalOfficina = 0;
  let maleCount = 0;
  let femaleCount = 0;

  const byNationality: Record<string, number> = {};
  const byProfession: Record<string, number> = {};
  const byLanguage: Record<string, number> = {};
  const byZoneResident: Record<string, number> = {};
  const byItalianLevel: Record<string, number> = {};

  records.forEach((r) => {
    if (r.officinaOpportunity) totalOfficina++;
    if (r.gender === "F") femaleCount++;
    else maleCount++;

    const nat = r.nationality || "Non specificata";
    byNationality[nat] = (byNationality[nat] || 0) + 1;

    const prof = r.jobSought || "Non specificata";
    byProfession[prof] = (byProfession[prof] || 0) + 1;

    const lang = r.translationLanguage || "Italiano";
    byLanguage[lang] = (byLanguage[lang] || 0) + 1;

    const zone = r.zoneResident || "Roma General";
    byZoneResident[zone] = (byZoneResident[zone] || 0) + 1;

    const lvl = r.italianLevel || "Non specificato";
    byItalianLevel[lvl] = (byItalianLevel[lvl] || 0) + 1;
  });

  const getTopKey = (map: Record<string, number>) => {
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? `${sorted[0][0]} (${sorted[0][1]})` : "N/D";
  };

  return {
    totalLetters,
    totalOfficina,
    officinaPercentage: Math.round((totalOfficina / totalLetters) * 100),
    maleCount,
    femaleCount,
    byNationality,
    byProfession,
    byLanguage,
    byZoneResident,
    byItalianLevel,
    topNationality: getTopKey(byNationality),
    topProfession: getTopKey(byProfession),
    topZone: getTopKey(byZoneResident),
    topLanguage: getTopKey(byLanguage)
  };
}

export function exportStatsCSV(records: LetterStatRecord[]): void {
  if (records.length === 0) return;

  const headers = [
    "ID",
    "Data Ora",
    "Nome Utente",
    "Sesso",
    "Nazionalita",
    "Livello Italiano",
    "Professione Cercata",
    "Zona Residenza",
    "Zona Lavoro",
    "Lingua Traduzione",
    "Officina Lavoro Inclusion",
    "Cooperative",
    "Uffici Pubblici",
    "Scuole Italiano"
  ];

  const rows = records.map((r) => [
    r.id,
    new Date(r.timestamp).toLocaleString("it-IT"),
    `"${(r.recipientName || "Anonimo").replace(/"/g, '""')}"`,
    r.gender || "M",
    `"${(r.nationality || "").replace(/"/g, '""')}"`,
    `"${(r.italianLevel || "").replace(/"/g, '""')}"`,
    `"${(r.jobSought || "").replace(/"/g, '""')}"`,
    `"${(r.zoneResident || "").replace(/"/g, '""')}"`,
    `"${(r.zoneJobSought || "").replace(/"/g, '""')}"`,
    `"${(r.translationLanguage || "").replace(/"/g, '""')}"`,
    r.officinaOpportunity ? "SI" : "NO",
    r.cooperativesCount || 0,
    r.publicOfficesCount || 0,
    r.schoolsCount || 0
  ]);

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `statistiche_lettere_orientamento_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportStatsJSON(records: LetterStatRecord[]): void {
  if (records.length === 0) return;

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `statistiche_lettere_orientamento_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
