import { Document, Paragraph, TextRun, Packer, AlignmentType, PageBreak } from "docx";
import { GeneratedLetter } from "../types";

/**
 * Helper to get localized labels for translated annexes in the Word document.
 */
function getDocLabel(key: "Address" | "Phone" | "Hours" | "Activity" | "Support" | "Annex" | "ContactDetails" | "A" | "B" | "C", lang: string): string {
  const labels: Record<string, Record<string, string>> = {
    english: {
      Address: "Address", Phone: "Phone", Hours: "Hours", Activity: "Activities", Support: "Support offered",
      Annex: "ANNEX: USEFUL CONTACTS IN THE ROME AREA",
      ContactDetails: "Contact details of the orientation services mentioned in the letter",
      A: "A. Recommended Social Cooperatives and Placement Agencies (Ten)",
      B: "B. Employment Centers and Job Orientation Centers (COL)",
      C: "C. Free Italian Language Courses for Foreigners"
    },
    french: {
      Address: "Adresse", Phone: "Téléphone", Hours: "Horaires", Activity: "Activités", Support: "Soutien proposé",
      Annex: "ANNEXE : CONTACTS UTILES DANS LA RÉGION DE ROME",
      ContactDetails: "Coordonnées des services d'orientation mentionnés dans la lettre",
      A: "A. Coopératives sociales et agences de placement recommandées (Dix)",
      B: "B. Centres pour l'Emploi et Centres d'Orientation Professionnelle (COL)",
      C: "C. Cours d'italien gratuits pour les étrangers"
    },
    spanish: {
      Address: "Dirección", Phone: "Teléfono", Hours: "Horarios", Activity: "Actividades", Support: "Soporte ofrecido",
      Annex: "ANEXO: CONTACTOS ÚTILES EN EL ÁREA DE ROMA",
      ContactDetails: "Datos de contacto de los servicios de orientación mencionados en la carta",
      A: "A. Cooperativas sociales y agencias de empleo recomendadas (Diez)",
      B: "B. Centros de Empleo y Centros de Orientación Laboral (COL)",
      C: "C. Cursos gratuitos de lengua italiana para extranjeros"
    },
    romanian: {
      Address: "Adresă", Phone: "Telefon", Hours: "Program", Activity: "Activități", Support: "Suport oferit",
      Annex: "ANEXĂ: CONTACTE UTILE ÎN ZONA ROMEI",
      ContactDetails: "Datele de contact ale serviciilor de orientare menționate în scrisoare",
      A: "A. Cooperative sociale și agenții de plasare recomandate (Zece)",
      B: "B. Centre de Ocupare a Forței de Muncă și Centre de Orientare Profesională (COL)",
      C: "C. Cursuri gratuite de limba italiană pentru străini"
    },
    ukrainian: {
      Address: "Адреса", Phone: "Телефон", Hours: "Години роботи", Activity: "Діяльність", Support: "Пропонована підтримка",
      Annex: "ДОДАТОК: КОРИСНІ КОНТАКТИ В РИМІ",
      ContactDetails: "Контактні дані служб орієнтації, згаданих у листі",
      A: "А. Рекомендовані соціальні кооперативи та агенції з працевлаштування (Десять)",
      B: "Б. Центри зайнятості та Центри професійної орієнтації (COL)",
      C: "В. Безкоштовні курси італійської мови для іноземців"
    },
    arabic: {
      Address: "العنوان", Phone: "الهاتف", Hours: "ساعات العمل", Activity: "الأنشطة", Support: "الدعم المقدم",
      Annex: "ملحق: جهات اتصال مفيدة في منطقة روما",
      ContactDetails: "بيانات الاتصال بخدمات التوجيه المذكورة في الرسالة",
      A: "أ. التعاونيات الاجتماعية ووكالات التوظيف الموصى بها (عشرة)",
      B: "ب. مكاتب العمل ومراكز التوجيه المهني (COL)",
      C: "ج. دورات لغة إيطالية مجانية للأجانب"
    },
    cingalese: {
      Address: "ලිපිනය", Phone: "දුරකථන", Hours: "පැය", Activity: "ක්‍රියාකාරකම්", Support: "පිරිනමන සහාය",
      Annex: "ඇමුණුම: රෝම ප්‍රදේශයේ ප්‍රයෝජනවත් සම්බන්ධතා",
      ContactDetails: "ලිපියේ සඳහන් කර ඇති දිශානති සේවාවන්හි සම්බන්ධතා තොරතුරු",
      A: "A. නිර්දේශිත සමාජ සමුපකාර සහ රැකියා නියෝජිත ආයතන (දහයක්)",
      B: "B. රැකියා මධ්‍යස්ථාන සහ රැකියා දිශානති මධ්‍යස්ථාන (COL)",
      C: "C. විදේශිකයන් සඳහා නොමිලේ ඉතාලි භාෂා පාඨමාලා"
    },
    polish: {
      Address: "Adres", Phone: "Telefon", Hours: "Godziny otwarcia", Activity: "Działalność", Support: "Oferowane wsparcie",
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

export interface UsefulSitesData {
  sectionTitle: string;
  websitesTitle: string;
  appsTitle: string;
  websites: { name: string; url: string; desc: string }[];
  apps: { name: string; desc: string }[];
}

export function getUsefulSitesAndApps(lang: string): UsefulSitesData {
  const data: Record<string, UsefulSitesData> = {
    italian: {
      sectionTitle: "D. SITI INTERNET E APP CONSIGLIATI PER LA RICERCA DEL LAVORO",
      websitesTitle: "SITI internet per cercare lavoro sul WEB:",
      appsTitle: "APP specializzate per la ricerca del lavoro:",
      websites: [
        { name: "Regione Lazio Offerte Lavoro", url: "https://www.regione.lazio.it/cittadini/lavoro/offerte-lavoro", desc: "Sito ufficiale della Regione Lazio con tutte le offerte di lavoro del territorio." },
        { name: "Subito.it", url: "www.subito.it", desc: "Sezione lavoro, ottima per lavori operativi, ristorazione e servizi rapidi." },
        { name: "Bakeca.it", url: "www.bakeka.it", desc: "Portale generalista per annunci di lavoro, diviso per città e categorie." },
        { name: "Indeed", url: "www.indeed.com", desc: "Il motore di ricerca lavoro più diffuso, raccoglie annunci da tutta Italia." },
        { name: "Monster", url: "www.monster.it", desc: "Piattaforma storica per la ricerca attiva di profili professionali vari." },
        { name: "LinkedIn", url: "www.linkedin.com", desc: "Social network professionale (consigliato principalmente per profili di livello medio-alto)." }
      ],
      apps: [
        { name: "Cercolavoro", desc: "Applicazione dedicata agli annunci di lavoro con ricerca focalizzata e filtri territoriali." },
        { name: "InfoJobs", desc: "Una delle app più scaricate per candidarsi rapidamente e monitorare lo stato delle selezioni." },
        { name: "Indeed Job Search", desc: "L'app ufficiale di Indeed per cercare annunci ovunque ti trovi e candidarsi con un click." },
        { name: "Monster", desc: "App mobile per creare il profilo, caricare il CV e scorrere gli annunci di lavoro." },
        { name: "Nextdoor", desc: "Ottima per piccoli lavori di quartiere, assistenza, ripetizioni e passaparola locale." },
        { name: "Glassdoor", desc: "Permette di cercare offerte e consultare recensioni sulle aziende scritte dai dipendenti." }
      ]
    },
    english: {
      sectionTitle: "D. RECOMMENDED WEBSITES AND APPS FOR JOB SEARCH",
      websitesTitle: "Internet WEBSITES to search for jobs on the WEB:",
      appsTitle: "Specialized APPS for job search:",
      websites: [
        { name: "Regione Lazio Offerte Lavoro", url: "https://www.regione.lazio.it/cittadini/lavoro/offerte-lavoro", desc: "Official website of the Lazio Region with all local job offers." },
        { name: "Subito.it", url: "www.subito.it", desc: "Jobs section, great for operational work, catering, and quick services." },
        { name: "Bakeca.it", url: "www.bakeka.it", desc: "General portal for job postings, divided by city and category." },
        { name: "Indeed", url: "www.indeed.com", desc: "The most popular job search engine, collecting ads from all over Italy." },
        { name: "Monster", url: "www.monster.it", desc: "Historical platform for active search of various professional profiles." },
        { name: "LinkedIn", url: "www.linkedin.com", desc: "Professional social network (mainly recommended for medium-to-high level profiles)." }
      ],
      apps: [
        { name: "Cercolavoro", desc: "Application dedicated to job advertisements with focused search and local filters." },
        { name: "InfoJobs", desc: "One of the most downloaded apps to apply quickly and track selection status." },
        { name: "Indeed Job Search", desc: "Indeed's official app to search for ads on the go and apply with one click." },
        { name: "Monster", desc: "Mobile app to create your profile, upload your CV, and browse job postings." },
        { name: "Nextdoor", desc: "Great for small neighborhood jobs, assistance, tutoring, and local word-of-mouth." },
        { name: "Glassdoor", desc: "Allows searching for offers and reading company reviews written by employees." }
      ]
    },
    french: {
      sectionTitle: "D. SITES INTERNET ET APPLICATIONS RECOMMANDÉS POUR LA RECHERCHE D'EMPLOI",
      websitesTitle: "SITES internet pour chercher du travail sur le WEB :",
      appsTitle: "APPLICATIONS spécialisées pour la recherche d'emploi :",
      websites: [
        { name: "Regione Lazio Offerte Lavoro", url: "https://www.regione.lazio.it/cittadini/lavoro/offerte-lavoro", desc: "Site officiel de la Région Latium avec toutes les offres d'emploi locales." },
        { name: "Subito.it", url: "www.subito.it", desc: "Section emploi, idéale pour les travaux opérationnels, la restauration et les services rapides." },
        { name: "Bakeca.it", url: "www.bakeka.it", desc: "Portail général d'offres d'emploi, divisé par ville et catégorie." },
        { name: "Indeed", url: "www.indeed.com", desc: "Le moteur de recherche d'emploi le plus populaire, rassemblant des annonces de toute l'Italie." },
        { name: "Monster", url: "www.monster.it", desc: "Plateforme historique pour la recherche active de profils professionnels variés." },
        { name: "LinkedIn", url: "www.linkedin.com", desc: "Réseau social professionnel (recommandé principalement pour les profils de niveau moyen à élevé)." }
      ],
      apps: [
        { name: "Cercolavoro", desc: "Application dédiée aux annonces d'emploi avec recherche ciblée et filtres locaux." },
        { name: "InfoJobs", desc: "L'une des applications les plus téléchargées pour postuler rapidement et suivre l'état de la sélection." },
        { name: "Indeed Job Search", desc: "L'application officielle d'Indeed pour rechercher des offres en déplacement et postuler en un clic." },
        { name: "Monster", desc: "Application mobile pour créer un profil, télécharger votre CV et parcourir les offres." },
        { name: "Nextdoor", desc: "Idéal pour les petits boulots de quartier, l'aide à domicile, le tutorat et le bouche-à-oreille local." },
        { name: "Glassdoor", desc: "Permet de rechercher des offres et de consulter les avis d'entreprises écrits par les salariés." }
      ]
    },
    spanish: {
      sectionTitle: "D. SITIOS WEB Y APLICACIONES RECOMENDADOS PARA LA BÚSQUEDA DE EMPLEO",
      websitesTitle: "Sitios web para buscar trabajo en la WEB:",
      appsTitle: "APLICACIONES especializadas para la búsqueda de empleo:",
      websites: [
        { name: "Regione Lazio Offerte Lavoro", url: "https://www.regione.lazio.it/cittadini/lavoro/offerte-lavoro", desc: "Sitio oficial de la Región de Lacio con todas las ofertas de empleo del territorio." },
        { name: "Subito.it", url: "www.subito.it", desc: "Sección de empleo, excelente para trabajos operativos, hostelería y servicios rápidos." },
        { name: "Bakeca.it", url: "www.bakeka.it", desc: "Portal generalista de ofertas de empleo, dividido por ciudad y categoría." },
        { name: "Indeed", url: "www.indeed.com", desc: "El buscador de empleo más utilizado, reúne anuncios de toda Italia." },
        { name: "Monster", url: "www.monster.it", desc: "Plataforma histórica para la búsqueda activa de diversos perfiles profesionales." },
        { name: "LinkedIn", url: "www.linkedin.com", desc: "Red social profesional (recomendada principalmente para perfiles de nivel medio-alto)." }
      ],
      apps: [
        { name: "Cercolavoro", desc: "Aplicación dedicada a anuncios de empleo con búsqueda enfocada y filtros territoriales." },
        { name: "InfoJobs", desc: "Una de las aplicaciones más descargadas para postularse rápidamente y seguir el estado de selección." },
        { name: "Indeed Job Search", desc: "La aplicación oficial de Indeed para buscar anuncios dondequiera que estés y postularte con un clic." },
        { name: "Monster", desc: "Aplicación móvil para crear tu perfil, subir tu currículum y explorar ofertas." },
        { name: "Nextdoor", desc: "Excelente para pequeños trabajos de barrio, asistencia, clases particulares y el boca a boca local." },
        { name: "Glassdoor", desc: "Permite buscar ofertas y consultar opiniones sobre empresas escritas por los propios empleados." }
      ]
    },
    romanian: {
      sectionTitle: "D. SITE-URI INTERNET ȘI APLICAȚII RECOMANDATE PENTRU CĂUTAREA UNUI LOC DE MUNCĂ",
      websitesTitle: "SITE-uri de internet pentru căutarea unui loc de muncă pe WEB:",
      appsTitle: "APLICAȚII specializate pentru căutarea unui loc de muncă:",
      websites: [
        { name: "Regione Lazio Offerte Lavoro", url: "https://www.regione.lazio.it/cittadini/lavoro/offerte-lavoro", desc: "Site-ul oficial al Regiunii Lazio cu toate ofertele de muncă de pe teritoriu." },
        { name: "Subito.it", url: "www.subito.it", desc: "Secțiunea de locuri de muncă, excelentă pentru muncă operativă, alimentație publică și servicii rapide." },
        { name: "Bakeca.it", url: "www.bakeka.it", desc: "Portal generalist pentru anunțuri de muncă, împărțit pe orașe și categorii." },
        { name: "Indeed", url: "www.indeed.com", desc: "Cel mai popular motor de căutare de locuri de muncă, colectează anunțuri din toată Italia." },
        { name: "Monster", url: "www.monster.it", desc: "Platformă istorică pentru căutarea activă de diverse profiluri profesionale." },
        { name: "LinkedIn", url: "www.linkedin.com", desc: "Rețea de socializare profesională (recomandată în special pentru profiluri de nivel mediu spre înalt)." }
      ],
      apps: [
        { name: "Cercolavoro", desc: "Aplicație dedicată anunțurilor de muncă cu căutare concentrată și filtre teritoriale." },
        { name: "InfoJobs", desc: "Una dintre cele mai descărcate aplicații pentru a aplica rapid și a urmări stadiul selecției." },
        { name: "Indeed Job Search", desc: "Aplicația oficială Indeed pentru a căuta anunțuri în mișcare și a aplica cu un singur clic." },
        { name: "Monster", desc: "Aplicație mobilă pentru a crea profilul, a încărca CV-ul și a răsfoi anunțurile de muncă." },
        { name: "Nextdoor", desc: "Excelent pentru joburi mici de cartier, asistență, meditații și recomandări locale." },
        { name: "Glassdoor", desc: "Permite căutarea de oferte și consultarea recenziilor companiilor scrise de angajați." }
      ]
    },
    ukrainian: {
      sectionTitle: "Г. РЕКОМЕНДОВАНІ ІНТЕРНЕТ-САЙТИ ТА ДОДАТКИ ДЛЯ ПОШУКУ РОБОТИ",
      websitesTitle: "Інтернет-сайти для пошуку роботи в WEB-мережі:",
      appsTitle: "Спеціалізовані додатки для пошуку роботи:",
      websites: [
        { name: "Regione Lazio Offerte Lavoro", url: "https://www.regione.lazio.it/cittadini/lavoro/offerte-lavoro", desc: "Офіційний сайт регіону Лаціо з усіма пропозиціями роботи на території." },
        { name: "Subito.it", url: "www.subito.it", desc: "Розділ роботи, чудовий для оперативної роботи, ресторанного бізнесу та швидких послуг." },
        { name: "Bakeca.it", url: "www.bakeka.it", desc: "Загальний портал оголошень про роботу, розділений за містами та категоріями." },
        { name: "Indeed", url: "www.indeed.com", desc: "Найпопулярніша пошукова система роботи, яка збирає оголошення з усієї Італії." },
        { name: "Monster", url: "www.monster.it", desc: "Історична платформа для активного пошуку різних професійних профілів." },
        { name: "LinkedIn", url: "www.linkedin.com", desc: "Професійна соціальна мережа (рекомендується переважно для профілів середнього та високого рівня)." }
      ],
      apps: [
        { name: "Cercolavoro", desc: "Додаток, присвячений оголошенням про роботу, з цілеспрямованим пошуком і територіальними фільтрами." },
        { name: "InfoJobs", desc: "Один із найпопулярніших додатків для швидкої подачі заявок та відстеження статусу відбору." },
        { name: "Indeed Job Search", desc: "Офіційний додаток Indeed для пошуку оголошень у будь-якому місці та подачі заявки в один клік." },
        { name: "Monster", desc: "Мобільний додаток для створення профілю, завантаження резюме та перегляду пропозицій роботи." },
        { name: "Nextdoor", desc: "Чудово підходить для невеликих підробіток по сусідству, допомоги, репетиторства та місцевих рекомендацій." },
        { name: "Glassdoor", desc: "Дозволяє шукати пропозиції та переглядати відгуки про компанії, написані співробітниками." }
      ]
    },
    arabic: {
      sectionTitle: "د. مواقع الإنترنت والتطبيقات الموصى بها للبحث عن عمل",
      websitesTitle: "مواقع الإنترنت للبحث عن عمل على الويب:",
      appsTitle: "تطبيقات متخصصة للبحث عن عمل:",
      websites: [
        { name: "Regione Lazio Offerte Lavoro", url: "https://www.regione.lazio.it/cittadini/lavoro/offerte-lavoro", desc: "الموقع الرسمي لإقليم لاتسيو ويحتوي على جميع عروض العمل في المنطقة." },
        { name: "Subito.it", url: "www.subito.it", desc: "قسم الوظائف، وهو ممتاز للعمل الميداني والخدمات الغذائية والخدمات السريعة." },
        { name: "Bakeca.it", url: "www.bakeka.it", desc: "بوابة عامة لإعلانات الوظائف، مقسمة حسب المدن والفئات." },
        { name: "Indeed", url: "www.indeed.com", desc: "محرك البحث عن الوظائف الأكثر شعبية، حيث يجمع الإعلانات من جميع أنحاء إيطاليا." },
        { name: "Monster", url: "www.monster.it", desc: "منصة تاريخية للبحث النشط عن مختلف الملفات المهنية." },
        { name: "LinkedIn", url: "www.linkedin.com", desc: "شبكة اجتماعية مهنية (يُوصى بها بشكل أساسي للمستويات المتوسطة والعالية)." }
      ],
      apps: [
        { name: "Cercolavoro", desc: "تطبيق مخصص لإعلانات الوظائف مع بحث مركّز وفلاتر جغرافية." },
        { name: "InfoJobs", desc: "أحد التطبيقات الأكثر تحميلًا للتقديم بسرعة ومتابعة حالة طلبات التوظيف." },
        { name: "Indeed Job Search", desc: "تطبيق إنديد الرسمي للبحث عن الإعلانات أثناء التنقل والتقديم بضغطة زر." },
        { name: "Monster", desc: "تطبيق للهاتف المحمول لإنشاء ملفك الشخصي وتحميل سيرتك الذاتية وتصفح إعلانات الوظائف." },
        { name: "Nextdoor", desc: "ممتاز للوظائف الصغيرة في الحي والمساعدة والدروس الخصوصية والتواصل المحلي." },
        { name: "Glassdoor", desc: "يتيح لك البحث عن العروض والاطلاع على تقييمات الشركات المكتوبة من الموظفين." }
      ]
    },
    cingalese: {
      sectionTitle: "D. රැකියා සෙවීම සඳහා නිර්දේශිත වෙබ් අඩවි සහ ඇප්ස්",
      websitesTitle: "වෙබ් අඩවි හරහා රැකියා සෙවීම සඳහා වෙබ් අඩවි:",
      appsTitle: "රැකියා සෙවීම සඳහා විශේෂිත ඇප්ස්:",
      websites: [
        { name: "Regione Lazio Offerte Lavoro", url: "https://www.regione.lazio.it/cittadini/lavoro/offerte-lavoro", desc: "ලැසියෝ කලාපයේ නිල රැකියා වෙබ් අඩවිය." },
        { name: "Subito.it", url: "www.subito.it", desc: "රැකියා අංශය, ක්ෂණික සේවා, ආහාර සැපයුම් සහ මෙහෙයුම් වැඩ සඳහා ඉතා සුදුසුය." },
        { name: "Bakeca.it", url: "www.bakeka.it", desc: "නගර සහ වර්ගීකරණය අනුව බෙදා ඇති රැකියා දැන්වීම් සඳහා පොදු ද්වාරයකි." },
        { name: "Indeed", url: "www.indeed.com", desc: "ඉතාලිය පුරා දැන්වීම් එකතු කරන වඩාත් ජනප්‍රිය රැකියා සෙවුම් යන්ත්‍රයයි." },
        { name: "Monster", url: "www.monster.it", desc: "විවිධ වෘත්තීය පැතිකඩයන් සක්‍රියව සෙවීම සඳහා ඓතිහාසික වේදිකාවකි." },
        { name: "LinkedIn", url: "www.linkedin.com", desc: "වෘත්තීය සමාජ ජාලය (ප්‍රධාන වශයෙන් මධ්‍යම හා ඉහළ මට්ටමේ පැතිකඩ සඳහා නිර්දේශ කෙරේ)." }
      ],
      apps: [
        { name: "Cercolavoro", desc: "දේශීය පෙරහන් සහ ඉලක්කගත සෙවුම් සහිත රැකියා දැන්වීම් සඳහා කැප වූ යෙදුමකි." },
        { name: "InfoJobs", desc: "ඉක්මනින් අයදුම් කිරීමට සහ තේරීම් තත්ත්වය නිරීක්ෂණය කිරීමට වඩාත්ම බාගත කරන ලද යෙදුමකි." },
        { name: "Indeed Job Search", desc: "ඕනෑම තැනක සිට දැන්වීම් සෙවීමට සහ එක ක්ලික් එකකින් අයදුම් කිරීමට නිල යෙදුමයි." },
        { name: "Monster", desc: "පැතිකඩ නිර්මාණය කිරීමට, CV උඩුගත කිරීමට සහ රැකියා දැන්වීම් පිරික්සීමට ජංගම යෙදුමයි." },
        { name: "Nextdoor", desc: "අසල්වැසි කුඩා රැකියා, උපකාර, උපකාරක පන්ති සහ දේශීය ප්‍රචාරණය සඳහා ඉතා හොඳය." },
        { name: "Glassdoor", desc: "සේවකයින් විසින් ලියන ලද සමාගම් සමාලෝචන විමසීමට සහ දීමනා සෙවීමට ඉඩ සලසයි." }
      ]
    },
    polish: {
      sectionTitle: "D. STRONY INTERNETOWE I APLIKACJE PRZYDATNE W POSZUKIWANIU PRACY",
      websitesTitle: "Strony internetowe do poszukiwania pracy w sieci:",
      appsTitle: "Aplikacje dedykowane poszukiwaniu pracy:",
      websites: [
        { name: "Regione Lazio Offerte Lavoro", url: "https://www.regione.lazio.it/cittadini/lavoro/offerte-lavoro", desc: "Oficjalna strona Regionu Lacjum ze wszystkimi ofertami pracy w regionie." },
        { name: "Subito.it", url: "www.subito.it", desc: "Dział pracy, doskonały dla prac fizycznych, gastronomii i szybkich usług." },
        { name: "Bakeca.it", url: "www.bakeka.it", desc: "Ogólny portal z ogłoszeniami o pracę, z podziałem na miasta i kategorie." },
        { name: "Indeed", url: "www.indeed.com", desc: "Najpopularniejsza wyszukiwarka pracy, gromadząca ogłoszenia z całych Włoch." },
        { name: "Monster", url: "www.monster.it", desc: "Historyczna platforma do aktywnego poszukiwania różnorodnych profili zawodowych." },
        { name: "LinkedIn", url: "www.linkedin.com", desc: "Profesjonalna sieć społecznościowa (zalecana głównie dla profili średniego i wyższego szczebla)." }
      ],
      apps: [
        { name: "Cercolavoro", desc: "Aplikacja dedykowana ogłoszeniom o pracę z ukierunkowanym wyszukiwaniem i filtrami lokalizacyjnymi." },
        { name: "InfoJobs", desc: "Jedna z najczęściej pobieranych aplikacji do szybkiego aplikowania i śledzenia statusu rekrutacji." },
        { name: "Indeed Job Search", desc: "Oficjalna aplikacja Indeed do wyszukiwania ogłoszeń i aplikowania jednym kliknięciem." },
        { name: "Monster", desc: "Aplikacja mobilna do tworzenia profilu, przesyłania CV i przeglądania ofert pracy." },
        { name: "Nextdoor", desc: "Doskonała do drobnych prac sąsiedzkich, opieki, korepetycji i lokalnych kontaktów." },
        { name: "Glassdoor", desc: "Umożliwia wyszukiwanie ofert i sprawdzanie opinii o firmach napisanych przez pracowników." }
      ]
    }
  };

  const norm = (lang || "").toLowerCase().trim();

  if (!norm || norm.includes("ita") || norm.includes("ital") || norm === "italian" || norm === "italiano") {
    return data.italian;
  }
  if (norm.includes("fran") || norm === "french" || norm === "francese") {
    return data.french;
  }
  if (norm.includes("spag") || norm.includes("span") || norm === "spanish" || norm === "spagnolo") {
    return data.spanish;
  }
  if (norm.includes("rumen") || norm.includes("romen") || norm.includes("romanian") || norm === "rumeno") {
    return data.romanian;
  }
  if (norm.includes("ucra") || norm.includes("ukra") || norm === "ukrainian" || norm === "ucraino") {
    return data.ukrainian;
  }
  if (norm.includes("arab") || norm.includes("egiz") || norm.includes("egitt") || norm.includes("egypt") || norm === "arabic" || norm === "arabo") {
    return data.arabic;
  }
  if (norm.includes("cing") || norm.includes("sinha") || norm === "cingalese" || norm === "sinhalese") {
    return data.cingalese;
  }
  if (norm.includes("pola") || norm.includes("polacc") || norm === "polish" || norm === "polacco") {
    return data.polish;
  }
  if (norm.includes("ingl") || norm.includes("engl") || norm === "english" || norm === "inglese") {
    return data.english;
  }

  // Fallback for foreign target languages without specialized dictionary:
  return data.english;
}

function getDocSectionLabelText(key: "A" | "B" | "C", lang: string, isAltro: boolean) {
  const original = getDocLabel(key, lang);
  if (!isAltro) return original;
  if (key === "B") {
    return original.replace(/^B\./, "A.").replace(/^Б\./, "А.").replace(/^ب\./, "أ.");
  }
  if (key === "C") {
    return original.replace(/^C\./, "B.").replace(/^В\./, "Б.").replace(/^ج\./, "ب.");
  }
  return original;
}

function getDocTranslatedHeader(lang: string): { title: string; subtitle: string } {
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

function getDocOfficinaOpportunityText(lang: string): { title: string; line: string } {
  const norm = (lang || "").toLowerCase();
  if (norm.includes("ingl") || norm.includes("engl")) {
    return {
      title: "OPPORTUNITY FROM CARITAS TO WHICH YOU HAVE BEEN NOMINATED",
      line: "Opp. No.: ____   |   Job type: ____________________________________________________________________"
    };
  }
  if (norm.includes("spag") || norm.includes("span")) {
    return {
      title: "OPORTUNIDAD DE CARITAS A LA QUE TE HEMOS POSTULADO",
      line: "N. Oportunidad: ____   |   Tipo de trabajo: ____________________________________________________________________"
    };
  }
  if (norm.includes("fran")) {
    return {
      title: "OPPORTUNITÉ DE CARITAS À LAQUELLE NOUS VOUS AVONS CANDIDATÉ",
      line: "N° Opp. : ____   |   Type de travail : ____________________________________________________________________"
    };
  }
  if (norm.includes("rumen") || norm.includes("romanian")) {
    return {
      title: "OPORTUNITATEA DE LA CARITAS LA CARE TE-AM CANDIDAT",
      line: "Nr. Opp.: ____   |   Tipul de muncă: ____________________________________________________________________"
    };
  }
  if (norm.includes("ucra") || norm.includes("ukrain")) {
    return {
      title: "МОЖЛИВІСТЬ ВІД CARITAS, НА ЯКУ ВАС БУЛО ВИСУНУТО",
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
      title: "OFERTA Z CARITAS, NA KTÓRĄ ZGŁOSILIŚMY TWOJĄ KANDYDATURĘ",
      line: "Nr Oferty: ____   |   Rodzaj pracy: ____________________________________________________________________"
    };
  }
  return {
    title: "OPPORTUNITA' DELLA CARITAS A CUI TI ABBIAMO CANDIDATO",
    line: "N. Opp.: ____   |   Tipo di lavoro: ____________________________________________________________________"
  };
}

/**
 * Helper to split multi-line letter texts and render them as justified paragraphs
 * with correct indentations for numbered lists (e.g. 1., 2.) to format Word neatly.
 */
function addFormattedParagraphs(children: any[], text: string, isItalic = false, color?: string) {
  if (!text) return;
  const lines = text.split("\n");
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      // Add minor space for blank lines
      return;
    }

    // Check if the line is a numbered bullet point like "1. CURRICULUM..." or "3. ISCRIZIONE..."
    const isBullet = /^\d+\.\s+[A-Z]{3,}/.test(trimmed) || /^\d+\.\s+/.test(trimmed);

    children.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: isBullet ? 100 : 40, after: 100, line: 240 }, // Compact line spacing
        indent: isBullet ? { left: 360, hanging: 360 } : undefined, // Hanging indent for bullet points
        children: [
          new TextRun({
            text: trimmed,
            font: "Arial",
            size: 21, // ~10.5pt
            italics: isItalic,
            color: color,
          }),
        ],
      })
    );
  });
}

