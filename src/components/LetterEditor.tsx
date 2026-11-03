import React, { useState } from "react";
import { GeneratedLetter, Cooperative, PublicOffice, ItalianSchool } from "../types";
import { generateWordDocument, getUsefulSitesAndApps } from "../lib/wordGenerator";
import { saveCustomCooperative, saveCustomPublicOffice, saveCustomItalianSchool, getMunicipioFromZone, municipioOffices, municipioSchools, queryLocalDb } from "../lib/localDb";
import { Download, RefreshCw, Plus, Trash2, Globe, Heart, Eye, FileText, Check, Search, Building2, MapPin, AlertCircle, Loader2, Phone, ExternalLink, Database, X } from "lucide-react";

function getLabel(key: "Address" | "Phone" | "Hours" | "Annex" | "ContactDetails" | "A" | "B" | "C", lang: string): string {
  const labels: Record<string, Record<string, string>> = {
    english: {
      Address: "Address", Phone: "Phone", Hours: "Hours",
      Annex: "ANNEX: USEFUL CONTACTS IN THE ROME AREA",
      ContactDetails: "Contact details of the orientation services mentioned in the letter",
      A: "A. Recommended Social Cooperatives and Placement Agencies (Ten)",
      B: "B. Employment Centers and Job Orientation Centers (COL)",
      C: "C. Free Italian Language Courses for Foreigners"
    },
    french: {
      Address: "Adresse", Phone: "Téléphone", Hours: "Horaires",
      Annex: "ANNEXE : CONTACTS UTILES DANS LA RÉGION DE ROME",
      ContactDetails: "Coordonnées dei services d'orientation mentionnés dans la lettre",
      A: "A. Coopératives sociales et agences de placement recommandées (Dix)",
      B: "B. Centres pour l'Emploi et Centres d'Orientation Professionnelle (COL)",
      C: "C. Cours d'italien gratuits pour les étrangers"
    },
    spanish: {
      Address: "Dirección", Phone: "Teléfono", Hours: "Horarios",
      Annex: "ANEXO: CONTACTOS ÚTILES EN EL ÁREA DE ROMA",
      ContactDetails: "Datos de contacto de los servicios de orientación mencionados en la carta",
      A: "A. Cooperativas sociales y agencias de empleo recomendadas (Diez)",
      B: "B. Centros de Empleo y Centros de Orientación Laboral (COL)",
      C: "C. Cursos gratuitos de lengua italiana para extranjeros"
    },
    romanian: {
      Address: "Adresă", Phone: "Telefon", Hours: "Program",
      Annex: "ANEXĂ: CONTACTE UTILE ÎN ZONA ROMEI",
      ContactDetails: "Datele de contact ale serviciilor de orientare menționate în scrisoare",
      A: "A. Cooperative sociale și agenții de plasare recomandate (Zece)",
      B: "B. Centre de Ocupare a Forței de Muncă și Centre de Orientare Profesională (COL)",
      C: "C. Cursuri gratuite de limba italiană pentru străini"
    },
    ukrainian: {
      Address: "Адреса", Phone: "Телефон", Hours: "Години роботи",
      Annex: "ДОДАТОК: КОРИСНІ КОНТАКТИ В РИМІ",
      ContactDetails: "Контактні дані служб орієнтації, згаданих у листі",
      A: "А. Рекомендовані соціальні кооперативи та агенції з працевлаштування (Десять)",
      B: "Б. Центри зайнятості та Центри професійної орієнтації (COL)",
      C: "В. Безкоштовні курси італійської мови для іноземців"
    },
    arabic: {
      Address: "العنوان", Phone: "الهاتف", Hours: "ساعات العمل",
      Annex: "ملحق: جهات اتصال مفيدة في منطقة روما",
      ContactDetails: "بيانات الاتصال بخدمات التوجيه المذكورة في الرسالة",
      A: "أ. التعاونيات الاجتماعية ووكالات التوظيف الموصى بها (عشرة)",
      B: "ب. مكاتب العمل ومراكز التوجيه المهني (COL)",
      C: "ج. دورات لغة إيطالية مجانية للأجانب"
    },
    cingalese: {
      Address: "ලිපිනය", Phone: "දුරකථන", Hours: "පැය",
      Annex: "ඇමුණුම: රෝම ප්‍රදේශයේ ප්‍රයෝජනවත් සම්බන්ධතා",
      ContactDetails: "ලිපියේ සඳහን කර ඇති දිශානති සේවාවන්හි සම්බන්ධතා තොරතුරු",
      A: "A. නිර්දේශිත සමාජ සමුපකාර සහ රැකියා නියෝජිත ආයතන (දහයක්)",
      B: "B. රැකියා මධ්‍යස්ථාන සහ රැකියා දිශානති මධ්‍යස්ථාන (COL)",
      C: "C. විදේශිකයන් සඳහා නොමිලේ ඉතාලි භාෂා පාඨමාලා"
    },
    polish: {
      Address: "Adres", Phone: "Telefon", Hours: "Godziny otwarcia",
      Annex: "ZAŁĄCZNIK: PRZYDATNE KONTAKTY W REJONIE RZYMU",
      ContactDetails: "Dane kontaktowe punktów orientacji zawodowej wymienionych w liście",
      A: "A. Zalecane Spółdzielnie Socjalne i Agencje Pracy (Dziesięć)",
      B: "B. Urzędy Pracy i Centra Orientacji Zawodowej (COL)",
      C: "C. Bezpłatne Kursy Języka Włoskiego dla Cudzoziemców"
    }
  };
  const keyMap = {
    "Francese": "french",
    "Spagnolo": "spanish",
    "Rumeno": "romanian",
    "Ucraino": "ukrainian",
    "Arabo": "arabic",
    "Arabic": "arabic",
    "Egiziano": "arabic",
    "Egitto": "arabic",
    "Cingalese": "cingalese",
    "Sinhalese": "cingalese",
    "Polacco": "polish",
    "Polish": "polish"
  };
  const norm = (lang || "").toLowerCase().trim();
  const resolved = keyMap[lang as keyof typeof keyMap] || (
    norm.includes("arab") || norm.includes("egiz") || norm.includes("egitt") || norm.includes("egypt") ? "arabic" : "english"
  );
  return labels[resolved]?.[key] || labels.english[key] || key;
}

const getSectionLabelText = (key: "A" | "B" | "C", lang: string, isAltro: boolean, hasSchools: boolean) => {
  const original = getLabel(key, lang);
  if (!isAltro) return original;
  if (key === "B") {
    return original.replace(/^B\./, "A.").replace(/^Б\./, "А.").replace(/^ب\./, "أ.");
  }
  if (key === "C") {
    return original.replace(/^C\./, "B.").replace(/^В\./, "Б.").replace(/^ج\./, "ب.");
  }
  return original;
};

