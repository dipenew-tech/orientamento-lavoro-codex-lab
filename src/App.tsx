import React, { useState, useEffect, useRef } from "react";
import { UserFormInputs, GeneratedLetter } from "./types";
import LetterEditor from "./components/LetterEditor";
import MissingEntryReport, { getEntryReportMailto, type EntryReportHandle } from "./components/MissingEntryReport";
import { formatSelectedJobLinks, getJobBoardLinks, getJobSearchTerms } from "./lib/jobBoardLinks";
import AdminStatsModal from "./components/AdminStatsModal";
import { saveLetterStat } from "./lib/statsStore";
import { generateLocalFallback } from "./lib/fallbackGenerator";
import { 
  Heart, 
  User, 
  Briefcase, 
  MapPin, 
  Compass, 
  AlertCircle, 
  ArrowRight,
  Search,
  Loader2,
  Building2,
  Phone,
  BarChart3,
  Lock,
  Download
} from "lucide-react";

type ThemeOption = "classic" | "professional" | "modern" | "caritas";

const THEMES: Record<ThemeOption, {
  name: string;
  subtitle: string;
  badge: string;
  bgClass: string;
  headerBg: string;
  headerTitle: string;
  headerSubtitle: string;
  logoBadgeBg: string;
  logoBadgeText: string;
  logoBadgeContent: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  accentBtn: string;
  accentText: string;
  accentBadge: string;
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
  bannerBg: string;
  bannerBorder: string;
  bannerTitleText: string;
  labelColor: string;
  sectionTitleColor: string;
}> = {
  classic: {
    name: "Classico",
    subtitle: "Clean e minimale",
    badge: "Standard",
    bgClass: "bg-slate-50 text-slate-800",
    headerBg: "bg-white border-b border-slate-200/80 shadow-sm",
    headerTitle: "Orientamento Lavoro",
    headerSubtitle: "Accoglienza, Orientamento e Contatti Territoriali a Roma",
    logoBadgeBg: "bg-blue-700 text-white shadow-blue-700/20",
    logoBadgeText: "text-white font-bold",
    logoBadgeContent: "OL",
    cardBg: "bg-white",
    cardBorder: "border-slate-200/80",
    cardShadow: "shadow-sm",
    accentBtn: "bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/15",
    accentText: "text-blue-700",
    accentBadge: "bg-blue-50 text-blue-700 border-blue-200/60",
    inputBg: "bg-slate-50/60 text-slate-900",
    inputBorder: "border-slate-200",
    inputFocus: "focus:ring-blue-700/20 focus:border-blue-700",
    bannerBg: "bg-white",
    bannerBorder: "border-slate-200/80",
    bannerTitleText: "text-slate-900",
    labelColor: "text-slate-700 font-semibold",
    sectionTitleColor: "text-slate-500 font-semibold",
  },
  professional: {
    name: "Professionale",
    subtitle: "Istituzionale & Formale",
    badge: "Executive",
    bgClass: "bg-slate-100 text-slate-900 font-sans",
    headerBg: "bg-slate-900 text-white border-b-2 border-amber-500 shadow-md",
    headerTitle: "Servizio di Orientamento e Lavoro",
    headerSubtitle: "Scheda Ufficiale di Accoglienza e Servizi Territoriali - Roma",
    logoBadgeBg: "bg-amber-500 text-slate-950 font-serif font-black shadow-amber-500/20",
    logoBadgeText: "text-slate-950 font-extrabold",
    logoBadgeContent: "SOL",
    cardBg: "bg-slate-50",
    cardBorder: "border-slate-300",
    cardShadow: "shadow-md",
    accentBtn: "bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 shadow-lg shadow-slate-900/20",
    accentText: "text-slate-900",
    accentBadge: "bg-amber-100 text-amber-950 border-amber-300 font-semibold",
    inputBg: "bg-white text-slate-900",
    inputBorder: "border-slate-300",
    inputFocus: "focus:ring-slate-900/20 focus:border-slate-900",
    bannerBg: "bg-slate-900 text-slate-100 border-l-4 border-l-amber-500",
    bannerBorder: "border-slate-800",
    bannerTitleText: "text-amber-400 font-serif",
    labelColor: "text-slate-800 font-bold",
    sectionTitleColor: "text-slate-600 font-bold",
  },
  modern: {
    name: "Moderna",
    subtitle: "Tech Minimal & Dynamic",
    badge: "Modern UI",
    bgClass: "bg-slate-950 text-slate-100 font-sans",
    headerBg: "bg-slate-900/90 text-white border-b border-indigo-900/60 backdrop-blur-md shadow-xl shadow-indigo-950/40",
    headerTitle: "DIPE Smart Work Engine",
    headerSubtitle: "AI-Powered Territorial Job & Orientation Assistant",
    logoBadgeBg: "bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-600/30",
    logoBadgeText: "text-white font-black",
    logoBadgeContent: "AI",
    cardBg: "bg-slate-900/90 text-slate-100",
    cardBorder: "border-indigo-900/50",
    cardShadow: "shadow-2xl shadow-indigo-950/50",
    accentBtn: "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30",
    accentText: "text-indigo-400",
    accentBadge: "bg-indigo-950/80 text-indigo-300 border-indigo-700/60 font-medium",
    inputBg: "bg-slate-800/90 text-slate-100",
    inputBorder: "border-indigo-900/60",
    inputFocus: "focus:ring-indigo-500/30 focus:border-indigo-500",
    bannerBg: "bg-slate-900/90 text-indigo-100 border-t border-indigo-500/30",
    bannerBorder: "border-indigo-900/60",
    bannerTitleText: "text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300 font-bold",
    labelColor: "text-indigo-200 font-medium",
    sectionTitleColor: "text-indigo-400 font-semibold",
  },
  caritas: {
    name: "Caritas Roma",
    subtitle: "Personalizzato Caritas",
    badge: "Ufficiale",
    bgClass: "bg-[#fcfaf7] text-neutral-900 font-sans",
    headerBg: "bg-[#b91c1c] text-white border-b-2 border-amber-400 shadow-md",
    headerTitle: "Caritas Diocesana di Roma",
    headerSubtitle: "Area Inclusione Lavoro & Accoglienza • Coordinamento DIPE",
    logoBadgeBg: "bg-white text-[#b91c1c] shadow-md",
    logoBadgeText: "text-[#b91c1c] font-black",
    logoBadgeContent: "CR",
    cardBg: "bg-white",
    cardBorder: "border-red-100 border-t-4 border-t-[#b91c1c]",
    cardShadow: "shadow-md",
    accentBtn: "bg-[#b91c1c] hover:bg-[#990000] text-white font-bold shadow-md shadow-red-900/20",
    accentText: "text-[#b91c1c]",
    accentBadge: "bg-amber-100 text-amber-900 border-amber-300/80 font-semibold",
    inputBg: "bg-[#fdfbf7] text-neutral-900",
    inputBorder: "border-red-200",
    inputFocus: "focus:ring-red-600/20 focus:border-red-600",
    bannerBg: "bg-amber-50/80 text-amber-950 border-l-4 border-l-[#b91c1c]",
    bannerBorder: "border-amber-200/80",
    bannerTitleText: "text-[#b91c1c] font-bold",
    labelColor: "text-neutral-800 font-semibold",
    sectionTitleColor: "text-red-700 font-bold",
  }
};