export function generateWordDocument(letter: GeneratedLetter): Promise<Blob> {
  const children: any[] = [];
  const isAltro = letter.cooperatives.length === 0;

  // ==========================================
  // PAGE 1: THE OFFICIAL LETTER (ITALIAN)
  // ==========================================

  // Header Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: "CONSIGLI PER CERCARE LAVORO",
          bold: true,
          size: 26,
          color: "1D4ED8", // Dark Blue
          font: "Arial",
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 },
      children: [
        new TextRun({
          text: "Servizio di Orientamento Lavoro",
          italics: true,
          size: 18,
          color: "555555",
          font: "Arial",
        }),
      ],
    })
  );

  // Divider Line
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "_________________________________________________________________________________",
          color: "CCCCCC",
          font: "Arial",
        }),
      ],
    })
  );

  // Recipient / Metadata
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "Destinatario: ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: letter.recipientName || "Gentile Utente", font: "Arial", size: 21 }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "Oggetto: ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: letter.subject, font: "Arial", size: 21 }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 350 },
      children: [
        new TextRun({ text: "Data dell'incontro: ", bold: true, font: "Arial", size: 21 }),
        new TextRun({ text: new Date().toLocaleDateString("it-IT"), font: "Arial", size: 21 }),
      ],
    })
  );

  // 1. Greeting
  children.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 100, after: 180 },
      children: [
        new TextRun({ text: letter.italianLetter.greeting, font: "Arial", size: 22 }),
      ],
    })
  );

  // 2. Intro
  addFormattedParagraphs(children, letter.italianLetter.intro);

  // 3. Curriculum & job search paragraphs (Point 1 and Point 2)
  addFormattedParagraphs(children, letter.italianLetter.cooperativesIntro);

  // 4. Public Offices CPI, COL & Portafuturo (Point 3, Point 4, and Point 5)
  addFormattedParagraphs(children, letter.italianLetter.publicOfficesIntro);

  // 5. Italian School paragraph if applicable
  if (letter.italianSchools && letter.italianSchools.length > 0 && letter.italianLetter.schoolsIntro) {
    addFormattedParagraphs(children, letter.italianLetter.schoolsIntro, false, "1D4ED8");
  }

  // 6. Conclusion
  addFormattedParagraphs(children, letter.italianLetter.conclusion);

  // ==========================================
  // PAGE 2: ANNEXES / ALLEGATI (CONTACTS & DATA)
  // ==========================================
  
  // Page Break to start Annexes on a new sheet
  children.push(
    new Paragraph({
      children: [new PageBreak()]
    })
  );

  // Annex Header
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: "ALLEGATO: CONTATTI UTILI SUL TERRITORIO DI ROMA",
          bold: true,
          size: 24,
          color: "143642", // Navy
          font: "Arial",
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "Mappe, indirizzi e recapiti utili dei servizi di orientamento menzionati nella lettera",
          italics: true,
          size: 16,
          color: "555555",
          font: "Arial",
        }),
      ],
    })
  );

  // Officina Opportunity section if selected
  if (letter.officinaOpportunity) {
    children.push(
      new Paragraph({
        spacing: { before: 150, after: 60 },
        children: [
          new TextRun({
            text: "OPPORTUNITA' DELLA CARITAS A CUI TI ABBIAMO CANDIDATO",
            bold: true,
            size: 20,
            color: "1D4ED8", // Dark Blue
            font: "Arial",
          }),
        ],
      })
    );
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "N. Opp.: ____   |   Tipo di lavoro: ____________________________________________________________________",
            bold: true,
            font: "Arial",
            size: 19,
            color: "333333",
          }),
        ],
      })
    );
  }

  // SECTION A: COOPERATIVES (10 COOPERATIVES REQUIRED)
  if (!isAltro) {
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 150 },
        children: [
          new TextRun({
            text: "A. COOPERATIVE E STRUTTURE DI SELEZIONE CONSIGLIATE (DIECI)",
            bold: true,
            size: 20,
            color: "1D4ED8", // Dark Blue
            font: "Arial",
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: { after: 150 },
        children: [
          new TextRun({
            text: "Consigliamo di presentarsi o inviare il curriculum vitae alle seguenti strutture specializzate nel settore richiesto:",
            italics: true,
            font: "Arial",
            size: 18,
            color: "555555"
          }),
        ],
      })
    );

    letter.cooperatives.forEach((coop, index) => {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 80, after: 80 },
          children: [
            new TextRun({ text: `${index + 1}. ${coop.name}`, bold: true, color: "143642", font: "Arial", size: 20 }),
            new TextRun({ text: `\n   • Indirizzo: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: coop.address, font: "Arial", size: 18 }),
            new TextRun({ text: `\n   • Telefono: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: coop.phone, font: "Arial", size: 18 }),
            new TextRun({ text: `\n   • Orari: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: coop.hours, font: "Arial", size: 18 }),
            ...(coop.email ? [
              new TextRun({ text: `\n   • Email: `, bold: true, font: "Arial", size: 18 }),
              new TextRun({ text: coop.email, font: "Arial", size: 18 })
            ] : []),
            new TextRun({ text: `\n   • Attività: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: coop.description, font: "Arial", italics: true, size: 18 }),
          ],
        })
      );
    });
  }

  // SECTION B: PUBLIC OFFICES
  children.push(
    new Paragraph({
      spacing: { before: 250, after: 150 },
      children: [
        new TextRun({
          text: isAltro
            ? "A. CENTRI PER L'IMPIEGO E CENTRI ORIENTAMENTO LINGUISTICO E LAVORATIVO (CPI / COL)"
            : "B. CENTRI PER L'IMPIEGO E CENTRI ORIENTAMENTO LINGUISTICO E LAVORATIVO (CPI / COL)",
          bold: true,
          size: 20,
          color: "1D4ED8",
          font: "Arial",
        }),
      ],
    })
  );

  letter.publicOffices.forEach((office, index) => {
    children.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 80, after: 80 },
        children: [
          new TextRun({ text: `${index + 1}. ${office.name} (${office.type})`, bold: true, color: "143642", font: "Arial", size: 20 }),
          new TextRun({ text: `\n   • Indirizzo: `, bold: true, font: "Arial", size: 18 }),
          new TextRun({ text: office.address, font: "Arial", size: 18 }),
          new TextRun({ text: `\n   • Telefono: `, bold: true, font: "Arial", size: 18 }),
          new TextRun({ text: office.phone, font: "Arial", size: 18 }),
          new TextRun({ text: `\n   • Orari: `, bold: true, font: "Arial", size: 18 }),
          new TextRun({ text: office.hours, font: "Arial", size: 18 }),
          ...(office.email ? [
            new TextRun({ text: `\n   • Email: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: office.email, font: "Arial", size: 18 })
          ] : []),
          new TextRun({ text: `\n   • Supporto offerto: `, bold: true, font: "Arial", size: 18 }),
          new TextRun({ text: office.description, font: "Arial", italics: true, size: 18 }),
        ],
      })
    );
  });

  // SECTION C: ITALIAN SCHOOLS (if present)
  if (letter.italianSchools && letter.italianSchools.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 250, after: 150 },
        children: [
          new TextRun({
            text: isAltro ? "B. CORSI GRATUITI DI LINGUA ITALIANA PER STRANIERI" : "C. CORSI GRATUITI DI LINGUA ITALIANA PER STRANIERI",
            bold: true,
            size: 20,
            color: "1D4ED8",
            font: "Arial",
          }),
        ],
      })
    );

    letter.italianSchools.forEach((school, index) => {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 80, after: 80 },
          children: [
            new TextRun({ text: `${index + 1}. ${school.name}`, bold: true, color: "143642", font: "Arial", size: 20 }),
            new TextRun({ text: `\n   • Indirizzo: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: school.address, font: "Arial", size: 18 }),
            new TextRun({ text: `\n   • Telefono: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: school.phone, font: "Arial", size: 18 }),
            new TextRun({ text: `\n   • Orari Segreteria: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: school.hours, font: "Arial", size: 18 }),
            ...(school.email ? [
              new TextRun({ text: `\n   • Email: `, bold: true, font: "Arial", size: 18 }),
              new TextRun({ text: school.email, font: "Arial", size: 18 })
            ] : []),
            new TextRun({ text: `\n   • Informazioni: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: school.description, font: "Arial", italics: true, size: 18 }),
          ],
        })
      );
    });
  }

  // SECTION D: SITI INTERNET E APP CONSIGLIATI (Italian)
  const italianSitesData = getUsefulSitesAndApps("italian");
  const dPrefix = isAltro ? (letter.italianSchools && letter.italianSchools.length > 0 ? "C." : "B.") : "D.";
  children.push(
    new Paragraph({
      spacing: { before: 250, after: 150 },
      children: [
        new TextRun({
          text: italianSitesData.sectionTitle.replace(/^D\./, dPrefix),
          bold: true,
          size: 20,
          color: "1D4ED8",
          font: "Arial",
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: italianSitesData.websitesTitle,
          bold: true,
          font: "Arial",
          size: 18,
          color: "143642"
        }),
      ],
    })
  );

  italianSitesData.websites.forEach((site) => {
    children.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({ text: `• ${site.name} (${site.url}): `, bold: true, font: "Arial", size: 18 }),
          new TextRun({ text: site.desc, font: "Arial", size: 18 }),
        ],
      })
    );
  });

  children.push(
    new Paragraph({
      spacing: { before: 150, after: 100 },
      children: [
        new TextRun({
          text: italianSitesData.appsTitle,
          bold: true,
          font: "Arial",
          size: 18,
          color: "143642"
        }),
      ],
    })
  );

  italianSitesData.apps.forEach((appItem) => {
    children.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({ text: `• ${appItem.name}: `, bold: true, font: "Arial", size: 18 }),
          new TextRun({ text: appItem.desc, font: "Arial", size: 18 }),
        ],
      })
    );
  });


  // ==========================================
  // PAGE 3: THE TRANSLATED LETTER (IF FOREIGNER)
  // ==========================================
  if (letter.hasTranslation && letter.translatedLetter) {
    const trans = letter.translatedLetter;

    // Page Break to start translated letter on a fresh page
    children.push(
      new Paragraph({
        children: [new PageBreak()]
      })
    );

    const docTransHeader = getDocTranslatedHeader(letter.translationLanguage);

    // Header Title
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: docTransHeader.title,
            bold: true,
            size: 24,
            color: "1D4ED8",
            font: "Arial",
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: docTransHeader.subtitle,
            italics: true,
            size: 16,
            color: "555555",
            font: "Arial",
          }),
        ],
      })
    );

    // Greeting (Translated)
    children.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 180 },
        children: [
          new TextRun({ text: trans.greeting, font: "Arial", size: 21, italics: true }),
        ],
      })
    );

    // Intro (Translated)
    addFormattedParagraphs(children, trans.intro, true);

    // CooperativesIntro (Translated)
    addFormattedParagraphs(children, trans.cooperativesIntro, true);

    // PublicOfficesIntro (Translated)
    addFormattedParagraphs(children, trans.publicOfficesIntro, true);

    // SchoolsIntro (Translated)
    if (letter.italianSchools && letter.italianSchools.length > 0 && trans.schoolsIntro) {
      addFormattedParagraphs(children, trans.schoolsIntro, true, "1D4ED8");
    }

    // Conclusion (Translated)
    addFormattedParagraphs(children, trans.conclusion, true);


    // ==========================================
    // PAGE 4: TRANSLATED ANNEXES (IF FOREIGNER)
    // ==========================================
    children.push(
      new Paragraph({
        children: [new PageBreak()]
      })
    );

    // Annex Header (Translated)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: getDocLabel("Annex", letter.translationLanguage).toUpperCase(),
            bold: true,
            size: 24,
            color: "143642", // Navy
            font: "Arial",
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: getDocLabel("ContactDetails", letter.translationLanguage),
            italics: true,
            size: 16,
            color: "555555",
            font: "Arial",
          }),
        ],
      })
    );

    // Translated Officina Opportunity section if selected
    if (letter.officinaOpportunity) {
      const officinaInfo = getDocOfficinaOpportunityText(letter.translationLanguage);
      children.push(
        new Paragraph({
          spacing: { before: 150, after: 60 },
          children: [
            new TextRun({
              text: officinaInfo.title,
              bold: true,
              size: 20,
              color: "1D4ED8", // Dark Blue
              font: "Arial",
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: officinaInfo.line,
              bold: true,
              font: "Arial",
              size: 19,
              color: "333333",
            }),
          ],
        })
      );
    }

    // SECTION A: COOPERATIVES (Translated)
    if (!isAltro) {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 150 },
          children: [
            new TextRun({
              text: getDocLabel("A", letter.translationLanguage).toUpperCase(),
              bold: true,
              size: 20,
              color: "1D4ED8", // Dark Blue
              font: "Arial",
            }),
          ],
        })
      );

      letter.cooperatives.forEach((coop, index) => {
        children.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({ text: `${index + 1}. ${coop.translatedName || coop.name}`, bold: true, color: "143642", font: "Arial", size: 20 }),
              new TextRun({ text: `\n   • ${getDocLabel("Address", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
              new TextRun({ text: coop.address, font: "Arial", size: 18 }),
              new TextRun({ text: `\n   • ${getDocLabel("Phone", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
              new TextRun({ text: coop.phone, font: "Arial", size: 18 }),
              new TextRun({ text: `\n   • ${getDocLabel("Hours", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
              new TextRun({ text: coop.hours, font: "Arial", size: 18 }),
              ...(coop.email ? [
                new TextRun({ text: `\n   • Email: `, bold: true, font: "Arial", size: 18 }),
                new TextRun({ text: coop.email, font: "Arial", size: 18 })
              ] : []),
              new TextRun({ text: `\n   • ${getDocLabel("Activity", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
              new TextRun({ text: coop.translatedDescription || coop.description, font: "Arial", italics: true, size: 18 }),
            ],
          })
        );
      });
    }

    // SECTION B: PUBLIC OFFICES (Translated)
    children.push(
      new Paragraph({
        spacing: { before: 250, after: 150 },
        children: [
          new TextRun({
            text: getDocSectionLabelText("B", letter.translationLanguage, isAltro).toUpperCase(),
            bold: true,
            size: 20,
            color: "1D4ED8",
            font: "Arial",
          }),
        ],
      })
    );

    letter.publicOffices.forEach((office, index) => {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 80, after: 80 },
          children: [
            new TextRun({ text: `${index + 1}. ${office.translatedName || office.name} (${office.translatedType || office.type})`, bold: true, color: "143642", font: "Arial", size: 20 }),
            new TextRun({ text: `\n   • ${getDocLabel("Address", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: office.address, font: "Arial", size: 18 }),
            new TextRun({ text: `\n   • ${getDocLabel("Phone", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: office.phone, font: "Arial", size: 18 }),
            new TextRun({ text: `\n   • ${getDocLabel("Hours", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: office.hours, font: "Arial", size: 18 }),
            ...(office.email ? [
              new TextRun({ text: `\n   • Email: `, bold: true, font: "Arial", size: 18 }),
              new TextRun({ text: office.email, font: "Arial", size: 18 })
            ] : []),
            new TextRun({ text: `\n   • ${getDocLabel("Support", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: office.translatedDescription || office.description, font: "Arial", italics: true, size: 18 }),
          ],
        })
      );
    });

    // SECTION C: ITALIAN SCHOOLS (Translated)
    if (letter.italianSchools && letter.italianSchools.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 250, after: 150 },
          children: [
            new TextRun({
              text: getDocSectionLabelText("C", letter.translationLanguage, isAltro).toUpperCase(),
              bold: true,
              size: 20,
              color: "1D4ED8",
              font: "Arial",
            }),
          ],
        })
      );

      letter.italianSchools.forEach((school, index) => {
        children.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({ text: `${index + 1}. ${school.translatedName || school.name}`, bold: true, color: "143642", font: "Arial", size: 20 }),
              new TextRun({ text: `\n   • ${getDocLabel("Address", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
              new TextRun({ text: school.address, font: "Arial", size: 18 }),
              new TextRun({ text: `\n   • ${getDocLabel("Phone", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
              new TextRun({ text: school.phone, font: "Arial", size: 18 }),
              new TextRun({ text: `\n   • ${getDocLabel("Hours", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
              new TextRun({ text: school.hours, font: "Arial", size: 18 }),
              ...(school.email ? [
                new TextRun({ text: `\n   • Email: `, bold: true, font: "Arial", size: 18 }),
                new TextRun({ text: school.email, font: "Arial", size: 18 })
              ] : []),
              new TextRun({ text: `\n   • ${getDocLabel("Activity", letter.translationLanguage)}: `, bold: true, font: "Arial", size: 18 }),
              new TextRun({ text: school.translatedDescription || school.description, font: "Arial", italics: true, size: 18 }),
            ],
          })
        );
      });
    }

    // SECTION D: SITI INTERNET E APP CONSIGLIATI (Translated)
    const translatedSitesData = getUsefulSitesAndApps(letter.translationLanguage);
    const transDPrefix = isAltro ? (letter.italianSchools && letter.italianSchools.length > 0 ? "C." : "B.") : "D.";
    children.push(
      new Paragraph({
        spacing: { before: 250, after: 150 },
        children: [
          new TextRun({
            text: translatedSitesData.sectionTitle.replace(/^D\./, transDPrefix).replace(/^Г\./, transDPrefix === "C." ? "В." : "Б."),
            bold: true,
            size: 20,
            color: "1D4ED8",
            font: "Arial",
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: translatedSitesData.websitesTitle,
            bold: true,
            font: "Arial",
            size: 18,
            color: "143642"
          }),
        ],
      })
    );

    translatedSitesData.websites.forEach((site) => {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({ text: `• ${site.name} (${site.url}): `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: site.desc, font: "Arial", size: 18 }),
          ],
        })
      );
    });

    children.push(
      new Paragraph({
        spacing: { before: 150, after: 100 },
        children: [
          new TextRun({
            text: translatedSitesData.appsTitle,
            bold: true,
            font: "Arial",
            size: 18,
            color: "143642"
          }),
        ],
      })
    );

    translatedSitesData.apps.forEach((appItem) => {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({ text: `• ${appItem.name}: `, bold: true, font: "Arial", size: 18 }),
            new TextRun({ text: appItem.desc, font: "Arial", size: 18 }),
          ],
        })
      );
    });
  }

  // Final Footer signature
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: "Servizio Orientamento Lavoro Roma - Contatti Territoriali",
          size: 16,
          color: "777777",
          font: "Arial",
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134,    // 2.0 cm (in twentieths of a point)
              bottom: 1134, // 2.0 cm
              left: 1417,   // 2.5 cm
              right: 1417,  // 2.5 cm
            }
          }
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}
