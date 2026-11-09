import { GeneratedLetter, Cooperative, PublicOffice, ItalianSchool, LetterSection } from "../types";
import { queryLocalDb, getPublicOfficesForZone, getItalianSchoolsForZone } from "./localDb";

// Translation dictionaries for offline fallback (Integral, word-for-word literal translations)
const translations: Record<string, {
  language: string;
  greeting: string;
  intro: string;
  cooperativesIntro: string;
  publicOfficesIntro: string;
  schoolsIntro?: string;
  conclusion: string;
}> = {
  english: {
    language: "Inglese",
    greeting: "Dear ${recipientName},",
    intro: "we are pleased that you have turned to us for help in your job search. We seek to help you find opportunities suitable for you and, to do this, we would like — in a spirit of friendship — to give you some suggestions.\n\nFirst of all, consider that SEARCHING FOR A JOB IS A JOB IN ITSELF: that is, the search must be done with commitment, respecting certain hours that you set yourself (for example, 2 hours a day), consulting and searching independently all job offer points, websites, apps, agencies, etc. We are available to give you advice and direct you, but the search must be done by yourself, also because personal data is requested for registration. We will do together:",
    cooperativesIntro: "1. CURRICULUM VITAE: it serves to list your work experiences, to indicate the job you want, and to understand where to best commit yourself in the search. The curriculum must be updated as much as possible. In the curriculum, we will also list your strengths and see if you want to commit to areas other than those followed so far.\n\n2. JOB SEARCH: we suggest some websites or Apps where you will have to register (we have attached a dedicated section — Section D attached — with the complete list of the most useful websites and apps for job hunting), attaching your Curriculum and providing other information. You must check these sites often (every 1-2 days) because offers fly away quickly if you do not reply. In addition, you can visit or call job agencies, cooperatives, etc. (we will give you some references, but you must contact them and make an appointment). Attached you will find a list of 10 addresses in Rome where you can go and leave your curriculum; they are specialized in looking for people who do the job you want.",
    publicOfficesIntro: "3. REGISTRATION AT THE EMPLOYMENT CENTER: check that you are correctly registered at the Employment Center (CPI) or other Employment Center in Rome. If you haven't done it yet, it is the first thing you must do. If you need a hand in filling out the forms, we will help you.\n\n4. OTHER MUNICIPAL OFFICES: we also suggest going to the COL Job Orientation Center and to Portafuturo at Via Galvani 108 (near the Piramide Metro); these are other municipal offices that can help you look for a job.\n\n5. OUR ALERTS: if we receive direct job offers or through our headquarters, we will notify you by email.",
    schoolsIntro: "A fundamental thing to find a job is to speak Italian well: if you do not speak well yet, attached we provide a list of free schools for foreigners; attend them and practice as much as possible in speaking Italian. It is very important!",
    conclusion: "During your job search, our orientation desk remains available to give you support and also to help you evaluate any proposals; come visit us or make a new appointment to inform each other about the job search.\n\nGood luck with your job search."
  },
  spanish: {
    language: "Spagnolo",
    greeting: "Estimado/a ${recipientName},",
    intro: "nos complace que se haya dirigido a nosotros para solicitar ayuda en su búsqueda de empleo. Intentamos ayudarle a encontrar oportunidades adecuadas para usted y, para ello, quisiéramos — con espíritu de amistad — darle algunas sugerencias.\n\nAnte todo, considere que BUSCAR TRABAJO ES UN TRABAJO: es decir, la búsqueda debe hacerse con compromiso, respetando ciertos horarios que usted mismo establezca (por ejemplo, 2 horas al día), consultando y buscando de manera autónoma en todos los puntos de oferta de trabajo, sitios web, aplicaciones, agencias, etc. Nosotros estamos disponibles para darle consejos y orientarle, pero la búsqueda debe hacerla usted mismo, también porque se solicitan datos personales para el registro. Juntos haremos:",
    cooperativesIntro: "1. CURRÍCULUM: sirve para enumerar sus experiencias laborales, para indicar el trabajo deseado y comprender dónde comprometerse mejor en la búsqueda. El currículum debe actualizarse lo más posible. En el currículum también enumeraremos sus puntos fuertes y veremos si desea comprometerse en otras áreas distintas a las seguidas hasta ahora.\n\n2. BÚSQUEDA DE TRABAJO: le sugerimos algunos sitios web o aplicaciones donde deberá registrarse (hemos adjuntado una sección especial — la Sección D adjunta — con la lista completa de los sitios web y aplicaciones más útiles para la búsqueda de empleo), adjuntando su currículum y proporcionando otra información. Debe consultar estos sitios a menudo (cada 1-2 días) porque las ofertas desaparecen rápidamente si no responde. Además, puede visitar o llamar a agencias de empleo, cooperativas, etc. (de las cuales le daremos algunas referencias, pero debe ser usted quien se ponga en contacto con ellos y concierte una cita). En el anexo encontrará la lista de 10 direcciones en Roma donde puede ir y dejar su currículum; están especializadas en la búsqueda de personas que realizan el trabajo que usted desea.",
    publicOfficesIntro: "3. INSCRIPCIÓN EN EL CENTRO DE EMPLEO: verifique que esté correctamente inscrito en el Centro de Empleo (CPI) u otro Centro de Empleo de Roma. Si aún no lo ha hecho, es lo primero que debe hacer. Si necesita ayuda para completar los formularios, nosotros le ayudaremos.\n\n4. OTRAS OFICINAS MUNICIPALES: también le sugerimos ir al COL Centro de Orientación Laboral y a Portafuturo en Via Galvani 108 (cerca del Metro Piramide); son otras oficinas municipales que le pueden ayudar a buscar trabajo.\n\n5. NUESTRAS NOTIFICACIONES: si nos llegan ofertas de trabajo directas o a través de nuestra sede, se las notificaremos por correo electrónico.",
    schoolsIntro: "Algo fundamental para encontrar trabajo es hablar bien el italiano: si aún no habla bien, en el anexo le presentamos una lista de escuelas gratuitas para extranjeros; asista a ellas y practique lo más posible hablando italiano. ¡Es sumamente importante!",
    conclusion: "Durante la búsqueda de empleo, nuestro centro de orientación está disponible para brindarle apoyo y también para ayudarle a evaluar posibles propuestas; venga a visitarnos o concierte una nueva cita para informarnos mutuamente sobre la búsqueda de empleo.\n\n¡Buena suerte en su búsqueda de empleo!"
  },
  romanian: {
    language: "Rumeno",
    greeting: "Stimate/Stimată ${recipientName},",
    intro: "ne bucurăm că te-ai adresat nouă pentru a cere ajutor în căutarea unui loc de muncă. Încercăm să te ajutăm să găsești oportunități potrivite pentru tine și, pentru a face acest lucru, am dori — în spirit de prietenie — să îți oferim câteva sugestii.\n\nÎn primul rând, consideră că A CĂUTA UN LOC DE MUNCĂ ESTE O MUNCĂ ÎN SINE: adică căutarea trebuie făcută cu implicare, respectând anumite ore pe care le stabilești singur (de ex. 2 ore pe zi), consultând și căutând în mod autonom în toate punctele de ofertă de muncă, site-uri de internet, aplicații, agenții etc. Noi suntem disponibili să îți oferim sfaturi și să te îndrumăm, dar căutarea trebuie făcută de tine însuți, de asemenea pentru că se solicită date personale pentru înregistrare. Împreună vom face:",
    cooperativesIntro: "1. CURRICULUM VITAE: servește la listarea experiențelor tale de muncă, la indicarea locului de muncă dorit și la înțelegerii unde să te implici cel mai bine în căutare. Curriculumul trebuie actualizat cât mai mult posibil. În curriculum vom lista și punctele tale forte și vom vedea dacă dorești să te implici și în alte domenii diferite de cele urmate până acum.\n\n2. CĂUTAREA LOCULUI DE MUNCĂ: îți sugerăm câteva site-uri de internet sau aplicații unde va trebui să te înregistrezi (am atașat o secțiune dedicată — Secțiunea D din anexă — cu lista completă a celor mai utile site-uri și aplicații pentru căutarea unui loc de muncă), atașând Curriculumul tău și furnizând alte informații. Trebuie să consulți des aceste site-uri (la fiecare 1-2 zile) deoarece ofertele dispar rapid dacă nu răspunzi. În plus, poți vizita sau telefona la agenții de muncă, cooperative etc. (despre care îți vom oferit câteva referințe, dar trebuie să fii tu cel care îi contactează și își face programare). În anexă găsești lista cu 10 adrese din Roma unde poți merge și lăsa curriculumul; acestea sunt specializate în căutarea persoanelor care fac munca pe care o dorești.",
    publicOfficesIntro: "3. ÎNREGISTRAREA LA CENTRUL DE OCUPARE A FORȚEI DE MUNCĂ: verifică dacă ești înregistrat corect la Centrul de Ocupare (CPI) sau la alt Centru de Ocupare din Roma. Dacă nu ai făcut-o încă, este primul lucru pe care trebuie să-l faci. Dacă ai nevoie de ajutor la completarea formularelor, te ajutăm noi.\n\n4. ALTE BIROURI MUNICIPALE: îți sugerăm de asemenea să mergi la COL Centrul de Orientare Profesională și la Portafuturo din Via Galvani 108 (lângă stația Metro Piramide); acestea sunt alte birouri municipale care te pot ajuta să cauți un loc de muncă.\n\n5. ALERTELE NOASTRE: dacă primim oferte de muncă directe sau prin intermediul sediului nostru, te vom anunța prin e-mail.",
    schoolsIntro: "Un factor esențial pentru a găsi de lucru în Italia este cunoașterea limbii italiene. Dacă nu o vorbești bine, în anexă îți punem la dispoziție o listă de școli gratuite pentru străini; frecventează-le și exersează cât mai mult posibil vorbirea limbii italiene. Esențial!",
    conclusion: "În timpul căutării unui loc de muncă, centrul nostru de orientare rămâne la dispoziția ta pentru a-ți oferi sprijin. Succes în căutarea unui loc de muncă!"
  },
  ukrainian: {
    language: "Ucraino",
    greeting: "Шановний/а ${recipientName},",
    intro: "ми раді, що ви звернулися до нас за допомогою у пошуку роботи. Ми намагаємося допомогти вам знайти відповідні можливості і для цього хотіли б — у дружньому дусі — дати вам кілька порад.\n\nПерш за все, враховуйте, що ПОШУК РОБОТИ — ЦЕ ТАКОЖ РОБОТА: тобто пошук має здійснюватися наполегливо, з дотриманням певних годин, які ви встановлюєте самі (наприклад, 2 години на день), самостійно консультуючись і шукаючи в усіх джерелах пропозицій роботи, на інтернет-сайтах, у додатках, агенціях тощо. Ми готові надати поради, але пошук ви повинні здійснювати самостійно. Разом ми зробимо:",
    cooperativesIntro: "1. РЕЗЮМЕ: слугує для переліку вашого робочого досвіду та бажаної роботи. Резюме має бути максимально оновленим.\n\n2. ПОШУК РОБОТИ: ми пропонуємо сайти та додатки, де вам потрібно зареєструватися (див. Додаток D). Регулярно перевіряйте їх (кожні 1-2 дні). У додатку ви знайдете список з 10 адрес у Римі, де можна залишити резюме.",
    publicOfficesIntro: "3. РЕЄСТРАЦІЯ В ЦЕНТРІ ПРАЦЕВЛАШТУВАННЯ: перевірте, чи ви зареєстровані в Центрі зайнятості (CPI) у Римі.\n\n4. ІНШІ МУНІЦИПАЛЬНІ ОФІСИ: рекомендуємо звернутися до COL та Portafuturo за адресою Via Galvani 108.\n\n5. НАШІ ОПОВІЩЕННЯ: якщо ми отримаємо прямі вакансії, ми повідомимо вас електронною поштою.",
    schoolsIntro: "Фундаментальною річчю для пошуку роботи є хороше володіння італійською мовою: якщо ви ще не розмовляєте добре, ми надаємо список безкоштовних шкіл для іноземців; відвідуйте їх та практикуйтеся!",
    conclusion: "Під час пошуку роботи наш центр орієнтації залишається у вашому розпорядженні. Успіхів у пошуку роботи!"
  },
  french: {
    language: "Francese",
    greeting: "Cher/Chère ${recipientName},",
    intro: "nous sommes ravis que vous vous soyez adressé(e) à nous pour demander de l'aide dans votre recherche d'emploi. Nous essayons de vous aider à trouver des opportunités adaptées à vos besoins et, pour ce faire, nous aimerions — dans un esprit d'amitié — vous donner quelques suggestions.\n\nTout d'abord, considérez que CHERCHER UN EMPLOI EST UN TRAVAIL : c'est-à-dire que la recherche doit être faite avec engagement, en respectant certains horaires que vous fixez vous-même (par exemple, 2 heures par jour), en consultant et en recherchant de manière autonome tous les points d'offres d'emploi, les sites internet, les applications, les agences, etc. Nous sommes disponibles pour vous conseiller et vous orienter, mais la recherche doit être faite par vous-même, également parce que des données personnelles sont demandées pour l'inscription. Nous ferons ensemble :",
    cooperativesIntro: "1. CURRICULUM VITAE : il sert à lister vos expériences professionnelles, à indiquer l'emploi désiré et à comprendre où vous investir au mieux. Le CV doit être mis à jour autant que possible.\n\n2. RECHERCHE D'EMPLOI : nous vous suggérons des sites web ou applications où vous devrez vous inscrire (voir Section D jointe). Vous devez consulter ces sites souvent (tous les 1-2 jours). Vous trouverez en annexe 10 adresses à Rome où déposer votre CV.",
    publicOfficesIntro: "3. INSCRIPTION AU CENTRE POUR L'EMPLOI : vérifiez que vous êtes correctement inscrit(e) au Centre pour l'Emploi (CPI) de Rome.\n\n4. AUTRES BUREAUX MUNICIPAUX : nous vous suggérons d'aller au Centre d'Orientation COL et à Portafuturo au Via Galvani 108.\n\n5. NOS ALERTES : si nous recevons des offres d'emploi directes, nous vous en informerons par e-mail.",
    schoolsIntro: "Une chose fondamentale pour trouver un emploi est de bien parler italien : si vous ne le parlez pas encore bien, nous vous fournissons une liste d'écoles gratuites pour étrangers ; fréquentez-les et pratiquez autant que possible !",
    conclusion: "Pendant votre recherche d'emploi, notre centre d'orientation reste à votre disposition. Bon courage dans votre recherche d'emploi !"
  },
  arabic: {
    language: "Arabo",
    greeting: "عزيزي/عزيزتي ${recipientName}،",
    intro: "يسعدنا تواصلك معنا لطلب المساعدة في البحث عن عمل. نحن نحاول مساعدتك في إيجاد الفرص المناسبة لك، وللقيام بذلك نود — بروح الصداقة — تقديم بعض المقترحات لك.\n\nأولاً وقبل كل شيء، ضع في اعتبارك أن البحث عن عمل هو عمل في حد ذاته: أي أن البحث يجب أن يتم بانتظام، مع الالتزام بساعات معينة تحددها بنفسك (على سبيل المثال، ساعتان يوميًا)، والبحث بشكل مستقل في جميع مواقع الوظائف والتطبيقات والوكالات. نحن متاحون لتقديم النصيحة والتوجيه، ولكن يجب أن تقوم بالبحث بنفسك. سنقوم معًا بـ:",
    cooperativesIntro: "1. السيرة الذاتية: تُستخدم لإدراج خبراتك العملية وتحديد العمل المطلوب. يجب تحديث السيرة الذاتية قدر الإمكان.\n\n2. البحث عن عمل: نقترح عليك بعض المواقع أو التطبيقات التي يجب أن تسجل فيها (راجع المرفق D). يجب عليك مراجعة هذه المواقع بانتظام (كل 1-2 يوم). ستجد في المرفق قائمة بـ 10 عناوين في روما يمكنك الذهاب إليها وترك سيرتك الذاتية.",
    publicOfficesIntro: "3. التسجيل في مركز التوظيف: تحقق من تسجيلك بشكل صحيح في مركز التوظيف (CPI) في روما (${cpiDetails}). إذا لم تكن قد قمت بذلك بعد، فهذا هو أول شيء يجب عليك القيام به.\n\n4. المكاتب البلدية الأخرى: نقترح عليك أيضًا الذهاب إلى مركز التوجيه المهني COL في (${colDetails}) و Portafuturo في Via Galvani 108 (بالقرب من محطة Piramide)؛ هذه مكاتب بلدية أخرى يمكنها مساعدتك في البحث عن عمل.\n\n5. إشعاراتنا: إذا تلقينا عروض عمل مباشرة، سنقوم بإخطارك عبر البريد الإلكتروني.",
    schoolsIntro: "أمر أساسي للعثور على عمل هو التحدث بالإيطالية بشكل جيد: إذا كنت لا تتحدث بها جيدًا بعد، فنحن نقدم قائمة بالمدارس المجانية للأجانب؛ احضرها وتدرب قدر الإمكان!",
    conclusion: "خلال رحلة البحث عن عمل، يظل مركز التوجيه الخاص بنا في خدمتك لتقديم الدعم. نتمنى لك التوفيق في البحث عن عمل!"
  },
  cingalese: {
    language: "Cingalese",
    greeting: "හිතවත් ${recipientName},",
    intro: "රැකියා සෙවීමේදී උපකාර පැතීම සඳහා ඔබ අප වෙත පැමිණීම පිළිබඳව අප සතුටු වෙමු. ඔබට ගැළපෙන අවස්ථා සොයා ගැනීමට අපි උදවු කිරීමට උත්සාහ කරමු, මිත්‍රත්වයේ හැඟීමෙන් — ඔබට යෝජනා කිහිපයක් ලබා දීමට අපි කැමැත්තෙමු.\n\nපළමුවෙන්ම, රැකියාවක් සෙවීම යනු රැකියාවක් බව සලකන්න: එනම් සෙවීම කැපවීමෙන් කළ යුතු අතර, ඔබ විසින්ම නියම කර ගන්නා නිශ්චිත වේලාවන් (උදාහරණයක් ලෙස දිනකට පැය 2ක්) ගරු කරමින්, සියලුම රැකියා පිරිනැමීමේ ස්ථාන, වෙබ් අඩවි, ඇප්ස්, ආයතන ආදිය ස්වාධීනව විමසමින් සහ සොයමින් කළ යුතුය. අප ඔබට උපදෙස් දීමට සහ මඟ පෙන්වීමට සූදානම්ව සිටින නමුත්, ලියාපදිංචිය සඳහා පුද්ගලික දත්ත ඉල්ලා සිටින බැවින් සෙවීම ඔබ විසින්ම කළ යුතුය. අපි එකට කරන්නෙමු:",
    cooperativesIntro: "1. ජීව දත්ත පත්‍රිකාව (CURRICULUM VITAE): මෙය ඔබගේ සේවා පළපුරුද්ද ලැයිස්තුගත කිරීමට, ඔබ කැමති රැකියාව දැක්වීමට සහ සෙවීමේදී වඩාත් හොඳින් කැපවිය යුත්තේ කොතැනද යන්න තේරුම් ගැනීමට උපකාරී වේ. ජීව දත්ත පත්‍රිකාව හැකි උපරිමයෙන් යාවත්කාලීන කළ යුතුය. ජීව දත්ත පත්‍රිකාවේ අපි ඔබගේ ශක්තීන් ලැයිස්තුගත කරන අතර මෙතෙක් අනුගමනය කළ ක්ෂේත්‍ර හැර වෙනත් ක්ෂේත්‍රවල නිරත වීමට ඔබට අවශ්‍ය දැයි බලමු.\n\n2. රැකියා සෙවීම: ඔබ ලියාපදිංචි විය යුතු සමහර වෙබ් අඩවි හෝ ඇප්ස් අපි ඔබට යෝජනා කරමු (රැකියා සෙවීම සඳහා වඩාත් ප්‍රයෝජනවත් වෙබ් අඩවි සහ ඇප්ස් පිළිබඳ සම්පූර්ණ ලැයිස්තුවක් ඇමුණුමෙහි ඇති ඩී කොටසේ අමුණා ඇත), එහිදී ඔබගේ ජීව දත්ත පත්‍රිකාව අමුණා වෙනත් තොරතුරු සැපයිය යුතුය. ඔබ මෙම වෙබ් අඩවි නිතර (සෑම දින 1-2 කට වරක්) පරීක්ෂා කළ යුතුය, මන්ද ඔබ පිළිතුරු නොදුනහොත් රැකියා දීමනා ඉක්මනින් මඟ හැරී යනු ඇත. මීට අමතරව, ඔබට රැකියා නියෝජිත ආයතන, සමුපකාර සමිති ආදිය වෙත යාමට හෝ දුරකථනයෙන් ඇමතීමට හැකිය (අපි ඔබට යොමු කිහිපයක් ලබා දෙන්නෙමු, නමුත් ඔබ ඔවුන් හා සම්බන්ධ වී හමුවීමක් වෙන් කරවා ගත යුතුය). ඔබට යා හැකි සහ ඔබේ ජීව දත්ත පත්‍රිකාව භාර දිය හැකි රෝමයේ ලිපින 10 ක ලැයිස්තුවක් ඇමුණුමෙහි දැක්වේ; ඔබ කැමති රැකියාව කරන පුද්ගලයින් සෙවීම සඳහා ඔවුන් විශේෂඥයෝ වෙති.",
    publicOfficesIntro: "3. රැකියා මධ්‍යස්ථානයේ ලියාපදිංචිය: ඔබ ඔබේ ප්‍රදේශයේ රැකියා මධ්‍යස්ථානයේ (CPI) හෝ වෙනත් රැකියා මධ්‍යස්ථානයක නිවැරදිව ලියාපදිංචි වී ඇත්දැයි පරීක්ෂා කරන්න. ඔබ තවමත් එය කර නොමැති නම්, ඔබ මුලින්ම කළ යුතු දේ එයයි. ඔබට පෝරම පිරවීම සඳහා උපකාර අවශ්‍ය නම්, අපි ඔබට උදවු කරන්නෙමු.\n\n4. වෙනත් නගර සභා කාර්යාල: COL රැකියා දිශානති මධ්‍යස්ථානය සහ Via Galvani 108 (Piramide මෙට්‍රෝව අසල) පිහිටි Portafuturo වෙත යන ලෙසද අපි ඔබට යෝජනා කරමු; රැකියා සෙවීමට ඔබට උපකාර කළ හැකි වෙනත් නගර සභා කාර්යාල මේවා වේ.\n\n5. අපගේ දැනුම්දීම්: අපට සෘජුව හෝ අපගේ මූලස්ථානය හරහා රැකියා දීමනා ලැබුණහොත්, අපි ඔබට විද්‍යුත් තැපෑලෙන් දැනුම් දෙන්නෙමු.",
    schoolsIntro: "රැකියාවක් සොයා ගැනීමට අත්‍යවශ්‍ය කරුණක් වන්නේ ඉතාලි භාෂාව හොඳින් කතා කිරීමයි: ඔබ තවමත් හොඳින් කතා නොකරන්නේ නම්, විදේශිකයන් සඳහා නොමිලේ පවත්වන පාසල් ලැයිස්තුවක් ඇමුණුමේ දක්වා ඇත; ඒවාට සහභාගී වී ඉතාලි භාෂාව කතා කිරීමට හැකි තරම් පුහුණු වන්න. එය ඉතා වැදගත් වේ!",
    conclusion: "රැකියා සෙවීමේදී, අපගේ සවන්දීමේ සහ මඟ පෙන්වීමේ මධ්‍යස්ථානය ඔබට සහාය වීමට මෙන්ම ඕනෑම රැකියා යෝජනාවක් ඇගයීමට ඔබට උපකාර කිරීමට සැමවිටම සූදානම්ව සිටී; අප හමුවීමට පැමිණෙන්න හෝ රැකියා සෙවීම පිළිබඳව එකිනෙකා දැනුවත් කිරීමට නව හමුවීමක් වෙන් කරවා ගන්න.\n\nරැකියාවක් සෙවීමෙහි ඔබේ කාර්යය සාර්ථක වේවා."
  },
  polish: {
    language: "Polacco",
    greeting: "Drogi/Droga ${recipientName},",
    intro: "cieszymy się, że zwróciłeś/aś się do nas o pomoc w poszukiwaniu pracy. Staramy się pomóc Ci znaleźć odpowiednie dla Ciebie możliwości i w tym celu chcielibyśmy — w duchu przyjaźni — przekazać Ci kilka wskazówek.\n\nPrzede wszystkim pamiętaj, że POSZUKIWANIE PRACY TO TEŻ PRACA: poszukiwania należy prowadzić z zaangażowaniem, przestrzegając wyznaczonych godzin (np. 2 godziny dziennie), samodzielnie sprawdzając oferty pracy, strony internetowe, aplikacje, agencje itp. Jesteśmy do Twojej dyspozycji, aby służyć Ci radą i kierować Cię, ale poszukiwania musisz prowadzić samodzielnie. Razem zrobimy:",
    cooperativesIntro: "1. CURRICULUM VITAE: służy do przedstawienia Twojego doświadczenia zawodowego, wskazania pożądanej pracy i zrozumienia, gdzie najlepiej zaangażować się w poszukiwania. CV musi być jak najbardziej aktualne.\n\n2. POSZUKIWANIE PRACY: sugerujemy kilka stron internetowych lub aplikacji, na których należy się zarejestrować (w załączniku D znajduje się pełna lista przydatnych stron i aplikacji), dołączając swoje CV. Należy często sprawdzać te strony (co 1-2 dni). W załączniku znajdziesz listę 10 adresów w Rzymie, gdzie możesz udać się i zostawić swoje CV.",
    publicOfficesIntro: "3. REJESTRACJA W URZĘDZIE PRACY: sprawdź, czy jesteś prawidłowo zarejestrowany/a w Urzędzie Pracy (CPI) w Rzymie. Jeśli ještě tego nie zrobiłeś/aś, jest to pierwsza rzecz, którą musisz zrobić.\n\n4. INNE URZĘDY MIEJSKIE: sugerujemy również udanie się do Centrum Orientacji Zawodowej COL i Portafuturo przy Via Galvani 108; są to inne urzędy miejskie, które mogą pomóc w poszukiwaniu pracy.\n\n5. NASZE POWIADOMIENIA: jeśli otrzymamy bezpośrednie oferty pracy, powiadomimy Cię e-mailem.",
    schoolsIntro: "Kluczową rzeczą, aby znaleźć pracę, jest dobra znajomość języka włoskiego: jeśli jeszcze nie mówisz dobrze, w załączniku przedstawiamy listę bezpłatnych szkół dla obcokrajowców; uczęszczaj na nie i ćwicz jak najwięcej!",
    conclusion: "Podczas poszukiwania pracy nasze biuro orientacji pozostaje do Twojej dyspozycji, aby udzielić Ci wsparcia. Życzymy powodzenia w poszukiwaniu pracy!"
  },
  albanian: {
    language: "Albanese",
    greeting: "I/E dashur ${recipientName},",
    intro: "jemi të lumtur që na jeni drejtuar për të kërkuar ndihmë në kërkimin e punës. Ne përpiqemi t'ju ndihmojmë të gjeni mundësi të përshtatshme për ju dhe, për ta bërë këtë, do të donim — në frymën e miqësisë — t'ju jepnim disa sugjerime.\n\nSë pari, konsideroni se KËRKIMI I PUNËS ËSHTË NJË PUNË NË VETVETE: domethënë kërkimi duhet të bëhet me përkushtim, duke respektuar orare të caktuara që i vendosni vetë (për shembull, 2 orë në ditë), duke konsultuar dhe kërkuar në mënyrë autonome në të gjitha pikat e ofertave të punës, uebsajtet, aplikacionet, agjencitë, etj. Ne jemi në dispozicion për t'ju dhënë këshilla, por kërkimi duhet të bëhet nga ju vetë. Së bashku do të bëjmë:",
    cooperativesIntro: "1. CURRICULUM VITAE: shërben për të listuar përvojat tuaja të punës, për të treguar punën e dëshiruar dhe për të kuptuar ku të angazhoheni më mirë. CV-ja duhet të azhurnohet sa më shumë të jetë e mundur.\n\n2. KËRKIMI I PUNËS: ju sugjerojmë disa uebsajte ose aplikacione ku duhet të regjistroheni (kemi bashkëngjitur Seksionin D me listën e plotë të uebsajteve më të dobishme), duke bashkëngjitur CV-në tuaj. Duhet t'i kontrolloni shpesh këto faqe (çdo 1-2 ditë). Në bashkëngjitje do të gjeni një listë me 10 adresa në Romë ku mund të shkoni dhe të lini CV-në tuaj.",
    publicOfficesIntro: "3. REGJISTRIMI NË QENDRËN E PUNËSIMIT: verifikoni që jeni regjistruar saktë në Qendrën e Punësimit (CPI) në Romë. Nëse nuk e keni bërë ende, është gjëja e parë që duhet të bëni.\n\n4. ZYRAT TERA BASHKIAKE: ju sugjerojmë gjithashtu të shkoni në Qendrën e Orientimit në Punë COL dhe në Portafuturo në Via Galvani 108; këto janë zyra të tjera bashkiake që mund t'ju ndihmojnë.\n\n5. NJOFTIMET TONA: nëse marrim oferta direkte pune, do t'ju njoftojmë me email.",
    schoolsIntro: "Një gjë thelbësore për të gjetur punë është të flisni mirë italisht: nëse nuk flisni mirë akoma, në bashkëngjitje ju ofrojmë një listë të shkollave pa pagesë për të huajt; ndiqni ato dhe ushtrohuni sa më shumë!",
    conclusion: "Gjatë kërkimit tuaj të punës, qendra jonë e orientimit mbetet në dispozicionin tuaj për t'ju dhënë mbështetje. Punë të mbarë në kërkimin e punës!"
  },
  bengali: {
    language: "Bengalese",
    greeting: "প্রিয় ${recipientName},",
    intro: "চাকরি খোঁজার কাজে আপনি সাহায্য পেতে আমাদের কাছে এসেছেন বলে আমরা আনন্দিত। আমরা আপনার জন্য উপযুক্ত সুযোগ খুঁজে পেতে সাহায্য করার চেষ্টা করি এবং বন্ধুত্বের মনোভাব নিয়ে আপনাকে কিছু পরামর্শ দিতে চাই।\n\nপ্রথমত, মনে রাখবেন যে চাকরি খোঁজা নিজেই একটি কাজ: অর্থাৎ আত্মনিবেদন এবং নির্দিষ্ট সময়সূচী (যেমন দিনে ২ ঘণ্টা) মেনে স্বায়ত্তশাসিতভাবে বিভিন্ন ওয়েবসাইট, অ্যাপস ও এজেন্সিতে অনুসন্ধান করতে হবে। আমরা পরামর্শ দিতে প্রস্তুত, কিন্তু নিবন্ধন করার জন্য আপনার ব্যক্তিগত তথ্যের প্রয়োজন বলে অনুসন্ধান আপনাকেই করতে হবে। আমরা একসাথে করব:",
    cooperativesIntro: "১. জীবনবৃত্তান্ত (CV): এটি আপনার কাজের অভিজ্ঞতা তালিকাভুক্ত করতে এবং কাঙ্ক্ষিত চাকরি নির্দেশ করতে ব্যবহৃত হয়। এটি সর্বদা হালনাগাদ রাখতে হবে।\n\n২. চাকরি অনুসন্ধান: আমরা কিছু ওয়েবসাইট বা অ্যাপের প্রস্তাব দিচ্ছি যেখানে আপনাকে নিবন্ধিত হতে হবে (সংযুক্ত সেকশন D দেখুন)। এই সাইটগুলি আপনাকে প্রায়শই (প্রতি ১-২ দিনে) পরীক্ষা করতে হবে। সংযুক্ত নথিতে রোমের ১০টি ঠিকানার একটি তালিকা পাবেন যেখানে আপনি আপনার জীবনবৃত্তান্ত জমা দিতে পারেন।",
    publicOfficesIntro: "৩. এমপ্লয়মেন্ট সেন্টারে নিবন্ধন: রোমের এমপ্লয়মেন্ট সেন্টারে (CPI) আপনি সঠিকভাবে নিবন্ধিত কিনা তা পরীক্ষা করুন। หาก না করে থাকেন, তবে এটিই প্রথম কাজ।\n\n৪. অন্যান্য পৌর কার্যালয়: আমরা আপনাকে COL জব ওরিয়েন্টেশন সেন্টার এবং Via Galvani 108-এ Portafuturo-এ যাওয়ার পরামর্শ দিচ্ছি।\n\n৫. আমাদের বিজ্ঞপ্তি: আমরা সরাসরি কোনো চাকরির সুযোগ পেলে আপনাকে ইমেলের মাধ্যমে জানাব।",
    schoolsIntro: "চাকরি পাওয়ার জন্য একটি মৌলিক বিষয় হলো ভালোভাবে ইতালি ভাষা বলা: আপনি যদি এখনো ভালোভাবে না বলেন, তাহলে বিনামূল্যে বিদেশীদের জন্য স্কুলের একটি তালিকা সংযুক্ত করা হলো; নিয়মিত ক্লাস করুন এবং চর্চা করুন।",
    conclusion: "আপনার চাকরি খোঁজার সময় আমাদের কেন্দ্র আপনাকে সহায়তা করতে প্রস্তুত। আপনার চাকরি খোঁজার শুভকামনা!"
  },
  serbian: {
    language: "Serbo",
    greeting: "Dragi/Draga ${recipientName},",
    intro: "drago nam je što ste nam se obratili za pomoć u traženju posla. Nastojimo da vam pomognemo da pronađete odgovarajuće prilike i dajemo vam nekoliko korisnih saveta.\n\nPre svega, imajte na umu da je TRAŽENJE POSLA POSAO SAM PO SEBI: traženje se mora obavljati predano, poštujući određeno vreme (npr. 2 sata dnevno), samostalno pretražujući sve sajtove, aplikacije i agencije. Mi smo tu da vam damo savet, ali pretragu morate obaviti sami. Zajedno ćemo uraditi:",
    cooperativesIntro: "1. RADNA BIOGRAFIJA (CV): služi za navođenje vašeg radnog iskustva i željenog posla. CV mora biti što više ažuriran.\n\n2. TRAŽENJE POSLA: predlažemo nekoliko sajtova i aplikacija na kojima se morate registrovati (u prilogu D nalazi se kompletna lista). Ove sajtove morate često proveravati (svaka 1-2 dana). U prilogu ćete naći listu od 10 adresa u Rimu gde možete otići i ostaviti svoj CV.",
    publicOfficesIntro: "3. REGISTRACIJA U CENTRU ZA ZAPOŠLJAVANJE: proverite da li ste ispravno registrovani u Centru za zapošljavanje (CPI) u Rimu.\n\n4. OSTALE OPŠTINSKE KANCELARIJE: predlažemo da odete u COL Centar za orijentaciju i Portafuturo na adresi Via Galvani 108.\n\n5. NAŠA OBAVEŠTENJA: ako dobijemo direktne ponude za posao, obavestićemo vas putem e-maila.",
    schoolsIntro: "Ključna stvar za pronalaženje posla je dobro poznavanje italijanskog jezika: u prilogu vam nudimo listu besplatnih škola za strance; pohađajte ih i vežbajte što više!",
    conclusion: "Tokom vaše potrage za poslom, naš centar za orijentaciju ostaje vam na raspolaganju. Srećno u traženju posla!"
  },
  bosnian: {
    language: "Bosniaco",
    greeting: "Dragi/Draga ${recipientName},",
    intro: "drago nam je što ste nam se obratili za pomoć u traženju posla. Nastojimo da vam pomognemo da pronađete odgovarajuće prilike i nudimo vam nekoliko korisnih savjeta.\n\nPrije svega, imajte na umu da je TRAŽENJE POSLA POSAO SAM PO SEBI: traženje se mora obavljati predano, poštujući određeno vrijeme (npr. 2 sata dnevno), samostalno pretražujući sajtove, aplikacije i agencije. Mi smo tu da vam damo savjet, ali pretragu morate obaviti sami. Zajedno ćemo uraditi:",
    cooperativesIntro: "1. RADNA BIOGRAFIJA (CV): služi za navođenje vašeg radnog iskustva i željenog posla. CV mora biti ažuriran.\n\n2. TRAŽENJE POSLA: predlažemo nekoliko sajtova i aplikacija na kojima se morate registrovati (u prilogu D nalazi se kompletna lista). Ove sajtove morate često provjeravati (svaka 1-2 dana). U prilogu ćete naći listu od 10 adresa u Rimu gdje možete otići i ostaviti svoj CV.",
    publicOfficesIntro: "3. REGISTRACIJA U CENTRU ZA ZAPOŠLJAVANJE: provjerite da li ste ispravno registrovani u Centru za zapošljavanje (CPI) u Rimu.\n\n4. OSTALE OPĆINSKE KANCELARIJE: predlažemo da odete u COL Centar za orijentaciju i Portafuturo na adresi Via Galvani 108.\n\n5. NAŠA OBAVJEŠTENJA: ako dobijemo direktne ponude za posao, obavijestit ćemo vas putem e-maila.",
    schoolsIntro: "Ključna stvar za pronalaženje posla je dobro poznavanje italijanskog jezika: u prilogu vam nudimo listu besplatnih škola za strance; pohađajte ih i vježbajte što više!",
    conclusion: "Tokom vaše potrage za poslom, naš centar za orijentaciju ostaje vam na raspolaganju. Sretno u traženju posla!"
  },
  bulgarian: {
    language: "Bulgaro",
    greeting: "Уважаеми/а ${recipientName},",
    intro: "радваме се, че се обърнахте към нас за помощ при търсенето на работа. Стремим се да ви помогнем да намерите подходящи възможности и искаме да ви дадем няколко съвета.\n\nПреди всичко имайте предвид, че ТЪРСЕНЕТО НА РАБОТА Е РАБОТА САМО ПО СЕБЕ СИ: търсенето трябва да се извършва с пълна отдаденост, спазвайки определени часове (напр. 2 часа на ден), самостоятелно проверявайки уебсайтове, приложения и агенции. Ние сме на разположение за съвети, но търсенето трябва да направите сами. Заедно ще направим:",
    cooperativesIntro: "1. АВТОБИОГРАФИЯ (CV): служит за описване на вашия трудов опит и желаната работа. CV-то трябва да бъде възможно най-актуално.\n\n2. ТЪРСЕНЕ НА РАБОТА: предлагаме ви няколко уебсайта и приложения, където да се регистрирате (вижте Приложение D). Трябва често да проверявате тези сайтове (на всеки 1-2 дни). В приложението ще намерите списък с 10 адреса в Рим, където да оставите вашето CV.",
    publicOfficesIntro: "3. РЕГИСТРАЦИЯ В БЮРОТО ПО ТРУДА: проверете дали сте правилно регистрирани в Бюрото по труда (CPI) в Рим.\n\n4. ДРУГИ ОБЩИНСКИ ОФИСИ: препоръчваме ви да посетите и COL Център за професионална ориентация и Portafuturo на Via Galvani 108.\n\n5. НАШИТЕ ИЗВЕСТИЯ: ако получим директни оферти за работа, ще ви уведомим по имейл.",
    schoolsIntro: "Основно нещо за намиране на работа е да говорите добре италиански: ако все още не говорите добре, в приложението предоставяме списък с безплатни училища за чужденци; посещавайте ги и упражнявайте езика!",
    conclusion: "По време на търсенето на работа нашият център за ориентация остава на ваше разположение. Успех в търсенето на работа!"
  },
  croatian: {
    language: "Croato",
    greeting: "Dragi/Draga ${recipientName},",
    intro: "drago nam je što ste nam se obratili za pomoć u traženju posla. Nastojimo vam pomoći da pronađete odgovarajuće prilike i dajemo vam nekoliko korisnih savjeta.\n\nPrije svega, imajte na umu da je TRAŽENJE POSLA POSAO SAM PO SEBI: traženje se mora obavljati predano, poštujući određeno vrijeme (npr. 2 sata dnevno), samostalno pretražujući web stranice, aplikacije i agencije. Mi smo tu da vam damo savjet, ali pretragu morate obaviti sami. Zajedno ćemo uraditi:",
    cooperativesIntro: "1. RADNA BIOGRAFIJA (CV): služi za navođenje vašeg radnog iskustva i željenog posla. CV mora biti ažuriran.\n\n2. TRAŽENJE POSLA: predlažemo nekoliko web stranica i aplikacija na kojima se morate registrirati (u prilogu D nalazi se kompletna lista). Ove stranice morate često provjeravati (svaka 1-2 dana). U prilogu ćete naći listu od 10 adresa u Rimu gdje možete otići i ostaviti svoj CV.",
    publicOfficesIntro: "3. REGISTRACIJA U CENTRU ZA ZAPOŠLJAVANJE: provjerite jeste li ispravno registrirani u Centru za zapošljavanje (CPI) u Rimu.\n\n4. OSTALI GRADSKI UREDI: predlažemo da odete u COL Centar za orijentaciju i Portafuturo na adresi Via Galvani 108.\n\n5. NAŠE OBAVIJESTI: ako dobijemo izravne ponude za posao, obavijestit ćemo vas putem e-maila.",
    schoolsIntro: "Ključna stvar za pronalaženje posla je dobro poznavanje talijanskog jezika: u prilogu vam nudimo popis besplatnih škola za strance; pohađajte ih i vježbajte što više!",
    conclusion: "Tijekom vaše potrage za poslom, naš centar za orijentaciju ostaje vam na raspolaganju. Sretno u traženju posla!"
  },
  tagalog: {
    language: "Tagalog (Filippino)",
    greeting: "Mahal naming ${recipientName},",
    intro: "masaya kami na lumapit ka sa amin upang humingi ng tulong sa paghahanap ng trabaho. Layunin naming tulungan kang makahanap ng mga angkop na pagkakataon at magbigay ng ilang payo.\n\nUna sa lahat, tandaan na ANG PAGHAHANAP NG TRABAHO AY ISANG TRABAHO RIN: kailangan itong gawin nang may dedikasyon at tamang oras araw-araw (halimbawa, 2 oras bawat araw) sa pamamagitan ng pagtingin sa mga website, app, at ahensya. Nandito kami upang magpayo, ngunit ikaw mismo ang magrerehistro at maghahanap. Pagtutulungan natin ang mga sumusunod:",
    cooperativesIntro: "1. CURRICULUM VITAE (CV): ginagamit ito upang ilista ang iyong karanasan sa trabaho at ang gustong trabaho. Kailangang updated ang iyong CV.\n\n2. PAGHAHANAP NG TRABAHO: nagmumungkahi kami ng ilang website at app kung saan ka dapat magparehistro (tingnan ang Inilakip na Seksyon D). Bisitahin ang mga ito nang madalas (bawat 1-2 araw). Sa attachment, makakakita ka ng listahan ng 10 address sa Roma kung saan maaari kang mag-iwan ng iyong CV.",
    publicOfficesIntro: "3. PAGPAPAREHISTRO SA EMPLOYMENT CENTER: siguraduhing nakarehistro ka nang tama sa Employment Center (CPI) sa Roma.\n\n4. IBA PANG MGA TANGGAPAN NG LUNGSOD: inirerekomenda rin naming pumunta sa COL Job Orientation Center at sa Portafuturo sa Via Galvani 108.\n\n5. AMING MGA ABISO: kung makakatanggap kami ng direktang alok sa trabaho, ipapaalam namin sa iyo sa pamamagitan ng email.",
    schoolsIntro: "Mahalagang bagay sa paghahanap ng trabaho ang mahusay na pagsasalita ng wikang Italyano: kung hindi ka pa masyadong marunong, nakalakip ang listahan ng mga libreng paaralan para sa mga dayuhan; pumasok dito at magsanay nang husto!",
    conclusion: "Habang naghahanap ng trabaho, ang aming orientation desk ay laging handang sumuporta sa iyo. Good luck sa iyong paghahanap ng trabaho!"
  },
  georgian: {
    language: "Georgiano",
    greeting: "ძვირფასო ${recipientName},",
    intro: "მოხარულნი ვართ, რომ მოგვმართეთ სამუშაოს ძიებაში დახმარებისთვის. ჩვენ ვცდილობთ დაგეხმაროთ შესაფერისი შესაძლებლობების პოვნაში და გვსურს მოგცეთ რამდენიმე რჩევა.\n\nპირველ რიგში, გაითვალისწინეთ, რომ სამუშაოს ძიება თავად არის სამუშაო: ძიება უნდა განხორციელდეს პასუხისმგებლობით (მაგალითად, დღეში 2 საათი), დამოუკიდებლად ვებსაიტების, აპლიკაციებისა და სააგენტოების შემოწმებით. ჩვენ მზად ვართ მოგცეთ რჩევები, მაგრამ ძიება თავად უნდა აწარმოოთ. ერთად გავაკეთებთ:",
    cooperativesIntro: "1. რეზიუმე (CV): ემსახურება თქვენი სამუშაო გამოცდილებისა და სასურველი სამუშაოს მითითებას. CV მაქსიმალურად განახლებული უნდა იყოს.\n\n2. სამუშაოს ძიება: გთავაზობთ რამდენიმე ვებსაიტს ან აპლიკაციას, სადაც უნდა დარეგისტრირდეთ (იხილეთ დანართი D). ეს საიტები ხშირად (ყოველ 1-2 დღეში) უნდა შეამოწმოთ. დანართში იხილავთ რომის 10 მისამართის სიას, სადაც შეგიძლიათ მიბრძანდეთ და დატოვოთ თქვენი CV.",
    publicOfficesIntro: "3. რეგისტრაცია დასაქმების ცენტრში: შეამოწმეთ, ხართ თუ არა სწორად დარეგისტრირებული დასაქმების ცენტრში (CPI) რომში.\n\n4. სხვა მუნიციპალური ოფისები: ასევე გირჩევთ ეწვიოთ COL პროფესიული ორიენტაციის ცენტრს და Portafuturo-ს Via Galvani 108-ზე.\n\n5. ჩვენი შეტყობინებები: პირდაპირი ვაკანსიების მიღების შემთხვევაში, შეგატყობინებთ ელფოსტით.",
    schoolsIntro: "სამუშაოს მოსაძებნად ფუნდამენტურია იტალიური ენის კარგი ცოდნა: თუ ჯერ კარგად ვერ ლაპარაკობთ, თანდართულად გთავაზობთ უფასო სკოლების სიას; იარეთ მათზე და ივარჯიშეთ!",
    conclusion: "სამუშაოს ძიების პროცესში ჩვენი საორიენტაციო ცენტრი რჩება თქვენს განკარგულებაში. წარმატებებს გისურვებთ სამუშაოს ძიებაში!"
  },
  macedonian: {
    language: "Macedone",
    greeting: "Драг/а ${recipientName},",
    intro: "се радуваме што ни се обративте за помош во барањето работа. Се трудиме да ви помогнеме да најдете соодветни можности и сакаме да ви дадеме неколку совети.\n\nПред сè, имајте предвид дека БАРАЊЕТО РАБОТА Е РАБОТА САМО ПО СЕБЕ: барањето мора да се врши посветено, почитувајќи одредено време (на пр. 2 часа дневно), самостојно пребарувајќи сите сајтови, апликации и агенции. Ние сме тука за совет, но пребарувањето мора да го направите самите. Заедно ќе направиме:",
    cooperativesIntro: "1. КУРИКУЛУМ ВИТАЕ (CV): служи за наведување на вашето работно искуство и посакуваната работа. CV-то мора да биде ажурирано.\n\n2. БАРАЊЕ РАБОТА: ви предлагаме неколку веб-сајтови или апликации каде што треба да се регистрирате (видете го Прилог D). Овие сајтови мора да ги проверувате често (на секои 1-2 дена). Во прилог ќе најдете листа од 10 адреси во Рим каде што можете да отидете и да го оставите вашето CV.",
    publicOfficesIntro: "3. РЕГИСТРАЦИЈА ВО ЦЕНТАРОТ ЗА ВРАБОТУВАЊЕ: проверете дали сте правилно регистрирани во Центарот за вработување (CPI) во Рим.\n\n4. ДРУГИ ОПШТИНСКИ КАНЦЕЛАРИИ: ви предлагаме да отидете и во Центарот за ориентација COL и во Portafuturo на Via Galvani 108.\n\n5. НАШИ ИЗВЕСТУВАЊА: доколку добиеме директни понуди за работа, ќе ве известиме преку е-пошта.",
    schoolsIntro: "Клучна работа за наоѓање работа е добро да зборувате италијански: во прилог ви нудиме листа на бесплатни училишта за странци; посетувајте ги и вежбајте што повеќе!",
    conclusion: "За време на вашето барање работа, нашиот центар за ориентација ви стои на располагање. Со среќа во барањето работа!"
  },
  czech: {
    language: "Ceco",
    greeting: "Vážený/á ${recipientName},",
    intro: "jsme rádi, že jste se na nás obrátil/a s žádostí o pomoc při hledání práce. Snažíme se vám pomoci najít vhodné příležitosti a rádi bychom vám dali několik rad.\n\nPředevším mějte na paměti, že HLEDÁNÍ PRÁCE JE PRÁCE SAMA O SOBĚ: hledání musí probíhat s nasazením, v určených hodinách (např. 2 hodiny denně), samostatným vyhledáváním na webech, v aplikacích a agenturách. Jsme vám k dispozici pro radu, ale vyhledávání musíte provádět sami. Společně udělámе:",
    cooperativesIntro: "1. ŽIVOTOPIS (CV): slouží k uvedení vašich pracovních zkušeností a požadované práce. CV musí být co nejvíce aktuální.\n\n2. HLEDÁNÍ PRÁCE: doporučujeme několik webů a aplikací, kde se musíte zaregistrovat (viz Příloha D). Tyto stránky musíte často kontrolovat (každé 1-2 dny). V příloze najdete seznam 10 adres v Římě, kam můžete jít a zanechat svůj životopis.",
    publicOfficesIntro: "3. REGISTRACE NA ÚŘADU PRÁCE: zkontrolujte, zda jste správně registrováni na Úřadu práce (CPI) v Římě.\n\n4. DALŠÍ MĚSTSKÉ ÚŘADY: doporučujeme navštívit také Orientační centrum COL a Portafuturo na Via Galvani 108.\n\n5. NAŠE UPOZORNĚNÍ: pokud obdržíme přímé nabídky práce, upozorníme vás e-mailem.",
    schoolsIntro: "Základní věcí pro nalezení práce je mluvit dobře italsky: v příloze uvádíme seznam bezplatných škol pro cizince; navštěvujte je a trénujte mluvení!",
    conclusion: "Během vašeho hledání práce je vám naše orientační středisko plně k dispozici. Hodně štěstí při hledání práce!"
  },
  somali: {
    language: "Somalo",
    greeting: "Mudanaha/Marwo ${recipientName},",
    intro: "waan ku faraxsan nahay inaad na soo gaadhay si aad caawimaad ugu hesho raadinta shaqada. Waxaan rabnaa inaan ku caawino inaad hesho fursado ku habboon, waxaana rabnaa inaan ku siino talooyin foycan.\n\nHorta ogaaw in RAADINTA SHAQADU TAHAY SHAQO IEED: waa in loo samaystaa waqti go'an maalintii (tusaale 2 saacadood maalintii), iyadoo la baarayso websaydhada, apps-ka iyo wakaaladaha. Waxaan diyaar u nahay inaan talo ku siino, laakiin raadinta waa inaad adigu samaysaa. Wadajir waxaan u samayn doonaa:",
    cooperativesIntro: "1. CURRICULUM VITAE (CV): wuxuu u adeegaa inaad ku qorto khibradaada shaqo iyo shaqada aad rabto. CV-ga waa in mar walba la cusboaysiiyaa.\n\n2. RAADINTA SHAQADA: waxaan kugu talinaynaa websaydhada iyo apps-ka aad ka diiwaan gashan karto (eeg Qaybta D). Waa inaad mar walba hubisaa (1-2 maalmoodba mar). Lifaaqa waxaad ka heli doontaa 10 ciwaan oo Roma ah oo aad CV-gaaga u dhiiban karto.",
    publicOfficesIntro: "3. DIIWAANGELINTA XAFIISKA SHAQADA: hubi inaad si sax ah uga diiwaan gashan tahay Xafiiska Shaqada (CPI) ee Roma.\n\n4. XAFIISYADA KALE EE DEGAANKA: waxaan sidoo kale kugu talinaynaa inaad tagto Xafiiska Orientamento COL iyo Portafuturo ee Via Galvani 108.\n\n5. OGAYSIISYADAYADA: haddii aan helno fursado shaqo oo toos ah, waxaan ku ogeysiin doonaa e-mail.",
    schoolsIntro: "Arrin aad u muhiim ah oo ku saabsan raadinta shaqadu waa inaad si fiican ugu hadasho luqadda Talyaaniga: lifaaqa waxaan ku siineynaa liiska iskuulada lacag la'aanta ah; kaparticipate oo ku exercised!",
    conclusion: "Inta aad ku jirto raadinta shaqada, xafiiskeena haguubinta ayaa diyaar u ah inuu ku caawiyo. Guul ku raadinta shaqada!"
  },
  swahili: {
    language: "Swahili",
    greeting: "Mpendwa ${recipientName},",
    intro: "tunafurahi kwamba umetutafuta kwa msaada wa kutafuta kazi. Tunajaribu kukusaidia kupata fursa zinazokufaa na tunapenda kukupa ushauri mbalimbali.\n\nKwanza kabisa, kumbuka kuwa KUTAFUTA KAZI NI KAZI YENYEWE: inapaswa kufanywa kwa kujitolea, ukizingatia masaa maalum (kwa mfano masaa 2 kwa siku), ukitafuta kwa kujitegemea kwenye tovuti, programu na mashirika. Tuko tayari kukupa ushauri, lakini utafutaji unapaswa kufanywa na wewe mwenyewe. Pamoja tutafanya:",
    cooperativesIntro: "1. CURRICULUM VITAE (CV): inatumiwa kuorodhesha uzoefu wako wa kazi na kazi unayotaka. CV inapaswa sasishwa mara kwa mara.\n\n2. KUTAFUTA KAZI: tunapendekeza tovuti na programu ambazo unapaswa kujisajili (angalia Kiambatisho D). Unapaswa kuangalia tovuti hizi mara kwa mara (kila siku 1-2). Katika kiambatisho utapata orodha ya anwani 10 huko Roma ambapo unaweza kwenda na kuacha CV yako.",
    publicOfficesIntro: "3. USAJILI KATIKA KITUO CHA AJIRA: hakikisha umesajiliwa vyema katika Kituo cha Ajira (CPI) huko Roma.\n\n4. OFISI NYINGINE ZA MANISPAA: tunapendekeza pia kwenda Kituo cha Mwelekeo cha COL na Portafuturo katika Via Galvani 108.\n\n5. TAARIFA ZETU: tukipata fursa za kazi za moja kwa moja, tutaarifu kwa barua pepe.",
    schoolsIntro: "Jambo la msingi la kupata kazi ni kuzungumza Kiitaliano vizuri: katika kiambatisho tunakupa orodha ya shule za bure kwa wageni; hudhuria na ujifunze vizuri!",
    conclusion: "Wakati wa kutafuta kazi, kituo chetu cha kuelekeza kipo tayari kukupa usaidizi. Kila la kheri katika kutafuta kazi!"
  },
  turkish: {
    language: "Turco",
    greeting: "Sayın ${recipientName},",
    intro: "iş arama konusunda bizden yardım istediğiniz için mutluyuz. Size uygun fırsatları bulmanıza yardımcı olmaya çalışıyoruz ve size bazı tavsiyelerde bulunmak istiyoruz.\n\nHer şeyden önce, İŞ ARAMANIN KENDİSİNE BİR İŞ OLDUĞUNU unutmayın: arama işlemi, belirlediğiniz saatlere uyarak (örneğin günde 2 saat), web sitelerini, uygulamaları ve ajansları bağımsız olarak kontrol ederek kararlılıkla yapılmalıdır. Danışmanlık vermeye hazırız ancak başvuruları kendiniz yapmalısınız. Birlikte şunları yapacağız:",
    cooperativesIntro: "1. ÖZGEÇMİŞ (CV): iş deneyimlerinizi ve istediğiniz işi belirtmeye yarar. Özgeçmişiniz güncel tutulmalıdır.\n\n2. İŞ ARAMA: kaydolmanız gereken bazı web siteleri ve uygulamalar öneriyoruz (Ek D bölümüne bakın). Bu siteleri sık sık (1-2 günde bir) kontrol etmelisiniz. Ekte Roma'da gidip CV bırakabileceğiniz 10 adresin listesini bulacaksınız.",
    publicOfficesIntro: "3. İŞ BULMA KURUMUNA KAYIT: Roma'daki İş Kurumuna (CPI) doğru şekilde kayıtlı olduğunuzu kontrol edin.\n\n4. DİĞER BELEDİYE OFİSLERİ: Ayrıca COL İş Yönlendirme Merkezi ve Via Galvani 108 adresindeki Portafuturo'ya gitmenizi öneririz.\n\n5. BİLDİRİMLERİMİZ: doğrudan bir iş teklifi alırsak sizi e-posta ile bilgilendireceğiz.",
    schoolsIntro: "İş bulmak için en temel husus iyi İtalyanca konuşmaktır: henüz iyi konuşamıyorsanız, ekte yabancılar için ücretsiz okulların bir listesini sunuyoruz; bu kurslara katılın!",
    conclusion: "İş arama süreciniz boyunca oryantasyon merkezimiz size destek olmak için hizmetinizdedir. İş arama sürecinizde başarılar dileriz!"
  },
  hindi: {
    language: "Hindi",
    greeting: "प्रिय ${recipientName},",
    intro: "हमें खुशी है कि आप नौकरी की तलाश में मदद के लिए हमारे पास आए हैं। हम आपके लिए उपयुक्त अवसर खोजने में मदद करने का प्रयास करते हैं और आपको कुछ सुझाव देना चाहते हैं।\n\nसबसे पहले, ध्यान रखें कि नौकरी खोजना अपने आप में एक काम है: यानी खोज प्रतिबद्धता के साथ, एक निश्चित समय (जैसे दिन में 2 घंटे) निर्धारित करके की जानी चाहिए। हम सलाह देने के लिए उपलब्ध हैं, लेकिन आवेदन आपको स्वयं करना होगा। हम मिलकर करेंगे:",
    cooperativesIntro: "1. पाठ्यक्रम जीवन (सीवी): यह आपके कार्य अनुभवों और वांछित नौकरी को दर्शाने के काम आता है। सीवी हमेशा अपडेट रहना चाहिए।\n\n2. नौकरी की खोज: हम कुछ वेबसाइटों या ऐप का सुझाव देते हैं जहाँ आपको पंजीकरण करना होगा (संलग्न अनुभाग D देखें)। आपको इन साइटों को अक्सर (हर 1-2 दिन में) देखना चाहिए। संलग्नक में आपको रोम में 10 पतों की एक सूची मिलेगी जहाँ आप जाकर अपना सीवी जमा कर सकते हैं।",
    publicOfficesIntro: "3. रोजगार केंद्र में पंजीकरण: जांचें कि क्या आप रोम में रोजगार केंद्र (CPI) में सही तरीके से पंजीकृत हैं।\n\n4. अन्य नगर निगम कार्यालय: हम आपको COL जॉब ओरिएंटेशन सेंटर और Via Galvani 108 में Portafuturo जाने का भी सुझाव देते हैं।\n\n5. हमारी सूचनाएं: यदि हमें सीधे नौकरी के प्रस्ताव मिलते हैं, तो हम आपको ईमेल द्वारा सूचित करेंगे।",
    schoolsIntro: "नौकरी पाने के लिए इतालवी भाषा अच्छी तरह बोलना बहुत जरूरी है: यदि आप अभी अच्छी तरह नहीं बोलते हैं, तो संलग्नक में हम विदेशियों के लिए मुफ्त स्कूलों की एक सूची प्रदान कर रहे हैं; उनमें भाग लें!",
    conclusion: "आपकी नौकरी की तलाश के दौरान, हमारा मार्गदर्शन केंद्र आपकी सहायता के लिए उपलब्ध है। नौकरी की तलाश में शुभकामनाएं!"
  },
};