function getTranslatedHeader(lang: string): { title: string; subtitle: string } {
  const norm = (lang || "").toLowerCase();
  if (norm.includes("ingl") || norm.includes("engl")) {
    return {
      title: "ADVICE FOR JOB HUNTING",
      subtitle: "Job Orientation Service"
    };
  }
  if (norm.includes("spag") || norm.includes("span")) {
    return {
      title: "CONSEJOS PARA BUSCAR EMPLEO",
      subtitle: "Servicio de Orientación Laboral"
    };
  }
  if (norm.includes("fran")) {
    return {
      title: "CONSEILS POUR CHERCHER UN EMPLOI",
      subtitle: "Service d'Orientation Professionnelle"
    };
  }
  if (norm.includes("rumen") || norm.includes("romanian")) {
    return {
      title: "SFATURI PENTRU CĂUTAREA UNUI LOC DE MUNCĂ",
      subtitle: "Serviciul de Orientare Profesională"
    };
  }
  if (norm.includes("ucra") || norm.includes("ukrain")) {
    return {
      title: "ПОРАДИ ЩОДО ПОШУКУ РОБОТИ",
      subtitle: "Служба професійної орієнтації"
    };
  }
  if (norm.includes("arab") || norm.includes("egiz") || norm.includes("egitt") || norm.includes("egypt")) {
    return {
      title: "نصائح للبحث عن عمل",
      subtitle: "خدمة التوجيه المهني"
    };
  }
  if (norm.includes("cing") || norm.includes("sinha")) {
    return {
      title: "රැකියාවක් සෙවීම සඳහා උපදෙස්",
      subtitle: "රැකියා දිශානති සේවාව"
    };
  }
  if (norm.includes("pola") || norm.includes("polacc") || norm.includes("polish")) {
    return {
      title: "WSKAZÓWKI DOTYCZĄCE POSZUKIWANIA PRACY",
      subtitle: "Usługa Orientacji Zawodowej"
    };
  }
  return {
    title: "ADVICE FOR JOB HUNTING",
    subtitle: "Job Orientation Service"
  };
}

function getOfficinaOpportunityText(lang: string): { title: string; line: string } {
  const norm = (lang || "").toLowerCase();
  if (norm.includes("ingl") || norm.includes("engl")) {
    return {
      title: "Opportunity from CARITAS to which you have been nominated",
      line: "Opp. No.: ____   |   Job type: ____________________________________________________________________"
    };
  }
  if (norm.includes("spag") || norm.includes("span")) {
    return {
      title: "Oportunidad de CARITAS a la que te hemos postulado",
      line: "N. Oportunidad: ____   |   Tipo de trabajo: ____________________________________________________________________"
    };
  }
  if (norm.includes("fran")) {
    return {
      title: "Opportunité de CARITAS à laquelle nous vous avons candidaté",
      line: "N° Opp. : ____   |   Type de travail : ____________________________________________________________________"
    };
  }
  if (norm.includes("rumen") || norm.includes("romanian")) {
    return {
      title: "Oportunitatea de la CARITAS la care te-am candidat",
      line: "Nr. Opp.: ____   |   Tipul de muncă: ____________________________________________________________________"
    };
  }
  if (norm.includes("ucra") || norm.includes("ukrain")) {
    return {
      title: "Можливість від CARITAS, на яку вас було висунуто",
      line: "№ Можливості: ____   |   Тип роботи: ____________________________________________________________________"
    };
  }
  if (norm.includes("arab") || norm.includes("egiz") || norm.includes("egitt") || norm.includes("egypt")) {
    return {
      title: "فرصة CARITAS التي قمنا بترشيحك لها",
      line: "رقم الفرصة: ____   |   نوع العمل: ____________________________________________________________________"
    };
  }
  if (norm.includes("cing") || norm.includes("sinha")) {
    return {
      title: "ඔබව ඉදිරිපත් කරන ලද CARITAS හි අවස්ථාව",
      line: "අවස්ථා අංකය: ____   |   රැකියා වර්ගය: ____________________________________________________________________"
    };
  }
  if (norm.includes("pola") || norm.includes("polacc") || norm.includes("polish")) {
    return {
      title: "Oferta z CARITAS, na którą zgłosiliśmy Twoją kandydaturę",
      line: "Nr Oferty: ____   |   Rodzaj pracy: ____________________________________________________________________"
    };
  }
  return {
    title: "Opportunità della CARITAS a cui ti abbiamo candidato",
    line: "N. Opp.: ____   |   Tipo di lavoro: ____________________________________________________________________"
  };
}

interface LetterEditorProps {
  initialLetter: GeneratedLetter;
  onReset: () => void;
}

