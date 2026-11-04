import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Lock, 
  Mail, 
  Download, 
  Trash2, 
  X, 
  Search, 
  CheckCircle2, 
  Globe2, 
  Briefcase, 
  MapPin, 
  Languages, 
  UserCheck, 
  Calendar, 
  KeyRound, 
  RefreshCw,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  PieChart,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";
import { 
  getLetterStats, 
  computeAggregatedStats, 
  exportStatsCSV, 
  exportStatsJSON, 
  clearLetterStats,
  LetterStatRecord 
} from "../lib/statsStore";
import { searchLocalDatabase, DatabaseSearchResult } from "../lib/localDb";

interface AdminStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentBtnClass?: string;
}

export default function AdminStatsModal({ isOpen, onClose, accentBtnClass }: AdminStatsModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("admin_authenticated") === "true";
  });
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"charts" | "registry" | "database">("charts");
  const [statsRecords, setStatsRecords] = useState<LetterStatRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Database Search & Verification Tab State
  const [dbSearchQuery, setDbSearchQuery] = useState<string>("");
  const [dbCategoryFilter, setDbCategoryFilter] = useState<string>("all");
  const [dbMunicipioFilter, setDbMunicipioFilter] = useState<string>("all");

  // Date Filtering State
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "yesterday" | "7days" | "custom">("all");
  const [customDate, setCustomDate] = useState<string>("");

  // Email sending state
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailStatus, setEmailStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Clear confirmation
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  const loadData = () => {
    const records = getLetterStats();
    setStatsRecords(records);
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "1234" || pinInput.trim() === "admin" || pinInput.trim() === "caritas") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setPinError(null);
      loadData();
    } else {
      setPinError("PIN errato. Prova con 1234 (PIN di default).");
    }
  };

  const getDateFilteredRecords = () => {
    const now = new Date();
    const getLocalYYYYMMDD = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const todayStr = getLocalYYYYMMDD(now);

    return statsRecords.filter((r) => {
      if (!r.timestamp) return true;
      const rDateObj = new Date(r.timestamp);
      const rDateStr = getLocalYYYYMMDD(rDateObj);

      if (dateFilter === "today") {
        return rDateStr === todayStr;
      }
      if (dateFilter === "yesterday") {
        const yestObj = new Date(now);
        yestObj.setDate(yestObj.getDate() - 1);
        const yestStr = getLocalYYYYMMDD(yestObj);
        return rDateStr === yestStr;
      }
      if (dateFilter === "7days") {
        const diffMs = now.getTime() - rDateObj.getTime();
        return diffMs >= 0 && diffMs <= 7 * 24 * 3600 * 1000;
      }
      if (dateFilter === "custom" && customDate) {
        return rDateStr === customDate;
      }
      return true; // "all"
    });
  };

  const dateFilteredRecords = getDateFilteredRecords();
  const agg = computeAggregatedStats(dateFilteredRecords);

  const handleClear = () => {
    clearLetterStats();
    setStatsRecords([]);
    setShowClearConfirm(false);
  };

  // Filtered registry
  const filteredRecords = dateFilteredRecords.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.recipientName && r.recipientName.toLowerCase().includes(q)) ||
      (r.nationality && r.nationality.toLowerCase().includes(q)) ||
      (r.jobSought && r.jobSought.toLowerCase().includes(q)) ||
      (r.zoneResident && r.zoneResident.toLowerCase().includes(q)) ||
      (r.translationLanguage && r.translationLanguage.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden transition-all">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Area Riservata — Statistiche Orientamento Lavoro
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monitoraggio e reportistica dettagliata delle lettere generate a Roma
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Authentication Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800 shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Accesso Riservato Amministratore</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inserisci il PIN amministrativo per consultare l'archivio delle statistiche e inviare report via email.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Inserisci PIN (default: 1234)"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {pinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2`}
              >
                <UserCheck className="w-4 h-4" />
                Accedi all'Area Statistiche
              </button>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 rounded-xl text-left">
                <p className="text-[11px] text-amber-900 dark:text-amber-300 font-medium leading-relaxed">
                  💡 <strong>PIN rapido di prova:</strong> Digita <strong>1234</strong> per accedere direttamente all'Area Riservata Statistiche.
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Action Bar & Notification Alert */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100/70 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("charts")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "charts"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  Panoramica & Grafici
                </button>
                <button
                  onClick={() => setActiveTab("registry")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "registry"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Registro Dettagliato ({dateFilteredRecords.length})
                </button>
                <button
                  onClick={() => setActiveTab("database")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "database"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  Verifica Database & Ricerca
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => exportStatsCSV(dateFilteredRecords)}
                    disabled={dateFilteredRecords.length === 0}
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-medium transition-all flex items-center gap-1 disabled:opacity-40"
                    title="Esporta in formato CSV / Excel"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    CSV
                  </button>
                  <button
                    onClick={() => exportStatsJSON(dateFilteredRecords)}
                    disabled={dateFilteredRecords.length === 0}
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-medium transition-all flex items-center gap-1 disabled:opacity-40"
                    title="Esporta in formato JSON"
                  >
                    <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                    JSON
                  </button>
                </div>

                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={statsRecords.length === 0}
                  className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl text-xs font-medium transition-all flex items-center gap-1 border border-red-200/50 dark:border-red-900/40 disabled:opacity-40"
                  title="Azzera il registro delle statistiche"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Azzera
                </button>
              </div>
            </div>

            {/* Date Filtering Selector Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-500/10 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-500/20">
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1 mr-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Filtro su base giorno:
                </span>
                {[
                  { id: "all", label: "Tutti i tempi" },
                  { id: "today", label: "Oggi" },
                  { id: "yesterday", label: "Ieri" },
                  { id: "7days", label: "Ultimi 7 Giorni" },
                  { id: "custom", label: "Data Specifica" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDateFilter(item.id as any)}
                    className={`px-3 py-1 rounded-xl font-medium transition-all ${
                      dateFilter === item.id
                        ? "bg-amber-600 text-white shadow-xs font-bold"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                {dateFilter === "custom" && (
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>

              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Lettere selezionate: <span className="text-amber-700 dark:text-amber-300 font-bold">{dateFilteredRecords.length}</span> su {statsRecords.length} totali
              </div>
            </div>

            {/* Email Status Toast Alert */}
            {emailStatus && (
              <div className={`p-3.5 rounded-2xl text-xs font-medium flex items-center justify-between border ${
                emailStatus.success 
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
                  : "bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border-red-200 dark:border-red-800"
              }`}>
                <div className="flex items-center gap-2">
                  {emailStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                  <span>{emailStatus.message}</span>
                </div>
                <button onClick={() => setEmailStatus(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Clear Confirmation Modal / Banner */}
            {showClearConfirm && (
              <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-red-900 dark:text-red-200">
                <div className="text-xs space-y-0.5">
                  <p className="font-bold">Confermi l'azzeramento completo del registro delle statistiche?</p>
                  <p className="opacity-80">Questa azione eliminerà tutte le {statsRecords.length} registrazioni salvate.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Sì, Azzera Tutto
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            )}

            {/* Top Key Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 space-y-1">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Totale Lettere</p>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{agg.totalLetters}</p>
                <p className="text-[10px] text-slate-500">Generati per orientamento</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 space-y-1">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nazione Top</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{agg.topNationality}</p>
                <p className="text-[10px] text-slate-500">Provenienza più frequente</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 space-y-1">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Professione Top</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{agg.topProfession}</p>
                <p className="text-[10px] text-slate-500">Settore lavorativo principale</p>
              </div>

              <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-3.5 space-y-1">
                <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Officina Lavoro</p>
                <p className="text-2xl font-black text-amber-900 dark:text-amber-200">{agg.officinaPercentage}%</p>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">Inseriti nei corsi gratuiti ({agg.totalOfficina})</p>
              </div>
            </div>

            {/* TAB 1: CHARTS & BREAKDOWNS */}
            {activeTab === "charts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Profession Breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border-b pb-2 border-slate-100 dark:border-slate-800">
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    Dettaglio per Professione Cercata
                  </h3>
                  <div className="space-y-2.5">
                    {Object.entries(agg.byProfession)
                      .sort((a, b) => b[1] - a[1])
                      .map(([prof, count]) => {
                        const pct = Math.round((count / agg.totalLetters) * 100);
                        return (
                          <div key={prof} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                              <span className="truncate pr-2">{prof}</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-500" 
                                style={{ width: `${pct}%` }} 
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* 2. Nationality Breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border-b pb-2 border-slate-100 dark:border-slate-800">
                    <Globe2 className="w-4 h-4 text-blue-600" />
                    Dettaglio per Nazionalità dell'Utente
                  </h3>
                  <div className="space-y-2.5">
                    {Object.entries(agg.byNationality)
                      .sort((a, b) => b[1] - a[1])
                      .map(([nat, count]) => {
                        const pct = Math.round((count / agg.totalLetters) * 100);
                        return (
                          <div key={nat} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                              <span className="truncate pr-2">{nat}</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" 
                                style={{ width: `${pct}%` }} 
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* 3. Translation Language Breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border-b pb-2 border-slate-100 dark:border-slate-800">
                    <Languages className="w-4 h-4 text-purple-600" />
                    Dettaglio per Lingua della Lettera Tradotta
                  </h3>
                  <div className="space-y-2.5">
                    {Object.entries(agg.byLanguage)
                      .sort((a, b) => b[1] - a[1])
                      .map(([lang, count]) => {
                        const pct = Math.round((count / agg.totalLetters) * 100);
                        return (
                          <div key={lang} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                              <span className="truncate pr-2">{lang}</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" 
                                style={{ width: `${pct}%` }} 
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* 4. Zone Resident & Italian Level Breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border-b pb-2 border-slate-100 dark:border-slate-800">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Zone di Residenza & Livello di Italiano
                  </h3>
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Zone principali di Roma:</p>
                    {Object.entries(agg.byZoneResident)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([zone, count]) => {
                        const pct = Math.round((count / agg.totalLetters) * 100);
                        return (
                          <div key={zone} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                              <span className="truncate pr-2">{zone}</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                                style={{ width: `${pct}%` }} 
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: DETAILED REGISTRY */}
            {activeTab === "registry" && (
              <div className="space-y-4">
                
                {/* Search input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtra per nome, nazione, professione, lingua o quartiere..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Cancella
                    </button>
                  )}
                </div>

                {/* Registry Table */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Data / Ora</th>
                          <th className="py-2.5 px-3">Utente</th>
                          <th className="py-2.5 px-3">Nazione</th>
                          <th className="py-2.5 px-3">Professione</th>
                          <th className="py-2.5 px-3">Lingua</th>
                          <th className="py-2.5 px-3">Zona Residenza</th>
                          <th className="py-2.5 px-3 text-center">Officina</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {filteredRecords.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-slate-400">
                              Nessuna lettera trovata nel registro.
                            </td>
                          </tr>
                        ) : (
                          filteredRecords.map((r) => {
                            const dateStr = new Date(r.timestamp).toLocaleDateString("it-IT", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            });
                            const isExpanded = expandedId === r.id;

                            return (
                              <React.Fragment key={r.id}>
                                <tr 
                                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                >
                                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400">{dateStr}</td>
                                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                                    {r.recipientName || "Anonimo"} ({r.gender || "M"})
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{r.nationality}</td>
                                  <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-semibold">{r.jobSought}</td>
                                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                                    <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200/60 dark:border-purple-800/60">
                                      {r.translationLanguage}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{r.zoneResident}</td>
                                  <td className="py-2.5 px-3 text-center">
                                    {r.officinaOpportunity ? (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                                        SI
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 text-[10px]">-</span>
                                    )}
                                  </td>
                                </tr>

                                {/* Expanded Detail Row */}
                                {isExpanded && (
                                  <tr className="bg-slate-50/90 dark:bg-slate-850/90">
                                    <td colSpan={7} className="p-4 border-t border-b border-slate-200/80 dark:border-slate-800">
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                        <div>
                                          <span className="block text-slate-400 text-[10px] uppercase font-bold">Livello Italiano:</span>
                                          <span className="font-semibold text-slate-800 dark:text-slate-200">{r.italianLevel}</span>
                                        </div>
                                        <div>
                                          <span className="block text-slate-400 text-[10px] uppercase font-bold">Zona Lavoro Cercata:</span>
                                          <span className="font-semibold text-slate-800 dark:text-slate-200">{r.zoneJobSought}</span>
                                        </div>
                                        <div>
                                          <span className="block text-slate-400 text-[10px] uppercase font-bold">Risorse Incluse:</span>
                                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {r.cooperativesCount} Coop • {r.publicOfficesCount} Uffici • {r.schoolsCount} Scuole
                                          </span>
                                        </div>
                                        <div>
                                          <span className="block text-slate-400 text-[10px] uppercase font-bold">Modalità Generazione:</span>
                                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {r.isLocalFallback ? "Generazione Locale Fallback" : "Banca Dati / AI Online"}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: DATABASE SEARCH & VERIFICATION */}
            {activeTab === "database" && (
              <div className="space-y-4">
                {/* Search & Filter Header */}
                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Banca Dati Territoriale Roma & Ostia — 100% Verificata
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Verifica e ricerca immediata per Ufficio, Indirizzo e Telefono.
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800">
                      {searchLocalDatabase(dbSearchQuery, dbCategoryFilter, dbMunicipioFilter).length} Strutture Trovate
                    </span>
                  </div>

                  {/* Search Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1 relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cerca ufficio, indirizzo, telefono..."
                        value={dbSearchQuery}
                        onChange={(e) => setDbSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <select
                        value={dbCategoryFilter}
                        onChange={(e) => setDbCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="all">Tutte le Categorie</option>
                        <option value="offices">Solo Uffici Pubblici (CPI & COL)</option>
                        <option value="schools">Solo Scuole d'Italiano (CPIA)</option>
                        <option value="cooperatives">Solo Cooperative & Agenzie Lavoro</option>
                      </select>
                    </div>

                    <div>
                      <select
                        value={dbMunicipioFilter}
                        onChange={(e) => setDbMunicipioFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="all">Tutti i Municipi di Roma (I - XV)</option>
                        {Array.from({ length: 15 }, (_, i) => `Municipio ${["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"][i]}`).map(m => (
                          <option key={m} value={m}>{m} {m === "Municipio X" ? "(Ostia & Litorale)" : ""}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table of Database Entries */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                  <div className="overflow-x-auto max-h-[500px]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold sticky top-0 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-2.5 px-3">Struttura / Ente</th>
                          <th className="py-2.5 px-3">Categoria</th>
                          <th className="py-2.5 px-3">Municipio</th>
                          <th className="py-2.5 px-3">Indirizzo Verificato</th>
                          <th className="py-2.5 px-3">Telefono</th>
                          <th className="py-2.5 px-3">Email & Orari</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {searchLocalDatabase(dbSearchQuery, dbCategoryFilter, dbMunicipioFilter).map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-2.5 px-3">
                              <span className="font-bold text-slate-900 dark:text-slate-100 block">{item.name}</span>
                              <span className="text-[11px] text-slate-500 line-clamp-1">{item.description}</span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                item.category === "Ufficio Pubblico"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                  : item.category === "Scuola Italiano"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              }`}>
                                {item.category}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">
                              {item.municipio}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                              {item.address}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <a href={`tel:${item.phone.replace(/\s+/g, '')}`} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                {item.phone}
                              </a>
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-500">
                              <span className="block text-slate-700 dark:text-slate-300 font-medium truncate max-w-[160px]">{item.email}</span>
                              <span className="block text-[10px] text-slate-400">{item.hours}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