const NATIONALITIES_LIST = [
  "Albania",
  "Algeria",
  "Bangladesh",
  "Bosnia",
  "Bulgaria",
  "Cile",
  "Colombia",
  "Congo",
  "Costa d'Avorio",
  "Croazia",
  "Egitto",
  "Filippine",
  "Georgia",
  "India",
  "Italia",
  "Libia",
  "Macedonia",
  "Madagascar",
  "Marocco",
  "Moldavia",
  "Nigeria",
  "Perù",
  "Polonia",
  "Rep. Ceca",
  "Rep. Dem. del Congo",
  "Romania",
  "Serbia",
  "Siria",
  "Somalia",
  "Sri-Lanka",
  "Tanzania",
  "Tunisia",
  "Turchia",
  "Ucraina",
  "Uruguay",
  "Altro"
];

export default function App() {
  const [step, setStep] = useState<"form" | "loading" | "result" | "error">("form");
  const [error, setError] = useState<string | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetter | null>(null);

  // Admin Statistics Modal State
  const [isAdminStatsOpen, setIsAdminStatsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      return search.includes("admin") || search.includes("stats") || search.includes("pin") || hash.includes("admin") || hash.includes("stats");
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handlePopState = () => {
        const search = window.location.search.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        if (search.includes("admin") || search.includes("stats") || hash.includes("admin")) {
          setIsAdminStatsOpen(true);
        }
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, []);

  // Form states
  const [formData, setFormData] = useState<UserFormInputs>({
    recipientName: "",
    gender: "M",
    nationality: "",
    italianLevel: "Basso",
    jobSought: "",
    zoneResident: "Ostia",
    zoneJobSought: "Ostia"
  });

  // Custom "Other" job field
  const [isOtherJob, setIsOtherJob] = useState(false);
  const [customJob, setCustomJob] = useState("");

  // Custom "Other" nationality field
  const [isOtherNationality, setIsOtherNationality] = useState(false);
  const [customNationality, setCustomNationality] = useState("");

  // Graphic theme selection state
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>("classic");

  // Loading state messages cycle
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const loadingMessages = [
    "Consultazione del repertorio territoriale...",
    "Selezione dei servizi pertinenti alla professione...",
    "Preparazione dei riferimenti territoriali disponibili...",
    "Selezione delle scuole di italiano gratuite per stranieri...",
    "Scrittura della lettera di accoglienza e di orientamento personalizzata...",
    "Traduzione automatica del testo per agevolare la persona nel suo percorso..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "loading") {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleInputChange = (field: keyof UserFormInputs, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const letterRequest = useRef(0);
  const jobReport = useRef<EntryReportHandle>(null);
  const nationalityReport = useRef<EntryReportHandle>(null);
  const [pendingReportDrafts, setPendingReportDrafts] = useState<{ label: string; href: string }[]>([]);
  const job = (isOtherJob ? customJob : formData.jobSought).trim();
  const nat = (isOtherNationality ? customNationality : formData.nationality).trim();
  const missingLetterFields = [
    !nat && "nazionalità",
    !job && "professione",
    !formData.zoneResident.trim() && "quartiere di residenza",
    !formData.zoneJobSought.trim() && "zona dove cercare lavoro",
  ].filter(Boolean);
  const [showJobBoards, setShowJobBoards] = useState(false);
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [openedJobSearch, setOpenedJobSearch] = useState("");
  const [includeJobLinks, setIncludeJobLinks] = useState(false);
  const [jobLinksInput, setJobLinksInput] = useState("");
  const jobSearchTerms = isOtherJob ? [job] : getJobSearchTerms(job);
  const selectedJobTerm = jobSearchTerms.includes(jobSearchTerm) ? jobSearchTerm : jobSearchTerms[0];
  const jobBoards = formData.zoneJobSought.trim() && selectedJobTerm
    ? getJobBoardLinks(selectedJobTerm, formData.zoneJobSought)
    : null;
  const searchKey = job + "\n" + formData.zoneJobSought.trim();
  const searchedCurrentSelection = !!jobBoards && openedJobSearch === searchKey;
  const selectedJobLinks = searchedCurrentSelection && includeJobLinks ? formatSelectedJobLinks(jobLinksInput) : "";

  function markSearchOpened() {
    if (!searchedCurrentSelection) {
      setIncludeJobLinks(false);
      setJobLinksInput("");
    }
    setOpenedJobSearch(searchKey);
    if (isOtherJob) void jobReport.current?.send();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (missingLetterFields.length) {
      setError("Completa questi campi: " + missingLetterFields.join(", ") + ".");
      return;
    }

    if (searchedCurrentSelection && includeJobLinks && !selectedJobLinks) {
      setError("Incolla almeno un link a un singolo annuncio oppure scegli No.");
      return;
    }

    const request = ++letterRequest.current;
    setPendingReportDrafts([]);
    const reports = [
      ...(isOtherNationality ? [{ report: nationalityReport.current, category: "nazionalita" as const, entry: nat, label: "Nazionalità" }] : []),
      ...(isOtherJob ? [{ report: jobReport.current, category: "mestiere" as const, entry: job, label: "Professione" }] : []),
    ];
    void Promise.all(reports.map(async item => {
      let accepted = false;
      try {
        accepted = (await item.report?.send()) === true;
      } catch {
        // The letter is already generated locally and the email can be retried manually.
      }
      return accepted ? null : { label: item.label, href: getEntryReportMailto(item.category, item.entry) };
    })).then(drafts => {
      if (request === letterRequest.current) setPendingReportDrafts(drafts.filter(draft => draft !== null));
    });
    setStep("loading");
    setLoadingMsgIndex(0);

    try {
      const payload = {
        ...formData,
        nationality: nat,
        jobSought: job,
        italianOnly: isOtherNationality,
        skipProfessionalMatching: isOtherJob,
      };

      const data: GeneratedLetter = generateLocalFallback(payload);
      if (selectedJobLinks) {
        data.italianLetter.cooperativesIntro += "\n\nANNUNCI SELEZIONATI\n\n" + selectedJobLinks;
      }

      // Save stat record locally as well
      saveLetterStat({
        recipientName: formData.recipientName || "Anonimo",
        gender: formData.gender || "M",
        nationality: nat,
        italianLevel: formData.italianLevel,
        jobSought: job,
        zoneResident: formData.zoneResident,
        zoneJobSought: formData.zoneJobSought,
        translationLanguage: data.translationLanguage || "Italiano",
        officinaOpportunity: false,
        cooperativesCount: data.cooperatives ? data.cooperatives.length : 0,
        publicOfficesCount: data.publicOffices ? data.publicOffices.length : 0,
        schoolsCount: data.italianSchools ? data.italianSchools.length : 0,
        isLocalFallback: data.isLocalFallback
      });

      setGeneratedLetter(data);
      setStep("result");
    } catch (err: any) {
      console.error("Errore nella generazione locale:", err);
      setError("Impossibile generare la lettera locale. Verificare i dati e riprovare.");
      setStep("error");
    }
  };

  const handleResetAll = () => {
    letterRequest.current += 1;
    setFormData({
      recipientName: "",
      gender: "M",
      nationality: "",
      italianLevel: "Basso",
      jobSought: "",
      zoneResident: "Ostia",
      zoneJobSought: "Ostia"
    });
    setShowJobBoards(false);
    setJobSearchTerm("");
    setOpenedJobSearch("");
    setPendingReportDrafts([]);
    setIncludeJobLinks(false);
    setJobLinksInput("");
    setIsOtherJob(false);
    setCustomJob("");
    setIsOtherNationality(false);
    setCustomNationality("");
    setGeneratedLetter(null);
    setError(null);
    setStep("form");
  };

  const t = THEMES[currentTheme];

  return (
    <div className={`min-h-screen ${t.bgClass} flex flex-col antialiased transition-colors duration-300`}>
      {/* Top Navbar */}
      <header className={`${t.headerBg} sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${t.logoBadgeBg} rounded-xl flex items-center justify-center text-sm ${t.logoBadgeText}`}>
              {t.logoBadgeContent}
            </div>
            <div>
              <h1 className="font-semibold text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                {t.headerTitle}
              </h1>
              <p className="text-xs opacity-80 font-medium">{t.headerSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminStatsOpen(true)}
              className="flex items-center gap-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer shadow-xs"
              title="Cerca e verifica uffici, indirizzi e telefoni"
            >
              <Search className="w-3.5 h-3.5 text-amber-600" />
              Cerca servizi
            </button>
            <div className="flex items-center gap-2 text-xs bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-full font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Consultazione libera
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col justify-center">
        
        {/* STEP 1: FORM */}
        {step === "form" && (
          <div className="space-y-4 max-w-6xl mx-auto w-full">
            
            {/* Compact Greeting & Guide Banner */}
            <div className={`${t.bannerBg} ${t.bannerBorder} rounded-2xl p-4 sm:p-5 border shadow-xs space-y-2`}>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 animate-spin-slow opacity-80" />
                <h2 className={`font-bold text-sm uppercase tracking-wide ${t.bannerTitleText}`}>
                  Scheda di Colloquio e Orientamento al Lavoro
                </h2>
              </div>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                Compila i dati essenziali, scegli professione e zona e genera una <strong>scheda Word di orientamento</strong>. Controlla recapiti, indirizzi e orari prima di consegnarla: il repertorio non è verificato in tempo reale.
              </p>
            </div>

            {/* Main Form Card (3-Column Desktop Grid for single-screen desktop fit, 1-Column Mobile) */}
            <div className={`${t.cardBg} ${t.cardBorder} ${t.cardShadow} rounded-2xl p-4 sm:p-6 transition-all border`}>
              <form noValidate onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* COLUMN 1: Informazioni Personali */}
                  <div className="space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5 ${t.sectionTitleColor}`}>
                        <User className="w-4 h-4" />
                        1. Persona
                      </h3>
                      
                      <div>
                        <label className={`block text-xs mb-1 ${t.labelColor}`}>Nome (facoltativo)</label>
                        <input
                          type="text"
                          placeholder="Es: Ahmed, Maria, ..."
                          value={formData.recipientName}
                          onChange={(e) => handleInputChange("recipientName", e.target.value)}
                          className={`w-full px-3 py-2 ${t.inputBg} border ${t.inputBorder} ${t.inputFocus} rounded-xl focus:outline-none text-xs font-medium`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs mb-1 ${t.labelColor}`}>Sesso / Genere *</label>
                        <select
                          value={formData.gender || "M"}
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                          className={`w-full px-3 py-2 ${t.inputBg} border ${t.inputBorder} ${t.inputFocus} rounded-xl focus:outline-none text-xs font-medium`}
                        >
                          <option value="M">Maschio</option>
                          <option value="F">Femmina</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-xs mb-1 ${t.labelColor}`}>Nazionalità *</label>
                        <select
                          value={isOtherNationality ? "Altro" : formData.nationality}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Altro") {
                              setIsOtherNationality(true);
                              handleInputChange("nationality", "Altro");
                            } else if (val === "Italia") {
                              setIsOtherNationality(false);
                              setFormData(prev => ({
                                ...prev,
                                nationality: "Italia",
                                italianLevel: "Alto"
                              }));
                            } else {
                              setIsOtherNationality(false);
                              handleInputChange("nationality", val);
                            }
                          }}
                          className={`w-full px-3 py-2 ${t.inputBg} border ${t.inputBorder} ${t.inputFocus} rounded-xl focus:outline-none text-xs font-medium`}
                        >
                          <option value="">-- Seleziona nazionalità --</option>
                          {NATIONALITIES_LIST.map((nat) => (
                            <option key={nat} value={nat}>{nat}</option>
                          ))}
                        </select>
                      </div>

                      {isOtherNationality && (
                        <div>
                          <label className={`block text-xs mb-1 ${t.labelColor}`}>Specifica Nazionalità *</label>
                          <input
                            type="text"
                            required
                            placeholder="Es: Vietnam, Messico..."
                            value={customNationality}
                            onChange={(e) => setCustomNationality(e.target.value)}
                            maxLength={120}
                            className={`w-full px-3 py-2 ${t.inputBg} border ${t.inputBorder} ${t.inputFocus} rounded-xl focus:outline-none text-xs font-medium`}
                          />
                          <MissingEntryReport ref={nationalityReport} category="nazionalita" value={customNationality} />
                        </div>
                      )}

                      <div className={formData.nationality === "Italia" ? "opacity-30 pointer-events-none transition-all" : "transition-all"}>
                        <label className={`block text-xs mb-1 ${t.labelColor}`}>
                          Conoscenza Lingua Italiana {formData.nationality === "Italia" ? "(Madrelingua)" : "*"}
                        </label>
                        <select
                          disabled={formData.nationality === "Italia"}
                          value={formData.nationality === "Italia" ? "Alto" : formData.italianLevel}
                          onChange={(e) => handleInputChange("italianLevel", e.target.value)}
                          className={`w-full px-3 py-2 ${t.inputBg} border ${t.inputBorder} ${t.inputFocus} rounded-xl focus:outline-none text-xs font-medium disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                          <option value="Alto">Alto (C1 - C2 / Madrelingua)</option>
                          <option value="Medio">Medio (B1 - B2)</option>
                          <option value="Basso">Basso (A1 - A2)</option>
                          <option value="Nessuna">Nessuna conoscenza</option>
                        </select>
                        {formData.nationality === "Italia" && (
                          <p className="text-[10px] opacity-70 mt-1 italic">Oscurato per cittadini italiani (Madrelingua)</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 2: Lavoro Cercato */}
                  <div className="space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5 ${t.sectionTitleColor}`}>
                        <Briefcase className="w-4 h-4" />
                        2. Lavoro Cercato
                      </h3>

                      <div>
                        <label className={`block text-xs mb-1 ${t.labelColor}`}>Seleziona Professione *</label>
                        <select
                          value={isOtherJob ? "Altro" : formData.jobSought}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Altro") {
                              setIsOtherJob(true);
                              handleInputChange("jobSought", "");
                            } else {
                              setIsOtherJob(false);
                              handleInputChange("jobSought", val);
                            }
                          }}
                          className={`w-full px-3 py-2 ${t.inputBg} border ${t.inputBorder} ${t.inputFocus} rounded-xl focus:outline-none text-xs font-medium`}
                        >
                          <option value="">-- Seleziona un ruolo --</option>
                          <option value="Badante (assistenza anziani)">Badante (assistenza anziani)</option>
                          <option value="Colf/pulizie (servizi domestici)">Colf/pulizie (servizi domestici)</option>
                          <option value="Facchino/magazziniere">Facchino/magazziniere</option>
                          <option value="Lavapiatti/aiuto cucina">Lavapiatti/aiuto cucina</option>
                          <option value="Pizzaiolo">Pizzaiolo</option>
                          <option value="Cuoco">Cuoco</option>
                          <option value="Muratore/Operaio edile">Muratore/Operaio edile</option>
                          <option value="Custode/portiere">Custode/portiere</option>
                          <option value="Cameriere/barista">Cameriere/barista</option>
                          <option value="Giardiniere">Giardiniere</option>
                          <option value="Segreteria (assistenza d'ufficio/reception)">Segreteria (assistenza d'ufficio/reception)</option>
                          <option value="Autista (conducente/fattorino)">Autista (conducente/fattorino)</option>
                          <option value="Altro">Altro</option>
                        </select>
                      </div>

                      {isOtherJob && (
                        <div>
                          <label className={`block text-xs mb-1 ${t.labelColor}`}>Specifica altro lavoro *</label>
                          <input
                            type="text"
                            required
                            placeholder="Es: Idraulico, Autista, Parrucchiere..."
                            value={customJob}
                            onChange={(e) => setCustomJob(e.target.value)}
                            maxLength={120}
                            className={`w-full px-3 py-2 ${t.inputBg} border ${t.inputBorder} ${t.inputFocus} rounded-xl focus:outline-none text-xs font-medium`}
                          />
                          <MissingEntryReport ref={jobReport} category="mestiere" value={customJob} />
                        </div>
                      )}

                    </div>
                  </div>

                  {/* COLUMN 3: Residenza & Logistica + Submit */}
                  <div className="space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-1.5 flex items-center gap-1.5 ${t.sectionTitleColor}`}>
                        <MapPin className="w-4 h-4" />
                        3. Residenza e Logistica a Roma
                      </h3>

                      <div>
                        <label className={`block text-xs mb-1 ${t.labelColor}`}>Quartiere o Zona dove abita *</label>
                        <input
                          type="text"
                          placeholder="Es: Ostia, Casilina, Municipio V, ..."
                          required
                          value={formData.zoneResident}
                          onChange={(e) => handleInputChange("zoneResident", e.target.value)}
                          className={`w-full px-3 py-2 ${t.inputBg} border ${t.inputBorder} ${t.inputFocus} rounded-xl focus:outline-none text-xs font-medium`}
                        />
                        <p className="text-[10px] opacity-60 mt-0.5">Identifica CPI e Scuole di Italiano più vicine.</p>
                      </div>

                      <div>
                        <label className={`block text-xs mb-1 ${t.labelColor}`}>Zona dove cerca lavoro *</label>
                        <input
                          type="text"
                          placeholder="Es: Tutta Roma, Ostia, Municipio I, ..."
                          required
                          value={formData.zoneJobSought}
                          onChange={(e) => handleInputChange("zoneJobSought", e.target.value)}
                          className={`w-full px-3 py-2 ${t.inputBg} border ${t.inputBorder} ${t.inputFocus} rounded-xl focus:outline-none text-xs font-medium`}
                        />
                        <p className="text-[10px] opacity-60 mt-0.5">Identifica le cooperative più vicine a quel territorio.</p>
                      </div>
                    </div>

                    <div>
                      <button type="button" aria-expanded={showJobBoards && !!jobBoards}
                        onClick={() => {
                          if (!jobBoards) {
                            setError(!job ? "Indica la professione da cercare." : "Indica la zona dove cercare lavoro.");
                            return;
                          }
                          setError(null);
                          setShowJobBoards(open => !open);
                        }}
                        className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold disabled:opacity-50">
                        <Search className="h-4 w-4" /> Cerca annunci di lavoro
                      </button>
                      {showJobBoards && jobBoards && (
                        <div className="mt-2 space-y-2 text-xs">
                          {jobSearchTerms.length > 1 && (
                            <label className="flex items-center gap-2">
                              Cerca come
                              <select value={selectedJobTerm} onChange={event => setJobSearchTerm(event.target.value)}
                                className={`rounded border px-2 py-1 ${t.inputBg}`}>
                                {jobSearchTerms.map(term => <option key={term}>{term}</option>)}
                              </select>
                            </label>
                          )}
                          <p>Apri i risultati filtrati sul portale. Per stamparli, premi Ctrl+P (⌘+P su Mac) nella scheda del portale.</p>
                          <div className="flex gap-3">
                            <a href={jobBoards.indeed} onClick={markSearchOpened} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Risultati Indeed ↗</a>
                            <a href={jobBoards.subito} onClick={markSearchOpened} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Risultati Subito ↗</a>
                          </div>
                        </div>
                      )}
                      {searchedCurrentSelection && (
                        <fieldset className="mt-3 space-y-2 text-xs">
                          <legend className="font-semibold">Aggiungere gli annunci scelti alla lettera?</legend>
                          <button type="button" aria-pressed={includeJobLinks} className="mr-3 underline" onClick={() => setIncludeJobLinks(true)}>Sì, aggiungi annunci</button>
                          <button type="button" aria-pressed={!includeJobLinks} className="underline" onClick={() => setIncludeJobLinks(false)}>No</button>
                          {includeJobLinks && (
                            <label className="block">
                              Incolla il link di ogni annuncio su una riga. Puoi scrivere il titolo prima del link.
                              <textarea rows={4} value={jobLinksInput} onChange={event => setJobLinksInput(event.target.value)}
                                className={`mt-1 block w-full rounded border p-2 ${t.inputBg}`} />
                            </label>
                          )}
                        </fieldset>
                      )}
                    </div>

                    {/* Submit Button inside Col 3 / bottom desktop layout */}
                    <div className="pt-2">
                      {isOtherNationality && (
                        <p className="mb-2 text-xs">La lettera sarà generata in italiano.</p>
                      )}
                      <button
                        type="submit"
                        className={`w-full px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm disabled:opacity-50 ${t.accentBtn}`}
                      >
                        Genera Lettera
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>

                  </div>

                </div>

                {/* Form Error Message */}
                {error && (
                  <div role="alert" className="p-3 bg-red-50 text-red-800 rounded-xl text-xs flex items-start gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-bold">Attenzione</p>
                      <p className="opacity-90">{error}</p>
                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>
        )}

        {step === "result" && pendingReportDrafts.length > 0 && (
          <div role="status" className="mb-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
            Il servizio email non ha confermato la segnalazione. Puoi inviarla dal tuo programma di posta.
            {pendingReportDrafts.map(draft => <a key={draft.label} href={draft.href} className="ml-2 underline">Apri bozza · {draft.label}</a>)}
          </div>
        )}

        {/* STEP 2: LOADING */}
        {step === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto min-h-[350px]" id="loading_screen">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-700/10 rounded-full blur-xl animate-pulse"></div>
              <div className={`relative w-16 h-16 ${t.cardBg} ${t.cardBorder} border rounded-2xl shadow-md flex items-center justify-center`}>
                <Compass className="w-8 h-8 text-blue-700 animate-spin" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-lg">Generazione in corso...</h3>
              <p className="text-xs opacity-60 font-mono tracking-wider uppercase">Inizializzazione Servizio AI</p>
            </div>

            <div className={`w-full ${t.cardBg} ${t.cardBorder} border rounded-2xl p-4 shadow-sm min-h-[80px] flex items-center justify-center`}>
              <p className="text-xs sm:text-sm animate-fade-in font-medium leading-relaxed opacity-90">
                {loadingMessages[loadingMsgIndex]}
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: RESULT EDITOR */}
        {step === "result" && generatedLetter && (
          <LetterEditor
            initialLetter={generatedLetter}
            onReset={handleResetAll}
          />
        )}

        {/* STEP 4: ERROR STATE */}
        {step === "error" && (
          <div className="max-w-xl mx-auto text-center space-y-6 py-12" id="error_screen">
            <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto border border-blue-200/50">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Errore di Generazione / Limite Quota Raggiunto</h3>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-md mx-auto">
                La richiesta ha riscontrato un limite temporaneo di quota API o un problema di connessione.
              </p>
              <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-200/40 text-left text-xs text-neutral-700 space-y-2">
                <p className="font-bold text-blue-800">💡 Soluzione Consigliata per gli Sportelli:</p>
                <p>Puoi generare <strong>immediatamente</strong> la stessa identica lettera compilata in ogni dettaglio utilizzando la nostra <strong>Generazione Locale Integrata</strong>. Contiene un database pre-caricato di scuole di italiano gratuite, centri per l'impiego territoriali e cooperative reali attive a Roma, pronti all'uso senza attese o consumi di rete.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={() => setStep("form")}
                className="px-5 py-2.5 bg-neutral-200/80 hover:bg-neutral-300 rounded-xl text-neutral-800 font-medium text-xs transition-all cursor-pointer"
              >
                Modifica Dati Inseriti
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-black/10 dark:border-white/10 py-6 mt-8 text-center text-xs opacity-80">
        <div className="max-w-2xl mx-auto px-4 mb-4">
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium px-4 py-3 rounded-xl shadow-2xs">
            Per qualsiasi segnalazione di malfunzionamento o per suggerimenti inviare mail a{" "}
            <a href="mailto:dipenew@gmail.com" className="font-bold underline underline-offset-2">
              dipenew@gmail.com
            </a>{" "}
            . grazie
          </div>
        </div>
        <p>© {new Date().getFullYear()} Servizio Orientamento Lavoro Roma. Tutti i diritti riservati.</p>
        <p className="mt-1 opacity-60">Sviluppato per supportare i volontari nei servizi di orientamento locali.</p>
        <button
          onClick={() => setIsAdminStatsOpen(true)}
          className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 opacity-50 hover:opacity-100 underline transition-opacity"
        >
          Accesso Riservato Amministratore (PIN)
        </button>
      </footer>

      {/* Admin Statistics Reserved Area Modal */}
      <AdminStatsModal
        isOpen={isAdminStatsOpen}
        onClose={() => setIsAdminStatsOpen(false)}
        accentBtnClass={t.accentBtn}
      />
    </div>
  );
}