export default function LetterEditor({ initialLetter, onReset }: LetterEditorProps) {
  const [letter, setLetter] = useState<GeneratedLetter>(initialLetter);
  const isAltro = letter.cooperatives.length === 0;
  const isArabic = (letter.translationLanguage || "").toLowerCase().includes("arab") || 
                   (letter.translationLanguage || "").toLowerCase().includes("egiz") || 
                   (letter.translationLanguage || "").toLowerCase().includes("egitt");
  const [activeTab, setActiveTab] = useState<"anteprima" | "italiano" | "traduzione" | "cooperative" | "uffici" | "scuole" | "siti_app" | "ricerca_municipio">("anteprima");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSearchingMunicipio, setIsSearchingMunicipio] = useState(false);
  const [municipioSearchError, setMunicipioSearchError] = useState<string | null>(null);

  // Google Search & DB Insertion Modal State
  const [modalCategory, setModalCategory] = useState<"cooperative" | "office" | "school" | null>(null);
  const [modalSuccessMsg, setModalSuccessMsg] = useState<string | null>(null);
  const [newEntity, setNewEntity] = useState({
    type: "Centro per l'Impiego",
    name: "",
    address: "",
    phone: "",
    email: "",
    hours: "",
    description: "",
    municipio: "Municipio I",
    saveToDb: true
  });

  const handleOpenGoogleSearch = (category: "cooperative" | "office" | "school") => {
    let query = "";
    let jobSought = "";
    if (letter.subject && letter.subject.includes("per ")) {
      jobSought = letter.subject.split("per ")[1];
    }

    if (category === "office") {
      query = `Centro per l'Impiego COL Roma ${jobSought || ""}`;
    } else if (category === "cooperative") {
      query = `cooperative sociali agenzie lavoro ${jobSought || ""} Roma`;
    } else {
      query = `scuola italiano L2 CPIA stranieri Roma`;
    }

    const url = `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`;
    window.open(url, "_blank");
  };

  const handleOpenAddModal = (category: "cooperative" | "office" | "school") => {
    setModalCategory(category);
    setModalSuccessMsg(null);
    setNewEntity({
      type: category === "office" ? "Centro per l'Impiego" : "Struttura",
      name: "",
      address: "",
      phone: "",
      email: "",
      hours: category === "office" ? "Lun - Ven: 09:00 - 12:30" : "Lun - Ven: 09:00 - 13:00",
      description: "",
      municipio: "Municipio I",
      saveToDb: true
    });
  };

  const handleSaveNewEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntity.name.trim()) return;

    if (modalCategory === "cooperative") {
      const coop: Cooperative = {
        name: newEntity.name.trim(),
        address: newEntity.address.trim() || "Roma",
        phone: newEntity.phone.trim() || "Non specificato",
        email: newEntity.email.trim(),
        hours: newEntity.hours.trim() || "Lun - Ven: 09:00 - 13:00",
        description: newEntity.description.trim() || "Servizi sociali e supporto al lavoro"
      };
      setLetter(prev => ({ ...prev, cooperatives: [...prev.cooperatives, coop] }));

      if (newEntity.saveToDb) {
        saveCustomCooperative({
          ...coop,
          municipio: newEntity.municipio || "Municipio I"
        });
      }
    } else if (modalCategory === "office") {
      const office: PublicOffice = {
        type: newEntity.type.trim() || "Centro per l'Impiego",
        name: newEntity.name.trim(),
        address: newEntity.address.trim() || "Roma",
        phone: newEntity.phone.trim() || "Non specificato",
        email: newEntity.email.trim(),
        hours: newEntity.hours.trim() || "Lun - Ven: 09:00 - 12:30",
        description: newEntity.description.trim() || "Ufficio pubblico territoriale di supporto all'occupazione"
      };
      setLetter(prev => ({ ...prev, publicOffices: [...prev.publicOffices, office] }));

      if (newEntity.saveToDb) {
        saveCustomPublicOffice({
          ...office,
          municipio: newEntity.municipio || "Municipio I"
        });
      }
    } else if (modalCategory === "school") {
      const school: ItalianSchool = {
        name: newEntity.name.trim(),
        address: newEntity.address.trim() || "Roma",
        phone: newEntity.phone.trim() || "Non specificato",
        email: newEntity.email.trim(),
        hours: newEntity.hours.trim() || "Corsi settimanali",
        description: newEntity.description.trim() || "Scuola di lingua e alfabetizzazione per stranieri"
      };
      setLetter(prev => ({
        ...prev,
        italianSchools: [...(prev.italianSchools || []), school]
      }));

      if (newEntity.saveToDb) {
        saveCustomItalianSchool({
          ...school,
          municipio: newEntity.municipio || "Municipio I"
        });
      }
    }

    setModalSuccessMsg("✓ Struttura inserita nella lettera e salvata nel Database locale!");
    setTimeout(() => {
      setModalCategory(null);
      setModalSuccessMsg(null);
    }, 1200);
  };

  const runMunicipioSearch = async () => {
    setIsSearchingMunicipio(true);
    setMunicipioSearchError(null);
    try {
      // Get the job sought from the subject or letter details
      let jobSought = "giardiniere";
      if (letter.subject && letter.subject.includes("per ")) {
        jobSought = letter.subject.split("per ")[1];
      } else {
        jobSought = "giardiniere";
      }

      // Ricerca interamente locale per i 15 municipi di Roma.
      const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
      const municipi = numerals.map(n => {
        const municipio = `Municipio ${n}`;
        return {
          municipio,
          offices: municipioOffices[municipio] || [],
          schools: municipioSchools[municipio] || [],
          cooperatives: queryLocalDb(jobSought, municipio, municipio)
        };
      });

      setLetter(prev => ({
        ...prev,
        municipiResults: municipi
      }));
    } catch (err: any) {
      console.error("Error in Municipio Search:", err);
      setMunicipioSearchError(err.message || "Errore sconosciuto durante la ricerca.");
    } finally {
      setIsSearchingMunicipio(false);
    }
  };

  // Handlers for main text edits
  const handleMainFieldChange = (field: keyof GeneratedLetter, value: any) => {
    setLetter((prev) => ({ ...prev, [field]: value }));
  };

  const handleItalianLetterChange = (field: keyof typeof letter.italianLetter, value: string) => {
    setLetter((prev) => ({
      ...prev,
      italianLetter: { ...prev.italianLetter, [field]: value },
    }));
  };

  const handleTranslatedLetterChange = (field: keyof typeof letter.italianLetter, value: string) => {
    if (!letter.translatedLetter) return;
    setLetter((prev) => ({
      ...prev,
      translatedLetter: { ...prev.translatedLetter!, [field]: value },
    }));
  };

  // Cooperatives list managers
  const handleCooperativeChange = (index: number, field: keyof Cooperative, value: string) => {
    const updated = [...letter.cooperatives];
    updated[index] = { ...updated[index], [field]: value };
    setLetter((prev) => ({ ...prev, cooperatives: updated }));
  };

  const addCooperative = () => {
    const newCoop: Cooperative = {
      name: "Nuova Cooperativa",
      address: "Indirizzo",
      phone: "Telefono",
      hours: "Orari",
      description: "Descrizione del servizio offerto",
    };
    setLetter((prev) => ({ ...prev, cooperatives: [...prev.cooperatives, newCoop] }));
  };

  const removeCooperative = (index: number) => {
    const updated = letter.cooperatives.filter((_, i) => i !== index);
    setLetter((prev) => ({ ...prev, cooperatives: updated }));
  };

  // Public offices list managers
  const handleOfficeChange = (index: number, field: keyof PublicOffice, value: string) => {
    const updated = [...letter.publicOffices];
    updated[index] = { ...updated[index], [field]: value };
    setLetter((prev) => ({ ...prev, publicOffices: updated }));
  };

  const addOffice = () => {
    const newOffice: PublicOffice = {
      type: "Ufficio",
      name: "Nuovo Ufficio / Centro",
      address: "Indirizzo",
      phone: "Telefono",
      hours: "Orari",
      description: "Dettaglio dell'assistenza offerta",
    };
    setLetter((prev) => ({ ...prev, publicOffices: [...prev.publicOffices, newOffice] }));
  };

  const removeOffice = (index: number) => {
    const updated = letter.publicOffices.filter((_, i) => i !== index);
    setLetter((prev) => ({ ...prev, publicOffices: updated }));
  };

  // Schools list managers
  const handleSchoolChange = (index: number, field: keyof ItalianSchool, value: string) => {
    if (!letter.italianSchools) return;
    const updated = [...letter.italianSchools];
    updated[index] = { ...updated[index], [field]: value };
    setLetter((prev) => ({ ...prev, italianSchools: updated }));
  };

  const addSchool = () => {
    const newSchool: ItalianSchool = {
      name: "Nuova Scuola di Italiano",
      address: "Indirizzo",
      phone: "Telefono",
      hours: "Orari",
      description: "Dettagli sul corso gratuito",
    };
    setLetter((prev) => ({
      ...prev,
      italianSchools: [...(prev.italianSchools || []), newSchool],
    }));
  };

  const removeSchool = (index: number) => {
    if (!letter.italianSchools) return;
    const updated = letter.italianSchools.filter((_, i) => i !== index);
    setLetter((prev) => ({ ...prev, italianSchools: updated }));
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await generateWordDocument(letter);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Lettera_Orientamento_${letter.recipientName.replace(/\s+/g, "_") || "Utente"}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting document:", error);
      alert("Errore durante l'esportazione del file Word. Riprova.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Format and render preview text lines
  const renderFormattedPreviewText = (text: string, isItalic = false, isRed = false) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-3 sm:h-4 no-print-break-indicator" />;
      
      const isBullet = /^\d+\.\s+[A-Z]{3,}/.test(trimmed) || /^\d+\.\s+/.test(trimmed);
      
      if (isBullet) {
        // Highlight title portion before colon
        const colonIdx = trimmed.indexOf(":");
        if (colonIdx !== -1) {
          const title = trimmed.substring(0, colonIdx + 1);
          const body = trimmed.substring(colonIdx + 1);
          return (
            <p key={idx} className={`print-paragraph text-justify text-[14px] sm:text-[15px] text-neutral-800 leading-relaxed sm:leading-loose mb-4 pl-6 -indent-6 ${isItalic ? "italic" : ""} ${isRed ? "text-blue-700 font-semibold" : ""}`}>
              <strong className="text-neutral-900 font-bold">{title}</strong>{body}
            </p>
          );
        }
        return (
          <p key={idx} className={`print-paragraph text-justify text-[14px] sm:text-[15px] text-neutral-800 leading-relaxed sm:leading-loose mb-4 pl-6 -indent-6 ${isItalic ? "italic" : ""} ${isRed ? "text-blue-700 font-semibold" : ""}`}>
            {trimmed}
          </p>
        );
      }
      
      return (
        <p key={idx} className={`print-paragraph text-justify text-[14px] sm:text-[15px] text-neutral-800 leading-relaxed sm:leading-loose mb-4 ${isItalic ? "italic" : ""} ${isRed ? "text-blue-700 font-medium" : ""}`}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" id="letter_editor_container">
      {/* Top Banner Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-blue-700" />
            <h2 className="text-xl font-semibold text-neutral-800">
              Lettera Generata per {letter.recipientName || "Utente"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500">
            Orientamento lavorativo come <strong className="text-neutral-700">{letter.subject.split("per ")[1] || "il profilo richiesto"}</strong>. Puoi modificare qualsiasi dato prima di esportare.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={onReset}
            className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-all font-medium flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Nuovo Colloquio
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium transition-all shadow-md shadow-blue-700/10 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Esportazione..." : "Scarica Word (.docx)"}
          </button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm h-fit">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-3">Sezioni Documento</p>
          
          <button
            onClick={() => setActiveTab("anteprima")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-between cursor-pointer ${
              activeTab === "anteprima"
                ? "bg-neutral-900 text-white font-semibold"
                : "text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Anteprima Stampa</span>
            </span>
            <span className="text-[10px] bg-blue-700 text-white px-1.5 py-0.5 rounded-md font-bold">LIVE</span>
          </button>

          <div className="h-px bg-neutral-100 my-2" />

          <button
            onClick={() => setActiveTab("italiano")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-between cursor-pointer ${
              activeTab === "italiano"
                ? "bg-blue-50 text-blue-800 border-l-4 border-blue-700"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-400" />
              <span>Lettera (Italiano)</span>
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-md">IT</span>
          </button>

          {letter.hasTranslation && (
            <button
              onClick={() => setActiveTab("traduzione")}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-between cursor-pointer ${
                activeTab === "traduzione"
                  ? "bg-blue-50 text-blue-800 border-l-4 border-blue-700"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-neutral-400" />
                <span className="truncate">Lettera ({letter.translationLanguage})</span>
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">TRAD</span>
            </button>
          )}

          {!isAltro && (
            <button
              onClick={() => setActiveTab("cooperative")}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-between cursor-pointer ${
                activeTab === "cooperative"
                  ? "bg-blue-50 text-blue-800 border-l-4 border-blue-700"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <span>1. Cooperative</span>
              <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-md">
                {letter.cooperatives.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("uffici")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-between cursor-pointer ${
              activeTab === "uffici"
                ? "bg-blue-50 text-blue-800 border-l-4 border-blue-700"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <span>{isAltro ? "1. Servizi Pubblici" : "2. Servizi Pubblici"}</span>
            <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-md">
              {letter.publicOffices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("scuole")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-between cursor-pointer ${
              activeTab === "scuole"
                ? "bg-blue-50 text-blue-800 border-l-4 border-blue-700"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <span>{isAltro ? "2. Scuole d'Italiano" : "3. Scuole d'Italiano"}</span>
            <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-md">
              {letter.italianSchools?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("siti_app")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-between cursor-pointer ${
              activeTab === "siti_app"
                ? "bg-blue-50 text-blue-800 border-l-4 border-blue-700"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <span>{isAltro ? (letter.italianSchools && letter.italianSchools.length > 0 ? "3. Siti e App Consigliati" : "2. Siti e App Consigliati") : "4. Siti e App Consigliati"}</span>
            <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-md">
              {getUsefulSitesAndApps("italian").websites.length + getUsefulSitesAndApps("italian").apps.length}
            </span>
          </button>
        </div>

        {/* Editing & Preview Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-6">
          
          {/* Metadata details edit (Only if not in preview tab) */}
          {activeTab !== "anteprima" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-neutral-100">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Destinatario della Lettera</label>
                <input
                  type="text"
                  value={letter.recipientName}
                  onChange={(e) => handleMainFieldChange("recipientName", e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Oggetto della Lettera</label>
                <input
                  type="text"
                  value={letter.subject}
                  onChange={(e) => handleMainFieldChange("subject", e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB: ANTEPRIMA DI STAMPA */}
          {activeTab === "anteprima" && (
            <div className="space-y-6">
              <div className="border-b border-neutral-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800">Anteprima di Stampa Interattiva</h3>
                  <p className="text-xs text-neutral-500">
                    Sfoglia il foglio A4 con spaziatura ottimizzata e alta leggibilità.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-[11px] bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full font-mono hidden md:block">
                    A4 Layout • Arial • Interlinea 1.6
                  </div>
                </div>
              </div>

              {/* paper layout visualizer */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-2 sm:p-6 overflow-x-auto">
                <div id="printable_letter_area" className="bg-white shadow-md border border-neutral-200/60 mx-auto w-full max-w-[21cm] p-5 sm:p-12 text-neutral-800 font-sans space-y-6 select-text text-sm rounded">
                  
                  {/* PAGE 1: ITALIAN LETTER */}
                  <div className="space-y-5">
                    {/* Header stamp */}
                    <div className="text-center space-y-1">
                      <h1 className="text-base sm:text-lg font-bold text-blue-700 tracking-tight print-header-title">CONSIGLI PER CERCARE LAVORO</h1>
                      <p className="text-[10px] sm:text-xs italic text-neutral-500">Servizio di Orientamento Lavoro</p>
                      <div className="w-full border-b border-neutral-200 pt-1.5" />
                    </div>

                    {/* Meta info */}
                    <div className="text-xs sm:text-sm space-y-1 text-neutral-700 font-mono bg-neutral-50/70 p-3 rounded-lg border border-neutral-100 print-avoid-break">
                      <p><strong>Destinatario:</strong> {letter.recipientName || "Gentile Utente"}</p>
                      <p><strong>Oggetto:</strong> {letter.subject}</p>
                      <p><strong>Data dell'incontro:</strong> {new Date().toLocaleDateString("it-IT")}</p>
                    </div>

                    {/* Greeting */}
                    <p className="text-xs sm:text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-1.5">
                      {letter.italianLetter.greeting}
                    </p>

                    {/* Letter contents */}
                    <div className="space-y-3.5">
                      {renderFormattedPreviewText(letter.italianLetter.intro)}
                      {renderFormattedPreviewText(letter.italianLetter.cooperativesIntro)}
                      {renderFormattedPreviewText(letter.italianLetter.publicOfficesIntro)}
                      
                      {letter.italianSchools && letter.italianSchools.length > 0 && letter.italianLetter.schoolsIntro && (
                        renderFormattedPreviewText(letter.italianLetter.schoolsIntro, false, true)
                      )}
                      
                      {renderFormattedPreviewText(letter.italianLetter.conclusion)}
                    </div>
                  </div>

                  {/* Page Divider visualizer */}
                  <div className="relative py-6 my-10 flex items-center justify-center select-none no-print-break-indicator">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-dashed border-neutral-300"></div>
                    </div>
                    <span className="relative px-3 bg-neutral-50 text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider rounded-full border border-neutral-200 py-0.5">
                      Interruzione Pagina • Inizio Allegati
                    </span>
                  </div>
                  <div className="print-page-break" />

                  {/* PAGE 2: ANNEXES / ALLEGATI */}
                  <div className="space-y-6 pt-2">
                    <div className="text-center space-y-1 print-avoid-break">
                      <h2 className="text-sm sm:text-base font-bold text-neutral-800 tracking-tight print-section-title">ALLEGATO: CONTATTI UTILI SUL TERRITORIO DI ROMA</h2>
                      <p className="text-[10px] sm:text-xs italic text-neutral-500">Recapiti dei servizi di orientamento menzionati nella lettera</p>
                      <div className="w-full border-b border-neutral-200 pt-1.5" />
                    </div>

                    {/* Officina Opportunity section if selected */}
                    {letter.officinaOpportunity && (
                      <div className="space-y-1.5 p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl print-card print-avoid-break my-3">
                        <h3 className="text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wider">
                          Opportunità della CARITAS a cui ti abbiamo candidato
                        </h3>
                        <p className="text-xs font-mono text-neutral-800 bg-white p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                          N. Opp.: ____ &nbsp;&nbsp;|&nbsp;&nbsp; Tipo di lavoro: ____________________________________________________________________
                        </p>
                      </div>
                    )}

                    {/* Section A: Cooperatives (10 entries) */}
                    {!isAltro && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-neutral-100 pb-1 print-section-title">
                          A. Cooperative e Strutture di Selezione Consigliate (Dieci)
                        </h3>
                        <div className="space-y-3">
                          {letter.cooperatives.map((coop, index) => (
                            <div key={index} className="print-card print-avoid-break text-xs sm:text-[13px] pl-4 border-l-2 border-neutral-300 space-y-1 py-1">
                              <p className="font-semibold text-neutral-900">{index + 1}. {coop.name}</p>
                              <p className="text-neutral-700 leading-normal"><span className="font-medium text-neutral-500">Indirizzo:</span> {coop.address}</p>
                              <p className="text-neutral-700 leading-normal">
                                <span className="font-medium text-neutral-500">Telefono:</span> {coop.phone} &nbsp;|&nbsp; <span className="font-medium text-neutral-500">Orari:</span> {coop.hours}
                                {coop.email && <> &nbsp;|&nbsp; <span className="font-medium text-neutral-500">Email:</span> {coop.email}</>}
                              </p>
                              <p className="text-neutral-600 italic text-[11px] sm:text-xs leading-relaxed pt-0.5">{coop.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section B: Public Offices */}
                    <div className="space-y-4 pt-4">
                      <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-neutral-100 pb-1 print-section-title">
                        {isAltro ? "A. Centri per l'Impiego e COL" : "B. Centri per l'Impiego e COL"}
                      </h3>
                      <div className="space-y-3">
                        {letter.publicOffices.map((office, index) => (
                          <div key={index} className="print-card print-avoid-break text-xs sm:text-[13px] pl-4 border-l-2 border-neutral-300 space-y-1 py-1">
                            <p className="font-semibold text-neutral-900">{index + 1}. {office.name} ({office.type})</p>
                            <p className="text-neutral-700 leading-normal"><span className="font-medium text-neutral-500">Indirizzo:</span> {office.address}</p>
                            <p className="text-neutral-700 leading-normal">
                              <span className="font-medium text-neutral-500">Telefono:</span> {office.phone} &nbsp;|&nbsp; <span className="font-medium text-neutral-500">Orari:</span> {office.hours}
                              {office.email && <> &nbsp;|&nbsp; <span className="font-medium text-neutral-500">Email:</span> {office.email}</>}
                            </p>
                            <p className="text-neutral-600 italic text-[11px] sm:text-xs leading-relaxed pt-0.5">{office.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section C: Italian Schools */}
                    {letter.italianSchools && letter.italianSchools.length > 0 && (
                      <div className="space-y-4 pt-4">
                        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-neutral-100 pb-1 print-section-title">
                          {isAltro ? "B. Corsi Gratuiti di Lingua Italiana per Stranieri" : "C. Corsi Gratuiti di Lingua Italiana per Stranieri"}
                        </h3>
                        <div className="space-y-3">
                          {letter.italianSchools.map((school, index) => (
                            <div key={index} className="print-card print-avoid-break text-xs sm:text-[13px] pl-4 border-l-2 border-neutral-300 space-y-1 py-1">
                              <p className="font-semibold text-neutral-900">{index + 1}. {school.name}</p>
                              <p className="text-neutral-700 leading-normal"><span className="font-medium text-neutral-500">Indirizzo:</span> {school.address}</p>
                              <p className="text-neutral-700 leading-normal">
                                <span className="font-medium text-neutral-500">Telefono:</span> {school.phone} &nbsp;|&nbsp; <span className="font-medium text-neutral-500">Orari:</span> {school.hours}
                                {school.email && <> &nbsp;|&nbsp; <span className="font-medium text-neutral-500">Email:</span> {school.email}</>}
                              </p>
                              <p className="text-neutral-600 italic text-[11px] sm:text-xs leading-relaxed pt-0.5">{school.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section D: Sites and Apps (Italian) */}
                    <div className="space-y-4 pt-4">
                      <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-neutral-100 pb-1 print-section-title">
                        {isAltro ? (letter.italianSchools && letter.italianSchools.length > 0 ? "C. Siti Internet e App Consigliati per la Ricerca del Lavoro" : "B. Siti Internet e App Consigliati per la Ricerca del Lavoro") : "D. Siti Internet e App Consigliati per la Ricerca del Lavoro"}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-2">SITI internet per cercare lavoro sul WEB:</p>
                          <div className="space-y-2">
                            {getUsefulSitesAndApps("italian").websites.map((site, index) => (
                              <div key={index} className="print-card print-avoid-break text-xs sm:text-[13px] pl-4 border-l-2 border-neutral-300 py-1">
                                <p className="font-semibold text-neutral-900">
                                  • {site.name} (<a href={site.url.startsWith("http") ? site.url : `https://${site.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{site.url}</a>)
                                </p>
                                <p className="text-neutral-600 italic text-[11px] sm:text-xs leading-relaxed">{site.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-2">APP specializzate per la ricerca del lavoro:</p>
                          <div className="space-y-2">
                            {getUsefulSitesAndApps("italian").apps.map((appItem, index) => (
                              <div key={index} className="print-card print-avoid-break text-xs sm:text-[13px] pl-4 border-l-2 border-neutral-300 py-1">
                                <p className="font-semibold text-neutral-900">• {appItem.name}</p>
                                <p className="text-neutral-600 italic text-[11px] sm:text-xs leading-relaxed">{appItem.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PAGE 3: TRANSLATED LETTER (ONLY IF RELEVANT) */}
                  {letter.hasTranslation && letter.translatedLetter && (
                    <>
                      {/* Page Divider visualizer */}
                      <div className="relative py-6 my-10 flex items-center justify-center select-none no-print-break-indicator">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-dashed border-neutral-300"></div>
                        </div>
                        <span className="relative px-3 bg-neutral-50 text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider rounded-full border border-neutral-200 py-0.5">
                          Interruzione Pagina • Traduzione Integrale ({letter.translationLanguage})
                        </span>
                      </div>
                      <div className="print-page-break" />

                      <div className={`space-y-5 ${isArabic ? "text-right" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
                        {/* Header stamp */}
                        <div className="text-center space-y-1">
                          <h1 className="text-base sm:text-lg font-bold text-blue-700 tracking-tight print-header-title">
                            {getTranslatedHeader(letter.translationLanguage).title}
                          </h1>
                          <p className="text-[10px] sm:text-xs italic text-neutral-500">
                            {getTranslatedHeader(letter.translationLanguage).subtitle}
                          </p>
                          <div className="w-full border-b border-neutral-200 pt-1.5" />
                        </div>

                        {/* Greeting translated */}
                        <p className={`text-xs sm:text-sm font-semibold italic text-neutral-900 pb-1 ${isArabic ? "text-right" : ""}`}>
                          {letter.translatedLetter.greeting}
                        </p>

                        {/* Translated body */}
                        <div className="space-y-3.5">
                          {renderFormattedPreviewText(letter.translatedLetter.intro, true)}
                          {renderFormattedPreviewText(letter.translatedLetter.cooperativesIntro, true)}
                          {renderFormattedPreviewText(letter.translatedLetter.publicOfficesIntro, true)}
                          
                          {letter.italianSchools && letter.italianSchools.length > 0 && letter.translatedLetter.schoolsIntro && (
                            renderFormattedPreviewText(letter.translatedLetter.schoolsIntro, true, true)
                          )}
                          
                          {renderFormattedPreviewText(letter.translatedLetter.conclusion, true)}
                        </div>
                      </div>

                      {/* PAGE 4: TRANSLATED ANNEXES */}
                      <div className="relative py-6 my-10 flex items-center justify-center select-none no-print-break-indicator">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-dashed border-neutral-300"></div>
                        </div>
                        <span className="relative px-3 bg-neutral-50 text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider rounded-full border border-neutral-200 py-0.5">
                          Interruzione Pagina • Allegati Tradotti ({letter.translationLanguage})
                        </span>
                      </div>
                      <div className="print-page-break" />

                      <div className="space-y-6 pt-2">
                        <div className="text-center space-y-1 print-avoid-break">
                          <h2 className="text-sm sm:text-base font-bold text-neutral-800 tracking-tight print-section-title">
                            {getLabel("Annex", letter.translationLanguage).toUpperCase()}
                          </h2>
                          <p className="text-[10px] sm:text-xs italic text-neutral-500">
                            {getLabel("ContactDetails", letter.translationLanguage)}
                          </p>
                          <div className="w-full border-b border-neutral-200 pt-1.5" />
                        </div>

                        {/* Translated Officina Opportunity section if selected */}
                        {letter.officinaOpportunity && (
                          <div className="space-y-1.5 p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl print-card print-avoid-break my-3">
                            <h3 className="text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wider">
                              {getOfficinaOpportunityText(letter.translationLanguage).title}
                            </h3>
                            <p className="text-xs font-mono text-neutral-800 bg-white p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                              {getOfficinaOpportunityText(letter.translationLanguage).line}
                            </p>
                          </div>
                        )}

                        {/* Section A: Cooperatives translated */}
                        {!isAltro && (
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-neutral-100 pb-1 print-section-title">
                              {getLabel("A", letter.translationLanguage)}
                            </h3>
                            <div className="space-y-3">
                              {letter.cooperatives.map((coop, index) => (
                                <div key={index} className="print-card print-avoid-break text-xs sm:text-[13px] pl-4 border-l-2 border-neutral-300 space-y-1 py-1">
                                  <p className="font-semibold text-neutral-900">{index + 1}. {coop.translatedName || coop.name}</p>
                                  <p className="text-neutral-700 leading-normal"><span className="font-medium text-neutral-500">{getLabel("Address", letter.translationLanguage)}:</span> {coop.address}</p>
                                  <p className="text-neutral-700 leading-normal">
                                    <span className="font-medium text-neutral-500">{getLabel("Phone", letter.translationLanguage)}:</span> {coop.phone} &nbsp;|&nbsp; <span className="font-medium text-neutral-500">{getLabel("Hours", letter.translationLanguage)}:</span> {coop.hours}
                                    {coop.email && <> &nbsp;|&nbsp; <span className="font-medium text-neutral-500">Email:</span> {coop.email}</>}
                                  </p>
                                  <p className="text-neutral-600 italic text-[11px] sm:text-xs leading-relaxed pt-0.5">{coop.translatedDescription || coop.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Section B: Public Offices translated */}
                        <div className="space-y-4 pt-4">
                          <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-neutral-100 pb-1 print-section-title">
                            {getSectionLabelText("B", letter.translationLanguage, isAltro, !!letter.italianSchools?.length)}
                          </h3>
                          <div className="space-y-3">
                            {letter.publicOffices.map((office, index) => (
                              <div key={index} className="print-card print-avoid-break text-xs sm:text-[13px] pl-4 border-l-2 border-neutral-300 space-y-1 py-1">
                                <p className="font-semibold text-neutral-900">{index + 1}. {office.translatedName || office.name} ({office.translatedType || office.type})</p>
                                <p className="text-neutral-700 leading-normal"><span className="font-medium text-neutral-500">{getLabel("Address", letter.translationLanguage)}:</span> {office.address}</p>
                                <p className="text-neutral-700 leading-normal">
                                  <span className="font-medium text-neutral-500">{getLabel("Phone", letter.translationLanguage)}:</span> {office.phone} &nbsp;|&nbsp; <span className="font-medium text-neutral-500">{getLabel("Hours", letter.translationLanguage)}:</span> {office.hours}
                                  {office.email && <> &nbsp;|&nbsp; <span className="font-medium text-neutral-500">Email:</span> {office.email}</>}
                                </p>
                                <p className="text-neutral-600 italic text-[11px] sm:text-xs leading-relaxed pt-0.5">{office.translatedDescription || office.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Section C: Italian Schools translated */}
                        {letter.italianSchools && letter.italianSchools.length > 0 && (
                          <div className="space-y-4 pt-4">
                            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-neutral-100 pb-1 print-section-title">
                              {getSectionLabelText("C", letter.translationLanguage, isAltro, !!letter.italianSchools?.length)}
                            </h3>
                            <div className="space-y-3">
                              {letter.italianSchools.map((school, index) => (
                                <div key={index} className="print-card print-avoid-break text-xs sm:text-[13px] pl-4 border-l-2 border-neutral-300 space-y-1 py-1">
                                  <p className="font-semibold text-neutral-900">{index + 1}. {school.translatedName || school.name}</p>
                                  <p className="text-neutral-700 leading-normal"><span className="font-medium text-neutral-500">{getLabel("Address", letter.translationLanguage)}:</span> {school.address}</p>
                                  <p className="text-neutral-700 leading-normal">
                                    <span className="font-medium text-neutral-500">{getLabel("Phone", letter.translationLanguage)}:</span> {school.phone} &nbsp;|&nbsp; <span className="font-medium text-neutral-500">{getLabel("Hours", letter.translationLanguage)}:</span> {school.hours}
                                    {school.email && <> &nbsp;|&nbsp; <span className="font-medium text-neutral-500">Email:</span> {school.email}</>}
                                  </p>
                                  <p className="text-neutral-600 italic text-[11px] sm:text-xs leading-relaxed pt-0.5">{school.translatedDescription || school.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Section D: Sites and Apps (Translated) */}
                        <div className="space-y-4 pt-4">
                          <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-neutral-100 pb-1 print-section-title">
                            {(() => {
                              const trans = getUsefulSitesAndApps(letter.translationLanguage);
                              if (!isAltro) return trans.sectionTitle;
                              const prefix = letter.italianSchools && letter.italianSchools.length > 0 ? "C." : "B.";
                              return trans.sectionTitle.replace(/^D\./, prefix).replace(/^Г\./, prefix === "C." ? "В." : "Б.");
                            })()}
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-2">
                                {getUsefulSitesAndApps(letter.translationLanguage).websitesTitle}
                              </p>
                              <div className="space-y-2">
                                {getUsefulSitesAndApps(letter.translationLanguage).websites.map((site, index) => (
                                  <div key={index} className="print-card print-avoid-break text-xs sm:text-[13px] pl-4 border-l-2 border-neutral-300 py-1">
                                    <p className="font-semibold text-neutral-900">
                                      • {site.name} {site.url ? `(${site.url})` : ""}
                                    </p>
                                    <p className="text-neutral-600 italic text-[11px] sm:text-xs leading-relaxed">{site.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider mb-2">
                                {getUsefulSitesAndApps(letter.translationLanguage).appsTitle}
                              </p>
                              <div className="space-y-2">
                                {getUsefulSitesAndApps(letter.translationLanguage).apps.map((appItem, index) => (
                                  <div key={index} className="print-card print-avoid-break text-xs sm:text-[13px] pl-4 border-l-2 border-neutral-300 py-1">
                                    <p className="font-semibold text-neutral-900">• {appItem.name}</p>
                                    <p className="text-neutral-600 italic text-[11px] sm:text-xs leading-relaxed">{appItem.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Stamp Footer */}
                  <div className="text-center pt-8 border-t border-neutral-100 text-[10px] sm:text-xs text-neutral-400 font-mono print-avoid-break">
                    SOL Roma Servizio Orientamento Lavoro • Documento Rilasciato il {new Date().toLocaleDateString("it-IT")}
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB: ITALIANO */}
          {activeTab === "italiano" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-neutral-800 border-b pb-2">Corpo Lettera in Italiano</h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Saluto Iniziale</label>
                <textarea
                  value={letter.italianLetter.greeting}
                  onChange={(e) => handleItalianLetterChange("greeting", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Introduzione e Sintesi Colloquio</label>
                <textarea
                  value={letter.italianLetter.intro}
                  onChange={(e) => handleItalianLetterChange("intro", e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Intro Sezione Cooperative (1)</label>
                <textarea
                  value={letter.italianLetter.cooperativesIntro}
                  onChange={(e) => handleItalianLetterChange("cooperativesIntro", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Intro Sezione Servizi Pubblici (2)</label>
                <textarea
                  value={letter.italianLetter.publicOfficesIntro}
                  onChange={(e) => handleItalianLetterChange("publicOfficesIntro", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm leading-relaxed"
                />
              </div>

              {letter.italianSchools && letter.italianSchools.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Intro Sezione Corsi di Italiano (3)</label>
                  <textarea
                    value={letter.italianLetter.schoolsIntro || ""}
                    onChange={(e) => handleItalianLetterChange("schoolsIntro", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm leading-relaxed"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Conclusione e Saluto Sportello</label>
                <textarea
                  value={letter.italianLetter.conclusion}
                  onChange={(e) => handleItalianLetterChange("conclusion", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB: TRADUZIONE */}
          {activeTab === "traduzione" && letter.translatedLetter && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold text-neutral-800 font-sans">
                  Traduzione Lettera in {letter.translationLanguage}
                </h3>
                <span className="text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full font-medium">
                  Traduzione Automatica Attiva
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Saluto Iniziale (Tradotto)</label>
                <textarea
                  value={letter.translatedLetter.greeting}
                  onChange={(e) => handleTranslatedLetterChange("greeting", e.target.value)}
                  rows={2}
                  dir={isArabic ? "rtl" : "ltr"}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Introduzione (Tradotto)</label>
                <textarea
                  value={letter.translatedLetter.intro}
                  onChange={(e) => handleTranslatedLetterChange("intro", e.target.value)}
                  rows={5}
                  dir={isArabic ? "rtl" : "ltr"}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Intro Sezione Cooperative (Tradotto)</label>
                <textarea
                  value={letter.translatedLetter.cooperativesIntro}
                  onChange={(e) => handleTranslatedLetterChange("cooperativesIntro", e.target.value)}
                  rows={4}
                  dir={isArabic ? "rtl" : "ltr"}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Intro Sezione Uffici Pubblici (Tradotto)</label>
                <textarea
                  value={letter.translatedLetter.publicOfficesIntro}
                  onChange={(e) => handleTranslatedLetterChange("publicOfficesIntro", e.target.value)}
                  rows={4}
                  dir={isArabic ? "rtl" : "ltr"}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm leading-relaxed"
                />
              </div>

              {letter.italianSchools && letter.italianSchools.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Intro Sezione Scuole (Tradotto)</label>
                  <textarea
                    value={letter.translatedLetter.schoolsIntro || ""}
                    onChange={(e) => handleTranslatedLetterChange("schoolsIntro", e.target.value)}
                    rows={3}
                    dir={isArabic ? "rtl" : "ltr"}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm leading-relaxed"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Conclusione (Tradotto)</label>
                <textarea
                  value={letter.translatedLetter.conclusion}
                  onChange={(e) => handleTranslatedLetterChange("conclusion", e.target.value)}
                  rows={4}
                  dir={isArabic ? "rtl" : "ltr"}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700/20 text-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB: COOPERATIVE */}
          {activeTab === "cooperative" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800">1. Cooperative & Strutture Consigliate</h3>
                  <p className="text-xs text-neutral-500">I 10 contatti reali selezionati per l'attività lavorativa richiesta.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleOpenGoogleSearch("cooperative")}
                    className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Cerca cooperative o agenzie su Google"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> 🔍 Cerca su Google
                  </button>
                  <button
                    onClick={() => handleOpenAddModal("cooperative")}
                    className="px-3 py-1.5 bg-blue-700 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Database className="w-3.5 h-3.5" /> ➕ Inserisci e Salva nel DB
                  </button>
                </div>
              </div>

              {/* Research Helper Banner */}
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-900 gap-2">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-700 shrink-0" />
                  <strong>Ricerca Internet & Database:</strong> Non trovi la cooperativa per questo municipio? Clicca su <em>"Cerca su Google"</em>, trova l'indirizzo e salvalo subito nel DB per le prossime volte!
                </span>
              </div>

              <div className="space-y-4">
                {letter.cooperatives.map((coop, index) => (
                  <div key={index} className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 space-y-3 relative group">
                    <button
                      onClick={() => removeCooperative(index)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-blue-700 hover:bg-neutral-100 transition-all cursor-pointer"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-10">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Nome Cooperativa / Ente</label>
                        <input
                          type="text"
                          value={coop.name}
                          onChange={(e) => handleCooperativeChange(index, "name", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Telefono</label>
                        <input
                          type="text"
                          value={coop.phone}
                          onChange={(e) => handleCooperativeChange(index, "phone", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Orari di ricevimento</label>
                        <input
                          type="text"
                          value={coop.hours}
                          onChange={(e) => handleCooperativeChange(index, "hours", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Email</label>
                        <input
                          type="text"
                          value={coop.email || ""}
                          placeholder="es: info@esempio.it"
                          onChange={(e) => handleCooperativeChange(index, "email", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Indirizzo completo</label>
                        <input
                          type="text"
                          value={coop.address}
                          onChange={(e) => handleCooperativeChange(index, "address", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Descrizione e Attività</label>
                      <textarea
                        value={coop.description}
                        onChange={(e) => handleCooperativeChange(index, "description", e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-600 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: UFFICI */}
          {activeTab === "uffici" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800">2. Centri per l'Impiego & COL</h3>
                  <p className="text-xs text-neutral-500">Istituzioni pubbliche territoriali di supporto al lavoro.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleOpenGoogleSearch("office")}
                    className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Cerca Centri per l'Impiego o COL su Google"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> 🔍 Cerca su Google
                  </button>
                  <button
                    onClick={() => handleOpenAddModal("office")}
                    className="px-3 py-1.5 bg-blue-700 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Database className="w-3.5 h-3.5" /> ➕ Inserisci e Salva nel DB
                  </button>
                </div>
              </div>

              {/* Research Helper Banner */}
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-900 gap-2">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-700 shrink-0" />
                  <strong>Ricerca Internet & Database:</strong> Se manca un Centro per l'Impiego o COL specifico, usa <em>"Cerca su Google"</em> e poi memorizzalo permanentemente con <em>"Inserisci e Salva nel DB"</em>.
                </span>
              </div>

              <div className="space-y-4">
                {letter.publicOffices.map((office, index) => (
                  <div key={index} className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 space-y-3 relative group">
                    <button
                      onClick={() => removeOffice(index)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-blue-700 hover:bg-neutral-100 transition-all cursor-pointer"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-10">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Tipologia Ufficio</label>
                        <input
                          type="text"
                          value={office.type}
                          onChange={(e) => handleOfficeChange(index, "type", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Nome Ufficio / Centro</label>
                        <input
                          type="text"
                          value={office.name}
                          onChange={(e) => handleOfficeChange(index, "name", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Indirizzo completo</label>
                        <input
                          type="text"
                          value={office.address}
                          onChange={(e) => handleOfficeChange(index, "address", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Telefono</label>
                        <input
                          type="text"
                          value={office.phone}
                          onChange={(e) => handleOfficeChange(index, "phone", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Email</label>
                        <input
                          type="text"
                          value={office.email || ""}
                          placeholder="es: info@esempio.it"
                          onChange={(e) => handleOfficeChange(index, "email", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Orari</label>
                        <input
                          type="text"
                          value={office.hours}
                          onChange={(e) => handleOfficeChange(index, "hours", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Note e Attività di supporto</label>
                        <input
                          type="text"
                          value={office.description}
                          onChange={(e) => handleOfficeChange(index, "description", e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SCUOLE */}
          {activeTab === "scuole" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800">3. Corsi di Italiano & Integrazione</h3>
                  <p className="text-xs text-neutral-500">Istituti e corsi gratuiti nelle vicinanze della persona.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleOpenGoogleSearch("school")}
                    className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Cerca Scuole di Italiano su Google"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> 🔍 Cerca su Google
                  </button>
                  <button
                    onClick={() => handleOpenAddModal("school")}
                    className="px-3 py-1.5 bg-blue-700 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Database className="w-3.5 h-3.5" /> ➕ Inserisci e Salva nel DB
                  </button>
                </div>
              </div>

              {!letter.italianSchools || letter.italianSchools.length === 0 ? (
                <div className="p-6 text-center border border-dashed rounded-2xl border-neutral-200 text-neutral-400 space-y-3">
                  <p className="text-sm">Nessuna scuola consigliata configurata per questo municipio.</p>
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => handleOpenGoogleSearch("school")}
                      className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> 🔍 Cerca Scuole su Google
                    </button>
                    <button
                      onClick={() => handleOpenAddModal("school")}
                      className="px-3 py-1.5 bg-blue-700 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Inserisci e Salva nel DB
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {letter.italianSchools.map((school, index) => (
                    <div key={index} className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 space-y-3 relative group">
                      <button
                        onClick={() => removeSchool(index)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-blue-700 hover:bg-neutral-100 transition-all cursor-pointer"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-10">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Nome della Scuola / Associazione</label>
                          <input
                            type="text"
                            value={school.name}
                            onChange={(e) => handleSchoolChange(index, "name", e.target.value)}
                            className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Telefono</label>
                          <input
                            type="text"
                            value={school.phone}
                            onChange={(e) => handleSchoolChange(index, "phone", e.target.value)}
                            className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Indirizzo completo</label>
                          <input
                            type="text"
                            value={school.address}
                            onChange={(e) => handleSchoolChange(index, "address", e.target.value)}
                            className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Email</label>
                          <input
                            type="text"
                            value={school.email || ""}
                            placeholder="es: cpia@istruzione.it"
                            onChange={(e) => handleSchoolChange(index, "email", e.target.value)}
                            className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Orari segreteria / corsi</label>
                          <input
                            type="text"
                            value={school.hours}
                            onChange={(e) => handleSchoolChange(index, "hours", e.target.value)}
                            className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-0.5">Note ed Offerta Formativa</label>
                        <textarea
                          value={school.description}
                          onChange={(e) => handleSchoolChange(index, "description", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-xl text-sm text-neutral-600 leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SITI E APP */}
          {activeTab === "siti_app" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold text-neutral-800">4. Siti Internet e App Consigliati per la Ricerca Lavoro</h3>
                <p className="text-xs text-neutral-500">I link e i canali più utili ed efficienti, sia via Web che da smartphone.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3 font-sans">Siti Internet per cercare lavoro sul Web:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getUsefulSitesAndApps("italian").websites.map((site, index) => (
                      <div key={index} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 space-y-1">
                        <p className="font-semibold text-neutral-900">{site.name}</p>
                        <a href={site.url.startsWith("http") ? site.url : `https://${site.url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all font-medium block">
                          {site.url}
                        </a>
                        <p className="text-xs text-neutral-500 leading-relaxed pt-1">{site.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3 font-sans">App specializzate per smartphone:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getUsefulSitesAndApps("italian").apps.map((appItem, index) => (
                      <div key={index} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 space-y-1">
                        <p className="font-semibold text-neutral-900">{appItem.name}</p>
                        <p className="text-xs text-neutral-500 leading-relaxed pt-1">{appItem.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: INSERISCI E SALVA NEL DB */}
      {modalCategory && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-700" />
                  {modalCategory === "cooperative" && "Aggiungi Cooperativa e Salva nel DB"}
                  {modalCategory === "office" && "Aggiungi Centro per l'Impiego / COL e Salva nel DB"}
                  {modalCategory === "school" && "Aggiungi Scuola d'Italiano L2 e Salva nel DB"}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Inserisci i dettagli trovati su Google o da fonti esterne.
                </p>
              </div>
              <button
                onClick={() => setModalCategory(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Google search trigger inside modal */}
            <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-2xl flex items-center justify-between text-xs text-amber-900">
              <span>Non hai ancora tutti i dati?</span>
              <button
                type="button"
                onClick={() => handleOpenGoogleSearch(modalCategory)}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" /> Cerca su Google adesso
              </button>
            </div>

            {modalSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center font-semibold text-sm">
                {modalSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSaveNewEntity} className="space-y-4">
                {modalCategory === "office" && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Tipologia Ufficio</label>
                    <select
                      value={newEntity.type}
                      onChange={(e) => setNewEntity(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm bg-neutral-50 font-medium"
                    >
                      <option value="Centro per l'Impiego">Centro per l'Impiego (CPI)</option>
                      <option value="Centro Orientamento Lavoro">Centro Orientamento Lavoro (COL)</option>
                      <option value="Sportello Informagiovani">Sportello Informagiovani</option>
                      <option value="Ufficio Servizi Sociali">Ufficio Servizi Sociali</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    {modalCategory === "cooperative" && "Nome Cooperativa / Agenzia *"}
                    {modalCategory === "office" && "Nome Ufficio / Centro *"}
                    {modalCategory === "school" && "Nome Scuola / Associazione *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="es: Cooperativa Sociale Il Cammino"
                    value={newEntity.name}
                    onChange={(e) => setNewEntity(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:ring-2 focus:ring-blue-700/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Telefono</label>
                    <input
                      type="text"
                      placeholder="es: 06 1234567"
                      value={newEntity.phone}
                      onChange={(e) => setNewEntity(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="es: info@struttura.it"
                      value={newEntity.email}
                      onChange={(e) => setNewEntity(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Indirizzo Completo</label>
                    <input
                      type="text"
                      placeholder="es: Via Prenestina 100, Roma"
                      value={newEntity.address}
                      onChange={(e) => setNewEntity(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Municipio di Roma</label>
                    <select
                      value={newEntity.municipio}
                      onChange={(e) => setNewEntity(prev => ({ ...prev, municipio: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm bg-neutral-50 font-medium"
                    >
                      {Array.from({ length: 15 }, (_, i) => `Municipio ${["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"][i]}`).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Orari di Apertura / Ricevimento</label>
                  <input
                    type="text"
                    placeholder="es: Lun - Ven: 09:00 - 13:00"
                    value={newEntity.hours}
                    onChange={(e) => setNewEntity(prev => ({ ...prev, hours: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Descrizione / Note Attività</label>
                  <textarea
                    rows={2}
                    placeholder="Note sui servizi offerti o modalità di candidatura..."
                    value={newEntity.description}
                    onChange={(e) => setNewEntity(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm"
                  />
                </div>

                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveToDbCheck"
                    checked={newEntity.saveToDb}
                    onChange={(e) => setNewEntity(prev => ({ ...prev, saveToDb: e.target.checked }))}
                    className="w-4 h-4 text-blue-700 rounded-xs border-neutral-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="saveToDbCheck" className="text-xs font-semibold text-neutral-800 cursor-pointer">
                    Salva permanentemente nel Database locale per tutti i futuri colloqui in questo Municipio
                  </label>
                </div>

                <div className="flex justify-end items-center gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setModalCategory(null)}
                    className="px-4 py-2 border border-neutral-200 text-neutral-600 hover:bg-neutral-100 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-700/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Salva ed Inserisci nella Lettera
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
