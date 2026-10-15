import type { GeneratedLetter, LetterSection, UserFormInputs } from "../src/types.ts";
import { createOpenAILetterAdapter, type AdapterResult } from "./openaiLetterAdapter.ts";
import { validateOpenAILetterSections, type OpenAILetterInput, type OpenAILetterSections, type OpenAIJobCategory, type OpenAILanguage } from "./openaiLetterContract.ts";

type Settings = { OPENAI_LETTER_ENABLED?: string; OPENAI_LETTER_MAX_CALLS?: string };
const JOBS: Record<string, OpenAIJobCategory> = {
  "Badante (assistenza anziani)": "care", "Colf/pulizie (servizi domestici)": "cleaning",
  "Facchino/magazziniere": "logistics", "Lavapiatti/aiuto cucina": "kitchen_support",
  Pizzaiolo: "pizza_making", Cuoco: "cooking", "Muratore/Operaio edile": "construction",
  "Custode/portiere": "caretaking", "Cameriere/barista": "hospitality", Giardiniere: "gardening",
  "Segreteria (assistenza d'ufficio/reception)": "office_support", "Autista (conducente/fattorino)": "driving",
};
const LANGUAGES: Record<string, OpenAILanguage> = {
  Inglese: "en", Spagnolo: "es", Rumeno: "ro", Ucraino: "uk", Francese: "fr", Arabo: "ar",
  Cingalese: "si", Polacco: "pl", Albanese: "sq", Bengalese: "bn", Serbo: "sr", Bosniaco: "bs",
  Bulgaro: "bg", Croato: "hr", "Tagalog (Filippino)": "tl", Georgiano: "ka", Macedone: "mk",
  Ceco: "cs", Somalo: "so", Swahili: "sw", Turco: "tr", Hindi: "hi",
};
const LEVELS: Record<string, OpenAILetterInput["italianLevel"]> = { Nessuna: "none", Basso: "basic", Medio: "intermediate", Alto: "advanced" };

function compose(local: LetterSection, ai: OpenAILetterSections): LetterSection {
  // Preserve every operational statement, institutional reference and greeting.
  const join = (text: string, original: string) => `${text}\n\n${original}`;
  return { ...local, intro: join(ai.intro, local.intro),
    cooperativesIntro: join(ai.cooperativesIntro, local.cooperativesIntro),
    conclusion: join(ai.conclusion, local.conclusion),
    schoolsIntro: ai.schoolsIntro && local.schoolsIntro ? join(ai.schoolsIntro, local.schoolsIntro) : local.schoolsIntro };
}

/** One instance for the entire process; never construct this inside a route. */
export function createLetterPersonalizer(options: {
  env?: Settings;
  generate?: (input: OpenAILetterInput) => Promise<AdapterResult>;
} = {}) {
  const env = options.env ?? process.env;
  const enabled = env.OPENAI_LETTER_ENABLED === "true";
  const maxCalls = Number(env.OPENAI_LETTER_MAX_CALLS ?? "20");
  const configured = Number.isInteger(maxCalls) && maxCalls >= 1 && maxCalls <= 100;
  let calls = 0;
  let busy = false;
  // Lazy initialization also avoids constructing a client when feature is off.
  let generate = options.generate;
  return async (base: GeneratedLetter, form: UserFormInputs): Promise<GeneratedLetter> => {
    const fallback = (reason: string): GeneratedLetter => ({ ...base, isLocalFallback: true, fallbackReason: reason });
    if (!enabled) return fallback("disabled");
    if (!configured) return fallback("invalid_config");
    if (busy) return fallback("usage_limit");
    const language = base.hasTranslation ? LANGUAGES[base.translationLanguage] : undefined;
    if (base.hasTranslation && (!language || !base.translatedLetter)) return fallback("unsupported_translation");
    const needed = language ? 2 : 1;
    if (calls + needed > maxCalls) return fallback("usage_limit");
    const input: OpenAILetterInput = {
      jobCategory: JOBS[form.jobSought] ?? "other", italianLevel: LEVELS[form.italianLevel] ?? "basic",
      outputLanguage: "it", hasCooperativeContacts: base.cooperatives.length > 0,
      includeSchoolsIntro: !!base.italianSchools?.length && !!base.italianLetter.schoolsIntro,
    };
    busy = true;
    try {
      generate ??= createOpenAILetterAdapter();
      const get = async (context: OpenAILetterInput) => {
        calls++; // Count every attempt, including errors; no automatic reset.
        const result = await generate!(context);
        if (result.ok === false) return result;
        const checked = validateOpenAILetterSections(result.sections, context);
        return checked.valid ? { ok: true as const, sections: checked.sections }
          : { ok: false as const, code: "invalid_response" as const };
      };
      const italian = await get(input);
      if (italian.ok === false) return fallback(italian.code);
      const translated = language ? await get({ ...input, outputLanguage: language }) : undefined;
      if (translated && translated.ok === false) return fallback(translated.code);
      return { ...base, italianLetter: compose(base.italianLetter, italian.sections),
        translatedLetter: translated?.ok && base.translatedLetter ? compose(base.translatedLetter, translated.sections) : base.translatedLetter,
        isLocalFallback: false, fallbackReason: undefined };
    } catch {
      return fallback("provider_error");
    } finally { busy = false; }
  };
}