const annexDict: Record<string, Record<string, string>> = {
  english: {
    "Fondazione Roma Litorale": "Roma Litorale Foundation",
    "Fondazione Roma Litorale - Agenzia Lavoro": "Roma Litorale Foundation - Employment Agency",
    "Fondazione Roma Litorale - Agenzia Lavoro Ostia": "Roma Litorale Foundation - Ostia Employment Agency",
    "Cooperativa Sociale Futura Onlus": "Futura Onlus Social Cooperative",
    "Assistenza e Territorio - Soc. Coop. Sociale Onlus": "Assistenza e Territorio Social Cooperative",
    "PrivatAssistenza Ostia Lido": "PrivatAssistenza Ostia Lido",
    "Cooperativa Lido": "Lido Cooperative",
    "Studio Eurogiga (Servizi e Payroll Ostia)": "Studio Eurogiga (Ostia Payroll & Services)",
    "Adecco Filiale Fiumicino": "Adecco Fiumicino Branch",
    "Randstad Italia - Filiale Roma EUR": "Randstad Italy - Rome EUR Branch",
    "CPIA 7 Sede Ostia 1 (Levante)": "CPIA 7 Ostia 1 Center (East)",
    "CPIA 7 Sede Ostia 2 (Ponente)": "CPIA 7 Ostia 2 Center (West)",
    "Corsi di Italiano Biblioteca Elsa Morante": "Elsa Morante Library Italian Courses",
    "Centro per l'Impiego": "Employment Center",
    "Centro Orientamento Lavoro": "Job Orientation Center",
    "Centro per l'Impiego (CPI) di Ostia": "Ostia Employment Center (CPI)",
    "COL Acilia - Centro Orientamento Lavoro": "Acilia COL - Job Orientation Center",
    "Centro per l'Impiego competente per il Municipio X. Indispensabile per l'iscrizione alle liste di disoccupazione e rilascio DID.": "Competent Employment Center for Municipio X. Essential for unemployment registration and DID issuance.",
    "Servizio gratuito del Comune di Roma per la stesura del curriculum vitae, bilancio di competenze e corsi professionali.": "Free service of the Municipality of Rome for CV drafting, skills assessment, and professional courses.",
    "CPIA 4 Roma - Sede Associata di Ostia": "CPIA 4 Rome - Ostia Associated Center",
    "Scuola di Italiano Sant'Egidio - Ostia": "Sant'Egidio Italian School - Ostia",
    "Scuola d'Italiano Popolare Affabulazione": "Affabulazione Popular Italian School",
    "Scuola pubblica statale gratuita. Rilascia attestati ufficiali di livello A2 per il permesso di soggiorno di lungo periodo.": "Free public state school. Issues official A2 level certificates for long-term residence permits.",
    "Corsi di lingua italiana totalmente gratuiti gestiti da volontari, dal livello base all'avanzato.": "Totally free Italian language courses run by volunteers, from basic to advanced level.",
    "Associazione locale che offre lezioni gratuite di italiano per stranieri in un contesto inclusivo.": "Local association offering free Italian lessons for foreigners in an inclusive environment.",
    "Cooperativa Sociale Prassi e Ricerca Onlus": "Prassi e Ricerca Onlus Social Cooperative",
    "Specializzata in servizi di assistenza alla persona, pulizie e manutenzione verde nel Municipio X.": "Specialized in personal care services, cleaning, and green maintenance in Municipio X.",
    "Cooperativa Sociale Girotondo Onlus": "Girotondo Onlus Social Cooperative",
    "Gestisce asili nido, servizi educativi, pulizie e assistenza domiciliare ad Ostia e dintorni.": "Manages kindergartens, educational services, cleaning, and home care in Ostia and surroundings.",
    "Cooperativa Sociale Santi Pietro e Paolo": "Santi Pietro e Paolo Social Cooperative",
    "Offre servizi socio-assistenziali, pulizie commerciali e giardinaggio sul litorale romano.": "Offers socio-assistance services, commercial cleaning, and gardening on the Roman coast.",
    "Cooperativa Sociale Hamilton": "Hamilton Social Cooperative",
    "Gestisce servizi di facchinaggio, portierato, pulizia e piccoli traslochi sul litorale.": "Manages porterage, concierge services, cleaning, and minor removals on the coast.",
    "Randstad Italia - Filiale di Ostia": "Randstad Italy - Ostia Branch",
    "Agenzia per il lavoro generalista: somministrazione e inserimento per ristorazione, logistica e uffici a Ostia.": "General employment agency: staffing and placement for catering, logistics, and offices in Ostia.",
    "Adecco Filiale di Ostia": "Adecco Branch of Ostia",
    "Agenzia per il lavoro che seleziona personale per negozi, alberghi, ristoranti e aziende di servizi nel Municipio X.": "Employment agency selecting staff for shops, hotels, restaurants, and service companies in Municipio X.",
    "Synergie Italia - Filiale di Ostia": "Synergie Italy - Ostia Branch",
    "Filiale locale per la selezione di addetti pulizie, magazzinieri, baristi e personale di sala a Ostia.": "Local branch for the selection of cleaners, warehouse workers, bartenders, and waiters in Ostia.",
    "Cooperativa Sociale Apriti Sesamo Onlus (Sede Ostia)": "Apriti Sesamo Onlus Social Cooperative (Ostia Branch)",
    "Servizi di pulizie, giardinaggio, custodia e inserimento lavorativo sul territorio costiero.": "Cleaning, gardening, custodial, and job placement services in the coastal territory.",
    "Cooperativa Sociale Sostegno": "Sostegno Social Cooperative",
    "Servizi di assistenza alla persona, colf, badanti e gestione piccoli uffici nel litorale romano.": "Personal care services, housekeepers, caregivers, and management of small offices on the Roman coast.",
    "Anffas Ostia Onlus": "Anffas Ostia Onlus",
    "Cooperativa sociale operante ad Ostia da decenni nell'ambito dell'assistenza, sanità e servizi educativi locali.": "Social cooperative operating in Ostia for decades in assistance, healthcare, and local educational services."
  },
  french: {
    "Centro per l'Impiego": "Centre pour l'Emploi",
    "Centro Orientamento Lavoro": "Centre d'Orientation Professionnelle",
    "Centro per l'Impiego (CPI) di Ostia": "Centre pour l'Emploi (CPI) d'Ostia",
    "COL Acilia - Centro Orientamento Lavoro": "COL Acilia - Centre d'Orientation Professionnelle",
    "Centro per l'Impiego competente per il Municipio X. Indispensabile per l'iscrizione alle liste di disoccupazione e rilascio DID.": "Centre d'emploi compétent pour la Municipalité X. Indispensable pour l'inscription au chômage et l'obtention du DID.",
    "Servizio gratuito del Comune di Roma per la stesura del curriculum vitae, bilancio di competenze e corsi professionali.": "Service gratuit de la Commune de Rome pour la rédaction de CV, bilan de compétences et formations professionnelles.",
    "CPIA 4 Roma - Sede Associata di Ostia": "CPIA 4 Rome - Centre d'Ostia",
    "Scuola di Italiano Sant'Egidio - Ostia": "École d'Italien Sant'Egidio - Ostia",
    "Scuola d'Italiano Popolare Affabulazione": "École Populaire d'Italien Affabulazione",
    "Scuola pubblica statale gratuita. Rilascia attestati ufficiali di livello A2 per il permesso di soggiorno di lungo periodo.": "École publique d'État gratuite. Délivre des certificats officiels de niveau A2 pour le titre de séjour de longue durée.",
    "Corsi di lingua italiana totalmente gratuiti gestiti da volontari, dal livello base all'avanzato.": "Cours d'italien totalement gratuits animés par des bénévoles, du niveau débutant à avancé.",
    "Associazione locale che offre lezioni gratuite di italiano per stranieri in un contesto inclusivo.": "Association locale proposant des cours d'italien gratuits pour étrangers dans un cadre inclusif.",
    "Cooperativa Sociale Prassi e Ricerca Onlus": "Coopérative Sociale Prassi e Ricerca Onlus",
    "Specializzata in servizi di assistenza alla persona, pulizie e manutenzione verde nel Municipio X.": "Spécialisée dans l'aide à la personne, le nettoyage et l'entretien des espaces verts dans la Municipalité X.",
    "Cooperativa Sociale Girotondo Onlus": "Coopérative Sociale Girotondo Onlus",
    "Gestisce asili nido, servizi educativi, pulizie e assistenza domiciliare ad Ostia e dintorni.": "Gère des crèches, des services éducatifs, le nettoyage et l'aide à domicile à Ostia et ses environs.",
    "Cooperativa Sociale Santi Pietro e Paolo": "Coopérative Sociale Santi Pietro e Paolo",
    "Offre servizi socio-assistenziali, pulizie commerciali e giardinaggio sul litorale romano.": "Propose des services d'assistance sociale, de nettoyage commercial et de jardinage sur le littoral romain.",
    "Cooperativa Sociale Hamilton": "Coopérative Sociale Hamilton",
    "Gestisce servizi di facchinaggio, portierato, pulizia e piccoli traslochi sul litorale.": "Gère le portage, la conciergerie, le nettoyage et les petits déménagements sur le littoral.",
    "Randstad Italia - Filiale di Ostia": "Randstad Italie - Agence d'Ostia",
    "Agenzia per il lavoro generalista: somministrazione e inserimento per ristorazione, logistica e uffici a Ostia.": "Agence d'emploi généraliste: travail temporaire et placement pour la restauration, la logistique et les bureaux à Ostia.",
    "Adecco Filiale di Ostia": "Adecco Agence d'Ostia",
    "Agenzia per il lavoro che seleziona personale per negozi, alberghi, ristoranti e aziende di servizi nel Municipio X.": "Agence de recrutement sélectionnant du personnel pour commerces, hôtels, restaurants et services dans la Municipalité X.",
    "Synergie Italia - Filiale di Ostia": "Synergie Italie - Agence d'Ostia",
    "Filiale locale per la selezione di addetti pulizie, magazzinieri, baristi e personale di sala a Ostia.": "Agence locale pour le recrutement d'agents d'entretien, de magasiniers, de barmans et de serveurs à Ostia.",
    "Cooperativa Sociale Apriti Sesamo Onlus (Sede Ostia)": "Coopérative Sociale Apriti Sesamo Onlus (Ostia)",
    "Servizi di pulizie, giardinaggio, custodia e inserimento lavorativo sul territorio costiero.": "Services de nettoyage, jardinage, gardiennage et insertion professionnelle sur la zone côtière.",
    "Cooperativa Sociale Sostegno": "Coopérative Sociale Sostegno",
    "Servizi di assistenza alla persona, colf, badanti e gestione piccoli uffici nel litorale romano.": "Services d'aide à la personne, femmes de ménage, gardes à domicile et gestion de petits bureaux sur la côte romaine.",
    "Anffas Ostia Onlus": "Anffas Ostia Onlus",
    "Cooperativa sociale operante ad Ostia da decenni nell'ambito dell'assistenza, sanità e servizi educativi locali.": "Coopérative sociale active à Ostia depuis des décennies dans les secteurs de l'aide sociale, de la santé et de l'éducation locale."
  },
  spanish: {
    "Centro per l'Impiego": "Centro de Empleo",
    "Centro Orientamento Lavoro": "Centro de Orientación Laboral",
    "Centro per l'Impiego (CPI) di Ostia": "Centro de Empleo (CPI) de Ostia",
    "COL Acilia - Centro Orientamento Lavoro": "COL Acilia - Centro de Orientación Laboral",
    "Centro per l'Impiego competente per il Municipio X. Indispensabile per l'iscrizione alle liste di disoccupazione e rilascio DID.": "Centro de Empleo competente para el Municipio X. Indispensable para la inscripción al paro y emisión de DID.",
    "Servizio gratuito del Comune di Roma per la stesura del curriculum vitae, bilancio di competenze e corsi professionali.": "Servicio gratuito del Ayuntamiento de Roma para la redacción de CV, balance de competencias y cursos profesionales.",
    "CPIA 4 Roma - Sede Associata di Ostia": "CPIA 4 Roma - Sede de Ostia",
    "Scuola di Italiano Sant'Egidio - Ostia": "Escuela de Italiano Sant'Egidio - Ostia",
    "Scuola d'Italiano Popolare Affabulazione": "Escuela Popular de Italiano Affabulazione",
    "Scuola pubblica statale gratuita. Rilascia attestati ufficiali di livello A2 per il permesso di soggiorno di lungo periodo.": "Escuela pública estatal gratuita. Emite certificados oficiales de nivel A2 para el permiso de residencia de larga duración.",
    "Corsi di lingua italiana totalmente gratuiti gestiti da volontari, dal livello base all'avanzato.": "Cursos de italiano totalmente gratuitos dirigidos por voluntarios, desde nivel básico hasta avanzado.",
    "Associazione locale che offre lezioni gratuite di italiano per stranieri in un contesto inclusivo.": "Asociación local que ofrece clases gratuitas de italiano para extranjeros en un ambiente inclusivo.",
    "Cooperativa Sociale Prassi e Ricerca Onlus": "Cooperativa Sociale Prassi e Ricerca Onlus",
    "Specializzata in servizi di assistenza alla persona, pulizie e manutenzione verde nel Municipio X.": "Especializada en servicios de asistencia personal, limpieza y mantenimiento de áreas verdes en el Municipio X.",
    "Cooperativa Sociale Girotondo Onlus": "Cooperativa Sociale Girotondo Onlus",
    "Gestisce asili nido, servizi educativi, pulizie e assistenza domiciliare ad Ostia e dintorni.": "Gestiona guarderías, servicios educativos, limpieza y asistencia diaria en Ostia y alrededores.",
    "Cooperativa Sociale Santi Pietro e Paolo": "Cooperativa Sociale Santi Pietro e Paolo",
    "Offre servizi socio-assistenziali, pulizie commerciali e giardinaggio sul litorale romano.": "Ofrece servicios de asistencia social, limpieza comercial y jardinería en la costa romana.",
    "Cooperativa Sociale Hamilton": "Cooperativa Sociale Hamilton",
    "Gestisce servizi di facchinaggio, portierato, pulizia e piccoli traslochi sul litorale.": "Gestiona servicios de portería, conserjería, limpieza y mudanzas pequeñas en la costa.",
    "Randstad Italia - Filiale di Ostia": "Randstad Italia - Sucursal de Ostia",
    "Agenzia per il lavoro generalista: somministrazione e inserimento per ristorazione, logistica e uffici a Ostia.": "Agencia de empleo generalista: trabajo temporal y selección para restauración, logística y oficinas en Ostia.",
    "Adecco Filiale di Ostia": "Adecco Sucursal de Ostia",
    "Agenzia per il lavoro che seleziona personale per negozi, alberghi, ristoranti e aziende di servizi nel Municipio X.": "Agencia de empleo que selecciona personal para tiendas, hoteles, restaurantes y servicios en el Municipio X.",
    "Synergie Italia - Filiale di Ostia": "Synergie Italia - Sucursal de Ostia",
    "Filiale locale per la selezione di addetti pulizie, magazzinieri, baristi e personale di sala a Ostia.": "Sucursal local para selección de limpiadores, mozos de almacén, camareros de barra y sala en Ostia.",
    "Cooperativa Sociale Apriti Sesamo Onlus (Sede Ostia)": "Cooperativa Sociale Apriti Sesamo Onlus (Ostia)",
    "Servizi di pulizie, giardinaggio, custodia e inserimento lavorativo sul territorio costiero.": "Servicios de limpieza, jardinería, custodia e inserción laboral en el territorio costero.",
    "Cooperativa Sociale Sostegno": "Cooperativa Sociale Sostegno",
    "Servizi di assistenza alla persona, colf, badanti e gestione piccoli uffici nel litorale romano.": "Servicios de asistencia personal, empleadas domésticas, cuidadores y gestión de oficinas en la costa romana.",
    "Anffas Ostia Onlus": "Anffas Ostia Onlus",
    "Cooperativa sociale operante ad Ostia da decenni nell'ambito dell'assistenza, sanità e servizi educativi locali.": "Cooperativa social que opera en Ostia desde hace décadas en asistencia, sanidad y servicios educativos locales."
  },
  polish: {
    "Centro per l'Impiego": "Urząd Pracy",
    "Centro Orientamento Lavoro": "Centrum Orientacji Zawodowej",
    "Centro per l'Impiego (CPI) di Ostia": "Urząd Pracy (CPI) w Ostii",
    "COL Acilia - Centro Orientamento Lavoro": "COL Acilia - Centrum Orientacji Zawodowej",
    "Centro per l'Impiego competente per il Municipio X. Indispensabile per l'iscrizione alle liste di disoccupazione e rilascio DID.": "Urząd Pracy właściwy dla Dzielnicy X. Niezbędny do rejestracji bezrobotnych i wydania DID.",
    "Servizio gratuito del Comune di Roma per la stesura del curriculum vitae, bilancio di competenze e corsi professionali.": "Bezpłatna usługa Miasta Rzym w zakresie sporządzania CV, bilansu kompetencji i kursów zawodowych.",
    "CPIA 4 Roma - Sede Associata di Ostia": "CPIA 4 Rzym - Filia w Ostii",
    "Scuola di Italiano Sant'Egidio - Ostia": "Szkoła Języka Włoskiego Sant'Egidio - Ostia",
    "Scuola d'Italiano Popolare Affabulazione": "Ludowa Szkoła Języka Włoskiego Affabulazione",
    "Scuola pubblica statale gratuita. Rilascia attestati ufficiali di livello A2 per il permesso di soggiorno di lungo periodo.": "Bezpłatna państwowa szkoła publiczna. Wydaje oficjalne zaświadczenia na poziomie A2 do zezwolenia na pobyt długoterminowy.",
    "Corsi di lingua italiana totalmente gratuiti gestiti da volontari, dal livello base all'avanzato.": "Całkowicie bezpłatne kursy języka włoskiego prowadzone przez wolontariuszy, od poziomu podstawowego do zaawansowanego.",
    "Associazione locale che offre lezioni gratuite di italiano per stranieri in un contesto inclusivo.": "Lokalne stowarzyszenie oferujące bezpłatne lekcje języka włoskiego dla cudzoziemców w integracyjnym środowisku.",
    "Cooperativa Sociale Prassi e Ricerca Onlus": "Spółdzielnia Socjalna Prassi e Ricerca Onlus",
    "Specializzata in servizi di assistenza alla persona, pulizie e manutenzione verde nel Municipio X.": "Specjalizuje się w usługach opieki osobistej, sprzątaniu i utrzymaniu terenów zielonych w Dzielnicy X.",
    "Cooperativa Sociale Girotondo Onlus": "Spółdzielnia Socjalna Girotondo Onlus",
    "Gestisce asili nido, servizi educativi, pulizie e assistenza domiciliare ad Ostia e dintorni.": "Prowadzi żłobki, usługi edukacyjne, sprzątanie i opiekę domową w Ostii i okolicach.",
    "Cooperativa Sociale Santi Pietro e Paolo": "Spółdzielnia Socjalna Santi Pietro e Paolo",
    "Offre servizi socio-assistenziali, pulizie commerciali e giardinaggio sul litorale romano.": "Oferuje usługi socjalno-opiekuńcze, sprzątanie komercyjne i ogrodnictwo na wybrzeżu rzymskim.",
    "Cooperativa Sociale Hamilton": "Spółdzielnia Socjalna Hamilton",
    "Gestisce servizi di facchinaggio, portierato, pulizia e piccoli traslochi sul litorale.": "Zarządza usługami tragarzy, portierni, sprzątania i drobnych przeprowadzek na wybrzeżu.",
    "Randstad Italia - Filiale di Ostia": "Randstad Italia - Filia w Ostii",
    "Agenzia per il lavoro generalista: somministrazione e inserimento per ristorazione, logistica e uffici a Ostia.": "Ogólna agencja pracy: praca tymczasowa i rekrutacja dla gastronomii, logistyki i biur w Ostii.",
    "Adecco Filiale di Ostia": "Adecco Filia w Ostii",
    "Agenzia per il lavoro che seleziona personale per negozi, alberghi, ristoranti e aziende di servizi nel Municipio X.": "Agencja pracy rekrutująca pracowników do sklepów, hoteli, restauracji i firm usługowych w Dzielnicy X.",
    "Synergie Italia - Filiale di Ostia": "Synergie Italia - Filia w Ostii",
    "Filiale locale per la selezione di addetti pulizie, magazzinieri, baristi e personale di sala a Ostia.": "Lokalna filia rekrutująca sprzątaczy, magazynierów, barmanów i obsługę sali w Ostii.",
    "Cooperativa Sociale Apriti Sesamo Onlus (Sede Ostia)": "Spółdzielnia Socjalna Apriti Sesamo Onlus (Oddział Ostia)",
    "Servizi di pulizie, giardinaggio, custodia e inserimento lavorativo sul territorio costiero.": "Usługi sprzątania, ogrodnictwa, ochrony i aktywizacji zawodowej na terenie nadmorskim.",
    "Cooperativa Sociale Sostegno": "Spółdzielnia Socjalna Sostegno",
    "Servizi di assistenza alla persona, colf, badanti e gestione piccoli uffici nel litorale romano.": "Usługi opiekuńcze, pomoce domowe, opiekunki i zarządzanie małymi biurami na wybrzeżu rzymskim.",
    "Anffas Ostia Onlus": "Anffas Ostia Onlus",
    "Cooperativa sociale operante ad Ostia da decenni nell'ambito dell'assistenza, sanità e servizi educativi locali.": "Spółdzielnia socjalna działająca w Ostii od dziesięcioleci w obszarze opieki, zdrowia i lokalnych usług edukacyjnych."
  },
  arabic: {
    "Fondazione Roma Litorale": "مؤسسة روما ليتورالي",
    "Fondazione Roma Litorale - Agenzia Lavoro": "مؤسسة روما ليتورالي - وكالة التوظيف",
    "Fondazione Roma Litorale - Agenzia Lavoro Ostia": "مؤسسة روما ليتورالي - وكالة توظيف أوستيا",
    "Cooperativa Sociale Futura Onlus": "التعاونية الاجتماعية فوتورا",
    "Assistenza e Territorio - Soc. Coop. Sociale Onlus": "التعاونية الاجتماعية المساعدة والإقليم",
    "PrivatAssistenza Ostia Lido": "بريفات أسيستنزا أوستيا ليدو",
    "Cooperativa Lido": "تعاونية ليدو",
    "Studio Eurogiga (Servizi e Payroll Ostia)": "استوديو يوروجيجا (خدمات أوستيا)",
    "Adecco Filiale Fiumicino": "أديكو - فرع فيوميتشينو",
    "Randstad Italia - Filiale Roma EUR": "رانستاد إيطاليا - فرع روما يور",
    "CPIA 7 Sede Ostia 1 (Levante)": "CPIA 7 مركز أوستيا 1",
    "CPIA 7 Sede Ostia 2 (Ponente)": "CPIA 7 مركز أوستيا 2",
    "Corsi di Italiano Biblioteca Elsa Morante": "دورات اللغة الإيطالية بمكتبة إلسا مورانتي",
    "Centro per l'Impiego": "مركز التوظيف",
    "Centro Orientamento Lavoro": "مركز التوجيه المهني",
    "Centro per l'Impiego (CPI) di Ostia": "مركز التوظيف (CPI) في أوستيا",
    "COL Acilia - Centro Orientamento Lavoro": "مركز التوجيه المهني COL أتشيليا",
    "Centro per l'Impiego competente per il Municipio X. Indispensabile per l'iscrizione alle liste di disoccupazione e rilascio DID.": "مركز التوظيف المختص لبلدية Municipio X. ضروري للتسجيل في قوائم البطالة واستخراج إفادة DID.",
    "Servizio gratuito del Comune di Roma per la stesura del curriculum vitae, bilancio di competenze e corsi professionali.": "خدمة مجانية من بلدية روما لإعداد السيرة الذاتية وتقييم المهارات والدورات المهنية.",
    "CPIA 4 Roma - Sede Associata di Ostia": "مدرسة CPIA 4 روما - فرع أوستيا",
    "Scuola di Italiano Sant'Egidio - Ostia": "مدرسة اللغة الإيطالية سانت إيجيديو - أوستيا",
    "Scuola d'Italiano Popolare Affabulazione": "المدرسة الشعبية للغة الإيطالية Affabulazione",
    "Scuola pubblica statale gratuita. Rilascia attestati ufficiali di livello A2 per il permesso di soggiorno di lungo periodo.": "مدرسة حكومية عامة مجانية. تمنح شهادات رسمية للمستوى A2 لتصريح الإقامة طويل الأمد.",
    "Corsi di lingua italiana totalmente gratuiti gestiti da volontari, dal livello base all'avanzato.": "دورات لغة إيطالية مجانية تمامًا يديرها متطوعون، من المستوى الأساسي إلى المتقدم.",
    "Associazione locale che offre lezioni gratuite di italiano per stranieri in un contesto inclusivo.": "جمعية محلية تقدم دروسًا مجانية في اللغة الإيطالية للأجانب في بيئة شاملة ومرحبة.",
    "Cooperativa Sociale Prassi e Ricerca Onlus": "التعاونية الاجتماعية Prassi e Ricerca Onlus",
    "Specializzata in servizi di assistenza alla persona, pulizie e manutenzione verde nel Municipio X.": "متخصصة في خدمات الرعاية الشخصية والنظافة وصيانة المساحات الخضراء في Municipio X.",
    "Cooperativa Sociale Girotondo Onlus": "التعاونية الاجتماعية Girotondo Onlus",
    "Gestisce asili nido, servizi educativi, pulizie e assistenza domiciliare ad Ostia e dintorni.": "تدير دور حضانة وخدمات تعليمية وتنظيف ورعاية منزلية في أوستيا وما حولها.",
    "Cooperativa Sociale Santi Pietro e Paolo": "التعاونية الاجتماعية Santi Pietro e Paolo",
    "Offre servizi socio-assistenziali, pulizie commerciali e giardinaggio sul litorale romano.": "تقدم خدمات الرعاية الاجتماعية والتنظيف التجاري والبستنة على ساحل روما.",
    "Cooperativa Sociale Hamilton": "التعاونية الاجتماعية Hamilton",
    "Gestisce servizi di facchinaggio, portierato, pulizia e piccoli traslochi sul litorale.": "تدير خدمات العتالة والاستقبال والحراسة والتنظيف والنقل الخفيف على الساحل.",
    "Randstad Italia - Filiale di Ostia": "رانستاد إيطاليا - فرع أوستيا",
    "Agenzia per il lavoro generalista: somministrazione e inserimento per ristorazione, logistica e uffici a Ostia.": "وكالة توظيف عامة: توريد عمالة وتوظيف لقطاع المطاعم والخدمات اللوجستية والمكاتب في أوستيا.",
    "Adecco Filiale di Ostia": "أديكو - فرع أوستيا",
    "Agenzia per il lavoro che seleziona personale per negozi, alberghi, ristoranti e aziende di servizi nel Municipio X.": "وكالة توظيف تختار موظفين للمحلات التجارية والفنادق والمطاعم وشركات الخدمات في Municipio X.",
    "Synergie Italia - Filiale di Ostia": "سينرجي إيطاليا - فرع أوستيا",
    "Filiale locale per la selezione di addetti pulizie, magazzinieri, baristi e personale di sala a Ostia.": "فرع محلي لاختيار عمال النظافة وأمناء المخازن وموظفي المقاهي وصالات الخدمة في أوستيا.",
    "Cooperativa Sociale Apriti Sesamo Onlus (Sede Ostia)": "التعاونية الاجتماعية Apriti Sesamo Onlus (فرع أوستيا)",
    "Servizi di pulizie, giardinaggio, custodia e inserimento lavorativo sul territorio costiero.": "خدمات التنظيف والبستنة والحراسة والدمج الوظيفي في المنطقة الساحلية.",
    "Cooperativa Sociale Sostegno": "التعاونية الاجتماعية Sostegno",
    "Servizi di assistenza alla persona, colf, badanti e gestione piccoli uffici nel litorale romano.": "خدمات الرعاية الشخصية والمساعدات المنزليات ورعاية المسنين وإدارة المكاتب الصغيرة على ساحل روما.",
    "Anffas Ostia Onlus": "أنفاس أوستيا Onlus",
    "Cooperativa sociale operante ad Ostia da decenni nell'ambito dell'assistenza, sanità e servizi educativi locali.": "تعاونية اجتماعية تعمل في أوستيا منذ عقود في مجالات الرعاية والصحة والخدمات التعليمية المحلية."
  }
};

function translateText(text: string, langKey: string): string {
  return annexDict[langKey]?.[text] || text;
}

export function generateLocalFallback(inputs: {
  recipientName: string;
  gender?: string;
  nationality: string;
  italianLevel: string;
  jobSought: string;
  zoneResident: string;
  zoneJobSought: string;
  officinaOpportunity?: boolean;
}): GeneratedLetter {
  const { recipientName, gender, nationality, italianLevel, jobSought, zoneResident, zoneJobSought, officinaOpportunity } = inputs;

  const isItalian = ["italia", "italiana", "italiano"].includes(nationality.toLowerCase());
  const needsSchools = ["Nessuna", "Basso"].includes(italianLevel);
  const lowerZone = zoneResident.toLowerCase();
  const isOstiaArea = lowerZone.includes("ostia") || lowerZone.includes("acilia") || lowerZone.includes("municipio x") || lowerZone.includes("municipio 10") || lowerZone.includes("dragona") || lowerZone.includes("infernetto") || lowerZone.includes("axa") || lowerZone.includes("casal palocco");

  const CORE_PROFESSIONS = [
    "badante (assistenza anziani)",
    "colf/pulizie (servizi domestici)",
    "facchino/magazziniere",
    "lavapiatti/aiuto cucina",
    "pizzaiolo",
    "cuoco",
    "muratore/operaio edile",
    "custode/portiere",
    "cameriere/barista",
    "giardiniere",
    "segreteria (assistenza d'ufficio/reception)",
    "autista (conducente/fattorino)"
  ];
  const jsLower = jobSought.trim().toLowerCase();
  const isAltro = jsLower === "altro" || (
    !CORE_PROFESSIONS.some(p => 
      p.toLowerCase() === jsLower ||
      jsLower.includes(p.split(" ")[0].toLowerCase()) ||
      p.toLowerCase().includes(jsLower.split(" ")[0].toLowerCase())
    )
  );

  // 1. Resolve Cooperatives based on jobSought category with high precision from the curated local database
  let selectedCoops: Cooperative[] = queryLocalDb(jobSought, zoneResident, zoneJobSought);


  // 2. Resolve Public Offices based on zoneResident
  let selectedOffices: PublicOffice[] = getPublicOfficesForZone(zoneResident);

  // 3. Resolve Italian Schools (only if needed)
  let selectedSchools: ItalianSchool[] = needsSchools ? getItalianSchoolsForZone(zoneResident) : [];

  // 4. Set up the Italian Letter Sections
  const isFemale = gender === "F";
  const nameLabel = recipientName 
    ? (isFemale ? `Cara ${recipientName},` : `Caro ${recipientName},`)
    : (isFemale ? "Cara amica," : "Caro amico,");
  
  const cpiName = selectedOffices[0]?.name || "Centro per l'Impiego competente";
  const cpiAddr = selectedOffices[0]?.address || "";
  const cpiDetails = cpiAddr ? `${cpiName} in ${cpiAddr}` : cpiName;

  const colName = selectedOffices[1]?.name || "COL (Centro Orientamento Lavoro) più vicino";
  const colAddr = selectedOffices[1]?.address || "";
  const colDetails = colAddr ? `${colName} in ${colAddr}` : colName;

  const greeting = nameLabel;
  let intro = `siamo lieti che ti sei ${isFemale ? "rivolta" : "rivolto"} a noi per chiedere aiuto nella ricerca di lavoro. Cerchiamo di aiutarti a trovare opportunità adatte a te e per far questo vorremmo — con spirito di amicizia — darti qualche suggerimento.
\nAnzitutto considera che CERCARE LAVORO È UN LAVORO: cioè la ricerca va fatta con impegno, rispettando certi orari che stabilisci da ${isFemale ? "sola" : "solo"} (ad es. 2 ore al giorno), consultando e cercando in maniera autonoma tutti i punti di offerta lavoro, i siti internet, le app, le agenzie, ecc. Noi siamo disponibili a darti consigli e indirizzarti ma la ricerca va fatta da ${isFemale ? "sola" : "solo"} anche perché vengono chiesti dati personali per la registrazione. Noi faremo insieme:`;

  // Le voci scelte nel percorso "Altro" entrano nel testo, non soltanto nei metadati.
  const nationalityForLetter = nationality.replace(/^altro\\s*:\\s*/i, "").trim();
  intro += `\\n\\nDATI CONFERMATI PER L'ORIENTAMENTO — Professione richiesta: ${jobSought.trim()}; nazionalità indicata: ${nationalityForLetter}.`;

  let cooperativesIntro = `1. CURRICULUM: serve per elencare le tue esperienze di lavoro, per indicare il lavoro da te desiderato, e capire dove impegnarti al meglio nella ricerca. Il curriculum va aggiornato il più possibile. Nel curriculum elencheremo anche i tuoi punti di forza e capire se vuoi impegnarti anche in altre aree diverse da quelle seguite finora.
\n2. RICERCA DEL LAVORO: noi ti suggeriamo alcuni siti Internet o App dove dovrai iscriverti, allegando il tuo Curriculum e fornendo altre informazioni. Devi consultare spesso questi siti (ogni 1-2 giorni) perché le offerte volano subito via se non rispondi. Inoltre, puoi visitare o telefonare ad agenzie di lavoro, cooperative, ecc. (di cui ti daremo qualche riferimento, ma devi essere tu a contattarli e prendere appuntamento). In allegato trovi i riferimenti disponibili: prima di inviare il curriculum verifica con ciascun ente le posizioni aperte, i requisiti e il canale di candidatura.`;

  let publicOfficesIntro = `3. ISCRIZIONE AL CENTRO IMPIEGO: verifica di essere correttamente ${isFemale ? "iscritta" : "iscritto"} al Centro Impiego (${cpiDetails}) oppure altro Centro Impiego di Roma. Se non lo hai ancora fatto, è la prima cosa che devi fare. Se ti serve una mano nella compilazione dei moduli ti aiutiamo noi.
\n4. ALTRI UFFICI COMUNALI: ti suggeriamo anche andare al COL Centro Orientamento Lavoro di ${colDetails} e a Portafuturo di Via Galvani 108 (vicino alla Metro Piramide); sono altri uffici comunali che ti possono aiutare a cercare lavoro.
\n5. NOSTRE SEGNALAZIONI: se ci arrivano offerte di lavoro dirette o tramite la nostra sede te le segnaleremo via email.`;

  if (isAltro && selectedCoops.length === 0) {
    cooperativesIntro = `1. CURRICULUM: serve per elencare le tue esperienze di lavoro, per indicare il lavoro da te desiderato, e capire dove impegnarti al meglio nella ricerca. Il curriculum va aggiornato il più possibile. Nel curriculum elencheremo anche i tuoi punti di forza e capire se vuoi impegnarti anche in altre aree diverse da quelle seguite finora.
\n2. RICERCA DEL LAVORO: noi ti suggeriamo alcuni siti Internet o App dove dovrai iscriverti, allegando il tuo Curriculum e fornendo altre informazioni. Devi consultare spesso questi siti (ogni 1-2 giorni) perché le offerte volano subito via se non rispondi.`;
  }

  if (selectedCoops.length === 0) {
    const profession = jobSought.trim();
    cooperativesIntro += `\\n\\nPER IL MESTIERE RICHIESTO (${profession}): verifica offerte con la denominazione esatta e sinonimi professionali presso il Centro per l'Impiego e le agenzie autorizzate; chiedi requisiti, qualifiche e disponibilità nella zona indicata. AGENZIE E COOPERATIVE: al momento nessuna struttura del repertorio ha un abbinamento verificato per questa professione nel territorio richiesto. Alcune schede esistono, ma sono escluse dal matching automatico perché la pertinenza professionale non è documentata. Per trovare opportunità concrete, consulta gli annunci aggiornati dei portali di lavoro e chiedi al CPI/COL competente di verificare agenzie autorizzate e offerte per la professione richiesta e le sue denominazioni equivalenti. Non indicare queste strutture come opportunità già verificate.`;
  }

  if (officinaOpportunity) {
    cooperativesIntro += ` Ti abbiamo candidato anche all'opportunità proposta dall'Officina delle Opportunità CARITAS che trovi negli allegati.`;
  }

  const schoolsIntro = needsSchools 
    ? "Una cosa fondamentale per trovare lavoro è parlare bene l’italiano: se non parli ancora bene, in allegato ti riportiamo un elenco di scuole gratuite per stranieri; frequentale e esercitati il più possibile nel parlare italiano. È importantissimo!"
    : undefined;

  const conclusion = `Durante la ricerca di lavoro il nostro centro di ascolto è disponibile a darti supporto e anche ad aiutarti a valutare eventuali proposte; vieni a trovarci o prendi un nuovo appuntamento anche per informarci reciprocamente sulla ricerca lavoro.
\nBuon lavoro nel cercare lavoro.`;

  const italianLetter: LetterSection = {
    greeting,
    intro,
    cooperativesIntro,
    publicOfficesIntro,
    schoolsIntro,
    conclusion
  };

  // 5. Translate if foreigner (using robust complete literal templates)
  let translatedLetter: LetterSection | undefined = undefined;
  let resolvedLang = "Inglese";
  
  if (!isItalian) {
    let nat = nationality.toLowerCase().trim();
    nat = nat.replace(/^altro\s*:\s*/i, "").replace(/^altro\s*-\s*/i, "").trim();
    let langKey = "english";

    if (!nat || nat === "altro") {
      langKey = "english";
      resolvedLang = "Inglese";
    } else if (nat.includes("senegal") || nat.includes("frances") || nat.includes("costa d'avorio") || nat.includes("mali") || nat.includes("madagasc") || nat.includes("congo")) {
      langKey = "french";
      resolvedLang = "Francese";
    } else if (nat.includes("peruv") || nat.includes("spagn") || nat.includes("colomb") || nat.includes("venez") || nat.includes("ecuad") || nat.includes("boliv") || nat.includes("argent") || nat.includes("cile") || nat.includes("uruguay") || nat.includes("spagna")) {
      langKey = "spanish";
      resolvedLang = "Spagnolo";
    } else if (nat.includes("rumen") || nat.includes("moldav") || nat.includes("romania") || nat.includes("romeno")) {
      langKey = "romanian";
      resolvedLang = "Rumeno";
    } else if (nat.includes("ucrai") || nat.includes("russa") || nat.includes("bielor") || nat.includes("ucrain")) {
      langKey = "ukrainian";
      resolvedLang = "Ucraino";
    } else if (nat.includes("egitt") || nat.includes("egiz") || nat.includes("egypt") || nat.includes("arab") || nat.includes("siria") || nat.includes("iraq") || nat.includes("libia") || nat.includes("maroc") || nat.includes("tunis") || nat.includes("alger") || nat.includes("yemen") || nat.includes("giordan") || nat.includes("palest")) {
      langKey = "arabic";
      resolvedLang = "Arabo";
    } else if (nat.includes("sri") || nat.includes("lanka") || nat.includes("cingal") || nat.includes("sinhala")) {
      langKey = "cingalese";
      resolvedLang = "Cingalese";
    } else if (nat.includes("pola") || nat.includes("polacc") || nat.includes("polon") || nat.includes("polish") || nat.includes("polski")) {
      langKey = "polish";
      resolvedLang = "Polacco";
    } else if (nat.includes("alban")) {
      langKey = "albanian";
      resolvedLang = "Albanese";
    } else if (nat.includes("bangla") || nat.includes("bengal")) {
      langKey = "bengali";
      resolvedLang = "Bengalese";
    } else if (nat.includes("serb")) {
      langKey = "serbian";
      resolvedLang = "Serbo";
    } else if (nat.includes("bosn")) {
      langKey = "bosnian";
      resolvedLang = "Bosniaco";
    } else if (nat.includes("bulgar")) {
      langKey = "bulgarian";
      resolvedLang = "Bulgaro";
    } else if (nat.includes("croa")) {
      langKey = "croatian";
      resolvedLang = "Croato";
    } else if (nat.includes("filippin") || nat.includes("tagalog")) {
      langKey = "tagalog";
      resolvedLang = "Tagalog (Filippino)";
    } else if (nat.includes("georgi")) {
      langKey = "georgian";
      resolvedLang = "Georgiano";
    } else if (nat.includes("macedon")) {
      langKey = "macedonian";
      resolvedLang = "Macedone";
    } else if (nat.includes("ceca") || nat.includes("czech")) {
      langKey = "czech";
      resolvedLang = "Ceco";
    } else if (nat.includes("somal")) {
      langKey = "somali";
      resolvedLang = "Somalo";
    } else if (nat.includes("tanzan") || nat.includes("swahili")) {
      langKey = "swahili";
      resolvedLang = "Swahili";
    } else if (nat.includes("turc") || nat.includes("turchi")) {
      langKey = "turkish";
      resolvedLang = "Turco";
    } else if (nat.includes("indi") || nat.includes("hindi")) {
      langKey = "hindi";
      resolvedLang = "Hindi";
    } else {
      langKey = "english";
      resolvedLang = "Inglese";
    }

    const unsupportedLanguage = nat.includes("vietnam") || nat.includes("viet nam");
    const dict = translations[langKey];
    
    // Trim cooperativesIntro for Altro in translated language
    const getTrimmedCoops = (text: string) => {
      const markers = [
        "Inoltre, puoi visitare",
        "In addition, you can visit",
        "Además, puede visitar",
        "În plus, poți vizita",
        "Крім того, ви можете відвідати",
        "De plus, vous pouvez visiter",
        "بالإضافة إلى ذلك، يمكنك زيارة",
        "මීට අමතරව, ඔබට රැකියා"
      ];
      for (const m of markers) {
        if (text.includes(m)) {
          return text.split(m)[0].trim();
        }
      }
      return text;
    };

    const getGenericFriend = (lKey: string, g?: string): string => {
      const isFemale = g?.toLowerCase() === "femmina" || g?.toLowerCase() === "donna";
      switch (lKey) {
        case "english":
          return "friend";
        case "spanish":
          return isFemale ? "amiga" : "amigo";
        case "romanian":
          return isFemale ? "prietenă" : "prieten";
        case "ukrainian":
          return isFemale ? "подруго" : "друже";
        case "french":
          return isFemale ? "amie" : "ami";
        case "arabic":
          return isFemale ? "الصديقة" : "الصديق";
        case "cingalese":
          return "මිතුරා";
        case "polish":
          return isFemale ? "przyjaciółko" : "przyjacielu";
        default:
          return "friend";
      }
    };

    const cleanName = recipientName?.trim();
    const nameToInsert = cleanName || getGenericFriend(langKey, gender);

    const formattedGreeting = (dict.greeting || "")
      .replace(/\${recipientName}|\$recipientName|\${recipeint}|\$recipeint|\$recipient/gi, nameToInsert);

    const finalIntro = dict.intro
      .replace(/\${recipientName}|\$recipientName|\${recipeint}|\$recipeint|\$recipient/gi, nameToInsert);

    let finalCoopsIntro = isAltro ? getTrimmedCoops(dict.cooperativesIntro) : dict.cooperativesIntro;

    if (officinaOpportunity) {
      const officinaSentences: Record<string, string> = {
        english: " We have also submitted your application for the opportunity proposed by the Officina delle Opportunità CARITAS which you will find in the attachments.",
        spanish: " También te hemos postulado a la oportunidad propuesta por la Officina delle Opportunità CARITAS que encontrarás en los anexos.",
        french: " Nous avons également présenté votre candidature à l'opportunité proposée par l'Officina delle Opportunità CARITAS que vous trouverez en annexe.",
        romanian: " Te-am candidat și la oportunitatea propusă de Officina delle Opportunità CARITAS pe care o găsești în anexe.",
        ukrainian: " Ми також подали вашу кандидатуру на вакансію, запропоновану Officina delle Opportunità CARITAS, яку ви знайдете у додатках.",
        arabic: " لقد قمنا أيضًا بترشيحك للفرصة المقترحة من قبل Officina delle Opportunità CARITAS والتي تجدها في المرفقات.",
        cingalese: " ඇමුණුම්වල ඇති Officina delle Opportunità CARITAS මගින් යෝජිත අවස්ථාව සඳහාද අපි ඔබව ඉදිරිපත් කර ඇත.",
        polish: " Zgłosiliśmy również Twoją kandydaturę na ofertę zaproponowaną przez Officina delle Opportunità CARITAS, którą znajdziesz w załącznikach."
      };
      finalCoopsIntro += officinaSentences[langKey] || officinaSentences.english;
    }

    const finalPublicIntro = dict.publicOfficesIntro
      .replace("${cpiDetails}", cpiDetails)
      .replace("${colDetails}", colDetails)
      .replace(/\${recipientName}|\$recipientName|\${recipeint}|\$recipeint|\$recipient/gi, nameToInsert);

    translatedLetter = unsupportedLanguage ? undefined : {
      greeting: formattedGreeting,
      intro: finalIntro,
      cooperativesIntro: finalCoopsIntro.replace(/\b10\b/g, String(selectedCoops.length)),
      publicOfficesIntro: finalPublicIntro,
      schoolsIntro: needsSchools ? dict.schoolsIntro : undefined,
      conclusion: dict.conclusion
    };

    // Translate the annex items (cooperatives, offices, and schools)
    if (!unsupportedLanguage) selectedCoops = selectedCoops.map(c => ({
      ...c,
      translatedName: translateText(c.name, langKey),
      translatedDescription: translateText(c.description, langKey)
    }));

    if (!unsupportedLanguage) selectedOffices = selectedOffices.map(o => ({
      ...o,
      translatedType: translateText(o.type, langKey),
      translatedName: translateText(o.name, langKey),
      translatedDescription: translateText(o.description, langKey)
    }));

    if (!unsupportedLanguage) selectedSchools = selectedSchools.map(s => ({
      ...s,
      translatedName: translateText(s.name, langKey),
      translatedDescription: translateText(s.description, langKey)
    }));
  }

  return {
    letterTitle: "CONSIGLI PER CERCARE LAVORO",
    subject: `Orientamento al lavoro per ${jobSought}`,
    recipientName: recipientName || "Gentile Utente",
    italianLetter,
    hasTranslation: !isItalian && !!translatedLetter,
    translationLanguage: translatedLetter ? resolvedLang : "Traduzione non disponibile per la lingua richiesta",
    translatedLetter,
    cooperatives: selectedCoops,
    publicOffices: selectedOffices,
    italianSchools: needsSchools ? selectedSchools : [],
    officinaOpportunity: !!officinaOpportunity,
    isLocalFallback: true
  };
}
